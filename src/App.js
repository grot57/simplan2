import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Task from './Task';
import TaskStore from './TaskStore';
import LaneDetails from "./LaneDetails";
import TaskDetails from "./TaskDetails";
import {Button, Col,Row, Glyphicon} from 'react-bootstrap';
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

function downloadObjectAsJson(exportObj, exportName){
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", exportName);
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

function clickElem(elem) {
    // Thx user1601638 on Stack Overflow (6/6/2018 - https://stackoverflow.com/questions/13405129/javascript-create-and-save-file )
    var eventMouse = document.createEvent("MouseEvents")
    eventMouse.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
    elem.dispatchEvent(eventMouse)
}
function openFile(func) {
    var readFile = function(e) {
        var file = e.target.files[0];
        if (!file) {
            return;
        }
        var reader = new FileReader();
        reader.onload = function(e) {
            var contents = e.target.result;
            fileInput.func(contents)
            document.body.removeChild(fileInput)
        }
        reader.readAsText(file)
    }
    var fileInput = document.createElement("input")
    fileInput.type='file'
    fileInput.style.display='none'
    fileInput.onchange=readFile
    fileInput.func=func || (() => {})
    document.body.appendChild(fileInput)
    clickElem(fileInput)
}


init();

store.report();
class App extends Component {
    state = {
        count: 0,
        laneDetails: null,
        taskDetails: null,
        lanePosition: {},
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
                <div style={{}}>

                    <span className="Lane-name" style={{borderBottom: "1px solid blue",width:"50%",float: "left"}}>
                        <Button onClick={() => this.setState({laneDetails:{name:"New Lane",id:uuid()}})}
                                bsStyle="link"
                                title={"Add Lane"}><Glyphicon glyph="plus" />New Lane</Button>
                        <Button onClick={() => this.setState({taskDetails:{name:"New Task",type: "task",id:uuid()}})}
                                bsStyle="link"
                                title={"Add Task"}><Glyphicon glyph="plus" />New Task</Button>
                    </span>


                        <span className="Lane-name-right" style={{borderBottom: "1px solid blue",width:"50%",float:"right"}}>                            <span>
                            <Button onClick={() => {
                                        openFile((f) => {
                                            store.restoreState(JSON.parse(f));
                                            this.setState({})
                                        })}}
                                    bsStyle="link"
                                    title={"Add Lane"}><Glyphicon glyph="open-file" />Open file</Button>
                            <Button onClick={() => {downloadObjectAsJson(store.getState(),"simplan.json")}}
                                    bsStyle="link"
                                    title={"Save To File"}><Glyphicon glyph="save-file" />Save to file</Button>
                            </span>
                        </span>


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

