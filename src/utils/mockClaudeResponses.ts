import type { ClaudeResponse, JokeMetrics } from '../types';
import { analyzeJokeWithClaude } from './claudeService';

// Convert blob to base64 for storage
export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

// Generate metrics based on score range
const generateMetrics = (baseScore: number): JokeMetrics => {
  const variance = () => Math.random() * 10 - 5; // ±5 variance
  
  return {
    stutterScore: Math.max(0, Math.min(100, baseScore + variance())),
    quickWit: Math.max(0, Math.min(100, baseScore + variance())),
    creativity: Math.max(0, Math.min(100, baseScore + variance())),
    punchlineImpact: Math.max(0, Math.min(100, baseScore + variance())),
  };
};

// Keywords for analyzing joke content (could be used for more sophisticated analysis)
// const positiveKeywords = ['funny', 'hilarious', 'laugh', 'joke', 'comedy', 'clever', 'witty'];
// const negativeKeywords = ['bad', 'awful', 'terrible', 'unfunny', 'boring', 'lame'];

// Various feedback messages based on performance
const greatFeedback = [
  "That was absolutely hilarious! The crowd can't stop laughing!",
  "Comedy gold! Your timing was perfect!",
  "The audience is roaring with laughter! Great job!",
  "You killed it! That punchline was incredible!",
  "Standing ovation! You're a natural comedian!",
];

const goodFeedback = [
  "Solid joke! The crowd is really enjoying it!",
  "Nice delivery! You got some good laughs there!",
  "Pretty funny! Keep working on that timing!",
  "The audience liked that one! Good energy!",
  "Not bad at all! You're getting the hang of it!",
];

const mixedFeedback = [
  "Mixed reactions from the crowd. Try a different approach!",
  "Some laughs, some groans. Keep practicing!",
  "Hit or miss, but you're on the right track!",
  "The crowd seems divided. Maybe punch it up a bit!",
  "Getting there! Work on that delivery!",
];

const poorFeedback = [
  "Tough crowd tonight! Don't give up!",
  "That one fell flat. Try a different angle!",
  "Crickets... but everyone bombs sometimes!",
  "The audience seems confused. Clarify your setup!",
  "Keep working on it! Comedy takes practice!",
];

// Suggestions for improvement
const suggestions = [
  "Try adding a unexpected twist at the end!",
  "Build more tension before the punchline!",
  "Make the setup clearer for better impact!",
  "Add more energy to your delivery!",
  "Try relating it to something more universal!",
  "Pause before the punchline for effect!",
  "Use more specific details in your setup!",
];

export function analyzeJoke(transcript: string, duration: number): ClaudeResponse {
  const lowerTranscript = transcript.toLowerCase();
  
  // Analyze various aspects of the joke
  const wordCount = transcript.split(/\s+/).length;
  const hasSetup = transcript.includes('?') || transcript.includes(',');
  const hasPunchline = wordCount > 10;
  const optimalWordCount = duration * 2.5; // ~2.5 words per second is good pacing
  const pacingScore = Math.max(0, 100 - Math.abs(wordCount - optimalWordCount) * 2);
  
  // Check for offensive content
  const offensiveKeywords = ['hate', 'stupid', 'dumb', 'idiot', 'kill', 'die'];
  const isOffensive = offensiveKeywords.some(keyword => lowerTranscript.includes(keyword));
  
  // Random factor to make it more realistic
  const randomFactor = Math.random();
  
  // Determine reaction and score
  let reaction: ClaudeResponse['reaction'];
  let score: number;
  let feedback: string;
  let suggestion: string | undefined;
  
  if (isOffensive) {
    // Offensive joke - always gets booed
    reaction = 'tomatoes';
    score = 5 + Math.random() * 10; // 5-15
    feedback = "Whoa! That crossed a line. The audience is not happy!";
    suggestion = "Keep it clean and respectful. Comedy doesn't need to hurt!";
  } else if (wordCount < 10) {
    // Too short - crickets
    reaction = 'crickets';
    score = 15 + Math.random() * 15; // 15-30
    feedback = "That was... it? The audience is confused!";
    suggestion = "Add more setup and context to your joke!";
  } else if (!hasSetup || !hasPunchline) {
    // Poor structure - give them a chance
    if (randomFactor < 0.3) { // 30% chance of still getting roses
      reaction = 'roses';
      score = 45 + Math.random() * 15; // 45-60
      feedback = "Not bad! The crowd appreciated the effort!";
      suggestion = "Add more structure to really nail it next time!";
    } else if (randomFactor < 0.6) { // 30% chance of crickets
      reaction = 'crickets';
      score = 20 + Math.random() * 20; // 20-40
      feedback = "The audience is waiting for the punchline...";
      suggestion = "Every joke needs a clear setup and punchline!";
    } else { // 40% chance of tomatoes
      reaction = 'tomatoes';
      score = 15 + Math.random() * 15; // 15-30
      feedback = poorFeedback[Math.floor(Math.random() * poorFeedback.length)];
      suggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
    }
  } else if (pacingScore < 50) {
    // Bad pacing - give them more chances
    if (randomFactor < 0.35) { // 35% chance of roses
      reaction = 'roses';
      score = 50 + Math.random() * 15; // 50-65
      feedback = "The crowd is warming up to you! Keep going!";
      suggestion = "Work on your timing to really make them laugh!";
    } else if (randomFactor < 0.65) { // 30% chance of tomatoes
      reaction = 'tomatoes';
      score = 25 + Math.random() * 20; // 25-45
      feedback = "The timing was way off! Work on your delivery!";
      suggestion = "Practice your pacing - timing is everything!";
    } else { // 35% chance of crickets
      reaction = 'crickets';
      score = 30 + Math.random() * 20; // 30-50
      feedback = "Some chuckles, but mostly silence...";
      suggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
    }
  } else {
    // Decent joke - now it's more random
    const reactionRoll = Math.random();
    
    if (reactionRoll < 0.40) { // 40% chance of great reaction
      reaction = 'laughs';
      score = 75 + Math.random() * 25; // 75-100
      feedback = greatFeedback[Math.floor(Math.random() * greatFeedback.length)];
    } else if (reactionRoll < 0.70) { // 30% chance of good reaction
      reaction = 'roses';
      score = 55 + Math.random() * 20; // 55-75
      feedback = goodFeedback[Math.floor(Math.random() * goodFeedback.length)];
    } else if (reactionRoll < 0.85) { // 15% chance of mixed reaction
      reaction = 'roses';
      score = 40 + Math.random() * 15; // 40-55
      feedback = mixedFeedback[Math.floor(Math.random() * mixedFeedback.length)];
      suggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
    } else { // 15% chance of negative reaction
      reaction = Math.random() < 0.5 ? 'tomatoes' : 'crickets';
      score = 25 + Math.random() * 15; // 25-40
      feedback = poorFeedback[Math.floor(Math.random() * poorFeedback.length)];
      suggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
    }
  }
  
  // Round score
  score = Math.round(score);
  
  // Generate metrics based on score
  const metrics = generateMetrics(score);
  
  return {
    reaction,
    score,
    feedback,
    suggestion,
    metrics,
  };
}

// Get AI response with fallback to mock
export async function getMockClaudeResponse(
  transcript: string, 
  duration: number,
  useRealAI: boolean = false // Only use AI when we have real transcription
): Promise<ClaudeResponse> {
  try {
    // Check if we should use real AI
    if (!useRealAI) {
      console.log('Using mock response (no real transcription)');
      // Simulate network delay for consistency
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
      return analyzeJoke(transcript, duration);
    }

    // Check if API key is configured
    if (!import.meta.env.VITE_ANTHROPIC_API_KEY || import.meta.env.VITE_ANTHROPIC_API_KEY === 'your_anthropic_api_key_here') {
      console.warn('Claude API key not configured, using mock response');
      // Simulate network delay for consistency
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
      return analyzeJoke(transcript, duration);
    }

    // Try to get Claude AI response only with real transcription
    console.log('Using Claude AI for real transcript analysis');
    const aiResponse = await analyzeJokeWithClaude(transcript, duration);
    return aiResponse;
  } catch (error) {
    console.error('Failed to get Claude AI response, falling back to mock:', error);
    // Fallback to mock response
    return analyzeJoke(transcript, duration);
  }
}