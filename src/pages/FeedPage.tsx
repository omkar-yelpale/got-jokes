import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconHome, IconMicrophone, IconUser, IconUserCircle } from '@tabler/icons-react';
import { useApp } from '../hooks/useApp';

export default function FeedPage() {
  const navigate = useNavigate();
  const { dispatch } = useApp();
  const [activeTab, setActiveTab] = useState<'trending' | 'friends'>('trending');

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F172A] to-[#1E293B]">
      <div className="max-w-md mx-auto h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4">
          <button
            onClick={() => {
              dispatch({ type: 'SET_USER', payload: null });
              navigate('/');
            }}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
            title="Change Avatar"
          >
            <IconUserCircle size={24} />
          </button>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            got jokes? <span>😉</span>
          </h1>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>

        {/* Tabs */}
        <div className="flex bg-white/5 rounded-full mx-4 p-1 mb-4">
          <button
            onClick={() => setActiveTab('trending')}
            className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${
              activeTab === 'trending' 
                ? 'bg-white/20 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Trending
          </button>
          <button
            onClick={() => setActiveTab('friends')}
            className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${
              activeTab === 'friends' 
                ? 'bg-white/20 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Friends
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto px-4 pb-20">
          {activeTab === 'trending' ? (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-6 text-center">
                <p className="text-white text-lg">No jokes yet!</p>
                <p className="text-gray-300 mt-2">Be the first to share a joke</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-6 text-center">
                <p className="text-white text-lg">Follow comedians to see their jokes here</p>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-[#0F172A]/90 backdrop-blur-lg border-t border-gray-700">
          <div className="flex justify-around items-center py-2">
            <button
              onClick={() => navigate('/feed')}
              className="p-3 text-[#EC4899]"
            >
              <IconHome size={28} />
            </button>
            <button
              onClick={() => navigate('/record')}
              className="p-3 text-gray-400 hover:text-white transition-colors"
            >
              <IconMicrophone size={28} />
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="p-3 text-gray-400 hover:text-white transition-colors"
            >
              <IconUser size={28} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}