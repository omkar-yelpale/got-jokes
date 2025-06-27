import { IconHome, IconMenu2, IconMicrophone, IconUser, IconLogout, IconUserCircle } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../hooks/useApp';
import SimpleAudioPlayer from '../components/Audio/SimpleAudioPlayer';

const AVATAR_EMOJIS: { [key: number]: string } = {
  1: '👦', 2: '🧔', 3: '👩', 4: '👱‍♀️',
  5: '🧔‍♂️', 6: '🤓', 7: '👨‍🦱', 8: '👩‍🦰',
  9: '👨‍🦲', 10: '👨‍🦳', 11: '👩‍🦳',
};

export default function ProfilePage() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const { user, jokes } = state;
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const publishedJokes = jokes.filter(joke => joke.published);
  const draftJokes = jokes.filter(joke => !joke.published);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F172A] to-[#1E293B]">
      <div className="max-w-md mx-auto pb-20">
        {/* Header */}
        <div className="flex justify-between items-center py-4 px-4 relative">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            got jokes? <span>😉</span>
          </h1>
          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <IconMenu2 size={24} />
            </button>
            
            {/* Dropdown Menu */}
            {showMenu && (
              <>
                {/* Backdrop */}
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowMenu(false)}
                />
                
                {/* Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-[#1E293B] rounded-lg shadow-xl border border-gray-700 z-20">
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      dispatch({ type: 'SET_USER', payload: null });
                      navigate('/');
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 transition-colors rounded-t-lg"
                  >
                    <IconUserCircle size={20} />
                    <span>Change Avatar</span>
                  </button>
                  <div className="border-t border-gray-700" />
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      if (confirm('Are you sure you want to logout?')) {
                        dispatch({ type: 'SET_USER', payload: null });
                        localStorage.clear();
                        navigate('/');
                      }
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-white/10 transition-colors rounded-b-lg"
                  >
                    <IconLogout size={20} />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Profile Header */}
        <div className="mx-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 bg-gradient-to-r from-[#5B21B6] to-[#EC4899] rounded-full flex items-center justify-center text-4xl">
              {AVATAR_EMOJIS[user.avatarId]}
            </div>
            <div className="flex-1">
              <h2 className="text-white text-xl font-semibold">@{user.username}</h2>
              <p className="text-gray-300">Level {user.level} Comedian</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-white">{user.followers}</p>
              <p className="text-gray-300 text-sm">Followers</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{user.following}</p>
              <p className="text-gray-300 text-sm">Following</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{user.totalLaughs}</p>
              <p className="text-gray-300 text-sm">Laughs</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{user.totalRoses}</p>
              <p className="text-gray-300 text-sm">Roses</p>
            </div>
          </div>
        </div>

        {/* My Jokes Section */}
        <div className="px-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white text-lg font-semibold">My Jokes</h3>
            <button className="px-4 py-2 border border-[#EC4899] text-[#EC4899] rounded-full text-sm hover:bg-[#EC4899]/10 transition-colors">
              Create Set
            </button>
          </div>

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
                <div key={joke.id} className="bg-white/5 rounded-xl p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-white font-medium">{joke.title}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-300">
                        <span>😂 {joke.reactions.laughs}</span>
                        <span>🌹 {joke.reactions.roses}</span>
                        <span>{Math.floor(joke.duration)}s</span>
                      </div>
                    </div>
                    {/* Play/Pause Button */}
                    {joke.audioBlob && (
                      <SimpleAudioPlayer audioUrl={joke.audioBlob} />
                    )}
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
                  <div key={joke.id} className="bg-white/5 rounded-xl p-4 border border-gray-700">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-white font-medium">{joke.title}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-300">
                          <span className="text-yellow-400">Draft</span>
                          <span>{Math.floor(joke.duration)}s</span>
                        </div>
                      </div>
                      {/* Play/Pause Button */}
                      {joke.audioBlob && (
                        <SimpleAudioPlayer audioUrl={joke.audioBlob} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0F172A]/90 backdrop-blur-lg border-t border-gray-700">
        <div className="flex justify-around items-center py-2">
          <button
            onClick={() => navigate('/feed')}
            className="p-3 text-gray-400 hover:text-white transition-colors"
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
            className="p-3 text-[#EC4899]"
          >
            <IconUser size={28} />
          </button>
        </div>
      </div>
    </div>
  );
}