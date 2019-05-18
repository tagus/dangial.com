import PropTypes from 'prop-types';
import random from 'lodash/random';
import React from 'react';
import { v4 } from 'uuid';
import { Wheel } from './models.js';

const REVOLUTIONS = 360 * 5;

/**
 * Calculates the coordinates on a circle for a segment
 * relative to the origin.
 *
 * @param {Number} percent
 * @param {Number} [radius = 1] The circles radius
 */
function getCoordinates(percent, radius = 1) {
  const x = radius * Math.cos(2 * Math.PI * percent);
  const y = radius * Math.sin(2 * Math.PI * percent);
  return [ x, y ];
}

/**
 * A 'spin-able' roulette style wheel
 */
export default class RouletteWheel extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      rotation: 0, // wheel rotation in degrees
      result: null, // the most recent spin result
    };
    this.handleSpin = this.handleSpin.bind(this);
    this.handleSpinEnd = this.handleSpinEnd.bind(this);
  }

  handleSpin() {
    const { wheel } = this.props;
    const angle = random(360, true);
    this.setState(prev => {
      const _count = prev.count + 1;
      return {
        count: _count,
        rotation: angle + (REVOLUTIONS * _count),
      };
    });
  }

  handleSpinEnd() {
    const { wheel } = this.props;
    const { rotation, count } = this.state;
    const angle = rotation - (REVOLUTIONS * count);
    const tilt = 1 - angle / 360;

    const portion = 1 / wheel.labels.length;
    const ranges = wheel.labels.map((_, i) => [ portion * i, portion * (i + 1) ]);
    const reducer = (acc, [ start, end ], i) => (tilt >= start && tilt < end) ? i : acc;
    const index = ranges.reduce(reducer, null);
    wheel.addHistory(index);

    this.setState({ result: index });
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
    const { rotation, result } = this.state;
    const portion = 1 / wheel.labels.length;
    // if the slice is more than 50%, take the large arc (the long way around)
    const arc = portion > .5 ? 1 : 0;

    const [ xp0, yp0 ] = getCoordinates(0.01);
    const [ xp1, yp1 ] = getCoordinates(-0.01);

    return (
      <svg className="roulette-wheel" viewBox="-1 -1 2 2">
        <g
          className="roulette-wheel-spin"
          style={{ transform: `rotate(${rotation}deg)` }}
          onTransitionEnd={this.handleSpinEnd}
        >
          {wheel.labels.map((l, i) => {
            const [ x0, y0 ] = getCoordinates(portion * i);
            const [ x1, y1 ] = getCoordinates(portion * (i + 1));

            const [ xt0, yt0 ] = getCoordinates(portion * (i + 0.425), 0.30);
            const [ xt1, yt1 ] = getCoordinates(portion * (i + 0.425), 0.95);

            return (
              <Slot
                key={l.id}
                start={[ x0, y0 ]}
                end={[ x1, y1 ]}
                textStart={[ xt0, yt0 ]}
                textEnd={[ xt1, yt1 ]}
                arc={arc}
                label={l.text}
                color={l.color}
              />
            );
          })}
        </g>
        <circle cx="0" cy="0" r="0.25" fill="white"/>
        {this.renderMarker()}
      </svg>
    );
  }

  render() {
    const { wheel } = this.props;
    const { result } = this.state;
    return (
      <div className="roulette-wheel-container">
        <div className="roulette-wheel-content">
          <div className="roulette-wheel-result">
            {result != null &&
                <span className="roulette-wheel-result-text">
                  {wheel.get(result)}
                </span>}
          </div>
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
  const [ x1, y1 ] = props.end;

  const [ xt0, yt0 ] = props.textStart;
  const [ xt1, yt1 ] = props.textEnd;

  const path = [
    `M ${x0} ${y0}`, // move
    `A 1 1 0 ${props.arc} 1 ${x1} ${y1}`, // arc
    'L 0 0', // line
  ];
  return (
    <g>
      <path d={path.join(' ')} fill={props.color}/>
      {/* <path
        fill="red"
        d={`M ${xt1} ${yt1} L ${xt0} ${yt0}`}
        stroke="red"
        strokeWidth="0.01"
      /> */}
      <def>
        <path id={slotId} d={`M ${xt1} ${yt1} L ${xt0} ${yt0}`}/>
      </def>
      <text className="roulette-wheel-label">
        <textPath href={`#${slotId}`} startOffset="50%">
          {props.label}
        </textPath>
      </text>
    </g>
  );
}

Slot.propTypes = {
  start: PropTypes.arrayOf(PropTypes.number).isRequired,
  end: PropTypes.arrayOf(PropTypes.number).isRequired,
  textStart: PropTypes.arrayOf(PropTypes.number).isRequired,
  textEnd: PropTypes.arrayOf(PropTypes.number).isRequired,
  arc: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};
