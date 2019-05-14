import React from 'react';
import Sidebar from './Sidebar.jsx';
import { Wheel } from './models.js';
import RouletteWheel from './Wheel.jsx';
import WheelForm from './WheelForm.jsx';

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
      isAddingWheel: false,
    };
    this.handleWheelSelect = this.handleWheelSelect.bind(this);
    this.handleWheelDelete = this.handleWheelDelete.bind(this);
    this.persistWheels = this.persistWheels.bind(this);
    this.toggleAddingWheel = this.toggleAddingWheel.bind(this);
    this.handleWheelSave = this.handleWheelSave.bind(this);
    this.handleWheelAdd = this.handleWheelAdd.bind(this);
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
    this.setState({
      selected: index,
      isAddingWheel: false,
    });
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

  /**
   * Toggles visibility of the wheel form component.
   */
  toggleAddingWheel() {
    this.setState(prev => {
      return { isAddingWheel: !prev.isAddingWheel };
    });
  }

  /**
   * Handles saving the new wheel.
   *
   * @param {Wheel} labels The new wheel
   */
  handleWheelSave(wheel) {
    this.setState(prev => {
      const _wheels = prev.wheels.concat([ wheel ]);
      return {
        isAddingWheel: false,
        wheels: _wheels,
        selected: _wheels.length - 1,
      };
    });
  }

  /**
   * Renders the new wheel form and deselects the selected wheel.
   */
  handleWheelAdd() {
    this.setState({
      isAddingWheel: true,
      selected: -1,
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
          <button className="btn" onClick={this.toggleAddingWheel}>
            <span>create</span>
          </button>
        </div>
      </div>
    );
  }

  render() {
    const { wheels, selected, isAddingWheel } = this.state;
    return (
      <div className="spins-container">
        <div className="spins-sidebar">
          <Sidebar
            wheels={wheels}
            onWheelSelect={this.handleWheelSelect}
            onWheelAdd={this.handleWheelAdd}
            onWheelDelete={this.handleWheelDelete}
            selected={selected}
          />
        </div>
        <div className="spins-wheel">
          {isAddingWheel
            ? <WheelForm onSave={this.handleWheelSave} onCancel={this.toggleAddingWheel}/>
            : this.renderWheel()}
        </div>
      </div>
    );
  }
}
