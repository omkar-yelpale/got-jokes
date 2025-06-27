import { IconArrowLeft } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AnalyticsModal from "../components/Analytics/AnalyticsModal";
import CrowdText from "../components/Reactions/CrowdText";
import ReactionAnimation from "../components/Reactions/ReactionAnimation";
import ScoreDisplay from "../components/Reactions/ScoreDisplay";
import RecordButton from "../components/Recording/RecordButton";
import { useApp } from "../hooks/useApp";
import { useAudioRecording } from "../hooks/useAudioRecording";
import type { ClaudeResponse, Joke } from "../types";
import { getMockClaudeResponse, blobToBase64 } from "../utils/mockClaudeResponses";
import { soundEffects } from "../utils/soundEffects";
import { transcriptionService } from "../utils/speechRecognition";
import stageBackground from "../assets/image.png";

export default function RecordPage() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [transcript, setTranscript] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [claudeResponse, setClaudeResponse] = useState<ClaudeResponse | null>(
    null
  );
  const [showReaction, setShowReaction] = useState(false);
  const [showScore, setShowScore] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [transcriptionAvailable] = useState(transcriptionService.isAvailable());

  const {
    isRecording,
    recordingTime,
    audioUrl,
    audioBlob,
    startRecording,
    stopRecording,
    resetRecording,
    error,
  } = useAudioRecording(60); // 60 second max

  // Update global recording state
  useEffect(() => {
    dispatch({ type: "SET_RECORDING", payload: isRecording });
    dispatch({
      type: "SET_RECORDING_STATE",
      payload: isRecording ? "recording" : "idle",
    });
  }, [isRecording, dispatch]);

  // Play ambient crowd sound on mount
  useEffect(() => {
    let stopFunction: (() => void) | null = null;
    
    // Start ambient sound after a short delay (to ensure user interaction)
    const timer = setTimeout(() => {
      stopFunction = soundEffects.playAmbientCrowd();
    }, 500);

    // Cleanup
    return () => {
      clearTimeout(timer);
      if (stopFunction) {
        stopFunction();
      }
    };
  }, []);

  const handleToggleRecording = async () => {
    if (isRecording) {
      // Stop recording and transcription
      stopRecording();
      const finalTranscript = transcriptionService.stop();
      setIsProcessing(true);
      dispatch({ type: "SET_RECORDING_STATE", payload: "processing" });

      // Check if we have a real transcript
      const hasRealTranscript = !!finalTranscript && finalTranscript.trim().length > 0;
      const jokeTranscript = hasRealTranscript 
        ? finalTranscript 
        : "So I went to the store yesterday, and you won't believe what happened. The cashier looked at me and said, 'Did you find everything?' And I said, 'Yeah, except for my dignity after trying to parallel park outside!'";
      
      setTranscript(jokeTranscript);
      console.log('Final transcript:', jokeTranscript);
      console.log('Has real transcript:', hasRealTranscript);

      // Get AI feedback - only use real AI if we have a real transcript
      const response = await getMockClaudeResponse(
        jokeTranscript,
        recordingTime,
        hasRealTranscript // Pass this flag to determine if we should use AI
      );
      setClaudeResponse(response);
      setIsProcessing(false);

      // Play audio and show reactions sequence
      if (audioUrl) {
        const audio = new Audio(audioUrl);
        audio.play().catch((err) => console.error("Error playing audio:", err));
      }

      setShowReaction(true);
      // Play the reaction sound effect
      soundEffects.playReactionSound(response.reaction);
      
      setTimeout(() => {
        setShowScore(true);
        setTimeout(() => {
          setShowReaction(false);
          setShowScore(false); // Hide score display
          setShowAnalytics(true);
          dispatch({ type: "SET_RECORDING_STATE", payload: "complete" });
        }, 2000);
      }, 2000);
    } else {
      resetRecording();
      setTranscript("");
      setClaudeResponse(null);
      setShowReaction(false);
      setShowScore(false);
      setShowAnalytics(false);
      
      // Start recording audio
      try {
        await startRecording();
        
        // Start transcription after recording starts successfully
        const transcriptionStarted = transcriptionService.start((interim) => {
          // Optional: Show live transcription
          console.log('Interim transcript:', interim);
        });
        
        if (!transcriptionStarted) {
          console.warn('Transcription not available, will use fallback');
        }
      } catch (err) {
        console.error('Failed to start recording:', err);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSave = async () => {
    if (!audioBlob || !claudeResponse) return;

    // Convert blob to base64 for persistence
    const audioBase64 = await blobToBase64(audioBlob);

    const joke: Joke = {
      id: Date.now().toString(),
      userId: state.user?.id || "",
      title: `Joke from ${new Date().toLocaleDateString()}`,
      audioBlob: audioBase64,
      transcript,
      duration: recordingTime,
      createdAt: new Date(),
      published: false,
      metrics: claudeResponse.metrics,
      reactions: {
        laughs: claudeResponse.reaction === "laughs" ? 1 : 0,
        roses: claudeResponse.reaction === "roses" ? 1 : 0,
        tomatoes: claudeResponse.reaction === "tomatoes" ? 1 : 0,
        feedback: claudeResponse.feedback,
        suggestion: claudeResponse.suggestion,
      },
    };

    dispatch({ type: "ADD_JOKE", payload: joke });
    navigate("/");
  };

  const handlePublish = async () => {
    if (!audioBlob || !claudeResponse) return;

    // Convert blob to base64 for persistence
    const audioBase64 = await blobToBase64(audioBlob);

    const joke: Joke = {
      id: Date.now().toString(),
      userId: state.user?.id || "",
      title: `Joke from ${new Date().toLocaleDateString()}`,
      audioBlob: audioBase64,
      transcript,
      duration: recordingTime,
      createdAt: new Date(),
      published: true,
      metrics: claudeResponse.metrics,
      reactions: {
        laughs: claudeResponse.reaction === "laughs" ? 1 : 0,
        roses: claudeResponse.reaction === "roses" ? 1 : 0,
        tomatoes: claudeResponse.reaction === "tomatoes" ? 1 : 0,
        feedback: claudeResponse.feedback,
        suggestion: claudeResponse.suggestion,
      },
    };

    dispatch({ type: "ADD_JOKE", payload: joke });
    navigate("/");
  };

  const handleDiscard = () => {
    resetRecording();
    setTranscript("");
    setClaudeResponse(null);
    setShowAnalytics(false);
    setShowScore(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Stage Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${stageBackground})` }}
      />
      
      {/* Dark overlay for better text visibility */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 z-10 p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
      >
        <IconArrowLeft size={24} />
      </button>

      <div className="max-w-md mx-auto min-h-screen flex flex-col items-center justify-center relative z-10 py-20">
        {/* Avatar or Microphone icon */}
        <div className="mb-8 animate-bounce">
          {isRecording && state.user?.customAvatar ? (
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/20">
              <img 
                src={state.user.customAvatar} 
                alt="Your avatar" 
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="text-6xl">
              {isRecording ? "🎭" : "🎤"}
            </div>
          )}
        </div>

        {/* Recording Status */}
        <div className="mt-8 text-center">
          <h2 className="text-white text-2xl font-semibold mb-2">
            {isRecording ? "Recording..." : "Record when you're ready!"}
          </h2>
          {isRecording && (
            <p className="text-red-400 text-lg font-mono">
              {formatTime(recordingTime)} / 1:00
            </p>
          )}
          {!transcriptionAvailable && (
            <p className="text-yellow-400 text-sm mt-2">
              ⚠️ Voice transcription not available in this browser
            </p>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-4 px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Record Button */}
        <div className="mt-8">
          <RecordButton
            isRecording={isRecording}
            onToggleRecording={handleToggleRecording}
            disabled={!!error}
          />
        </div>

        {/* Processing indicator */}
        {isProcessing && (
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 text-white">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Analyzing your joke...</span>
            </div>
            <p className="text-gray-400 text-sm mt-2">
              {transcript === "So I went to the store yesterday, and you won't believe what happened. The cashier looked at me and said, 'Did you find everything?' And I said, 'Yeah, except for my dignity after trying to parallel park outside!'" 
                ? "Using sample analysis (transcription unavailable)" 
                : "Using AI analysis for your joke"}
            </p>
          </div>
        )}
      </div>

      {/* Reaction Animations */}
      {claudeResponse && (
        <>
          <ReactionAnimation
            reaction={claudeResponse.reaction}
            isActive={showReaction}
            onComplete={() => {}}
          />
          <CrowdText
            reaction={claudeResponse.reaction}
            score={claudeResponse.score}
            isActive={showReaction}
          />
          <ScoreDisplay score={claudeResponse.score} isVisible={showScore} />
        </>
      )}

      {/* Analytics Modal */}
      <AnalyticsModal
        isOpen={showAnalytics}
        onClose={() => setShowAnalytics(false)}
        metrics={claudeResponse?.metrics || null}
        response={claudeResponse}
        audioUrl={audioUrl}
        onSave={handleSave}
        onPublish={handlePublish}
        onDiscard={handleDiscard}
      />
    </div>
  );
}
