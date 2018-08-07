
import _ from 'lodash';
import uuid from 'uuid/v4';

const defaultTask = {
    name: "undefined",
    assignee: "unknown",
    timeline: null,
    category: "backlog",
    start: 0,
    length: 5,
    done: "false",
    id: null,
}

const defaultLane = {
    name: "undefined",
    timeline: false,
    props: {},
    id: null,
}

class TaskStore {
    projectName = "My Project";
    tasks = [];
    lanes = [];
    dragInfo ={};
    history = [];
    historyIdx = 0;

    getProjectName() {
        return this.projectName
    }
    setProjectName(name) {
        this.projectName = name;
    }

    report() {
        if (this.tasks.length === 0)
            console.log( "<none>");
        this.tasks.forEach(console.log);
    };

    getLaneById(laneId) {
        return _.find(this.lanes,{id: laneId});
    }

    setLane(lane) {
        // based on lane id, either update exiting lane, or add a new one
        this.historyPush();
        if (!lane.id) {
            lane.id = uuid();
        }
        lane = {
            ...defaultLane,
            ...lane
        }

        let idx = _.findIndex(this.lanes,{id:lane.id});
        if (idx < 0) {
            // new lane
            if (_.isNil(lane.id)) {
                lane.id = uuid();
            }
            this.lanes.push(lane)
            return
        } else {
            // modify existing lane
            this.lanes[idx] = lane;
        }
    }
    setTask(task) {
        // based on task id, either update exiting task, or add a new one
        // fix numeric attributes
        this.historyPush();

        task.length = +(task.length) || 5;
        task.start = +(task.start) || 0;
        task.done = task.done || "false";

        let idx = _.findIndex(this.tasks,{id:task.id});
        if (idx < 0) {
            // new task
            if (_.isNil(task.id)) {
                task.id = uuid();
            }
            this.tasks.push(task)
            return
        } else {
            // modify existing lane
            this.tasks[idx] = task;
        }
    }

    addTaskToLane(taskId, laneId) {
        let t = this.tasks.find(tt => tt.id === taskId);
        let l = this.lanes.find(ll => ll.id === laneId);
        if (_.isEmpty(t) || _.isEmpty(l)) {
            console.log("Can't find task", taskId, "or lane", laneId);
            return;
        }
        if (l.timeline) {
            t.timeline = laneId;
        };
        _.keys(l.props).forEach(k => {
            t[k]=l.props[k]
        })
    };

    getAllLanes() {
        return this.lanes;
    };

    filterTasksByLane(laneId) {
        let tasks;
        let l = this.lanes.find(ll => ll.id == laneId);
        if (_.isEmpty(l)) {
            console.log("Can't find lane", laneId);
            return [];
        } else if (l.timeline) {
            tasks = _.filter(this.tasks, {timeline: laneId});
        } else if (_.isEmpty(l.props)) {
            tasks = this.tasks;
        } else {
            tasks = _.filter(this.tasks, l.props);
        }
        return [...tasks];
    }

    // return only tasks belings to a lane.
    // make sure to return a "copy" of tasks
    getTasksByLane(laneId) {
        let tasks = this.filterTasksByLane(laneId);
        tasks = this.orderTasks(laneId,tasks);
        return [...tasks];
    }

    orderTasks(laneId,tasks) {
        if (!this.dragInfo.sourceLaneId || this.dragInfo.targetLaneId !== laneId) {
            return this._calcStarts(tasks);
        }
        let sourceTask = _.find(this.tasks, {id: this.dragInfo.sourceTaskId});
        if (!sourceTask) {
            return this._calcStarts(tasks);
        }

        let targetPosition = this.dragInfo.targetPosition;

        let targetTask ;
        let nextStart = 0;
        // find targetTask (the one position is pointing to)
        let sourceIdx = _.findIndex(tasks,{id: sourceTask.id});
        if (sourceIdx >= 0) {
            if (tasks.length === 1) {
                // sourceTask is the only task in list
                // nothing to do.
                return this._calcStarts(tasks);

            }
            // need ot reorder with other task in list.
            tasks.splice(sourceIdx,1); // remove
        }

        tasks.forEach((t,idx) => {
            if (targetTask === undefined && nextStart === targetPosition ) {
                targetTask = t;
            }
            nextStart += t.length;
        });
        if (!targetTask &&  targetPosition <= nextStart-1) {
            // put back sourceTask in place. and do nothing
            tasks.splice(sourceIdx,0,sourceTask);
            return this._calcStarts(tasks);
        }
        if (targetTask && targetTask.id === sourceTask.id) {
            return this._calcStarts(tasks);
        }
        this.reorderTasks(sourceTask,targetTask);
        tasks = this.filterTasksByLane(laneId); // do it again to get the updated order of tasks.
        return this._calcStarts(tasks);

    }

    _calcStarts(tasks) {
        let nextStart = 0;
        return tasks.map(t => {
            let tt = {...t};
            if (_.isNil(tt.length)) tt.length=5; // default length
            tt.start = nextStart;
            nextStart += tt.length;
            return tt;
        });
    }

    historyPush() {
        if (this.historyIdx < this.history.length) {
            // clear any "redo" left overs.
            this.history.splice(this.historyIdx); // delete from idx to end
            this.historyIdx = this.history.length;
        }
        this.history.push(_.cloneDeep({tasks: this.tasks, lanes: this.lanes}));
        this.historyIdx++;
    }
    historyUndo() {
        if (this.historyIdx < 1) {
            return;
        }
        if (this.historyIdx === this.history.length) {
            // push current state to history.
            this.historyPush();
            this.historyIdx--;
        }
        this.historyIdx--;
        this.tasks = this.history[this.historyIdx].tasks;
        this.lanes = this.history[this.historyIdx].lanes;

    }

    historyRedo() {
        if (this.historyIdx >= this.history.length) {
            return;
        }
        this.historyIdx++;
        this.tasks = this.history[this.historyIdx].tasks;
        this.lanes = this.history[this.historyIdx].lanes;
        if (this.historyIdx === this.history.length-1) {
            // we now point to the last element, which is latest "current"
            this.history.pop();
        }
    }

    isUndo() {
        return (this.historyIdx > 0);
    }
    isRedo() {
        return (this.historyIdx < this.history.length);
    }

    // capture source task for drag-and-drop
    setDraggedTask(sourceLaneId, sourceTaskId,isResize) {
        // note we reset the "target" info if exists
        this.dragInfo = {
            sourceLaneId,
            sourceTaskId,
            isResize
        };
        this.historyPush();

    }

    // capture target lane & position for drag and drop.
    setTaskDragOverSquare(targetLaneId,targetPosition) {
        // every time this is call we need to get back to last "history" in order to cancel any intermiddiate changes during drag
        this.historyUndo();
        this.historyPush();

        this.dragInfo = {
            ...this.dragInfo,
            targetLaneId,
            targetPosition
        };
        if (this.dragInfo.isResize) {
            // TODO RESIZE
        }
        this.addTaskToLane(this.dragInfo.sourceTaskId,targetLaneId);
    }

    getDragInfo() {
        return this.dragInfo;
    }

    setTaskDrop(targetLaneId,targetTaskId) {
        this.dragInfo = {};
        return;
    }
    
    // reorder list of tasks.
    // move source-task to "just-before" target-tasj
    reorderTasks(sourceTask,targetTask) {
        if (_.isNil(sourceTask)) {
            return;
        }
        let sourceIdx = _.findIndex(this.tasks,{id: sourceTask.id});
        if (sourceIdx < 0) {
            return;
        }

        this.tasks.splice(sourceIdx,1);
        if (_.isNil(targetTask)) {
            // put at the end of the tasks list
            this.tasks.push(sourceTask);
            return;
        }
        // find index of targetTask;
        let targetIdx = _.findIndex(this.tasks,{id: targetTask.id});
        if (targetIdx < 0) {
            // put at the end of the task list
            this.tasks.push(sourceTask);
            return;
        }
        this.tasks.splice(targetIdx,0,sourceTask);
    }

    // reorder list of lanes.
    // move source-lane to "just-before" target-lane
    reorderLanes(sourceId,targetId) {

        let sourceIdx = _.findIndex(this.lanes,{id: sourceId});
        let sourceLane = this.lanes[sourceIdx];
        this.lanes.splice(sourceIdx,1);
        if (targetId === null) {
            // put at the end of the lanes list
            this.lanes.push(sourceLane);
            return;
        }
        // find index of targetLane;
        let targetIdx = _.findIndex(this.lanes,{id: targetId});
        this.lanes.splice(targetIdx,0,sourceLane);
    }

    getState() {
        return {
            tasks: this.tasks,
            lanes: this.lanes,
            projectName: this.projectName,
        };
    }

    restoreState(json) {
        this.historyPush();
        this.tasks = json.tasks;
        this.lanes = json.lanes;
        this.dragInfo = {};
        this.projectName = json.projectName || "My Project";
    }

};

export default TaskStore;