class GameTimer {
  timerId = 0;
  lastTimeStamp;
  remaining = 0;
  callback;
  interval;
  paused = false;

  constructor(callback, interval) {
    this.callback = callback;
    this.interval = interval;
  }

  start() {
    if (this.timerId !== 0) return;

    this.lastTimeStamp = Date.now();
    this.timerId = setInterval(() => {
      //console.log("call callback");
      this.lastTimeStamp = Date.now();
      this.callback();
    }, this.interval);
    //console.log("start: ", this.timerId);
  }

  stop() {
    clearInterval(this.timerId);
    this.timerId = 0;
    this.paused = false;
    //console.log("stop");
  }

  pause() {
    if (this.timerId === 0) return;

    this.paused = true;
    this.remaining = this.interval - (Date.now() - this.lastTimeStamp);
    clearInterval(this.timerId);
    this.timerId = 0;
    //console.log("pause remaining:", this.remaining);
  }

  resume() {
    //console.log("resume");
    this.paused = false;
    this.timerId = setTimeout(() => {
      this.timerId = 0;
      //console.log("call callback");
      this.callback();
      this.start();
    }, this.remaining);
  }

  togglePause() {
    if (this.paused) {
      this.resume();
    } else {
      this.pause();
    }
  }

  isPaused() {
    return this.paused;
  }
}

export default GameTimer;
