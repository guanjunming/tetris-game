import DelayTimer from "../delayTimer.js";
import GameTimer from "../gameTimer.js";

class TimeManager {
  gameTimer;
  lockTimer;

  paused = false;

  currentTimer;

  get isPaused() {
    return this.paused;
  }

  initGameTimer(callback, interval) {
    this.gameTimer = new GameTimer(callback, interval);
  }

  startGameTimer() {
    if (this.currentTimer && this.currentTimer != this.gameTimer) {
      this.currentTimer.stop();
    }

    if (this.paused) {
      console.log("trying to start game timer when paused!!!!!!");
    }

    if (this.gameTimer.start()) {
      this.currentTimer = this.gameTimer;
      console.log("current timer is : gameTimer");
    }
  }

  stopGameTimer() {
    if (this.gameTimer.stop()) {
      this.currentTimer = null;
      console.log("current timer NULL");
    }
  }

  initLockTimer(callback, delay) {
    this.lockTimer = new DelayTimer(() => {
      console.log("Lock timer end: setting current timer back to null");
      this.currentTimer = null;
      callback();
    }, delay);
  }

  startLockTimer() {
    if (this.currentTimer && this.currentTimer != this.lockTimer) {
      console.log("stop game timer!!!!!!!");
      this.currentTimer.stop();
    }

    if (this.lockTimer.start()) {
      this.currentTimer = this.lockTimer;
      console.log("current timer is: lockTimer");
    }
  }

  clearLockTimer() {
    if (this.lockTimer.stop()) {
      this.currentTimer = null;
      console.log("current timer NULL");
    }
  }

  togglePause() {
    if (this.currentTimer) {
      this.paused ? this.currentTimer.resume() : this.currentTimer.pause();
      this.paused = !this.paused;
    }
  }

  clearCurrentTimer() {
    console.log("clearing current timer: " + this.currentTimer);
    this.currentTimer?.stop();
    this.currentTimer = null;
    this.paused = false;
  }
}

const timeManager = new TimeManager();
export default timeManager;
