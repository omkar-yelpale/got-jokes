import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import { useApp } from './hooks/useApp';
import AvatarPage from './pages/AvatarPage';
import FeedPage from './pages/FeedPage';
import RecordPage from './pages/RecordPage';
import ProfilePage from './pages/ProfilePage';

function AppRoutes() {
  const { state } = useApp();
  
  return (
    <Routes>
      <Route path="/" element={state.user ? <Navigate to="/feed" /> : <AvatarPage />} />
      <Route path="/feed" element={state.user ? <FeedPage /> : <Navigate to="/" />} />
      <Route path="/record" element={state.user ? <RecordPage /> : <Navigate to="/" />} />
      <Route path="/profile" element={state.user ? <ProfilePage /> : <Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;