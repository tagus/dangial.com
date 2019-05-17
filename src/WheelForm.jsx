import PropTypes from 'prop-types';
import React from 'react';
import { Wheel } from './models.js';
import classNames from 'classnames';

const MAX_LABELS = 12;

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
    _labels.length > 0 && onSave(new Wheel(name, _labels));
  }

  /**
   * Adds a new label to this wheel form.
   */
  handleAdd() {
    this.setState(prev => {
      if (prev.labels.length < MAX_LABELS) {
        const _labels = prev.labels.concat([ '' ]);
        return { labels: _labels };
      }
      return {};
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
              shouldFocus={labels.length !== 1 && labels.length - 1 === i}
              onEnter={this.handleAdd}
              onBackspace={() => l.length === 0 && this.handleDelete(i)}
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
            shouldFocus={true}
          />
          <hr/>
          {labels.length > 0 && this.renderForm()}
          <div className="wheel-form-controls">
            {labels.length < MAX_LABELS &&
            <div className="wheel-form-add">
              <i className="far fa-plus-square" onClick={this.handleAdd}></i>
            </div>}
            <button type="submit" className="btn">
              <span>add</span>
            </button>
            <button className="btn" onClick={onCancel}>
              <span>cancel</span>
            </button>
          </div>
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
function Input(props) {
  const className = classNames({
    'wheel-form-input': true,
    'wheel-form-input-offset': props.showDelete,
  });
  return (
    <div className={className}>
      <input
        type="text"
        required={true}
        placeholder={props.placeholder}
        value={props.value}
        onChange={e => props.onChange(e.target.value)}
        autoFocus={props.shouldFocus}
        onKeyDown={e => {
          switch (e.keyCode) {
            case 13:
              e.preventDefault();
              props.onEnter();
              break;
            case 8:
              props.onBackspace();
            default:
              break;
          }
        }}
      />
      {props.showDelete &&
        <i className="far fa-times-circle wheel-form-input-delete" onClick={props.onDelete}/>}
    </div>
  );
}

Input.propTypes = {
  value: PropTypes.string,
  showDelete: PropTypes.bool,
  shouldFocus: PropTypes.bool,
  onChange: PropTypes.func,
  onDelete: PropTypes.func,
  onEnter: PropTypes.func,
  onBackspace: PropTypes.func,
  placeholder: PropTypes.string.isRequired,
};

Input.defaultProps = {
  value: '',
  showDelete: true,
  shouldFocus: false,
  onChange: () => {},
  onDelete: () => {},
  onEnter: () => {},
  onBackspace: () => {},
};
