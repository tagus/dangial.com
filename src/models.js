import { v4 } from 'uuid';

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
}
