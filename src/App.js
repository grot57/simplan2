import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Task from './Task';
import TaskStore from './TaskStore';
import LaneDetails from "./LaneDetails";
import TaskDetails from "./TaskDetails";
import {Button, Glyphicon} from 'react-bootstrap';
import _ from "lodash";
import uuid from 'uuid/v4';


import Lanes from './Lanes2';

const store = new TaskStore();



function init() {
    store.createLane({name:"backlog", timeline: false, props: {}});
    // store.createTask({name: "firstTask",length:5,start: 0, category: "backlog"});
    // store.createTask({name: "firstTask",length:5,start: 5, category: "backlog"});
    // store.createTask({name: "firstTask",length:5,start: 10, category: "backlog"});
    // store.createTask({name: "firstTask",length:5,start: 16, category: "backlog"});
    // store.createTask({name: "firstTask",length:5,start: 20, category: "backlog"});
    // store.createTask({name: "firstTask",length:5,start: 25, category: "backlog"});
    // store.createTask({name: "firstTask",length:5,start: 30, category: "backlog"});
    // store.createTask({name: "firstTask",length:5,start: 40, category: "backlog"});
    // store.createTask({name: "firstTask",length:5,start: 50, category: "backlog"});
    // store.createTask({name: "firstTask",length:5,start: 60, category: "backlog"});


    //[{start:1, length: 2, name: "T1"},{start:3,name:"T2"}].forEach((t) => {store.createTask(t)});
}


init();

store.report();
class App extends Component {
    state = {
        count: 0,
        laneDetails: null,
        taskDetails: null,
        lanePosition: {}
    }

    renderLaneDetails = (lane) => {
        return (
            (_.isNil(this.state.laneDetails)) ? null :
                <LaneDetails
                    //lane={store.getLaneById(this.state.laneDetails)}
                    lane={this.state.laneDetails}
                    onCancel={() => {
                        this.setState({laneDetails: null});
                    }}
                    onOk={(lane) => {
                        store.setLane(lane);
                        this.setState({}); // force rendering
                        this.setState({laneDetails: null});
                    }}

                />
        )
    }
    renderTaskDetails = (lane) => {
        return (
            (_.isNil(this.state.taskDetails)) ? null :
                <TaskDetails
                    //lane={store.getLaneById(this.state.laneDetails)}
                    task={this.state.taskDetails}
                    onCancel={() => {
                        this.setState({taskDetails: null});
                    }}
                    onOk={(task) => {
                        store.setTask(task);
                        this.setState({}); // force rendering
                        this.setState({taskDetails: null});
                    }}

                />
        )
    }

    render() {
        setTimeout(() => {
            let c = this.state.count;
            c++;
            if (c > 5) {
                c=0;
            }
            this.setState({count: c});
        },10000)
        let lanes = store.getAllLanes();
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h1 className="App-title">Welcome to Simplan</h1>
                </header>

                {/*<div style={{display: "block"}} >*/}
                {/*<Task name={"task1"} start={this.state.count}/>*/}
                {/*<Task name={"task2"} start={this.state.count+7}/>*/}
                {/*</div>*/}
                <div >
                    <div className="Lane-name">
                        <Button onClick={() => this.setState({laneDetails:{name:"New Lane",id:uuid()}})}
                                bsStyle="link"
                                title={"Add Lane"}><Glyphicon glyph="plus" />New Lane</Button>
                        <Button onClick={() => this.setState({taskDetails:{name:"New Task",type: "task",id:uuid()}})}
                                bsStyle="link"
                                title={"Add Task"}><Glyphicon glyph="plus" />New Task</Button>
                    </div>
                </div>
                <Lanes store={store}
                       lanes={lanes}
                       onClick = {(l) => {
                           this.setState({laneDetails: l})
                       }}
                       onTaskClick = {(t) => {
                           this.setState({taskDetails: t})
                       }}
                       onReorder ={(oldIdx, newIdx) => {
                           // note that "local" lanes, and the one at store might not be the same.
                           // beter switch to lane.id.
                           if (oldIdx ===  newIdx) {return;}
                           let sourceId = lanes[oldIdx].id;
                           let targetId;
                           // find target-lane - this is the one to put the source lane "jsut before"
                           if (oldIdx < newIdx) {
                               // move forward
                               if (newIdx+1 === lanes.length) {
                                   targetId = null; // stands for - put at the end;
                               } else {
                                   targetId = lanes[newIdx + 1].id;
                               }
                           } else {
                               // move backward
                               targetId = lanes[newIdx].id;
                           }
                           // We now need to take source Lane and put it just before

                           store.reorderLanes(sourceId,targetId);
                           this.setState({})
                       }}
                />

                {this.renderLaneDetails()}
                {this.renderTaskDetails()}
            </div>
        );
    }
}

export default App;

