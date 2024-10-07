class GameTimer {
  callback;
  interval;
  timerId = 0;
  lastTimeStamp;
  remaining = 0;

  constructor(callback, interval) {
    this.callback = callback;
    this.interval = interval;
  }

  start() {
    if (this.timerId !== 0) {
      return false;
    }

    this.lastTimeStamp = Date.now();
    this.remaining = this.interval;

    this.timerId = setInterval(() => {
      console.log("call callback");
      this.lastTimeStamp = Date.now();
      this.remaining = this.interval;

      this.callback();
    }, this.interval);
    console.log("start game timer: ", this.timerId);

    return true;
  }

  stop() {
    if (this.timerId === 0) {
      return false;
    }

    console.log("stop game timer: " + this.timerId);
    clearInterval(this.timerId);
    //clearTimeout(this.timerId);
    this.timerId = 0;

    return true;
  }

  pause() {
    if (this.timerId === 0) {
      return;
    }

    console.log("pause stop game timer: " + this.timerId);
    clearInterval(this.timerId);
    //clearTimeout(this.timerId);
    this.timerId = 0;
    this.remaining -= Date.now() - this.lastTimeStamp;
  }

  resume() {
    if (this.timerId !== 0) {
      return;
    }

    this.lastTimeStamp = Date.now();

    this.timerId = setTimeout(() => {
      this.timerId = 0;
      console.log("gametimer resume call callback");
      this.callback();
      this.start();
    }, this.remaining);
  }
}

export default GameTimer;
