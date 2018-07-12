import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Task from './Task';
import TaskStore from './TaskStore';
import LaneDetails from "./LaneDetails";
import {Button, Glyphicon} from 'react-bootstrap';
import _ from "lodash";
import uuid from 'uuid/v4';


import Lanes from './Lanes2';

const store = new TaskStore();



function init() {
    store.createLane({name:"backlogg", timeline: false, props: {category: "backlog"}});
    store.createTask({name: "firstTask",length:5,start: 0, category: "backlog"});
    store.createTask({name: "firstTask",length:5,start: 5, category: "backlog"});
    store.createTask({name: "firstTask",length:5,start: 10, category: "backlog"});
    store.createTask({name: "firstTask",length:5,start: 16, category: "backlog"});
    store.createTask({name: "firstTask",length:5,start: 20, category: "backlog"});
    store.createTask({name: "firstTask",length:5,start: 25, category: "backlog"});
    store.createTask({name: "firstTask",length:5,start: 30, category: "backlog"});
    store.createTask({name: "firstTask",length:5,start: 40, category: "backlog"});
    store.createTask({name: "firstTask",length:5,start: 50, category: "backlog"});
    store.createTask({name: "firstTask",length:5,start: 60, category: "backlog"});


    [{start:1, length: 2, name: "T1"},{start:3,name:"T2"}].forEach((t) => {store.createTask(t)});
}


init();

store.report();
class App extends Component {
    state = {
        count: 0,
        laneDetails: null,
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

    render() {
        setTimeout(() => {
            let c = this.state.count;
            c++;
            if (c > 5) {
                c=0;
            }
            this.setState({count: c});
        },10000)
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
                                title={"Add Lane"}><Glyphicon glyph="plus" /></Button>
                    </div>
                </div>
                <Lanes store={store}
                       lanes={store.getAllLanes()}
                       onClick = {(l) => {
                           this.setState({laneDetails: l})
                       }}
                />

                {this.renderLaneDetails()}
            </div>
        );
    }
}

export default App;

