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
      stopRecording();
      setIsProcessing(true);
      dispatch({ type: "SET_RECORDING_STATE", payload: "processing" });

      // Mock transcription
      const mockTranscript =
        "So I went to the store yesterday, and you won't believe what happened. The cashier looked at me and said, 'Did you find everything?' And I said, 'Yeah, except for my dignity after trying to parallel park outside!'";
      setTranscript(mockTranscript);

      // Get AI feedback
      const response = await getMockClaudeResponse(
        mockTranscript,
        recordingTime
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
      await startRecording();
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
        style={{ backgroundImage: `url(/src/assets/image.png)` }}
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
        {/* Microphone icon */}
        <div className="mb-8 text-6xl animate-bounce">
          {isRecording ? "🎭" : "🎤"}
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
