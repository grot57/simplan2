// THIS FILE SHOULD PROBABLY BE REMOVED IN FAVOR OF "Lanes1.js"


import React, { Component } from 'react';
import Task from './Task';
import {Col,Row} from 'react-bootstrap';
import {LANE_HEIGHT,TASK,TASK_SPACE_PX} from "./Constants";
import { DropTarget } from 'react-dnd';

const Types = {
    ITEM: "TASK"
}

const laneSquareTarget = {
    drop(props, monitor) {
        console.log("dropped", props.position);
        //props.onTaskDragEnd(props.laneId,props.task.id);
    },
    hover(props) {
        //console.log("hover", props.position);
        props.onTaskDragOverSquare(props.laneId,props.position);
    }
};

function collectTarget(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver()
    };
}

class LaneSquare extends Component {
    render() {
        let {position,isOver,connectDropTarget,dragInfo} = this.props;
        //console.log("dragInfo",dragInfo);
        let tick = 1;
        let pxPerTick = 40;
        let width = (1 / tick * pxPerTick - TASK_SPACE_PX) + "px";
        let left = (position / tick * pxPerTick) + "px";
        return connectDropTarget(
            <div style={{
                zIndex: 0,
                position: "absolute",
                left,
                width,
                background: isOver ? "yellow" : "lightGrey",
                opacity: isOver ? 0.5 : 0,
                height: LANE_HEIGHT + "px" ,
            }} />);
    }
}

let LaneSquareWrap = DropTarget(TASK, laneSquareTarget, collectTarget)(LaneSquare);


class Lane extends Component {

    render() {
        let {name, id, tasks, onClick, onTaskClick, dragHandle,
            onTaskDragStart,onTaskDragOverSquare,onTaskDragEnd,onTaskResizeStart,onTaskResizeEnd,
            dragInfo} = this.props;
        tasks = tasks || [];

        let dropTargets = [];
        for (let i = 0 ; i < 50 ; i++) {
            dropTargets.push(<LaneSquareWrap key={i} laneId={id} onTaskDragOverSquare={onTaskDragOverSquare} position={i} dragInfo={dragInfo}/>)
        }
        //console.log("id",id,"top",top);
        return (
                <div style={{marginTop: "5px", display: "block", position: "relative"}}>
                    <Row>
                    <Col xs={2}>
                        <div onClick={() => {onClick(id)}} className="Lane-name" >
                            <span>{dragHandle}</span>
                            <span >{name}</span>
                        </div>
                    </Col>
                    <Col xs={10}>
                        <div style={{position: "relative",dispaly:"block"}}>
                            {dropTargets}
                        </div>
                        {/* onMouseDown below is important! Needed to disable "draggable" on child elements*/}
                        <div onMouseDown={e => e.stopPropagation()} style={{  position: "relative"}}>
                            {tasks.map((t,idx) =>
                                <Task key={t.id}
                                      idx={idx}
                                      task={t}
                                      laneId={id}
                                      onClick={onTaskClick}
                                      onTaskDragStart={onTaskDragStart}
                                      onTaskDragEnd={onTaskDragEnd}
                                      onTaskResizeStart={onTaskResizeStart}
                                      onTaskResizeEnd={onTaskResizeEnd}
                                      dragInfo={dragInfo}

                                />)}
                        </div>
                    </Col>
                    </Row>
                </div>
        );
    }
}

export default Lane;
