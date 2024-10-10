class SoundManager {
  clips;
  music;
  soundEnabled = true;
  volumeOnBtn;
  volumeOffBtn;

  constructor() {
    this.initAudioClips();

    this.volumeOnBtn = document.getElementById("volume-on");
    this.volumeOffBtn = document.getElementById("volume-off");

    this.soundEnabled = localStorage.getItem("sound") === "true";
    this.setSoundSetting(this.soundEnabled);

    this.volumeOnBtn.addEventListener("click", () => {
      this.playMusic(false);
      this.setSoundSetting(false);
    });
    this.volumeOffBtn.addEventListener("click", () => {
      this.setSoundSetting(true);
      this.playMusic(true);
    });
  }

  initAudioClips() {
    const path = "../assets/audio/";

    this.clips = {
      move: new Audio(path + "move.wav"),
      rotate: new Audio(path + "rotate.wav"),
      soft_drop: new Audio(path + "soft_drop.wav"),
      hard_drop: new Audio(path + "hard_drop.wav"),
      hold: new Audio(path + "hold.wav"),
      drop_down: new Audio(path + "drop_down.wav"),
      line_1: new Audio(path + "line_1.wav"),
      line_2: new Audio(path + "line_2.wav"),
      line_3: new Audio(path + "line_3.wav"),
      line_4: new Audio(path + "line_4.wav"),
      game_over: new Audio(path + "game_over.wav"),
    };

    this.music = new Audio(path + "bgm.mp3");
    this.music.loop = true;
    this.music.volume = 0.3;
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

  playMusic(value, restart = true) {
    if (!this.soundEnabled) {
      return;
    }

    if (restart) {
      this.music.currentTime = 0;
    }

    if (value) {
      this.music.play();
    } else {
      this.music.pause();
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
