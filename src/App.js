import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Task from './Task';
import Lane from './Lane';
import TaskStore from './TaskStore';
import LaneDetails from "./LaneDetails";
import _ from "lodash";

const store = new TaskStore();
function init() {
    store.createLane({name:"backlogg", timeline: false, props: {category: "backlog"}});
    store.createTask({name: "firstTask",length:5,start: 0, category: "backlog"});
    [{start:1, length: 2, name: "T1"},{start:3,name:"T2"}].forEach((t) => {store.createTask(t)});
}


init();

store.report();
class App extends Component {
    state = {
        count: 0,
        laneDetails: null,
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
                <p className="App-intro">
                    To get started, edit <code>src/App.jsx</code> and save to reload.
                </p>
                <div style={{display: "block"}} >
                    <Task name={"task1"} start={this.state.count}/>
                    <Task name={"task2"} start={this.state.count+7}/>
                </div>
                <div style={{display: "block"}} >
                    {store.getAllLanes().map((l,laneOrder) => {
                        let tasks = store.getTasksByLane(l.id);
                        return <Lane key={l.id} id={l.id} order={laneOrder+1} name={l.name} tasks={tasks} onClick={(laneId) => {
                            console.log("click",laneId);

                            this.setState({laneDetails: laneId})

                        }}/>
                    })}
                </div>
                {(_.isNil(this.state.laneDetails)) ? null : <LaneDetails lane={store.getLaneById(this.state.laneDetails)} onHide={() => {
                    this.setState({laneDetails: null});
                }} />}
            </div>
        );
    }
}

export default App;

