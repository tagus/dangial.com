import React from 'react';
import Sidebar from './Sidebar.jsx';
import { Wheel } from './models.js';
import RouletteWheel from './Wheel.jsx';

const fakeWheel1 = new Wheel('soft bool', [ 'sugat', 'dangial', 'tom', 'joe', 'bob', 'ram', 'john', 'bolin', 'rollin' ]);
const fakeWheel2 = new Wheel('hard bool', [ 'dingus', 'tangus', 'rangus' ]);

/**
 * Main container for for the spins application.
 */
export default class Spins extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      wheels: [ fakeWheel1, fakeWheel2 ],
      selected: 1,
    }
    this.handleWheelSelect = this.handleWheelSelect.bind(this);
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
