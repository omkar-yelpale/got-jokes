# AI Integration Guide

## Overview
GotJokes now supports real AI-powered joke analysis using Anthropic's Claude AI. The app will analyze your jokes and provide realistic audience reactions, scores, and feedback.

## Setup

### 1. Get a Claude API Key
1. Sign up at [Anthropic Console](https://console.anthropic.com)
2. Generate an API key from the API keys section
3. For security, use appropriate key permissions

### 2. Configure Environment
1. Copy `.env.example` to `.env`
2. Replace `your_anthropic_api_key_here` with your actual API key:
   ```
   VITE_ANTHROPIC_API_KEY=sk-ant-api03-...your-key-here...
   ```

### 3. Optional: Choose Model
By default, the app uses `claude-3-haiku-20240307` for cost efficiency. You can change this:
```
VITE_CLAUDE_MODEL=claude-3-sonnet-20240229  # More expensive but potentially better analysis
VITE_CLAUDE_MODEL=claude-3-opus-20240229    # Most capable but most expensive
```

## How It Works

1. **Recording**: User records a joke (up to 60 seconds)
2. **Transcription**: Uses Web Speech API for real-time speech-to-text
   - Works in Chrome, Edge, and Safari browsers
   - Falls back to sample joke if transcription unavailable
3. **AI Analysis**: Sends actual transcript to Claude AI with comedy analysis prompt
4. **Response**: AI returns:
   - Reaction type (laughs, roses, tomatoes, crickets)
   - Score (0-100)
   - Audience feedback
   - Improvement suggestions
   - Performance metrics

## Fallback Behavior

If the AI integration fails or no API key is configured:
- App automatically falls back to mock responses
- No disruption to user experience
- Console warnings indicate fallback mode

## Cost Considerations

- **claude-3-haiku**: ~$0.00025 per joke analysis
- **claude-3-sonnet**: ~$0.003 per joke analysis
- **claude-3-opus**: ~$0.015 per joke analysis
- Monitor your Anthropic usage dashboard

## Security Notes

- API key is exposed in frontend (use restricted keys)
- Consider implementing a backend proxy for production
- Add rate limiting for cost control

## Testing

1. Record a joke in the app
2. Check browser console for AI/mock response indicators
3. Try different joke styles to see varied AI reactions

## Troubleshooting

- **"Claude API key not configured"**: Check your .env file
- **API errors**: Verify your API key has proper permissions
- **Rate limits**: Claude has usage limits per minute/day
- **CORS errors**: The SDK is configured for browser usage with `dangerouslyAllowBrowser: true`
- **No transcription**: Web Speech API requires HTTPS and is not available in all browsers
- **Empty transcript**: Speak clearly and ensure microphone permissions are granted

## Future Enhancements

- Implement backend API proxy for security
- Cache similar joke analyses
- Add user preference learning
- Support multiple languages for transcription
- Show live transcription while recording