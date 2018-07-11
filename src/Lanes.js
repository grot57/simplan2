import React, { Component } from 'react';
import Lane from './Lane';
import {LANE_HEIGHT} from "./Constants";
import _ from 'lodash';

class Lanes extends Component {

    state = {
        onDragReorder: {
            laneId: null,
            moveDown: 0
        }
    }
    onDrag = (laneId,x,y) => {
        let moveDown = (Math.floor(y/LANE_HEIGHT));
        if (moveDown !== this.state.onDragReorder.moveDown) {
            this.setState({
                onDragReorder: {
                    laneId,
                    moveDown
                }
            })
        }
        console.log("move",moveDown);
    };
    onDragStop = (laneId,x,y) => {
        // this.setState({
        //     onDragReorder: {
        //         laneId: null,
        //         moveDown: 0
        //     }
        // });
    };

    reorderLanes(lanes) {
        let {moveDown, laneId} = this.state.onDragReorder;
        if (moveDown === 0 || laneId===null ) return lanes;
        let sourceIdx = _.findIndex(lanes,{id:laneId});
        let sourceLane = lanes[sourceIdx];
        let newIdx = moveDown > 0 ? sourceIdx+moveDown : sourceIdx+moveDown-1;
        let newLanes =  [...lanes];
        newLanes.splice(sourceIdx,1);
        newLanes.splice(newIdx,0,sourceLane);
        console.log("Reorder:",lanes,newLanes)
        return newLanes;
    }

    render() {
        let {lanes,store,onClick} = this.props;
        lanes = this.reorderLanes(lanes);
        console.log(lanes)
        return (
            <div>
                {lanes.map((l,laneOrder) => {
                    let tasks = store.getTasksByLane(l.id);
                    return <Lane key={l.id}
                                 id={l.id}
                                 order={laneOrder}
                                 name={l.name}
                                 tasks={tasks}
                                 onClick={(laneId) => {
                                     onClick && onClick(l)
                                 }}
                                 onDrag={(x,y) => this.onDrag(l.id,x,y)}
                                 onDragStop={(x,y) => this.onDragStop(l.id,x,y)}
                    />
                })}
            </div>
        );
    }
}

export default Lanes;
