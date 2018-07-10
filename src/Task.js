import React, { Component } from 'react';
import Draggable from 'react-draggable';


class Task extends Component {
    state = {
        name: "undefined",
        start: 0,
        length: 5,
        color: "white",
        background: "blue",

    };

    style = {
        borderRadius: "10px",
        background:"blue",
        height: "50px",
        lineHeight: "50px",
        width: "100px",
        color: "white",
        textAlign: "left",
        verticalAlign: "middle",
        justifyContent: 'center',
        alignItems: 'center',
        position: "absolute",
        border: "3px solid grey",
        transition: "left 0.2s ease-in-out, top 0.5s ease-in-out"
    };
    render() {
        let {name,background,color,length,start,tick,pxPerTick,idx} = this.props;
        tick = tick || 1;
        pxPerTick = pxPerTick || 50;
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
            zIndex: idx

        }
        return (
            <Draggable>
                    <div style={divStyle}>
                        <span style={{marginLeft: "10px"}}>{name}</span>
                    </div>
            </Draggable>

        );
    }
}

export default Task;
