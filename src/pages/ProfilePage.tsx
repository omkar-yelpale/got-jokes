import { IconHome, IconMicrophone, IconTrash, IconDotsVertical, IconCamera, IconX } from '@tabler/icons-react';
import { useEffect, useState, useRef } from 'react';
import type { ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../hooks/useApp';
import SimpleAudioPlayer from '../components/Audio/SimpleAudioPlayer';
import logo from '../assets/logo.png';

const AVATAR_EMOJIS: { [key: number]: string } = {
  1: '👦', 2: '👨', 3: '😎', 4: '👩',
  5: '🧔', 6: '🤓', 7: '👩‍🦱', 8: '👱‍♀️',
  9: '👨‍💼', 10: '👩‍💻', 11: '🧑‍🎤', 12: '🎭',
};

export default function ProfilePage() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const { user, jokes } = state;
  const [activeJokeMenu, setActiveJokeMenu] = useState<string | null>(null);
  const [showAvatarUpload, setShowAvatarUpload] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setActiveJokeMenu(null);
    };

    if (activeJokeMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [activeJokeMenu]);

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Please select a JPG, PNG, or WebP image');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Please select an image smaller than 5MB');
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      dispatch({ type: 'UPDATE_USER_AVATAR', payload: result });
      setShowAvatarUpload(false);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    dispatch({ type: 'UPDATE_USER_AVATAR', payload: null });
    setShowAvatarUpload(false);
  };

  if (!user) {
    return null;
  }

  const publishedJokes = jokes.filter(joke => joke.published);
  const draftJokes = jokes.filter(joke => !joke.published);
  
  // Calculate total laughs and roses from published jokes
  const totalLaughs = publishedJokes.reduce((sum, joke) => sum + joke.reactions.laughs, 0);
  const totalRoses = publishedJokes.reduce((sum, joke) => sum + joke.reactions.roses, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F172A] to-[#1E293B]">
      <div className="max-w-md mx-auto pb-20">
        {/* Header */}
        <div className="flex justify-center items-center py-6 px-4">
          <img src={logo} alt="Got Jokes?" className="h-16 w-auto" />
        </div>

        {/* Profile Header */}
        <div className="mx-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-r from-[#5B21B6] to-[#EC4899] rounded-full flex items-center justify-center text-4xl overflow-hidden">
                {user.customAvatar ? (
                  <img 
                    src={user.customAvatar} 
                    alt="Custom avatar" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  AVATAR_EMOJIS[user.avatarId]
                )}
              </div>
              <button
                onClick={() => setShowAvatarUpload(true)}
                className="absolute -bottom-1 -right-1 p-1.5 bg-[#EC4899] rounded-full text-white hover:bg-[#DB2777] transition-colors"
              >
                <IconCamera size={16} />
              </button>
            </div>
            <div className="flex-1">
              <h2 className="text-white text-xl font-semibold">@{user.username}</h2>
              <p className="text-gray-300">Level {user.level} Comedian</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-white">{totalLaughs}</p>
              <p className="text-gray-300 text-sm">Laughs</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{totalRoses}</p>
              <p className="text-gray-300 text-sm">Roses</p>
            </div>
          </div>
        </div>

        {/* My Jokes Section */}
        <div className="px-4">
          <h3 className="text-white text-lg font-semibold mb-4">My Jokes</h3>

          {publishedJokes.length === 0 ? (
            <div className="bg-white/5 rounded-xl p-8 text-center">
              <p className="text-gray-300 mb-4">No jokes yet!</p>
              <button
                onClick={() => navigate('/record')}
                className="px-6 py-3 bg-gradient-to-r from-[#5B21B6] to-[#EC4899] text-white rounded-full font-medium hover:opacity-90 transition-opacity"
              >
                Record Your First Joke
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {publishedJokes.map((joke) => (
                <div key={joke.id} className="bg-white/5 rounded-xl p-4 relative">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-white font-medium">{joke.title}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-300">
                        <span>😂 {joke.reactions.laughs}</span>
                        <span>🌹 {joke.reactions.roses}</span>
                        {joke.reactions.tomatoes > 0 && <span>🍅 {joke.reactions.tomatoes}</span>}
                        {(joke.reactions.feedback?.includes('cricket') || joke.reactions.feedback?.includes('Cricket')) && <span>🦗</span>}
                        <span>{Math.floor(joke.duration)}s</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Play/Pause Button */}
                      {joke.audioBlob && (
                        <SimpleAudioPlayer audioUrl={joke.audioBlob} />
                      )}
                      {/* Menu Button */}
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveJokeMenu(activeJokeMenu === joke.id ? null : joke.id);
                          }}
                          className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <IconDotsVertical size={20} />
                        </button>
                        
                        {/* Dropdown Menu */}
                        {activeJokeMenu === joke.id && (
                          <div className="absolute right-0 mt-2 w-40 bg-[#1E293B] rounded-lg shadow-xl border border-gray-700 z-20">
                            <button
                              onClick={() => {
                                if (confirm('Are you sure you want to delete this joke?')) {
                                  dispatch({ type: 'DELETE_JOKE', payload: joke.id });
                                  setActiveJokeMenu(null);
                                }
                              }}
                              className="w-full flex items-center gap-2 px-4 py-3 text-red-400 hover:bg-white/10 transition-colors rounded-lg"
                            >
                              <IconTrash size={18} />
                              <span>Delete</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Drafts Section */}
          {draftJokes.length > 0 && (
            <div className="mt-8">
              <h3 className="text-white text-lg font-semibold mb-4">Drafts</h3>
              <div className="space-y-4">
                {draftJokes.map((joke) => (
                  <div key={joke.id} className="bg-white/5 rounded-xl p-4 border border-gray-700 relative">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-white font-medium">{joke.title}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-300">
                          <span className="text-yellow-400">Draft</span>
                          <span>😂 {joke.reactions.laughs}</span>
                          <span>🌹 {joke.reactions.roses}</span>
                          {joke.reactions.tomatoes > 0 && <span>🍅 {joke.reactions.tomatoes}</span>}
                          {(joke.reactions.feedback?.includes('cricket') || joke.reactions.feedback?.includes('Cricket')) && <span>🦗</span>}
                          <span>{Math.floor(joke.duration)}s</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* Play/Pause Button */}
                        {joke.audioBlob && (
                          <SimpleAudioPlayer audioUrl={joke.audioBlob} />
                        )}
                        {/* Menu Button */}
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveJokeMenu(activeJokeMenu === joke.id ? null : joke.id);
                            }}
                            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                          >
                            <IconDotsVertical size={20} />
                          </button>
                          
                          {/* Dropdown Menu */}
                          {activeJokeMenu === joke.id && (
                            <div className="absolute right-0 mt-2 w-40 bg-[#1E293B] rounded-lg shadow-xl border border-gray-700 z-20">
                              <button
                                onClick={() => {
                                  if (confirm('Are you sure you want to delete this draft?')) {
                                    dispatch({ type: 'DELETE_JOKE', payload: joke.id });
                                    setActiveJokeMenu(null);
                                  }
                                }}
                                className="w-full flex items-center gap-2 px-4 py-3 text-red-400 hover:bg-white/10 transition-colors rounded-lg"
                              >
                                <IconTrash size={18} />
                                <span>Delete</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Home Button - Top Left */}
      <button
        onClick={() => navigate('/')}
        className="fixed top-4 left-4 p-3 text-[#EC4899] bg-[#0F172A]/90 backdrop-blur-lg rounded-full border border-gray-700 z-10"
      >
        <IconHome size={24} />
      </button>

      {/* Bottom Navigation - Only Mic Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0F172A]/90 backdrop-blur-lg border-t border-gray-700">
        <div className="flex justify-center items-center py-4">
          <button
            onClick={() => navigate('/record')}
            className="p-4 bg-gradient-to-r from-[#5B21B6] to-[#EC4899] text-white rounded-full hover:opacity-90 transition-opacity shadow-lg"
          >
            <IconMicrophone size={32} />
          </button>
        </div>
      </div>

      {/* Avatar Upload Modal */}
      {showAvatarUpload && (
        <>
          <div 
            className="fixed inset-0 bg-black/70 z-40"
            onClick={() => setShowAvatarUpload(false)}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-[#1E293B] rounded-2xl p-6 max-w-sm w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white text-xl font-semibold">Upload Avatar</h3>
                <button
                  onClick={() => setShowAvatarUpload(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <IconX size={24} />
                </button>
              </div>

              {/* Current Avatar Preview */}
              <div className="mb-6 text-center">
                <div className="w-32 h-32 mx-auto bg-gradient-to-r from-[#5B21B6] to-[#EC4899] rounded-full flex items-center justify-center text-6xl overflow-hidden mb-2">
                  {user.customAvatar ? (
                    <img 
                      src={user.customAvatar} 
                      alt="Current avatar" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    AVATAR_EMOJIS[user.avatarId]
                  )}
                </div>
                <p className="text-gray-400 text-sm">Current Avatar</p>
              </div>

              {/* Upload Options */}
              <div className="space-y-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-3 bg-gradient-to-r from-[#5B21B6] to-[#EC4899] text-white rounded-full font-medium hover:opacity-90 transition-opacity"
                >
                  Choose Image
                </button>

                {user.customAvatar && (
                  <button
                    onClick={handleRemoveAvatar}
                    className="w-full py-3 border border-red-500 text-red-400 rounded-full font-medium hover:bg-red-500/10 transition-colors"
                  >
                    Remove Custom Avatar
                  </button>
                )}

                <p className="text-gray-400 text-xs text-center">
                  Upload JPG, PNG, or WebP (max 5MB)
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}