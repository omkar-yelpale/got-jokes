import booSound from '../assets/boo_sound.wav';
import laughterSound from '../assets/laughter_sound.wav';

class SoundEffects {
  private audioContext: AudioContext | null = null;
  private booAudio: HTMLAudioElement;
  private laughterAudio: HTMLAudioElement;

  constructor() {
    // Initialize audio context on user interaction
    if (typeof window !== 'undefined' && window.AudioContext) {
      this.audioContext = new AudioContext();
    }
    
    // Preload audio files
    this.booAudio = new Audio(booSound);
    this.laughterAudio = new Audio(laughterSound);
    
    // Set volumes
    this.booAudio.volume = 0.5;
    this.laughterAudio.volume = 0.5;
  }

  // Play a simple tone for testing
  private playTone(frequency: number, duration: number, type: OscillatorType = 'sine') {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  // Play applause/cheering sound (using laughter audio)
  playApplause() {
    // Clone the audio to allow multiple plays
    const audio = this.laughterAudio.cloneNode() as HTMLAudioElement;
    audio.volume = 0.5;
    audio.play().catch(err => console.error('Error playing applause:', err));
  }

  // Play laughter sound
  playLaughter() {
    // Clone the audio to allow multiple plays
    const audio = this.laughterAudio.cloneNode() as HTMLAudioElement;
    audio.volume = 0.5;
    audio.play().catch(err => console.error('Error playing laughter:', err));
  }

  // Play boo sound
  playBoo() {
    // Clone the audio to allow multiple plays
    const audio = this.booAudio.cloneNode() as HTMLAudioElement;
    audio.volume = 0.5;
    audio.play().catch(err => console.error('Error playing boo:', err));
  }

  // Play cricket sound (high pitched chirps)
  playCrickets() {
    if (!this.audioContext) return;

    // Simulate cricket chirps
    let chirpCount = 0;
    const chirp = () => {
      if (chirpCount < 6) {
        this.playTone(4000, 0.05, 'sine');
        chirpCount++;
        setTimeout(chirp, 150);
      }
    };
    
    chirp();
    
    // Repeat after a pause
    setTimeout(() => {
      chirpCount = 0;
      chirp();
    }, 1000);
  }

  // Play ambient crowd murmur (pleasant background sound)
  playAmbientCrowd(): (() => void) | null {
    if (!this.audioContext) return null;

    // Create a low-frequency rumble for crowd ambience
    const bufferSize = this.audioContext.sampleRate * 3; // 3 seconds
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const output = buffer.getChannelData(0);

    // Generate low-frequency noise
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.05; // Very low volume
    }

    const noise = this.audioContext.createBufferSource();
    const gainNode = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();

    noise.buffer = buffer;
    noise.loop = true;
    
    // Low-pass filter for rumble effect
    filter.type = 'lowpass';
    filter.frequency.value = 200;
    filter.Q.value = 1;

    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // Very low volume for ambient effect
    gainNode.gain.value = 0.1;

    noise.start();
    
    // Return stop function
    return () => {
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext!.currentTime + 0.5);
      setTimeout(() => noise.stop(), 500);
    };
  }

  // Play sound based on reaction type
  playReactionSound(reaction: 'laughs' | 'roses' | 'tomatoes' | 'crickets') {
    // Ensure audio context is resumed (for browser autoplay policies)
    if (this.audioContext?.state === 'suspended') {
      this.audioContext.resume();
    }

    switch (reaction) {
      case 'laughs':
        this.playLaughter();
        break;
      case 'roses':
        this.playApplause();
        break;
      case 'tomatoes':
        this.playBoo();
        break;
      case 'crickets':
        this.playCrickets();
        break;
    }
  }
}

// Export singleton instance
export const soundEffects = new SoundEffects();