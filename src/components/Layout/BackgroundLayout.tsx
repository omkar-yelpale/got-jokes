import { useLocation } from 'react-router-dom';
import homeBackground from '../../assets/home_bg.svg';

interface BackgroundLayoutProps {
  children: React.ReactNode;
}

export default function BackgroundLayout({ children }: BackgroundLayoutProps) {
  const location = useLocation();
  const isRecordPage = location.pathname === '/record';

  // Don't apply background on record page
  if (isRecordPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen relative">
      {/* Background SVG */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${homeBackground})` }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}