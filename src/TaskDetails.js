import React, { Component } from 'react';
import {Modal,Table, FormGroup,Radio,ControlLabel,FormControl,Col,Row,Checkbox,Button,Glyphicon } from 'react-bootstrap';
import ReactTable from 'react-table';
import _ from 'lodash';
import EdtableLabel from './EditableLabel';
import uuid from 'uuid/v4';


const TASK_PROPS = ["name","summary","details","type","priority","discussion","priority","id"]

class TaskDetails extends Component {
    help = {
        timeline:
            `Timeline lanes control the life cycle of a task.
Moving and changing a task on atimeline will change task;s properties such as: start-date, end-date, wip, completed, assignee, etc.
A task can only be assigned to a single timeline at a time.`,

        contolledProps:
            `Controlled propoerties define the relations between a lane and its tasks.
A task belongs to a lane if its properties are maching the ones defined as controlled-properties in that lane.
When a task is assigned to a lane, it will automatically get the lanes props.`,
        props:
        `You can add any number of properties( <key>,<value> pairs) to a task. 
Those props can later be used by Lanes (controlled-props) to figure out which tasks are part of which lanes.`
    };

    // translate object props like {k1:v1, k2:v2} into [{property:k1,value:v1},{property:k2,value:v2}]
    // this is needed for the react-table below.
    initPropsData(props) {
        let data = [];
        _.forIn(props,(v,k) => {
            data.push({property: k, value: v});
        });
        data.push({property: "", value: ""});
        return data;
    }

    state = {
        propsData: this.initPropsData(_.omit(this.props.task,TASK_PROPS)),
        task: {...this.props.task},
        isDup: false,
    }

    // for react table below
    renderEditable = (cellInfo) => {
        return (
            <div
                style={{ backgroundColor: "#fafafa" }}
                contentEditable
                suppressContentEditableWarning
                onBlur={e => {
                    const data = [...this.state.propsData];
                    data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
                    // add a new place holder for new prop
                    if (data.length < 1 || _.isNil(data[data.length - 1]) || _.isNil(data[data.length - 1][cellInfo.column.id]) || data[data.length - 1][cellInfo.column.id] !== "") {
                        data.push({property: "", value: ""});
                    }
                    this.setState({ propsData: data });
                }}
                dangerouslySetInnerHTML={{
                    __html: this.state.propsData[cellInfo.index][cellInfo.column.id]
                }}
            />
        );
    };

    deleteRow = (cellInfo) => {
        const data = [...this.state.propsData];
        if (cellInfo && data && cellInfo.index < data.length - 1) {
            data.splice(cellInfo.index,1);
        }
        this.setState({ propsData: data });
    }

    renderDeleteRowIcon = (cellInfo) => {
        return (
            <Button onClick={() => {this.deleteRow(cellInfo)}} bsStyle="link" bsSize="xsmall"><Glyphicon glyph="remove"/></Button>
        );
    };


    renderTable = () => {
        const data = this.state.propsData;
        return (
            <div>
                <ReactTable
                    showPagination = {false}
                    minRows = {(data && data.length ? data.length + 1 : 5)}
                    data={data}
                    columns={[
                        {
                            Header: "Prop",
                            accessor: "property",
                            Cell: this.renderEditable
                        },
                        {
                            Header: "Value",
                            accessor: "value",
                            Cell: this.renderEditable
                        },
                        {
                            Header: "",
                            accessor: "value",
                            Cell: this.renderDeleteRowIcon,
                            width: 30
                        }

                    ]}
                    defaultPageSize={20}
                    style={data && data.length > 10 ? {
                        height: "400px" // This will force the table body to overflow and scroll, since there is not enough room
                    } : {}}
                    className="-striped -highlight"
                />
                <br />
            </div>
        );
    }


    onOk = () => {
        let task = {...this.state.task};
        let props = this.state.propsData;
        let additionalProps = this.state.propsData.reduce( (props,o) => {
            if (_.isNil(o.property) || _.isEmpty(o.property) ) {
                return props;
            }
            props[o.property] = o.value;
            return props;
        },{});
        task = {...task,...additionalProps};
        return this.props.onOk && this.props.onOk(task)
    }

    setTaskAttr = (attr,value) => {
        this.setState(
            {task: {...this.state.task,[attr]: value}}
        );
    }
    render() {
        let {task} = this.state;
        return (
            <Modal show={!_.isEmpty(task)} onHide={this.props.onHide}>
                <Modal.Header>
                    <Modal.Title>
                        <Col xs={8}>
                            <EdtableLabel style={{fontSize: "18px", display: "inline-block"}}
                                          value={this.state.task.name}
                                          onChange= {(v) => this.setTaskAttr("name",v)}
                            />
                        </Col>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <FormGroup>
                            <ControlLabel>Task attributes:</ControlLabel>
                            <Row>
                                <Col xs={12}>
                                    <Checkbox >Is done</Checkbox>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={12}>
                                    <ControlLabel>Details </ControlLabel>
                                    <FormControl style={{height:200}} componentClass="textarea" placeholder="enter some details..." />
                                </Col>
                            </Row>
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>Type</ControlLabel>
                            <Row>
                                <Col xs={12}>
                                <Radio name="typeGroup"
                                       checked={this.state.task.type==="bug"}
                                       inline
                                       onChange = {(e) => this.setTaskAttr("type","bug")}>
                                    Bug
                                </Radio>{' '}
                                <Radio name="typeGroup"
                                       checked={this.state.task.type==="enhancement"}
                                       inline
                                       onChange = {(e) => this.setTaskAttr("type","enhancement")}>
                                    Enhancement
                                </Radio>{' '}
                                <Radio name="typeGroup"
                                       checked={this.state.task.type==="task"}
                                       inline
                                       onChange = {(e) => this.setTaskAttr("type","task")}>
                                    Task
                                </Radio>
                                </Col>
                            </Row>
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>Priority</ControlLabel>
                            <Row>
                                <Col xs={12}>
                                    <Radio name="prioGroup"
                                           checked={this.state.task.priority==="high"}
                                           inline
                                           onChange = {(e) => this.setTaskAttr("priority","high")}>
                                        High
                                    </Radio>{' '}
                                    <Radio name="prioGroup"
                                           checked={this.state.task.priority==="medium"}
                                           inline
                                           onChange = {(e) => this.setTaskAttr("priority","medium")}>
                                        Medium
                                    </Radio>{' '}
                                    <Radio name="prioGroup"
                                           checked={this.state.task.priority==="low"}
                                           inline
                                           onChange = {(e) => this.setTaskAttr("priority","low")}>
                                        Low
                                    </Radio>
                                </Col>
                            </Row>
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel title={this.help.props}>Task's props: <Glyphicon glyph="question-sign" /></ControlLabel>
                            {this.renderTable()}
                        </FormGroup>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <div style={{textAlign: "left"}}>{"id: " + task.id}</div>
                    <Button onClick={() => this.props.onDelete && this.props.onDelete(task) }
                            bsStyle="danger"><Glyphicon glyph="remove" /> Delete</Button>
                    {this.state.isDup ? "" :
                        <Button onClick={() => {
                                    task.id = uuid();
                                    this.setState({task,isDup:true});
                                }}
                                bsStyle = "primary"> <Glyphicon glyph = "share" /> Duplicate </Button>
                    }


                    <Button onClick={() => this.props.onCancel && this.props.onCancel() }
                            bsStyle="primary"><Glyphicon glyph="remove" /> Cancel</Button>
                    <Button onClick={this.onOk}
                            bsStyle="primary"><Glyphicon glyph="ok" /> OK</Button>
                </Modal.Footer>
            </Modal>

        );
    }
}

export default TaskDetails;
