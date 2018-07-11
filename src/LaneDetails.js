import React, { Component } from 'react';
import {Modal,Table, FormGroup,ControlLabel,FormControl,Col,Row,Checkbox,Button,Glyphicon } from 'react-bootstrap';
import ReactTable from 'react-table';
import _ from 'lodash';
import EdtableLabel from './EditableLabel';
import uuid from 'uuid/v4';

class LaneDetails extends Component {
    help = {
        timeline:
            `Timeline lanes control the life cycle of a task.
Moving and changing a task on atimeline will change task;s properties such as: start-date, end-date, wip, completed, assignee, etc.
A task can only be assigned to a single timeline at a time.`,

        contolledProps:
            `Controlled propoerties define the relations between a lane and its tasks.
A task belongs to a lane if its properties are maching the ones defined as controlled-properties in that lane.
When a task is assigned to a lane, it will automatically get the lanes props.`
    };

    initPropsData(props) {
        let data = [];
        _.forIn(props,(v,k) => {
            data.push({property: k, value: v});
        });
        data.push({property: "", value: ""});
        return data;
    }

    state = {
        propsData: this.initPropsData(this.props.lane ? this.props.lane.props: null),
        lane: {...this.props.lane},
        isDup: false,
    }



    setTaskProp() {

    };

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
        let lane = {...this.state.lane};
        let props = this.state.propsData;
        lane.props = this.state.propsData.reduce( (props,o) => {
            if (_.isNil(o.property) || _.isEmpty(o.property) ) {
                return props;
            }
            props[o.property] = o.value;
            return props;
        },{});
        return this.props.onOk && this.props.onOk(lane)
    }
    render() {
        let {onCancel, onOk} = this.props;
        let {lane} = this.state;
        return (
            <Modal show={!_.isEmpty(lane)} onHide={this.props.onHide}>
                <Modal.Header>
                    <Modal.Title>
                        <Col xs={8}>
                            <EdtableLabel style={{fontSize: "18px", display: "inline-block"}}
                                          value={this.state.lane.name}
                                          onChange= {(value) => { this.setState({lane: {...this.state.lane,name: value}})}}
                            />
                        </Col>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <FormGroup>
                            <ControlLabel>Lane attributes:</ControlLabel>
                        </FormGroup>
                        <FormGroup>
                            <Row>
                                <Col xs={12}>
                                    <Checkbox title={this.help.timeline}>Is timeline <Glyphicon glyph="question-sign" /></Checkbox>
                                </Col>


                            </Row>
                            {_.keys(_.omit(lane,["props","name","timeline","id"])).map((k) => <p>{k + ": " + lane[k]}</p>)}
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel title={this.help.contolledProps}>Controlled Task's props: <Glyphicon glyph="question-sign" /></ControlLabel>
                            {this.renderTable()}
                        </FormGroup>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <div style={{textAlign: "left"}}>{"id: " + lane.id}</div>
                    {this.state.isDup ? "" :
                        <Button onClick={() => {
                            lane.id = uuid();
                            this.setState({lane,isDup:true});
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

export default LaneDetails;
