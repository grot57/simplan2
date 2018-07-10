import React, { Component } from 'react';
import {Modal} from 'react-bootstrap';
import _ from 'lodash';

class LaneDetails extends Component {


    render() {
        let {lane,onHide} = this.props;
        return (
            <Modal show={!_.isEmpty(this.props.lane)} onHide={this.props.onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>{"Lane: " + this.props.name} </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h4>Text in a modal</h4>
                </Modal.Body>
            </Modal>

        );
    }
}

export default LaneDetails;
