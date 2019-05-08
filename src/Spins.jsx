import React from 'react';
import Sidebar from './Sidebar.jsx';
import { Wheel } from './models.js';

const fakeWheel1 = new Wheel('fake wheel 1', [ 'sugat', 'dangial', 'tom', 'joe' ]);
const fakeWheel2 = new Wheel('fake wheel 2', [ 'dingus', 'tangus', 'rangus' ]);

/**
 * Main container for for the spins application.
 */
export default class Spins extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      wheels: [ fakeWheel1, fakeWheel2 ],
      selected: -1,
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
        <div className="spins-wheel"></div>
      </div>
    );
  }
}
