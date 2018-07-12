
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
        let idx = _.findIndex(this.tasks,{id:task.id});
        if (idx < 0) {
            // new lane
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
        let t = this.tasks.find(tt => tt.id == taskId);
        let l = this.lanes.find(ll => ll.id == laneId);
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
        tasks = this._reorderTasks(tasks);
        return [...tasks]
    }

    _reorderTasks(tasks) {
        let nextStart = 0;
        return tasks.map(t => {
            let tt = {...t};
            if (_.isNil(tt.length)) tt.length=5; // default length
            tt.start = nextStart;
            nextStart += tt.length;
            return tt;
        });
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
};

export default TaskStore;