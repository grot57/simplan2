import React, { Component } from 'react';
import {LANE_HEIGHT,TASK,TASK_SPACE_PX} from './Constants';
import { DragSource } from 'react-dnd';
import {Glyphicon} from 'react-bootstrap';
import _ from 'lodash'

const Types = {
    ITEM: "TASK"
}

const taskMoveSource = {
    beginDrag(props) {
        console.log("begin drag:",props);
        let {length,start} = props.task
        let currentPosition = start;
        props.onTaskDragStart(props.laneId,props.task.id,currentPosition);
        return {}
    },
    endDrag(props) {
        /* code here */
        props.onTaskDragEnd();
    }
}
function collectTaskMoveSource(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging(),
    }
}

const taskResizeSource = {
    beginDrag(props) {
        console.log("begin resize:",props);
        let {start} = props.task
        props.onTaskResizeStart(props.laneId,props.task.id,start);
        return {}
    },
    endDrag(props) {
        /* code here */
        props.onTaskResizeEnd();
    }
}
function collectTaskResizeSource(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging(),
    }
}


class TaskLeftHandle extends Component {
    render() {
        let bluePattern = 'repeating-linear-gradient(45deg, white 10%, grey 20%'
        let yellowPpattern = 'repeating-linear-gradient(to right,#f6ba52,#f6ba52 2px,#ffd180 2px,#ffd180 4px';
        let {isOver} = this.props

        let style = {
            transition: "width 0.2s ease-in-out, left 0.2s ease-in-out, top 0.5s ease-in-out, background 0.5s ease-in-out",
            marginLeft: "0px",
            background: isOver ? yellowPpattern : bluePattern,
            width: "10px",
            zIndex: 100,
            textAlign: "left",
            verticalAlign: "middle",
            justifyContent: 'center',
            lineHeight: LANE_HEIGHT-4 + "px",
            position: "absolute",
            height: LANE_HEIGHT-4 + "px" ,
            cursor: "move",
            borderRadius: "4px",


        };

        return (
            <span className="hoverOnly" style={style}>

            </span>
        )
    }
}

class TaskRightHandle extends Component {
    render() {
        let bluePattern = 'repeating-linear-gradient(45deg, white 10%, grey 20%';
        let yellowPpattern = 'repeating-linear-gradient(to right,#f6ba52,#f6ba52 2px,#ffd180 2px,#ffd180 4px';
        let {isOver,connectDragSource} = this.props

        let style = {
            transition: "width 0.2s ease-in-out, left 0.2s ease-in-out, top 0.5s ease-in-out, background 0.5s ease-in-out",
            marginLeft: "0px",
            background: isOver ? yellowPpattern : bluePattern,
            width: "10px",
            zIndex: 100,
            textAlign: "right",
            float: "right",
            verticalAlign: "middle",
            justifyContent: 'center',
            lineHeight: LANE_HEIGHT-4 + "px",
            position: "absolute",
            right: "0px",
            top:"0px",
            height: LANE_HEIGHT-4 + "px" ,
            cursor: "ew-resize",
            borderRadius: "4px",
        };

        return (
            connectDragSource(<span className="hoverOnly" title="change length" style={style}>

            </span>)
        )
    }
}
let TaskResizeHandle = DragSource(TASK, taskResizeSource, collectTaskResizeSource)(TaskRightHandle);



class Task extends Component {
    state = {
        name: "undefined",
        start: 0,
        length: 5,
        color: "white",
        background: "blue",
        isDragged: false,
    };

    style = {
        borderRadius: "10px",
        background:"blue",
        height: LANE_HEIGHT + "px" ,
        lineHeight: LANE_HEIGHT + "px",
        fontSize: "12px",
        width: "100px",
        color: "white",
        textAlign: "left",
        verticalAlign: "middle",
        justifyContent: 'center',
        alignItems: 'center',
        position: "absolute",
        border: "2px solid grey",
        transition: "width 0.2s ease-in-out, left 0.2s ease-in-out, top 0.5s ease-in-out",

    };
    render() {
        // isDragging - is this specific task being dragged?
        const { isDragging, connectDragSource, dragInfo} = this.props;
        let {task,laneId,tick,pxPerTick,idx,onClick} = this.props;
        let isDragInProgress = false;
        if (!_.isEmpty(dragInfo)) {
            // something is being dragged
            if (dragInfo.sourceLaneId !== laneId || dragInfo.sourceTaskId !== task.id ||dragInfo.isResize ) {
                isDragInProgress = true;
            }
        }

        //console.log("isDragging", isDragging, "dragInfo",dragInfo.sourceTaskId,"=?=",task.id);
        let {name,length,start} = task
        tick = tick || 1;
        pxPerTick = pxPerTick || 40;

        name = name || this.state.name;
        length = length || this.state.length;
        let width = (length / tick * pxPerTick - TASK_SPACE_PX) + "px";
        let left = (start / tick * pxPerTick) + "px";
        let background = this.props.background || this.style.background;
        let color = this.props.color || this.style.color;
        if (task && task.color) {
            color = task.color
        }
        if (task && task.background) {
            background = task.background;
        }
        let divStyle = {
            ...this.style,
            width,
            background,
            color,
            left,
            top: "0px",
            overflow: "hidden",
            zIndex: isDragInProgress ? -1 : idx
        };
        if (isDragging ) {
             divStyle= {...divStyle,zIndex: -1,opacity: 0.5}
        }

        return connectDragSource(
                <div title={name} onDoubleClick={(e) => {
                        console.log("click",task);
                        if (onClick) onClick(this.props.task)
                    }}
                     style={divStyle}>
                    <TaskLeftHandle />
                    <span  style={{marginLeft: "10px"}}>
                        {task.done === "true" ? <Glyphicon style={{color:"LawnGreen"}} title="Done!" glyph="ok-sign" /> : ""}
                        {task.priority === "high" ? <Glyphicon style={{color:"GoldenRod"}} title="High priority" glyph="arrow-up" /> : ""}
                        <span> {name}</span>
                    </span>
                    <TaskResizeHandle task={this.props.task} laneId={this.props.laneId} onTaskResizeStart={this.props.onTaskResizeStart} onTaskResizeEnd={this.props.onTaskResizeEnd} />
                </div>
        );
    }
}

export default DragSource(TASK, taskMoveSource, collectTaskMoveSource)(Task);
