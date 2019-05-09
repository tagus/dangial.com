import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Wheel } from './models.js';

/**
 * Calculates the coordinates on a circle for a segment
 * relative to the origin.
 *
 * @param {Number} percent
 * @param {Number} [radius = 1] The circles radius
 */
function getCoordinates(percent, radius = 1) {
  const x = radius * Math.cos(2 * Math.PI * percent / radius);
  const y = radius * Math.sin(2 * Math.PI * percent / radius);
  return [ x, y ];
}

/**
 * A 'spin-able' roulette style wheel
 */
export default class RouletteWheel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSpinning: false,
    }
    this.handleSpin = this.handleSpin.bind(this);
  }

  handleSpin() {
    this.setState({ isSpinning: true }, () => {
      setTimeout(() => {
        this.setState({ isSpinning: false });
      }, 1000);
    })
  }

  renderWheel() {
    const { wheel } = this.props;
    const { isSpinning } = this.state;
    const portion = 1 / wheel.labels.length;
    // if the slice is more than 50%, take the large arc (the long way around)
    const arc = portion > .5 ? 1 : 0;
    const className = classNames({
      'roulette-wheel': true,
      'roulette-wheel-spin': isSpinning,
    });
    return (
      <svg className={className} viewBox="-1 -1 2 2">
        {wheel.labels.map(([ label, color ], i) => {
          const [ x0, y0 ] = getCoordinates(portion * i);
          const [ x1, y1 ] = getCoordinates(portion * (i + 1));
          return (
            <Slot
              key={label}
              start={[ x0, y0 ]}
              end={[ x1, y1 ]}
              arc={arc}
              label={label}
              color={color}
            />
          );
        })}
      </svg>
    );
  }

  render() {
    return (
      <div className="roulette-wheel-container">
        <div>
          {this.renderWheel()}
          <div className="roulette-wheel-controls">
            <button className="btn" onClick={this.handleSpin}>
              <span>spin</span>
            </button>
          </div>
        </div>
      </div>
    );
  }
}

RouletteWheel.propTypes = {
  wheel: PropTypes.instanceOf(Wheel).isRequired,
};

/**
 * A slot in the wheel based on the start and end coordinates.
 *
 * @param {Object} props  The slot props
 * @return {React.Component} The slot component
 */
function Slot(props) {
  const [ x0, y0 ] = props.start;
  const [ x1, y1 ] = props.end;
  const path = [
    `M ${x0} ${y0}`, // move
    `A 1 1 0 ${props.arc} 1 ${x1} ${y1}`, // arc
    'L 0 0', // line
  ];
  return (
    <path key={props.label} d={path.join(' ')} fill={props.color}/>
  );
}
