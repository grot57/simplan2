import React, { Component } from 'react';
import {Modal,Table, FormGroup,ControlLabel,FormControl,Col,Row,Checkbox,Button,Glyphicon } from 'react-bootstrap';
import ReactTable from 'react-table';
import _ from 'lodash';

class LaneDetails extends Component {
    initPropsData(props) {
        let data = [];
        _.forIn(props,(v,k) => {
            data.push({property: k, value: v});
        });
        data.push({property: "", value: ""});
        return data;
    }

    state = this.props.lane  ? {
        propsData: this.initPropsData(this.props.lane.props),
        lane: {...this.props.lane,
            props: {...this.props.lane.props,"___NEW":""}
        }} : null;



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


    render() {
        let {onHide} = this.props;
        let {lane} = this.state;
        return (
            <Modal show={!_.isEmpty(lane)} onHide={this.props.onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>{"Lane: " + lane.name} </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <FormGroup>
                            <ControlLabel>Lane attributes:</ControlLabel>
                        </FormGroup>
                        <FormGroup>
                            <Row>
                                <Col componentClass={ControlLabel} xs={1}>
                                    Name:
                                </Col>
                                <Col xs={8}>
                                    <FormControl
                                        type="text"
                                        value={lane.name}
                                        placeholder="Enter new name"
                                        onChange={this.handleChange}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={12}>
                                    <Checkbox title={"Timelines lanes control the life cycle of a task, including attributes such as: \nstart-date, end-date, wip, completed, assignee  "}>Is timeline</Checkbox>
                                </Col>


                            </Row>
                            {_.keys(_.omit(lane,["props","name","timeline","id"])).map((k) => <p>{k + ": " + lane[k]}</p>)}

                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>Controlled Task's props:</ControlLabel>
                            {this.renderTable()}
                        </FormGroup>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <div style={{textAlign: "left"}}>{"id: " + lane.id}</div>
                    <Button bsStyle="primary"><Glyphicon glyph="remove" />  Save</Button>
                    <Button bsStyle="primary"><Glyphicon glyph="remove" />Cancel</Button>
                </Modal.Footer>
            </Modal>

        );
    }
}

export default LaneDetails;
