class TimeManager {
  gameTimerInterval;
  gameTimerCallback;
  lockTimerDelay;
  lockTimerCallback;

  timerId = 0;
  activeTimer = 0;
  startTimeStamp;
  remaining;
  paused = false;

  get isPaused() {
    return this.paused;
  }

  initGameTimer(callback, interval) {
    this.gameTimerInterval = interval;
    this.gameTimerCallback = callback;
  }

  startGameTimer() {
    if (this.activeTimer === 1 && this.timerId) {
      return;
    }

    this.stopTimer();

    this.activeTimer = 1;
    this.startTimeStamp = Date.now();
    this.remaining = this.gameTimerInterval;

    this.timerId = setInterval(() => {
      this.startTimeStamp = Date.now();
      this.remaining = this.gameTimerInterval;
      this.gameTimerCallback();
    }, this.gameTimerInterval);
  }

  stopTimer() {
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = 0;
      this.activeTimer = 0;
    }
  }

  pauseTimer() {
    this.paused = true;

    if (this.activeTimer) {
      clearTimeout(this.timerId);
      this.timerId = 0;
      this.remaining -= Date.now() - this.startTimeStamp;
    }
  }

  resumeTimer() {
    this.paused = false;

    if (this.activeTimer) {
      this.startTimeStamp = Date.now();

      this.timerId = setTimeout(() => {
        this.timerId = 0;

        if (this.activeTimer === 1) {
          this.startGameTimer();
          this.gameTimerCallback();
        } else if (this.activeTimer === 2) {
          this.lockTimerCallback();
        }
      }, this.remaining);
    }
  }

  initLockTimer(callback, delay) {
    this.lockTimerDelay = delay;
    this.lockTimerCallback = callback;
  }

  startLockTimer() {
    if (this.activeTimer === 2 && this.timerId) {
      return;
    }

    this.stopTimer();

    this.activeTimer = 2;
    this.startTimeStamp = Date.now();
    this.remaining = this.lockTimerDelay;

    this.timerId = setTimeout(() => {
      this.timerId = 0;
      this.activeTimer = 0;
      this.lockTimerCallback();
    }, this.lockTimerDelay);
  }

  togglePause() {
    if (this.paused) {
      this.resumeTimer();
    } else {
      this.pauseTimer();
    }
  }

  resetTimer() {
    this.stopTimer();
    this.paused = false;
  }
}

const timeManager = new TimeManager();
export default timeManager;
