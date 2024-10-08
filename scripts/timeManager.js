// TimerType enum
const TimerType = Object.freeze({
  NONE: 0,
  GAME: 1,
  LOCK: 2,
});

class TimeManager {
  gameTimerInterval = 0;
  gameTimerCallback;
  lockTimerDelay = 0;
  lockTimerCallback;

  timerId = 0;
  activeTimer = TimerType.NONE;
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

  initLockTimer(callback, delay) {
    this.lockTimerDelay = delay;
    this.lockTimerCallback = callback;
  }

  startGameTimer() {
    if (this.activeTimer === TimerType.GAME && this.timerId) {
      return;
    }

    this.stopTimer();

    this.activeTimer = TimerType.GAME;
    this.startTimeStamp = Date.now();
    this.remaining = this.gameTimerInterval;

    this.timerId = setInterval(() => {
      this.startTimeStamp = Date.now();
      this.remaining = this.gameTimerInterval;
      this.gameTimerCallback?.();
    }, this.gameTimerInterval);
  }

  startLockTimer() {
    if (this.activeTimer === TimerType.LOCK && this.timerId) {
      return;
    }

    this.stopTimer();

    this.activeTimer = TimerType.LOCK;
    this.startTimeStamp = Date.now();
    this.remaining = this.lockTimerDelay;

    this.timerId = setTimeout(() => {
      this.timerId = 0;
      this.activeTimer = TimerType.NONE;
      this.lockTimerCallback?.();
    }, this.lockTimerDelay);
  }

  stopTimer() {
    if (this.timerId) {
      clearTimeout(this.timerId); // this will also clear interval
      this.timerId = 0;
      this.activeTimer = TimerType.NONE;
    }
  }

  pauseTimer() {
    this.paused = true;

    if (this.activeTimer !== TimerType.NONE) {
      clearTimeout(this.timerId);
      this.timerId = 0;
      this.remaining -= Date.now() - this.startTimeStamp;
    }
  }

  resumeTimer() {
    this.paused = false;

    if (this.activeTimer !== TimerType.NONE) {
      this.startTimeStamp = Date.now();

      this.timerId = setTimeout(() => {
        this.timerId = 0;

        if (this.activeTimer === TimerType.GAME) {
          this.startGameTimer();
          this.gameTimerCallback?.();
        } else if (this.activeTimer === TimerType.LOCK) {
          this.lockTimerCallback?.();
        }
      }, this.remaining);
    }
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
