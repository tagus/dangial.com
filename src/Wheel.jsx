import React from 'react';
import PropTypes from 'prop-types';
import { Wheel } from './models.js';

/**
 * A 'spinnable' roulette style wheel
 */
export default class RouletteWheel extends React.Component {
  getCoordinatesForPercent(percent) {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [ x, y ];
  }

  getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }


  renderWheel() {
    const { wheel } = this.props;

    const portion = 1 / wheel.slots.length;
    // console.debug(portion);
    let sum = 0;

    return (
      <svg className="roulette-wheel" viewBox="-1 -1 2 2">
        {wheel.slots.map(slot => {
          const [ startX, startY ] = this.getCoordinatesForPercent(sum);
          // console.debug(startX, startY);
          sum += portion;
          const [ endX, endY ] = this.getCoordinatesForPercent(sum);
          // console.debug(endX, endY);

          // if the slice is more than 50%, take the large arc (the long way around)
          const largeArcFlag = portion > .5 ? 1 : 0;

          // create an array and join it just for code readability
          const pathData = [
            `M ${startX} ${startY}`, // Move
            `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`, // Arc
            'L 0 0', // Line
          ].join(' ');

          return (
            <path key={slot} d={pathData} fill={this.getRandomColor()}/>
          );
        })}
        {/* <circle className="roulette-wheel-circle" cx="25" cy="25" r="25"/> */}
      </svg>
    );
  }

  render() {
    const { wheel } = this.props;
    return (
      <div>
        <h1 className="wheel-title">{wheel.name}</h1>
        {this.renderWheel()}
      </div>
    );
  }
}

RouletteWheel.propTypes = {
  wheel: PropTypes.instanceOf(Wheel).isRequired,
};
