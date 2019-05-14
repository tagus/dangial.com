import PropTypes from 'prop-types';
import React from 'react';
import { Wheel } from './models.js';

/**
 * A wheel form.
 */
export default class WheelForm extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      labels: [ '' ],
    };
    this.handleWheelSave = this.handleWheelSave.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
  }

  /**
   * Calls the onSave handler using the current labels state
   *
   * @param {React.SyntheticEvent} event The submission event
   */
  handleWheelSave(event) {
    event.preventDefault();
    const { onSave } = this.props;
    const { name, labels } = this.state;
    const _labels = labels.map(l => l.trim()).filter(l => l !== '');
    onSave(new Wheel(name, _labels));
  }

  /**
   * Adds a new label to this wheel form.
   */
  handleAdd() {
    this.setState(prev => {
      const _labels = prev.labels.concat([ '' ]);
      return { labels: _labels };
    });
  }

  /**
   * Updates a label at the given index
   *
   * @param {Number} index The label index
   * @param {String} label The updated label
   */
  handleChange(index, label) {
    this.setState(prev => {
      const _labels = prev.labels.slice();
      _labels[index] = label;
      return { labels: _labels };
    });
  }

  /**
   * Removes the label at the specified index.
   *
   * @param {Number} index The label index
   */
  handleDelete(index) {
    this.setState(prev => {
      if (prev.labels.length === 1) {
        return {};
      }
      const _labels = prev.labels.slice();
      _labels.splice(index, 1);
      return { labels: _labels };
    });
  }

  renderForm() {
    const { labels } = this.state;
    return (
      <div className="wheel-form-input-container">
        {labels.map((l, i) => {
          return (
            <Input
              key={i}
              value={l}
              onChange={value => this.handleChange(i, value)}
              onDelete={() => this.handleDelete(i)}
              showDelete={labels.length !== 1}
              placeholder='add label'
            />
          );
        })}
      </div>
    );
  }

  render() {
    const { name, labels } = this.state;
    const { onCancel } = this.props;
    return (
      <div className="wheel-form-container">
        <form onSubmit={this.handleWheelSave}>
          <h1 className="wheel-form-title">add a wheel</h1>
          <Input
            showDelete={false}
            value={name}
            placeholder='wheel name'
            onChange={name => this.setState({ name })}
          />
          <hr/>
          {labels.length > 0 && this.renderForm()}
          {labels.length <= 12 &&
            <div className="wheel-form-add">
              <i className="far fa-plus-square" onClick={this.handleAdd}></i>
            </div>}
          <button type="submit" className="btn">
            <span>add</span>
          </button>
          <button className="btn" onClick={onCancel}>
            <span>cancel</span>
          </button>
        </form>
      </div>
    );
  }
}

WheelForm.propTypes = {
  onSave: PropTypes.func,
  onCancel: PropTypes.func,
};

WheelForm.defaultProps = {
  onSave: () => {},
  onCancel: () => {},
};

/**
 * A simple text component.
 *
 * @param {Object} params
 */
function Input({ value, onChange, onDelete, showDelete, placeholder }) {
  return (
    <div className="wheel-form-input">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        required="required"
      />
      {showDelete &&
        <i className="far fa-times-circle wheel-form-input-delete" onClick={onDelete}/>}
    </div>
  );
}

Input.propTypes = {
  value: PropTypes.string,
  showDelete: PropTypes.bool,
  onChange: PropTypes.func,
  onDelete: PropTypes.func,
  placeholder: PropTypes.string.isRequired,
};

Input.defaultProps = {
  value: '',
  showDelete: true,
  onChange: () => {},
  onDelete: () => {},
};
