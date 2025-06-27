import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import buttonSvg from "../assets/button.svg";

export default function WelcomePage() {
  const navigate = useNavigate();

  const handleEnter = () => {
    navigate("/avatar");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      {/* Logo at top center */}
      <div className="mb-8">
        <img 
          src={logo} 
          alt="Got Jokes?" 
          className="h-24 md:h-32 object-contain"
        />
      </div>
      
      {/* Tagline text */}
      <h1 
        className="text-2xl md:text-3xl text-center mb-12 max-w-lg"
        style={{ 
          fontFamily: 'Poppins, sans-serif',
          fontWeight: 600,
          color: '#D6D7FF'
        }}
      >
        Tell a joke, get feedback, and see how the crowd reacts!
      </h1>
      
      {/* Enter button */}
      <button
        onClick={handleEnter}
        className="transition-transform hover:scale-105 active:scale-95"
      >
        <img 
          src={buttonSvg} 
          alt="Enter" 
          className="w-48 md:w-64 h-auto"
        />
      </button>
    </div>
  );
}