
import _ from 'lodash';
import uuid from 'uuid/v4';

const defaultTask = {
    name: "undefined",
    assignee: "unknown",
    masterLane: null,
    category: "backlog",
    start: 0,
    length: 5,
    id: null,
}

const defaultLane = {
    name: "undefined",
    timeline: false,
    props: {},
    id: null,
}

class TaskStore {
    tasks = [];
    lanes = [];
    dragInfo ={};

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
        task.length = +(task.length) || 5;
        task.start = +(task.start) || 0;

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

    createTask(task) {
        // fix numeric attributes
        task.length = +(task.length) || 5;
        task.start = +(task.start) || 0;
        let newTask = {
            ...defaultTask,
            ...task,
            id: uuid()
        }
        this.tasks.push({
            ...newTask
        });
    };

    createLane(lane) {
        let newLane = {
            ...defaultLane,
            ...lane,
            id: uuid()
        }
        this.lanes.push({
            ...newLane
        });
    };

    addTaskToLane(taskId, laneId) {
        let t = this.tasks.find(tt => tt.id === taskId);
        let l = this.lanes.find(ll => ll.id === laneId);
        if (_.isEmpty(t) || _.isEmpty(l)) {
            console.log("Can't find task", taskId, "or lane", laneId);
            return;
        }
        if (l.timeline) {
            t.masterLane = laneId;
        };
        _.keys(l.props).forEach(k => {
            t[k]=l[k]
        })
    };

    getAllTasks() {
        return this.tasks;
    }

    getAllLanes() {
        return this.lanes;
    };

    // return only tasks belings to a lane.
    // make sure to return a "copy" of tasks
    getTasksByLane(laneId) {
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

        if (targetPosition === 0) {
            targetPosition;
        }
        if (targetPosition === 1) {
            targetPosition;
        }
        if (targetPosition === 3) {
            targetPosition;
        }
        if (targetPosition === 4) {
            targetPosition;
        }
        if (targetPosition === 5) {
            targetPosition;
        }
        if (targetPosition === 6) {
            targetPosition;
        }
        if (targetPosition === 7) {
            targetPosition;
        }
        if (targetPosition === 8) {
            targetPosition;
        }
        if (targetPosition === 9) {
            targetPosition;
        }
        if (targetPosition === 10) {
            targetPosition;
        }
        if (targetPosition === 11) {
            targetPosition;
        }
        if (targetPosition === 12) {
            targetPosition;
        }


        // first take out source task (if exists) from task list.
        tasks = _.filter(tasks,t => t.id !== sourceTask.id);
        tasks = _.filter(tasks,t => t.id !== sourceTask.id);

        let targetIdx = tasks.length;
        let nextStart = 0;
        tasks.forEach((t,idx) => {
            nextStart += t.length;
            if (nextStart >= targetPosition) {
                targetIdx = Math.min(idx,targetIdx);
            }
        });
        tasks.splice(targetIdx,0,sourceTask);

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

    calcDnDShift(laneId,tasks) {
        if (!this.dragInfo.sourceLaneId || this.dragInfo.targetLaneId !== laneId) {
            return tasks;
        }
        let sourceTask = _.find(this.tasks, {id: this.dragInfo.sourceTaskId})
        if (!sourceTask) {
            return tasks;
        }
        let targetPosition = this.dragInfo.targetPosition;
        // filter out source-task... will re-insert based on new position
        tasks = _.filter(tasks,t => t.id !== sourceTask.id);
        // find dragged-over task
        let draggedOverTasks = _.filter(tasks, t => {
            if (t.start <= targetPosition && t.start+t.length > targetPosition) {
                return true;
            }
            return false;
        });
        if (_.isEmpty(draggedOverTasks)) {
            return tasks;
        }


        let _tasks = [];
        let start = 0;
        tasks.forEach(t => {
            if (!_.isEmpty(_.filter(draggedOverTasks,{id: t.id}))) {
                // this is the dragged over task - push the source task just before it.
                _tasks.push({...sourceTask,start});
                start += sourceTask.length;
            }
            _tasks.push({...t,start});
            start += t.length;
        })
        return _.filter(_tasks,null);
    }



    // reorder list of lanes.
    // move source-lane to "just-before" target-lane
    setDraggedTask(sourceLaneId, sourceTaskId) {
        // note we reset the "target" info if exists
        this.dragInfo = {
            sourceLaneId,
            sourceTaskId
        };
    }

    // TODO  - is this still needed?
    setTaskDragOver(targetLaneId,targetTaskId) {
        this.dragInfo = {
            ...this.dragInfo,
            targetLaneId,
            targetTaskId
        };
    }

    // TODO  - is this still needed?
    setTaskDrop(targetLaneId,targetTaskId) {
        if (!this.dragInfo.sourceLaneId ||  !this.dragInfo.targetLaneId ) {
            this.dragInfo = {};
            return;
        }
        this.dragInfo = {};
        return;

        // move source-task in task-list just before the "target"
        let sourceIdx = _.findIndex(this.tasks,{id:this.dragInfo.sourceTaskId});
        let targetIdx = _.findIndex(this.tasks,{id:this.dragInfo.targetTaskId});
        let sourceTask = this.tasks[sourceIdx];
        this.tasks.splice(sourceIdx,1).splice(targetIdx,0,sourceTask);
        this.dragInfo = {};
    }

    setTaskDragOverSquare(targetLaneId,targetPosition) {
        this.dragInfo = {
            ...this.dragInfo,
            targetLaneId,
            targetPosition
        };
    }

    getDragInfo() {
        return this.dragInfo;
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
        };
    }

    restoreState(json) {
        this.tasks = json.tasks;
        this.lanes = json.lanes;
        this.dragInfo = {};
    }

};

export default TaskStore;