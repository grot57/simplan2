// THIS FILE SHOULD PROBABLY BE REMOVED IN FAVOR OF "Lanes1.js"


import React, { Component } from 'react';
import Task from './Task';
import {Col,Row} from 'react-bootstrap';

class Lane extends Component {

    render() {
        let {name, id, tasks, onClick, onTaskClick, dragHandle} = this.props;
        tasks = tasks || [];

        //console.log("id",id,"top",top);
        return (
                <div onMouseDown={e => e.stopPropagation()} style={{marginTop: "5px", display: "block", position: "relative"}}>
                    <Row>
                    <Col xs={2}>
                        <div onClick={() => {onClick(id)}} className="Lane-name" >
                            <span>{dragHandle}</span>
                            <span >{name}</span>
                        </div>
                    </Col>
                    <Col xs={10}>
                        {/* onMouseDown below is important! Needed to disable "draggable" on child elements*/}
                        <div onMouseDown={e => e.stopPropagation()} style={{  position: "relative"}}>
                            {tasks.map((t,idx) => <Task key={idx} idx={idx} task={t} onClick={onTaskClick} />)}
                        </div>
                    </Col>
                    </Row>
                </div>
        );
    }
}

export default Lane;
