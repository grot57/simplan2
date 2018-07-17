import React, { Component } from 'react';
import Draggable from 'react-draggable';
import {LANE_HEIGHT} from './Constants';
import { DragSource } from 'react-dnd';
import { DropTarget } from 'react-dnd';

const Types = {
    ITEM: "TASK"
}

const taskSource = {
    beginDrag(props) {

        console.log(props);
        props.onTaskDragStart(props.task)
        return {}
    },
    endDrag(props) {
        /* code here */
    }
}
function collectSource(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging(),
    }
}

function collectTarget(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver()
    };
}


const taskTarget = {
    drop(props, monitor) {
        console.log("drop:",props);
    },
    hover(props) {
        props.onTaskDragOver(props.task);
    }
};

class TaskDropTarget extends Component {
    state = {
        isOver: false
    };

    // componentWillReceiveProps = (nextProps) => {
    //     if (nextProps.isOver === this.props.isOver) return;
    //     if (nextProps.isOver) {
    //         this.props.onTaskDragOver(this.props.task)
    //     }
    // }
    render() {
        let bluePattern = 'repeating-linear-gradient(#606dbc,#606dbc 2px,#465298 2px,#465298 4px'
        let yellowPpattern = 'repeating-linear-gradient(to right,#f6ba52,#f6ba52 2px,#ffd180 2px,#ffd180 4px';
        let {isOver,connectDropTarget} = this.props

        let style = {
            transition: "left 0.2s ease-in-out, top 0.5s ease-in-out, background 0.5s ease-in-out",
            marginLeft: "0px",
            background: isOver ? yellowPpattern : bluePattern,
            width: "10px",
            zIndex: 10,
            textAlign: "left",
            verticalAlign: "middle",
            justifyContent: 'center',
            lineHeight: LANE_HEIGHT-4 + "px",
            position: "absolute",
            height: LANE_HEIGHT-4 + "px" ,
            cursor: "move",
            borderRadius: "4px",
            opacity: "0.7",

        };

        return connectDropTarget(
            <span style={style}>

            </span>
        )
    }
}

let TaskDropTargetWrap = DropTarget(Types.ITEM, taskTarget, collectTarget)(TaskDropTarget);


class Task extends Component {
    state = {
        name: "undefined",
        start: 0,
        length: 5,
        color: "white",
        background: "blue",
        isDragged: false,
        dragStartPosition: {x:0, y:0},

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
        transition: "left 0.2s ease-in-out, top 0.5s ease-in-out",

    };
    render() {
        const { isDragging, connectDragSource, src, isOver } = this.props;
        let {task,tick,pxPerTick,idx,onClick,onTaskDragStart,onTaskDragOver,onTaskDragEnd} = this.props;
        let {name,length,start, shift} = task
        tick = tick || 1;
        pxPerTick = pxPerTick || 40;
        name = name || this.state.name;
        length = length || this.state.length;
        let width = (length / tick * pxPerTick - 6) + "px";
        if (shift && shift > 0) {
            console.log("SHIFTTT ", shift);
            start += shift;
        }
        let left = (start / tick * pxPerTick) + "px";
        let divStyle = {
            ...this.style,
            width,
            background: this.props.background || this.style.background,
            color: this.props.color || this.style.color,
            left,
            top: "0px",
            zIndex: idx
        }
        if (isDragging) {
            divStyle= {...divStyle, zIndex:9999,opacity: 0.5}
        }

        return connectDragSource(
                <div onDoubleClick={(e) => {
                        console.log("click",task);
                        if (onClick) onClick(this.props.task)
                    }}
                     style={divStyle}>
                    <TaskDropTargetWrap onTaskDragOver={this.props.onTaskDragOver} task={this.props.task}/>
                    <span style={{marginLeft: "10px"}}>{name}</span>
                </div>
        );
    }
}

export default DragSource(Types.ITEM, taskSource, collectSource)(Task);
