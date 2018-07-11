import React, { Component } from 'react';
import Task from './Task';
import Draggable from 'react-draggable';

class Lane extends Component {

    render() {
        let {name, id,order, tasks, onClick} = this.props;
        tasks = tasks || [];
        let top = order*80 +"px";
        //console.log("id",id,"top",top);
        return (
            <Draggable axis="y" onDrag={this.props.onDrag}>
                <div style={{ top:top, position: "relative"}}>
                    <div onDoubleClick={() => {this.props.onClick(id)}} className="Lane-name" >
                        <span style={{}}>{name}</span>
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
