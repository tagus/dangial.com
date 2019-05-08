import { v4 } from 'uuid';

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
];

/**
 * A wheel represents an instance of a spinner that is associated
 * with a list of slot entries a history of results each time the wheel
 * was spun.
 */
export class Wheel {
  constructor(name, slots = [], history = {}) {
    this.id = v4();
    this.name = name;
    this.slots = slots;
    this.history = history;
  }

  mapToColors(slots) {
    // TODO:
    return slots;
  }
}
