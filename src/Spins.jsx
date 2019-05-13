import React from 'react';
import Sidebar from './Sidebar.jsx';
import { Wheel, wheelFixtures } from './models.js';
import RouletteWheel from './Wheel.jsx';

const STORAGE_KEY = 'wheels';

/**
 * Main container for for the spins application.
 */
export default class Spins extends React.Component {
  constructor(props) {
    super(props);
    const _wheels = this.retrieveWheels();
    this.state = {
      wheels: _wheels,
      selected: _wheels.length > 0 ? 0 : -1,
    };
    this.handleWheelSelect = this.handleWheelSelect.bind(this);
    this.handleWheelDelete = this.handleWheelDelete.bind(this);
    this.persistWheels = this.persistWheels.bind(this);
  }

  componentDidMount() {
    window.addEventListener('beforeunload', this.persistWheels);
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.persistWheels);
  }

  /**
   * Saves existing wheels to the local storage.
   */
  persistWheels() {
    const { wheels } = this.state;
    const data = JSON.stringify(wheels);
    console.debug('saving wheels');
    window.localStorage.setItem(STORAGE_KEY, data);
  }

  /**
   * Checks the local storage for any saved wheels, returns an empty
   * list otherwise.
   *
   * @return {Wheel[]} The saved wheels.
   */
  retrieveWheels() {
    try {
      const data = window.localStorage.getItem(STORAGE_KEY);
      const _wheels = data ? JSON.parse(data) : [];
      return _wheels.map(w => Wheel.from(w));
    } catch (err) {
      console.warn(err);
      return [];
    }
  }

  /**
   * Handles wheel select by setting the selected
   * index to be the one specified.
   *
   * @param {Number} index The selected index
   */
  handleWheelSelect(index) {
    this.setState({ selected: index });
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
      return this.renderPlaceholder();
    }
    const wheel = wheels[selected];
    return (
      <RouletteWheel
        key={wheel.id}
        wheel={wheel}
      />
    );
  }

  renderPlaceholder() {
    return (
      <div className="spins-placeholder">
        <div className="spins-placeholder-content">
          <h1>no wheel selected</h1>
          <button className="btn">
            <span>create</span>
          </button>
        </div>
      </div>
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
