class SoundManager {
  clips;
  soundEnabled = true;
  volumeOnBtn;
  volumeOffBtn;

  constructor() {
    this.initAudioClips();

    this.volumeOnBtn = document.getElementById("volume-on");
    this.volumeOffBtn = document.getElementById("volume-off");

    this.soundEnabled = localStorage.getItem("sound") === "true";
    this.setSoundSetting(this.soundEnabled);

    this.volumeOnBtn.addEventListener("click", () => this.setSoundSetting(false));
    this.volumeOffBtn.addEventListener("click", () => this.setSoundSetting(true));
  }

  initAudioClips() {
    this.clips = {
      move: new Audio("../assets/audio/move.wav"),
      rotate: new Audio("../assets/audio/rotate.wav"),
      soft_drop: new Audio("../assets/audio/soft_drop.wav"),
      hard_drop: new Audio("../assets/audio/hard_drop.wav"),
      hold: new Audio("../assets/audio/hold.wav"),
      drop_down: new Audio("../assets/audio/drop_down.wav"),
      line_1: new Audio("../assets/audio/line_1.wav"),
      line_2: new Audio("../assets/audio/line_2.wav"),
      line_3: new Audio("../assets/audio/line_3.wav"),
      line_4: new Audio("../assets/audio/line_4.wav"),
      game_over: new Audio("../assets/audio/game_over.wav"),
    };
  }

  playSoundEffect(clipName, volume = 1) {
    if (!this.soundEnabled) {
      return;
    }

    const clip = this.clips[clipName];
    if (clip) {
      clip.volume = volume;
      clip.play();
    }
  }

  setSoundSetting(enabled) {
    this.soundEnabled = enabled;
    localStorage.setItem("sound", enabled);

    if (enabled) {
      this.volumeOnBtn.classList.remove("hidden");
      this.volumeOffBtn.classList.add("hidden");
    } else {
      this.volumeOnBtn.classList.add("hidden");
      this.volumeOffBtn.classList.remove("hidden");
    }
  }
}

const soundManager = new SoundManager();
export default soundManager;
