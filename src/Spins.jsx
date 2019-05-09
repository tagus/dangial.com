import React from 'react';
import Sidebar from './Sidebar.jsx';
import { Wheel, wheelFixtures } from './models.js';
import RouletteWheel from './Wheel.jsx';

/**
 * Main container for for the spins application.
 */
export default class Spins extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      wheels: wheelFixtures,
      selected: 1,
    }
    this.handleWheelSelect = this.handleWheelSelect.bind(this);
    this.handleWheelDelete = this.handleWheelDelete.bind(this);
  }

  checkLocalStorage() {
  }

  /**
   * Handles wheel select by setting the selected
   * index to be the one specified.
   *
   * @param {Number} index The selected index
   */
  handleWheelSelect(index) {
    this.setState({ selected: index })
  }

  /**
   * Handles wheel deletion by removing the wheel
   * at the given index.
   *
   * @param {Number} index The wheel index to delete.
   */
  handleWheelDelete(index) {
    this.setState(prev => {
      const _selected = prev.selected === index ? -1 : prev.selected;
      const _wheels = prev.wheels.slice();
      _wheels.splice(index, 1);
      return {
        wheels: _wheels,
        selected: _selected,
      };
    });
  }

  renderWheel() {
    const { wheels, selected } = this.state;
    if (selected === -1) {
      return (
        <h1>no wheel selected</h1>
      ); // TODO: add wheel button
    }
    return (
      <RouletteWheel
        wheel={wheels[selected]}
      />
    );
  }

  render() {
    const { wheels, selected } = this.state;
    return (
      <div className="spins-container">
        <div className="spins-sidebar">
          <Sidebar
            wheels={wheels}
            onWheelSelect={this.handleWheelSelect}
            onWheelDelete={this.handleWheelDelete}
            selected={selected}
          />
        </div>
        <div className="spins-wheel">
          {this.renderWheel()}
        </div>
      </div>
    );
  }
}
