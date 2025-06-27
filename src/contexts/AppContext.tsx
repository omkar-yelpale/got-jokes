import React, { createContext, useReducer, useEffect } from 'react';
import type { AppState, User, Joke } from '../types/index';

type Action =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'UPDATE_USER_AVATAR'; payload: string | null }
  | { type: 'SET_CURRENT_JOKE'; payload: Joke | null }
  | { type: 'ADD_JOKE'; payload: Joke }
  | { type: 'UPDATE_JOKE'; payload: { id: string; joke: Partial<Joke> } }
  | { type: 'DELETE_JOKE'; payload: string }
  | { type: 'SET_RECORDING'; payload: boolean }
  | { type: 'SET_RECORDING_STATE'; payload: AppState['recordingState'] }
  | { type: 'LOAD_JOKES'; payload: Joke[] };

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const AppContext = createContext<AppContextType | null>(null);

const initialState: AppState = {
  user: null,
  currentJoke: null,
  jokes: [],
  isRecording: false,
  recordingState: 'idle'
};

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'UPDATE_USER_AVATAR':
      if (!state.user) return state;
      return {
        ...state,
        user: {
          ...state.user,
          customAvatar: action.payload || undefined
        }
      };
    case 'SET_CURRENT_JOKE':
      return { ...state, currentJoke: action.payload };
    case 'ADD_JOKE':
      return { ...state, jokes: [...state.jokes, action.payload] };
    case 'UPDATE_JOKE':
      return {
        ...state,
        jokes: state.jokes.map(joke =>
          joke.id === action.payload.id
            ? { ...joke, ...action.payload.joke }
            : joke
        )
      };
    case 'DELETE_JOKE':
      return {
        ...state,
        jokes: state.jokes.filter(joke => joke.id !== action.payload)
      };
    case 'SET_RECORDING':
      return { ...state, isRecording: action.payload };
    case 'SET_RECORDING_STATE':
      return { ...state, recordingState: action.payload };
    case 'LOAD_JOKES':
      return { ...state, jokes: action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load user and jokes from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('gotjokes_user');
    const savedJokes = localStorage.getItem('gotjokes_jokes');

    if (savedUser) {
      dispatch({ type: 'SET_USER', payload: JSON.parse(savedUser) });
    }

    if (savedJokes) {
      dispatch({ type: 'LOAD_JOKES', payload: JSON.parse(savedJokes) });
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (state.user) {
      localStorage.setItem('gotjokes_user', JSON.stringify(state.user));
    }
    if (state.jokes.length > 0) {
      localStorage.setItem('gotjokes_jokes', JSON.stringify(state.jokes));
    }
  }, [state.user, state.jokes]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// Export context separately to avoid fast refresh warnings
export { AppContext };

