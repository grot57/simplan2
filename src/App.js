import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Task from './Task';
import TaskStore from './TaskStore';
import LaneDetails from "./LaneDetails";
import TaskDetails from "./TaskDetails";
import {Button,ButtonGroup,ButtonToolbar, Glyphicon} from 'react-bootstrap';
import EdtableLabel from './EditableLabel';
import _ from "lodash";
import uuid from 'uuid/v4';

import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';


import Lanes from './Lanes2';

const store = new TaskStore();



function init() {
    store.setLane({name:"backlog", timeline: false, props: {done:"false"}});
    store.setLane({name:"done", timeline: false, props: {done:"true"}});
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
        projectName: "My Project"
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
                        this.setState({laneDetails: null});
                    }}
                    onDelete={(lane) => {
                        store.deleteLane(lane.id);
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
                        this.setState({taskDetails: null});
                    }}
                    onDelete={(task) => {
                        store.deleteTask(task.id);
                        this.setState({taskDetails: null});
                    }}
                />
        )
    }

    _update = () => {
        this.setState({});
    };
    update = _.debounce(this._update,100);

    _onTaskDragOverSquare = (laneId,position) => {
        //console.log("Task being dragged over square : ",laneId,position);
        store.setTaskDragOverSquare(laneId, position);
        this._update();
    };

    onTaskDragOverSquare = _.debounce(this._onTaskDragOverSquare,50);

    render() {

        let lanes = store.getAllLanes();
        let isRedo = store.isRedo();
        let isUndo = store.isUndo();
        return (
            <div className="App">
                <header className="App-header">
                    {store.getProjectName() === undefined ? "" :
                        <EdtableLabel style={{marginTop: 0, color: "blue", fontSize: "18px", width: "20%"}}
                                      value={store.getProjectName()}
                                      onChange={(v) => {
                                          store.setProjectName(v);
                                          this.setState({})
                                      }}
                        />
                    }
                </header>
                <div>
                    <div className="Lane-name"  style={{ borderBottom: "1px solid blue", height: "45px"}}>

                        <span className="Lane-name" style={{float: "left"}}>

                            <ButtonGroup>
                                <Button style={{color: "blue"}}  bsSize="small"
                                        onClick={() => this.setState({laneDetails:{name:"New Lane",id:uuid()}})}
                                        title={"Add Lane"}><Glyphicon glyph="plus" />New Lane</Button>
                                <Button style={{color: "blue"}}  bsSize="small"
                                        onClick={() => this.setState({taskDetails:{name:"New Task",type: "task",id:uuid()}})}
                                        title={"Add Task"}><Glyphicon glyph="plus" />New Task</Button>
                            </ButtonGroup>
                            <ButtonGroup>
                                <Button  bsSize="small" style={{ color: "blue"}}
                                        onClick={() => {
                                            store.historyUndo();
                                            this.setState({});
                                        }} disabled={!isUndo} title={"Undo"}>Undo <Glyphicon glyph="arrow-left" /></Button>
                                <Button  style={{ color: "blue"}}  bsSize="small"
                                        onClick={() => {
                                            store.historyRedo();
                                            this.setState({});
                                        }} disabled={!isRedo} title={"Redo"}><Glyphicon glyph="arrow-right" /></Button>
                            </ButtonGroup>

                        </span>
                        <span className="Lane-name-right" style={{float:"right"}}>
                            <ButtonGroup>
                                <Button bsSize="small" style={{ color: "blue"}}
                                        onClick={() => {
                                            openFile((f) => {
                                                store.setProjectName(undefined);
                                                this.setState({})
                                                store.restoreState(JSON.parse(f));
                                                this.setState({})
                                            })}}
                                        title={"Add Lane"}><Glyphicon glyph="open-file" />Open file</Button>
                                <Button bsSize="small" style={{ marginRight: "20px", color: "blue"}}
                                        onClick={() => {downloadObjectAsJson(store.getState(),store.projectName + ".json")}}
                                        title={"Save To File"}><Glyphicon glyph="save-file" />Save to file</Button>
                            </ButtonGroup>
                        </span>
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
                       onTaskDragStart = {(laneId,taskId,currentPosition) => {
                           console.log("Task being dragged: ",taskId);
                           store.setDraggedTask(laneId,taskId,currentPosition)
                           this._update();
                       }}

                       onTaskDragOverSquare = {this.onTaskDragOverSquare}

                       onTaskDragEnd = {(laneId,taskId) => {
                           console.log("Task Drag End");
                           if (laneId && taskId) {
                               console.log("Task dropped: ", taskId);
                           }
                           let that = this;
                           _.debounce(function temp() {
                               store.setTaskDragEnd(laneId, taskId);
                               that.setState({});
                           }, 250)();

                       }}

                       onTaskResizeStart = {(laneId,taskId,currentPosition) => {
                           console.log("Task being resized: ",taskId);
                           let isResize = true;
                           store.setDraggedTask(laneId,taskId,currentPosition,isResize)
                           this.update();
                       }}

                       onTaskResizeEnd = {(laneId,taskId) => {
                           console.log("Task Resize End");
                           let that = this;
                           _.debounce(function temp() {
                               store.setTaskDragEnd(laneId, taskId);
                               that.setState({});
                           }, 250)();
                       }}

                       dragInfo = {store.getDragInfo()}

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
                <div>
                </div>
                {this.renderLaneDetails()}
                {this.renderTaskDetails()}
            </div>
        );
    }
}

export default DragDropContext(HTML5Backend)(App);

