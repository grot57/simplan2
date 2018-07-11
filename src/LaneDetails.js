import React, { Component } from 'react';
import {Modal,Table, FormGroup,ControlLabel,FormControl,Col,Row,Checkbox,Button,Glyphicon } from 'react-bootstrap';
import ReactTable from 'react-table';
import _ from 'lodash';

class LaneDetails extends Component {
    initPropsData(props) {
        let data = [];
        _.forIn(props,(v,k) => {
            data.push({property: k, value: v})
        });
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
                    this.setState({ data });
                }}
                dangerouslySetInnerHTML={{
                    __html: this.state.propsData[cellInfo.index][cellInfo.column.id]
                }}
            />
        );
    };

    renderTable = () => {
            const data = this.state.propsData;
            return (
                <div>
                    <ReactTable
                        showPagination = {false}
                        minRows = {5}
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
                            }
                        ]}
                        defaultPageSize={20}
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
                            <h4>Control Task's props:</h4>
                            <table>

                                <tbody>
                                {_.keys({...lane.props}).map((k) =>
                                    <tr>
                                        {k === "___NEW" ?
                                            <td>
                                                <FormControl
                                                    type="text"
                                                    value={lane.props[k]}
                                                    placeHolder={"Add"}
                                                    onChange={this.handleChange}
                                                />
                                            </td> :
                                            <td><span style={{marginRight: "30px"}}>{k}</span></td>
                                        }
                                        {k === "___NEW" ? "" :
                                            <td>
                                                <FormControl
                                                    type="text"
                                                    value={lane.props[k]}
                                                    onChange={this.handleChange}
                                                />
                                            </td>
                                        }
                                        {k === "___NEW" ? "" : <td><Button bsStyle="link" bsSize="xsmall"><Glyphicon glyph="remove" /></Button></td>}
                                    </tr>
                                )}
                                {/*<tr>*/}
                                    {/*<Button onClick = {this.addTaskProp} bsStyle="link" bsSize="xsmall"><Glyphicon glyph="plus" /></Button>*/}
                                {/*</tr>*/}
                                </tbody>
                            </table >
                        </FormGroup>
                        <FormGroup>
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
