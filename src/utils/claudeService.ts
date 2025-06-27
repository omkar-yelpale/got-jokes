import Anthropic from '@anthropic-ai/sdk';
import type { ClaudeResponse, JokeMetrics } from '../types';

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true, // Required for frontend usage
});

// Generate metrics based on AI analysis
const generateMetrics = (
  delivery: number,
  timing: number,
  originality: number,
  relatability: number
): JokeMetrics => {
  return {
    stutterScore: delivery,
    quickWit: timing,
    creativity: originality,
    punchlineImpact: relatability,
  };
};

export async function analyzeJokeWithClaude(
  transcript: string,
  duration: number
): Promise<ClaudeResponse> {
  try {
    const prompt = `You are a comedy club audience and judge. Analyze this joke performance and respond with a JSON object.

Joke transcript: "${transcript}"
Duration: ${duration} seconds
Word count: ${transcript.split(/\s+/).length}

Evaluate the joke on these criteria:
1. Is it actually funny? Does it have a proper setup and punchline?
2. Delivery quality (pacing, timing based on duration vs word count)
3. Originality and creativity
4. Relatability and audience appeal
5. Is it offensive or inappropriate?

Respond with ONLY a valid JSON object in this exact format:
{
  "reaction": "laughs" | "roses" | "tomatoes" | "crickets",
  "score": number (0-100),
  "feedback": "One sentence audience reaction",
  "suggestion": "One sentence improvement tip" | null,
  "metrics": {
    "delivery": number (0-100),
    "timing": number (0-100), 
    "originality": number (0-100),
    "relatability": number (0-100)
  }
}

Reaction guide:
- "laughs": Score 75-100, genuinely hilarious
- "roses": Score 50-74, good effort, decent laughs
- "tomatoes": Score 25-49, poor performance, offensive, or bad timing
- "crickets": Score 0-24, no punchline, too short, or confusing`;

    const message = await anthropic.messages.create({
      model: import.meta.env.VITE_CLAUDE_MODEL || 'claude-3-haiku-20240307',
      max_tokens: 300,
      temperature: 0.8,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: prompt
            }
          ]
        }
      ],
      system: 'You are a comedy club audience member. Respond only with valid JSON, no other text or markdown.'
    });

    // Extract the text content from Claude's response
    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
    
    if (!responseText) {
      throw new Error('No response from Claude');
    }

    // Parse the JSON response
    const parsed = JSON.parse(responseText);
    
    // Validate and transform the response
    return {
      reaction: parsed.reaction as ClaudeResponse['reaction'],
      score: Math.round(Math.max(0, Math.min(100, parsed.score))),
      feedback: parsed.feedback || 'The audience is processing your joke...',
      suggestion: parsed.suggestion || undefined,
      metrics: generateMetrics(
        parsed.metrics?.delivery || 50,
        parsed.metrics?.timing || 50,
        parsed.metrics?.originality || 50,
        parsed.metrics?.relatability || 50
      ),
    };
  } catch (error) {
    console.error('Claude API Error:', error);
    // Return a fallback response
    throw error;
  }
}