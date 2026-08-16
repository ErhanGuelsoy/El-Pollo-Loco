/**
 * Manages audio playback, muting and background music for the game.
 */
class GameAudio {
  AUDIO_FILES = [
    "audio/dragon-studio-car-crash-sound-376882.mp3",
    "audio/freesound_community-cartoon-jump-6462.mp3",
    "audio/liecio-collect-points-190037.mp3",
    "audio/spinopel-run-on-asphalt-road-393093.mp3",
    "audio/freesound_community-chicken-single-alarm-call-6056.mp3",
    "audio/digitalstore07-chicken-430403.mp3",
    "audio/freesound_community-collectcoin-6075.mp3",
    "audio/kaazoom-run-and-catch-x27em-full-version-retro-platform-game-music-442980.mp3",
    "audio/pepe_hurt.mp3"
  ];
  
    /**
     * Creates a GameAudio instance and loads all audio files.
     */
    constructor() {
      this.sounds = [];
      this.isMuted = false;
      this.loadSounds();
    }
  
    /**
     * Loads all audio files and stores them in the sounds array.
     */
    loadSounds() {
      this.AUDIO_FILES.forEach(path => {
        const audio = new Audio(path);
        audio.preload = "auto";
        this.sounds.push(audio);
      });
    }
  
    /**
     * Plays a sound by its index.
     * @param {number} index - Sound ID.
     */
    play(index) {
      const sound = this.sounds[index];
  
      if (!sound) {
        console.log("Sound not found:", index);
        return;
      }
  
      sound.currentTime = 0;
      sound.muted = this.isMuted;
  
      sound.play().catch(error => {
        console.log("Sound could not be played:", error);
      });
    }
  
    /**
     * Mutes or unmutes all game sounds.
     * @param {boolean} muted - Whether the sounds should be muted.
     */
    muteAll(muted) {
      this.isMuted = muted;
  
      this.sounds.forEach(sound => {
        sound.muted = muted;
      });
    }
  
    /**
     * Starts the background music and enables looping.
     */
    startMusic() {
      const music = this.sounds[7];
      if (!music) return;
  
      music.loop = true;
      music.volume = 0.4;
      music.muted = this.isMuted;
      music.play().catch(() => {});
    }
  
    /**
     * Stops all sounds and resets their playback position.
     */
    stopAll() {
      this.sounds.forEach(sound => {
        sound.pause();
        sound.currentTime = 0;
      });
    }
  }