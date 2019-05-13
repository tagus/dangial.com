import PropTypes from 'prop-types';
import random from 'lodash/random';
import React from 'react';
import { v4 } from 'uuid';
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
      count: 0,
      rotation: 0, // wheel rotation in degrees
    };
    this.handleSpin = this.handleSpin.bind(this);
  }

  handleSpin() {
    const { wheel } = this.props;
    const angle = random(360, true);
    this.setState(prev => {
      const _count = prev.count + 1;
      return {
        count: _count,
        rotation: angle + (1080 * _count),
      };
    });
  }

  renderMarker() {
    const [ x0, y0 ] = getCoordinates(-0.01);
    const [ x1, y1 ] = getCoordinates(0.01);
    const path = [
      `M ${x0} ${y0}`, // move
      `A 1 1 0 0 1 ${x1} ${y1}`, // arc
      'L 0.85 0', // line
    ];
    return (
      <path className="roulette-wheel-marker" d={path.join(' ')}/>
    );
  }

  renderWheel() {
    const { wheel } = this.props;
    const { rotation } = this.state;
    const portion = 1 / wheel.labels.length;
    // if the slice is more than 50%, take the large arc (the long way around)
    const arc = portion > .5 ? 1 : 0;

    const [ xp0, yp0 ] = getCoordinates(0.01);
    const [ xp1, yp1 ] = getCoordinates(-0.01);

    return (
      <svg className="roulette-wheel" viewBox="-1 -1 2 2">
        <g className="roulette-wheel-spin" transform={`rotate(${rotation})`}>
          {wheel.labels.map(([ label, color ], i) => {
            const [ x0, y0 ] = getCoordinates(portion * i);
            const [ xm, ym ] = getCoordinates(portion * (i + 0.5));
            const [ x1, y1 ] = getCoordinates(portion * (i + 1));
            return (
              <Slot
                key={label}
                start={[ x0, y0 ]}
                end={[ x1, y1 ]}
                mid={[ xm, ym ]}
                arc={arc}
                label={label}
                color={color}
              />
            );
          })}
          <circle cx="0" cy="0" r="0.3" fill="white"/>
        </g>
        {this.renderMarker()}
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
  const slotId = v4();
  const [ x0, y0 ] = props.start;
  const [ xm, ym ] = props.mid;
  const [ x1, y1 ] = props.end;
  const path = [
    `M ${x0} ${y0}`, // move
    `A 1 1 0 ${props.arc} 1 ${x1} ${y1}`, // arc
    'L 0 0', // line
  ];
  return (
    <g>
      <path d={path.join(' ')} fill={props.color}/>
      <def>
        <path id={slotId} d={`M ${xm} ${ym} L 0 0`}/>
      </def>
      <text className="roulette-wheel-label" alignmentBaseline="middle">
        <textPath href={`#${slotId}`} startOffset="15%">
          {props.label}
        </textPath>
      </text>
    </g>
  );
}

Slot.propTypes = {
  start: PropTypes.arrayOf(PropTypes.number).isRequired,
  end: PropTypes.arrayOf(PropTypes.number).isRequired,
  mid: PropTypes.arrayOf(PropTypes.number).isRequired,
  arc: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};
