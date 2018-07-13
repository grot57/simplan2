import React, { Component } from 'react';
import Draggable from 'react-draggable';
import {LANE_HEIGHT} from './Constants';

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

    dragPositon: {x:0, y:0}

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
        border: "3px solid grey",
        transition: "left 0.2s ease-in-out, top 0.5s ease-in-out",
    };
    render() {
        let {task,tick,pxPerTick,idx,onClick} = this.props;
        let {name,length,start} = task
        tick = tick || 1;
        pxPerTick = pxPerTick || 40;
        name = name || this.state.name;
        length = length || this.state.length;
        let width = (length / tick * pxPerTick - 6) + "px";
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
        if (this.state.isDragged) {
            divStyle= {...divStyle, zIndex:9999,opacity: 0.5}
        }

        return (
            <Draggable
                position={this.state.dragStartPosition}
                onStart={(e) => {
                    this.setState({isDragged: true})
                }}
                onStop={
                    (e) => this.setState({isDragged: false}
                )}
                onDrag={
                    (e,h,k) => console.log("drag: ",h,k,e)
                    }
            >
                <div onDoubleClick={(e) => {
                    console.log("click",task);
                    if (onClick) onClick(this.props.task)
                }}
                     style={divStyle}>
                    <span style={{marginLeft: "10px"}}>{name}</span>
                </div>

            </Draggable>

        );
    }
}

export default Task;
