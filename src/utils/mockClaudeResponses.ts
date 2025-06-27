import type { ClaudeResponse, JokeMetrics } from '../types';

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

// Keywords for analyzing joke content
const positiveKeywords = ['funny', 'hilarious', 'laugh', 'joke', 'comedy', 'clever', 'witty'];
const negativeKeywords = ['bad', 'awful', 'terrible', 'unfunny', 'boring', 'lame'];

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
  
  // Check for keywords
  const hasPositive = positiveKeywords.some(keyword => lowerTranscript.includes(keyword));
  const hasNegative = negativeKeywords.some(keyword => lowerTranscript.includes(keyword));
  
  // Analyze joke length (too short or too long affects score)
  const wordCount = transcript.split(/\s+/).length;
  const optimalWordCount = duration * 2.5; // ~2.5 words per second is good pacing
  const pacingScore = Math.max(0, 100 - Math.abs(wordCount - optimalWordCount) * 2);
  
  // Determine reaction and score
  let reaction: ClaudeResponse['reaction'];
  let score: number;
  let feedback: string;
  let suggestion: string | undefined;
  
  if (hasPositive && !hasNegative) {
    // Great performance
    reaction = 'laughs';
    score = 80 + Math.random() * 20; // 80-100
    feedback = greatFeedback[Math.floor(Math.random() * greatFeedback.length)];
  } else if (hasNegative && !hasPositive) {
    // Poor performance
    reaction = 'tomatoes';
    score = 10 + Math.random() * 20; // 10-30
    feedback = poorFeedback[Math.floor(Math.random() * poorFeedback.length)];
    suggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
  } else if (transcript.length < 20) {
    // Too short
    reaction = 'crickets';
    score = 20 + Math.random() * 20; // 20-40
    feedback = "That was too short! Give us more to work with!";
    suggestion = "Try expanding your joke with more setup and detail!";
  } else if (pacingScore > 70) {
    // Good pacing
    reaction = 'roses';
    score = 60 + Math.random() * 20; // 60-80
    feedback = goodFeedback[Math.floor(Math.random() * goodFeedback.length)];
  } else {
    // Mixed performance
    reaction = 'roses';
    score = 40 + Math.random() * 20; // 40-60
    feedback = mixedFeedback[Math.floor(Math.random() * mixedFeedback.length)];
    suggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
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

// Simulate API delay
export async function getMockClaudeResponse(
  transcript: string, 
  duration: number
): Promise<ClaudeResponse> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
  
  return analyzeJoke(transcript, duration);
}