import { IconX } from '@tabler/icons-react';
import { useSpring, animated, config } from 'react-spring';
import type { JokeMetrics, ClaudeResponse } from '../../types';

interface AnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  metrics: JokeMetrics | null;
  response: ClaudeResponse | null;
  audioUrl: string | null;
  onSave: () => void;
  onPublish: () => void;
  onDiscard: () => void;
}

interface MetricBarProps {
  label: string;
  value: number;
  icon: string;
}

function MetricBar({ label, value, icon }: MetricBarProps) {
  const animation = useSpring({
    from: { width: '0%' },
    to: { width: `${value}%` },
    config: config.slow,
  });

  const getBarColor = () => {
    if (value >= 80) return 'bg-gradient-to-r from-green-400 to-green-500';
    if (value >= 60) return 'bg-gradient-to-r from-blue-400 to-blue-500';
    if (value >= 40) return 'bg-gradient-to-r from-yellow-400 to-yellow-500';
    return 'bg-gradient-to-r from-red-400 to-red-500';
  };

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{icon}</span>
          <span className="text-white font-medium">{label}</span>
        </div>
        <span className="text-white font-bold">{Math.round(value)}%</span>
      </div>
      <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
        <animated.div 
          style={animation}
          className={`h-full ${getBarColor()} rounded-full`}
        />
      </div>
    </div>
  );
}

export default function AnalyticsModal({
  isOpen,
  onClose,
  metrics,
  response,
  audioUrl,
  onSave,
  onPublish,
  onDiscard
}: AnalyticsModalProps) {
  const modalAnimation = useSpring({
    opacity: isOpen ? 1 : 0,
    transform: isOpen ? 'scale(1)' : 'scale(0.9)',
    config: config.gentle,
  });

  const backdropAnimation = useSpring({
    opacity: isOpen ? 1 : 0,
  });

  if (!isOpen || !metrics || !response) return null;

  return (
    <>
      {/* Backdrop */}
      <animated.div 
        style={backdropAnimation}
        className="fixed inset-0 bg-black/70 z-50"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <animated.div 
          style={modalAnimation}
          className="w-full max-w-md"
        >
          <div className="bg-gradient-to-b from-[#1E293B] to-[#0F172A] rounded-3xl p-6 shadow-2xl border border-white/10">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Performance Analytics</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <IconX size={24} />
            </button>
          </div>

          {/* Overall Score with Reaction Badge */}
          <div className="text-center mb-6">
            <div className="text-5xl font-bold text-white mb-2">{response.score}</div>
            <div className="text-gray-300 mb-3">Overall Score</div>
            
            {/* Reaction Badge */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
              response.reaction === 'laughs' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
              response.reaction === 'roses' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
              response.reaction === 'tomatoes' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
              'bg-gray-500/20 text-gray-400 border border-gray-500/30'
            }`}>
              <span className="text-lg">
                {response.reaction === 'laughs' && '😂'}
                {response.reaction === 'roses' && '🌹'}
                {response.reaction === 'tomatoes' && '🍅'}
                {response.reaction === 'crickets' && '🦗'}
              </span>
              <span className="capitalize">{response.reaction}</span>
            </div>
          </div>

          {/* Metrics */}
          <div className="space-y-3 mb-6">
            <MetricBar 
              label="Delivery" 
              value={metrics.stutterScore} 
              icon="🎯"
            />
            <MetricBar 
              label="Quick Wit" 
              value={metrics.quickWit} 
              icon="⚡"
            />
            <MetricBar 
              label="Creativity" 
              value={metrics.creativity} 
              icon="✨"
            />
            <MetricBar 
              label="Punchline Impact" 
              value={metrics.punchlineImpact} 
              icon="💥"
            />
          </div>

          {/* Feedback */}
          <div className="bg-white/10 rounded-2xl p-4 mb-6">
            <p className="text-white text-lg mb-2">{response.feedback}</p>
            {response.suggestion && (
              <p className="text-gray-300 text-sm italic">
                💡 Tip: {response.suggestion}
              </p>
            )}
          </div>

          {/* Audio Player */}
          {audioUrl && (
            <div className="mb-6">
              <p className="text-gray-300 text-sm mb-2">Your Recording</p>
              <audio controls className="w-full">
                <source src={audioUrl} type="audio/webm" />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={onPublish}
              className="w-full py-3 bg-gradient-to-r from-[#5B21B6] to-[#EC4899] text-white rounded-full font-semibold hover:opacity-90 transition-opacity"
            >
              Publish to Feed
            </button>
            <button
              onClick={onSave}
              className="w-full py-3 border border-white/30 text-white rounded-full font-semibold hover:bg-white/10 transition-colors"
            >
              Save as Draft
            </button>
            <button
              onClick={onDiscard}
              className="w-full py-3 text-gray-400 hover:text-red-400 font-medium transition-colors"
            >
              Discard
            </button>
          </div>
        </div>
      </animated.div>
    </div>
    </>
  );
}