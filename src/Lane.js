import React, { Component } from 'react';
import Task from './Task';
import Draggable from 'react-draggable';
import {Col,Row} from 'react-bootstrap';

class Lane extends Component {

    state = {position: {x:0, y:0}};

    onDrag = (e, position) => {
        const {x, y} = position;
        this.props.onDrag && this.props.onDrag(x,y);
    };

    render() {
        let {name, id,order, tasks, onClick} = this.props;
        tasks = tasks || [];

        //console.log("id",id,"top",top);
        return (
            <Draggable axis="y" position={this.state.position} onDrag={this.onDrag} onStop={(e)=> {this.setState({postion: {x:0, y:0}});console.log(e,this.state)}}>
                <Row>
                <Col xs={2}>
                    <div onDoubleClick={() => {this.props.onClick(id)}} className="Lane-name" >
                        <span style={{}}>{name}</span>
                    </div>
                </Col>
                <Col xs={10}>
                    {/* onMouseDown below is important! Needed to disable "draggable" on child elements*/}
                    <div onMouseDown={e => e.stopPropagation()} style={{ left:"100px", position: "relative"}}>
                        {tasks.map((t,idx) => <Task key={idx} idx={idx} name={t.name} start={t.start} length={t.length} />)}
                    </div>
                </Col>
                </Row>
            </Draggable>
        );
    }
}

export default Lane;
