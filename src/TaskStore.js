
import _ from 'lodash';

class TaskStore {
    tasks = [];
    lanes = [{
        order: 0,
        name: "backlog",
        tasks: []
    }];

    report() {
        if (this.tasks.length === 0)
            console.log( "<none>");
        this.tasks.forEach(console.log);
    };

    addTask(task,lane="backlog") {
        let newTask = {
            ...task,
            id: _.uniqueId()
        }
        this.tasks.push({
            ...newTask
        });
        let l = this.lanes.find(ll => ll.name == lane) || this.lanes[0];
        l.tasks.push(newTask.id);
    };

    get allTasks() {
        return this.tasks;
    }

    get tasksCompressed() {

        let nextStart = 0;
        return this.tasks.map(t => {
            let tt = {...t};
            tt.start = nextStart;
            nextStart += tt.length;
            return tt;
        });
    }
};

export default TaskStore;