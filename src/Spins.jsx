import React from 'react';
import Sidebar from './Sidebar.jsx';
import { Wheel } from './models.js';
import RouletteWheel from './Wheel.jsx';
import WheelForm from './WheelForm.jsx';
import Cookie from 'js-cookie';
import MediaQuery from 'react-responsive'

const STORAGE_KEY = 'wheels';

const breakpoints = {
  mobile: {maxDeviceWidth: 767},
  desktop: {minDeviceWidth: 768},
}

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
      isSidebarOpen: false,
      isAddingWheel: false,
    };
    this.handleWheelSelect = this.handleWheelSelect.bind(this);
    this.handleWheelDelete = this.handleWheelDelete.bind(this);
    this.persistWheels = this.persistWheels.bind(this);
    this.toggleAddingWheel = this.toggleAddingWheel.bind(this);
    this.handleWheelSave = this.handleWheelSave.bind(this);
    this.handleWheelAdd = this.handleWheelAdd.bind(this);
    this.handleSidebarClose = this.handleSidebarClose.bind(this);
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
    if (window.localStorage) {
      window.localStorage.setItem(STORAGE_KEY, data);
    } else {
      Cookie.set(STORAGE_KEY, data);
    }
  }

  /**
   * Checks the local storage for any saved wheels, returns an empty
   * list otherwise.
   *
   * @return {Wheel[]} The saved wheels.
   */
  retrieveWheels() {
    try {
      let data;
      if (window.localStorage) {
        data = window.localStorage.getItem(STORAGE_KEY);
      } else {
        data = Cookie.get(STORAGE_KEY);
      }
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
   * Handles closing the sidebar
   *
   * @param {Wheel} labels The new wheel
   */
  handleSidebarClose() {
    this.setState(prev => {
      return {
        isSidebarOpen: false,
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
      isSidebarOpen: false,
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

  renderSidebar() {
    const { wheels, selected } = this.state;

    return (
      <Sidebar
        wheels={wheels}
        onWheelSelect={this.handleWheelSelect}
        onWheelAdd={this.handleWheelAdd}
        onWheelDelete={this.handleWheelDelete}
        onSidebarClose={this.handleSidebarClose}
        selected={selected}
      />
    );
  }

  render() {
    const { isAddingWheel, isSidebarOpen, selected } = this.state;
    const classNames = [isSidebarOpen ? 'is-open' : '', (selected !== -1 && !isAddingWheel) ? 'is-transparent' : ''].join(' ');

    return (
      <div className="spins-container">
        <div className={`spins-sidebar ${classNames}`}>
          <MediaQuery {...breakpoints.mobile}>
            {this.state.  isSidebarOpen ? this.renderSidebar() : null}
          </MediaQuery>
          <MediaQuery {...breakpoints.desktop}>
            {this.renderSidebar()}
          </MediaQuery>
        </div>
        <div className="spins-wheel">
          <button
            onClick={() => this.setState(prev => ({ isSidebarOpen: !prev.isSidebarOpen }))}
            className="sidebar-button">
            Wheels
          </button>
          {isAddingWheel
            ? <WheelForm onSave={this.handleWheelSave} onCancel={this.toggleAddingWheel}/>
            : this.renderWheel()}
        </div>
      </div>
    );
  }
}
