import React, { Component } from 'react';
import {SortableContainer, SortableElement, SortableHandle, arrayMove} from 'react-sortable-hoc';
import {List} from 'react-virtualized';

import {Glyphicon} from 'react-bootstrap';

import Lane from './Lane';
import {LANE_HEIGHT} from "./Constants";
import _ from 'lodash';


const DragHandle = SortableHandle(() => <Glyphicon className="hoverOnly2" glyph={"menu-hamburger"} style={{marginRight: 5, fontSize: 10, cursor: "move"}}/>);

const SortableItem = SortableElement(({value}) => {
    let {lane,tasks,onClick,onTaskClick,onTaskDragStart,onTaskDragOverSquare,onTaskDragEnd,onTaskResizeStart,onTaskResizeEnd,dragInfo} = value;
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
                      onTaskClick={onTaskClick}
                      onTaskDragStart={onTaskDragStart}
                      onTaskDragOverSquare={onTaskDragOverSquare}
                      onTaskDragEnd={onTaskDragEnd}
                      onTaskResizeStart={onTaskResizeStart}
                      onTaskResizeEnd={onTaskResizeEnd}
                      dragInfo={dragInfo}
                />
            </div>

    );
});

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
                    height={window.innerHeight - 120}
                />
        );
    }
}

const SortableList = SortableContainer(VirtualList, {withRef: true});

class Lanes extends Component {

    render() {
        let {lanes,store,onClick,onReorder} = this.props;

        // task actions
        let {
            onTaskClick,
            onTaskDragStart,
            onTaskDragOverSquare,
            onTaskDragEnd,
            onTaskResizeStart,
            onTaskResizeEnd,
            dragInfo
        } = this.props;

        //lanes = this.reorderLanes(lanes);
        //console.log(lanes)
        let laneItems = lanes.map((lane) => {
                let tasks = store.getTasksByLane(lane.id);
                return {value: {lane,tasks,onClick,onTaskClick,onTaskDragStart,onTaskDragOverSquare,onTaskDragEnd,onTaskResizeStart,onTaskResizeEnd,dragInfo}, height: 60}
            }
        );
        return (
            <SortableList
                ref={(instance) => {this.SortableList = instance;}}
                items={laneItems}
                useDragHandle={true}
                useWindowAsScrollContainer={true}
                onSortEnd = {({oldIndex, newIndex}) => {
                    onReorder && onReorder(oldIndex, newIndex);
                }}
                />
        );
    }
}

export default Lanes;
