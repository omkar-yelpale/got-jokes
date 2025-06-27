import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../hooks/useApp';
import type { User } from '../types/index';
import logo from '../assets/logo.png';
import buttonContinue from '../assets/button-continue.svg';

// Avatar data for 3x4 grid
const AVATARS = [
  { id: 1, name: 'Avatar 1', image: '👦', bgColor: 'bg-orange-300' },
  { id: 2, name: 'Avatar 2', image: '👨', bgColor: 'bg-blue-300' },
  { id: 3, name: 'Avatar 3', image: '😎', bgColor: 'bg-pink-300' },
  { id: 4, name: 'Avatar 4', image: '👩', bgColor: 'bg-yellow-300' },
  { id: 5, name: 'Avatar 5', image: '🧔', bgColor: 'bg-amber-300' },
  { id: 6, name: 'Avatar 6', image: '🤓', bgColor: 'bg-green-300' },
  { id: 7, name: 'Avatar 7', image: '👩‍🦱', bgColor: 'bg-cyan-300' },
  { id: 8, name: 'Avatar 8', image: '👱‍♀️', bgColor: 'bg-rose-300' },
  { id: 9, name: 'Avatar 9', image: '👨‍💼', bgColor: 'bg-purple-300' },
  { id: 10, name: 'Avatar 10', image: '👩‍💻', bgColor: 'bg-indigo-300' },
  { id: 11, name: 'Avatar 11', image: '🧑‍🎤', bgColor: 'bg-teal-300' },
];

export default function AvatarPage() {
  const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null);
  const { dispatch } = useApp();
  const navigate = useNavigate();

  const handleEnter = () => {
    if (selectedAvatar) {
      const newUser: User = {
        id: Date.now().toString(),
        username: `User${selectedAvatar}`,
        avatarId: selectedAvatar,
        customAvatar: undefined, // Don't set custom avatar here, only through upload
        level: 1,
        totalLaughs: 0,
        totalRoses: 0,
        followers: 0,
        following: 0,
        createdAt: new Date(),
      };
      
      dispatch({ type: 'SET_USER', payload: newUser });
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen text-white flex flex-col items-center justify-center p-4">
      {/* Logo */}
      <div className="mb-8">
        <img src={logo} alt="Got Jokes?" className="h-24 w-auto" />
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold mb-8">Select your Avatar</h1>

      {/* Avatar Grid Container */}
      <div className="bg-[#1E293B]/50 rounded-3xl p-6 backdrop-blur-sm border border-white/10 mb-8">
        {/* Avatar Grid */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          {AVATARS.map((avatar) => (
            <button
              key={avatar.id}
              onClick={() => setSelectedAvatar(avatar.id)}
              className={`
                w-20 h-20 rounded-full flex items-center justify-center
                transition-all duration-200 transform
                ${selectedAvatar === avatar.id 
                  ? 'ring-4 ring-[#EC4899] scale-110' 
                  : 'hover:scale-105'
                }
              `}
            >
              <div className={`w-full h-full rounded-full ${avatar.bgColor} flex items-center justify-center`}>
                <span className="text-3xl">{avatar.image}</span>
              </div>
            </button>
          ))}
          
          {/* Make Your Own button */}
          <button
            onClick={() => {
              setSelectedAvatar(12);
              // In a real implementation, this would open a file picker
              // For now, it just selects avatar 12
            }}
            className={`
              w-20 h-20 rounded-full flex items-center justify-center
              bg-gradient-to-br from-purple-500 to-pink-500
              transition-all duration-200 transform
              ${selectedAvatar === 12 
                ? 'ring-4 ring-[#EC4899] scale-110' 
                : 'hover:scale-105'
              }
            `}
          >
            <span className="text-2xl">➕</span>
          </button>
        </div>

        {/* Make Your Own text */}
        <div className="text-center text-cyan-400 font-medium">
          Make Your Own
        </div>
      </div>

      {/* Continue Button */}
      <button
        onClick={handleEnter}
        disabled={!selectedAvatar}
        className={`transition-transform ${
          selectedAvatar 
            ? 'hover:scale-105 active:scale-95' 
            : 'opacity-50 cursor-not-allowed'
        }`}
      >
        <img 
          src={buttonContinue} 
          alt="Continue" 
          className="w-48 md:w-64 h-auto"
        />
      </button>
    </div>
  );
}