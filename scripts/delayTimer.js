class DelayTimer {
  callback;
  delay = 0;
  timerId = 0;
  startTimeStamp;
  remaining = 0;

  constructor(callback, delay) {
    this.callback = callback;
    this.delay = delay;
  }

  start() {
    if (this.timerId !== 0) {
      return false;
    }

    this.startTimeStamp = Date.now();
    this.remaining = this.delay;

    this.timerId = setTimeout(() => {
      this.timerId = 0;
      this.callback();
    }, this.delay);

    console.log("start lock timer: ", this.timerId, "remaining: ", this.remaining);
    return true;
  }

  stop() {
    if (this.timerId === 0) {
      return false;
    }

    clearTimeout(this.timerId);
    this.timerId = 0;

    console.log("stop lock timer");
    return true;
  }

  pause() {
    if (this.timerId === 0) {
      return;
    }

    clearTimeout(this.timerId);
    this.timerId = 0;
    this.remaining -= Date.now() - this.startTimeStamp;
  }

  resume() {
    if (this.timerId !== 0) {
      return;
    }

    this.startTimeStamp = Date.now();

    this.timerId = setTimeout(() => {
      this.timerId = 0;
      this.callback();
    }, this.remaining);
  }
}

export default DelayTimer;
