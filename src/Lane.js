// THIS FILE SHOULD PROBABLY BE REMOVED IN FAVOR OF "Lanes1.js"


import React, { Component } from 'react';
import Task from './Task';
import {Col,Row} from 'react-bootstrap';

class Lane extends Component {

    render() {
        let {name, id, tasks, onClick, dragHandle} = this.props;
        tasks = tasks || [];

        //console.log("id",id,"top",top);
        return (
                <div onMouseDown={e => e.stopPropagation()} style={{display: "bloxk", position: "relative"}}>
                    <Row>
                    <Col xs={2}>
                        <div onDoubleClick={() => {this.props.onClick(id)}} className="Lane-name" >
                            <span>{dragHandle}</span>
                            <span >{name}</span>
                        </div>
                    </Col>
                    <Col xs={10}>
                        {/* onMouseDown below is important! Needed to disable "draggable" on child elements*/}
                        <div onMouseDown={e => e.stopPropagation()} style={{ left:"100px", position: "relative"}}>
                            {tasks.map((t,idx) => <Task key={idx} idx={idx} name={t.name} start={t.start} length={t.length} />)}
                        </div>
                    </Col>
                    </Row>
                </div>
        );
    }
}

export default Lane;
