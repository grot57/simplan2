import React, { Component } from 'react';
import {SortableContainer, SortableElement, SortableHandle, arrayMove} from 'react-sortable-hoc';
import {List} from 'react-virtualized';
import grip from './grip-vertical-solid.svg';

import {Glyphicon} from 'react-bootstrap';

import Lane from './Lane';
import {LANE_HEIGHT} from "./Constants";
import _ from 'lodash';


const SortableItem = SortableElement(({value}) => {
    let {lane,tasks,onClick} = value;
    return (
            <div>
                <Lane key={lane.id}
                      id={lane.id}
                      name={lane.name}
                      tasks={tasks}
                      dragHandle={<DragHandle />}
                      onClick={() => {
                          onClick && onClick(lane)
                      }}
                />
            </div>

    );
});



const DragHandle = SortableHandle(() => <Glyphicon glyph={"menu-hamburger"} style={{marginRight: 5, fontSize: 10}}/>);

class VirtualList extends Component {
    render() {
        const {items} = this.props;
        return (
                <List
                    ref={(instance) => {
                        this.List = instance;
                    }}
                    rowHeight={({index}) => items[index].height}
                    rowRenderer={({index}) => {
                        const {value} = items[index];
                        return <SortableItem index={index} value={value} />;
                    }}
                    rowCount={items.length}
                    width={window.innerWidth}
                    height={300}
                />
        );
    }
}

const SortableList = SortableContainer(VirtualList, {withRef: true});

class Lanes extends Component {

    state = {
        lanes: this.props.lanes
    };

    render() {
        let {lanes,store,onClick} = this.props;
        //lanes = this.reorderLanes(lanes);
        //console.log(lanes)
        let lanesComps = lanes.map((lane) => {
                let tasks = store.getTasksByLane(lane.id);
                return {value: {lane,tasks}, height: 89}
            }
        );
        return (
            <SortableList

                ref={(instance) => {this.SortableList = instance;}}
                items={lanesComps}
                useDragHandle={true}
                useWindowAsScrollContainer={true}/>
        );
    }
}

export default Lanes;