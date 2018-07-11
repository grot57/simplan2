import React, {Component} from 'react';
import {
    FormControl
} from 'react-bootstrap';
import _ from 'lodash';

import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';

/**
 * Helper class to limit re-render of components when editing title.
 * Rendered as a simple text while not focused / mouse over.
 */

class EditableLabel extends Component {

    state = {value: this.props.value}
    __inputRef = null;

    _onChange = (oldValue,newValue) => {
        if(this.props.validateFunc && !this.props.validateFunc(newValue)) {
            // input is not valid
            this.setState({value: oldValue})
        } else {
            // input is valid or no validateFunc defined
            if (this.props.onChange) {
                if (oldValue !== newValue) {
                    this.props.onChange(newValue)
                }
            }
        }
    };

    render() {
        let props = _.omit(this.props, ['value', 'onChange', 'validateFunc','activeHref','activeKey']);

        let className = undefined;

        className = "h2 hover-border-visible";

        return (
            <FormControl inputRef = {(ref) => {this.__inputRef = ref;}}
                         className={className}
                         {...props}
                         type="text" value={this.state.value}
                         onChange={(ev) => this.setState({value: ev.target.value})}
                         onBlur={(ev) => {
                             this._onChange(this.props.value,ev.target.value)
                         }}
                         onFocus={(ev) => ev.target.setSelectionRange(0, ev.target.value.length)}
                         onKeyPress={(ev) => {
                             if (ev.key === 'Enter') {
                                 this._onChange(this.props.value, ev.target.value)
                             }
                         }}
            />
        );
    }
};

export default EditableLabel;

