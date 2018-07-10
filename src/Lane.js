import React, { Component } from 'react';
import Task from './Task';
import Draggable from 'react-draggable';
class Lane extends Component {

    render() {
        let {name, id, tasks} = this.props;
        tasks = tasks || [];
        let top = id*80 +"px";
        console.log("id",id,"top",top);
        return (
            <Draggable axis="y">
                <div style={{ top:top, position: "relative"}}>
                    <div style={{height:"50px", lineHeight: "50px",color: "blue", position:"absolute",textAlign: "left", width: "100px",justifyContent: 'center', alignItems: 'center'}}>
                        <span style={{cursor: "pointer", marginLeft: "10px"}}>{name}</span>
                    </div>
                    {/* onMouseDown below is important! Needed to disable "draggable" on child elements*/}
                    <div onMouseDown={e => e.stopPropagation()} style={{ left:"100px", position: "relative"}}>
                        {tasks.map((t,idx) => <Task idx={idx} name={t.name} start={t.start} length={t.length} />)}
                    </div>
                </div>

            </Draggable>
        );
    }
}

export default Lane;
