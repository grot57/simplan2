import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Task from './Task';
import Lane from './Lane';
import TaskStore from './TaskStore';

const store = new TaskStore();
store.addTask({name: "HHH",length:5,start: 9});
[{start:1, length: 2, name: "T1"},{start:3,name:"T2"}].forEach((t) => {store.addTask(t)});
store.report();
class App extends Component {
  state = {
      count: 0
  }
  render() {
    setTimeout(() => {
        let c = this.state.count;
        c++;
        if (c > 5) {
            c=0;
        }
        this.setState({count: c});
    },2000)
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
          <Lane id={1} name="backlog" tasks={store.allTasks}/>
          <Lane id={2} name="backlog2" tasks={store.tasksCompressed}/>
        </div>
      </div>
    );
  }
}

export default App;

