import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Wheel } from './models';

/**
 * Sidebar that displays all existing wheels; provides controls
 * to select and add new wheels.
 */
export default class Sidebar extends React.Component {
  renderWheels() {
    const { wheels, selected, onWheelSelect, onWheelDelete } = this.props;
    return (
      <ul className="wheels-list">
        {wheels.map((w, i) => {
          const isSelected = selected === i;
          const className = classnames({
            'wheels-list-item': true,
            'is-selected': isSelected,
          });
          return (
            <li
              key={w.id}
              className={className}
              onClick={() => onWheelSelect(i)}
            >
              <span>{w.name}</span>
              {isSelected &&
                <i
                  className="far fa-times-circle wheels-list-item-delete"
                  onClick={() => onWheelDelete(i)}
                />}
            </li>
          );
        })}
      </ul>
    );
  }

  renderEmpty() {
    return (
      <h4>no wheels found</h4>
    );
  }

  render() {
    const { wheels } = this.props;
    return (
      <div>
        <h1>dangial.com</h1>
        {wheels.length > 0 ? this.renderWheels() : this.renderEmpty()}
      </div>
    );
  }
}

Sidebar.propTypes = {
  wheels: PropTypes.arrayOf(PropTypes.instanceOf(Wheel)),
  selected: PropTypes.number,
  onWheelSelect: PropTypes.func,
  onWheelDelete: PropTypes.func,
};

Sidebar.defaultProps = {
  wheels: [],
  selected: -1,
  onWheelSelect: () => {},
  onWheelDelete: () => {},
};
