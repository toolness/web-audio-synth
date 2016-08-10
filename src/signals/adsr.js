"use strict";

/* global Constant */

class Adsr {
  constructor(sampleRate, source, attack, decay, sustain, release) {
    this.STATE_ATTACK = 1;
    this.STATE_DECAY = 2;
    this.STATE_SUSTAIN = 3;
    this.STATE_RELEASE = 4;

    this.sampleRate = sampleRate;
    this.source = source;
    this._attack = attack;
    this._decay = decay;
    this._sustain = sustain;
    this._release = release;
    this._state = this.STATE_ATTACK;
    this._recompute();
  }

  _recompute() {
    this._attackSlope = 1 / (this.sampleRate * this._attack);
    this._decaySlope = -(1 - this._sustain) / (this.sampleRate * this._decay);
    this._releaseSlope = -this._sustain / (this.sampleRate * this._release);
  }

  startAttack() {
    this._state = this.STATE_ATTACK;
  }

  startRelease() {
    this._state = this.STATE_RELEASE;
  }

  *samples() {
    let amount = 0;

    for (let sample of this.source.samples()) {
      switch (this._state) {
        case this.STATE_ATTACK:
        amount += this._attackSlope;
        if (amount >= 1) {
          amount = 1;
          this._state = this.STATE_DECAY;
        }
        break;

        case this.STATE_DECAY:
        amount += this._decaySlope;
        if (amount <= this._sustain) {
          amount = this._sustain;
          this._state = this.STATE_SUSTAIN;
        }
        break;

        case this.STATE_SUSTAIN:
        amount = this._sustain;
        break;

        case this.STATE_RELEASE:
        amount += this._releaseSlope;
        if (amount <= 0) {
          yield 0;
          return;
        }
        break;
      }

      yield sample * amount;
    }
  }
}
