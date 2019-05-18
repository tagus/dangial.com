import { v4 } from 'uuid';
import shuffle from 'lodash/shuffle';

/**
 * A static list of possible color for each wheel slot.
 */
const colors = [
  '#1abc9c',
  '#3498db',
  '#9b59b6',
  '#e67e22',
  '#ff7675',
  '#fd79a8',
  '#55efc4',
  '#9AECDB',
  '#55E6C1',
  '#D6A2E8',
  '#706fd3',
  '#218c74',
  '#34ace0',
  '#0074D9',
  '#39CCCC',
];

/**
 * A wheel represents an instance of a spinner that is associated
 * with a list of slot entries a history of results each time the wheel
 * was spun.
 */
export class Wheel {
  /**
   * The wheel constructor.
   *
   * @param {string} name The wheel's name
   * @param {string[]} labels The wheel's labels
   * @param {{ timestamp: number, index: number }[]} history The wheel's history
   */
  constructor(name, labels = [], history = []) {
    this.id = v4();
    this.name = name;
    this.labels = this.generateLabels(labels);
    this.history = history;
  }

  /**
   * A static constructor to build a wheel object from the given json object.
   *
   * @param {Object} obj The json data
   */
  static from({ id, name, labels, history }) {
    const _wheel = new Wheel();
    _wheel.id = id;
    _wheel.name = name;
    _wheel.labels = labels.map(l => Label.from(l));
    _wheel.history = history;
    return _wheel;
  }

  /**
   * Retrieves the label's text at the given index.
   *
   * @param {Number} index The label index
   * @return {string} The selected label
   */
  get(index) {
    const label = this.labels[index];
    return label.text;
  }

  generateLabels(labels) {
    const shuffled = shuffle(colors);
    return labels.map((s, i) => {
      const color = shuffled[i % shuffled.length];
      return new Label(s, color);
    });
  }

  /**
   * Stores the given label to the wheel's history.
   *
   * @param {Number} index The index of the label to add to the history
   */
  addHistory(index) {
    this.history.push({
      timestamp: Date.now(),
      index : index,
    });
  }
}

/**
 * A simple container for a label and it's attributes.
 */
class Label {
  /**
   * The label constructor.
   *
   * @param {string} text The label text
   * @param {string} color The label's color hex code
   */
  constructor(text, color) {
    this.id = v4();
    this.text = text;
    this.color = color;
  }

  /**
   * A static constructor to build a label object from the given json object.
   *
   * @param {Object} obj The json data
   */
  static from({ id, text, color }) {
    const _label = new Label();
    _label.id = id;
    _label.text = text;
    _label.color = color;
    return _label;
  }
}
