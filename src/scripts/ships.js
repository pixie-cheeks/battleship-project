class Ship {
  #length = 0;
  #timesHit = 0;

  constructor(length) {
    this.#length = length;
  }

  getLength() {
    return this.#length;
  }

  getTimesHit() {
    return this.#timesHit;
  }

  hit() {
    this.#timesHit += 1;
  }

  isSunk() {
    return this.#timesHit >= this.#length;
  }
}

export default Ship;
