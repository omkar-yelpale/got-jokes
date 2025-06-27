export interface User {
  id: string;
  username: string;
  avatarId: number;
  level: number;
  totalLaughs: number;
  totalRoses: number;
  followers: number;
  following: number;
  createdAt: Date;
}

export interface Joke {
  id: string;
  userId: string;
  title: string;
  audioBlob: string; // Blob URL or base64
  transcript: string;
  duration: number;
  createdAt: Date;
  published: boolean;
  metrics: JokeMetrics;
  reactions: Reactions;
}

export interface JokeMetrics {
  stutterScore: number;    // 0-100
  quickWit: number;        // 0-100
  creativity: number;      // 0-100
  punchlineImpact: number; // 0-100
}

export interface Reactions {
  laughs: number;
  roses: number;
  tomatoes: number;
  feedback: string;        // Claude's 1-sentence feedback
  suggestion?: string;     // Optional punch-up
}

export interface ClaudeResponse {
  reaction: 'laughs' | 'roses' | 'tomatoes' | 'crickets';
  score: number;
  feedback: string;
  suggestion?: string;
  metrics: JokeMetrics;
}

export type RecordingState = 'idle' | 'recording' | 'processing' | 'complete';

export interface AppState {
  user: User | null;
  currentJoke: Joke | null;
  jokes: Joke[];
  isRecording: boolean;
  recordingState: RecordingState;
}