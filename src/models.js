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
  constructor(name, labels = [], history = []) {
    this.id = v4();
    this.name = name;
    this.labels = this.mapToColors(labels);
    this.history = history;
  }

  mapToColors(labels) {
    const shuffled = shuffle(colors);
    return labels.map((s, i) => {
      const color = shuffled[i % shuffled.length];
      return [ s, color ];
    });
  }

  /**
   * Stores the given label to the wheel's history.
   *
   * @param {String} label The label to add to the history
   */
  addHistory(label) {
    this.history.push({
      timestamp: Date.now(),
      label: label,
    })
  }
}

/**
 * Fake testing data
 */
export const wheelFixtures = [
  new Wheel(
    'a 1',
    [ 'sugat', 'dangial', 'tom', 'joe', 'bob', 'ram', 'john', 'bolin', 'rollin' ]),
  new Wheel(
    'a 2',
    [ 'dingus', 'tangus', 'rangus' ]),
];
