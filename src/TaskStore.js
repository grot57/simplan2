
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
        // based on lane id, either update exiting lane, or add anew one
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

    getTasksByLane(laneId) {
        let l = this.lanes.find(ll => ll.id == laneId);
        if (_.isEmpty(l)) {
            console.log("Can't find lane", laneId);
            return;
        }
        if (l.timeline) {
            return this._reorderTasks(_.filter(this.tasks,{masterLane: laneId}));
        }
        if (_.isEmpty(l.props)) {
            return this.tasks;
        }
        return _.filter(this.tasks,l.props);
    }

    _reorderTasks(tasks) {
        let nextStart = 0;
        return tasks.map(t => {
            let tt = {...t};
            tt.start = nextStart;
            nextStart += tt.length;
            return tt;
        });
    }
};

export default TaskStore;