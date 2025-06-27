import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import { useApp } from './hooks/useApp';
import WelcomePage from './pages/WelcomePage';
import AvatarPage from './pages/AvatarPage';
import RecordPage from './pages/RecordPage';
import ProfilePage from './pages/ProfilePage';

function AppRoutes() {
  const { state } = useApp();
  
  return (
    <Routes>
      <Route path="/" element={state.user ? <ProfilePage /> : <WelcomePage />} />
      <Route path="/avatar" element={<AvatarPage />} />
      <Route path="/record" element={state.user ? <RecordPage /> : <Navigate to="/" />} />
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