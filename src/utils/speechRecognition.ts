// Web Speech API for real-time transcription
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

// TypeScript declarations for Web Speech API
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: ((event: Event) => void) | null;
  onend: ((event: Event) => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: { new(): SpeechRecognition };
    webkitSpeechRecognition: { new(): SpeechRecognition };
  }
}

// Check for browser support
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

export class TranscriptionService {
  private recognition: SpeechRecognition | null = null;
  private isTranscribing = false;
  private transcript = '';
  private onTranscriptUpdate: ((transcript: string) => void) | null = null;

  constructor() {
    if (!SpeechRecognition) {
      console.warn('Speech recognition not supported in this browser');
      return;
    }

    this.recognition = new SpeechRecognition();
    this.setupRecognition();
  }

  private setupRecognition() {
    if (!this.recognition) return;

    // Configure recognition
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';
    this.recognition.maxAlternatives = 1;

    // Handle results
    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript + ' ';
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      // Update the complete transcript
      if (finalTranscript) {
        this.transcript += finalTranscript;
      }

      // Notify listener of updates
      if (this.onTranscriptUpdate) {
        this.onTranscriptUpdate(this.transcript + interimTranscript);
      }
    };

    // Handle errors
    this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error, event.message);
      
      switch (event.error) {
        case 'no-speech':
          console.log('No speech detected');
          break;
        case 'not-allowed':
          console.error('Microphone permission denied');
          break;
        case 'network':
          console.error('Network error during speech recognition');
          break;
        case 'service-not-allowed':
          console.error('Speech recognition service not allowed (HTTPS required)');
          break;
        default:
          console.error('Unknown speech recognition error');
      }
    };

    // Handle end
    this.recognition.onend = () => {
      this.isTranscribing = false;
      console.log('Speech recognition ended');
    };
  }

  start(onUpdate?: (transcript: string) => void): boolean {
    if (!this.recognition) {
      console.error('Speech recognition not available');
      return false;
    }

    if (this.isTranscribing) {
      console.warn('Already transcribing');
      return false;
    }

    try {
      this.transcript = '';
      this.onTranscriptUpdate = onUpdate || null;
      this.recognition.start();
      this.isTranscribing = true;
      console.log('Started transcription');
      return true;
    } catch (error) {
      console.error('Failed to start transcription:', error);
      return false;
    }
  }

  stop(): string {
    if (!this.recognition || !this.isTranscribing) {
      return this.transcript;
    }

    try {
      this.recognition.stop();
      this.isTranscribing = false;
      console.log('Stopped transcription');
      return this.transcript.trim();
    } catch (error) {
      console.error('Failed to stop transcription:', error);
      return this.transcript;
    }
  }

  getTranscript(): string {
    return this.transcript.trim();
  }

  isAvailable(): boolean {
    // Check for Speech Recognition API
    if (!SpeechRecognition) {
      return false;
    }
    
    // In production, also check for HTTPS (required for speech recognition)
    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
      console.warn('Speech recognition requires HTTPS in production');
      return false;
    }
    
    return true;
  }

  isActive(): boolean {
    return this.isTranscribing;
  }
}

// Export singleton instance
export const transcriptionService = new TranscriptionService();