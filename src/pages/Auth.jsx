import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowLeft, User, Phone, Key, Eye, EyeOff } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useToast } from '../context/ToastContext';
import './Auth.css';

const Auth = ({ initialMode = 'login' }) => {
  const [pupilPosition, setPupilPosition] = useState({ x: 0, y: 0 });
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const containerRef = useRef(null);
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const { login } = useShop();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isPasswordFocused || !containerRef.current) return;
      
      const { innerWidth, innerHeight } = window;
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      
      const normalizedX = (mouseX - innerWidth / 2) / (innerWidth / 2);
      const normalizedY = (mouseY - innerHeight / 2) / (innerHeight / 2);
      
      const maxMoveX = 5;
      const maxMoveY = 5;
      
      setPupilPosition({ 
        x: normalizedX * maxMoveX, 
        y: normalizedY * maxMoveY 
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isPasswordFocused]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('aurawear_registered_users') || '[]');
    
    if (initialMode === 'signup') {
      if (users.find(u => u.email === email)) {
        toast.error("User already exists! Please login instead.");
        return;
      }
      
      if (otp !== '123456' && otp !== '000000' && otp.length < 4) {
        toast.error("Please enter a valid OTP (e.g., 123456).");
        return;
      }
      
      const newUser = { name, phone, email, password };
      users.push(newUser);
      localStorage.setItem('aurawear_registered_users', JSON.stringify(users));
      toast.success("Account created successfully!");
      login(newUser);
      navigate('/');
    } else {
      const user = users.find(u => u.email === email && u.password === password);
      if (user) {
        toast.success(`Welcome back, ${user.name}!`);
        login(user);
        navigate('/');
      } else {
        toast.error("Invalid email or password. Please sign up first if you don't have an account.");
      }
    }
  };

  return (
    <div className="auth-container" ref={containerRef}>
      <div className="ambient-glow"></div>
      <div className="ambient-glow secondary"></div>
      
      <div className="particles">
        {[...Array(25)].map((_, i) => (
          <div key={i} className="particle"></div>
        ))}
      </div>

      <Link to="/" className="back-button">
        <ArrowLeft size={18} />
        <span>BACK TO STORE</span>
      </Link>

      <div className="login-wrapper">
        
        {/* Pixar-style SVG Peeking Panda */}
        <div className={`panda-svg-container ${isPasswordFocused ? 'covering-eyes' : ''}`}>
          <svg viewBox="0 0 400 320" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="fur-white" cx="40%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="60%" stopColor="#e8eaee" />
                <stop offset="100%" stopColor="#bdc3cc" />
              </radialGradient>
              
              <radialGradient id="fur-black" cx="30%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#3d434d" />
                <stop offset="40%" stopColor="#22252a" />
                <stop offset="100%" stopColor="#0d0e12" />
              </radialGradient>

              <radialGradient id="eye-patch" cx="40%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#2a2e36" />
                <stop offset="80%" stopColor="#111317" />
                <stop offset="100%" stopColor="#050608" />
              </radialGradient>

              <radialGradient id="snout-gradient" cx="50%" cy="20%" r="60%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="70%" stopColor="#f0f2f5" />
                <stop offset="100%" stopColor="#d3d7df" />
              </radialGradient>

              <radialGradient id="eyeball" cx="40%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="80%" stopColor="#e4e8eb" />
                <stop offset="100%" stopColor="#b5bcc7" />
              </radialGradient>

              <filter id="drop-shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="10" stdDeviation="8" floodColor="#000000" floodOpacity="0.6" />
              </filter>
              
              <filter id="soft-shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#000000" floodOpacity="0.3" />
              </filter>

              {/* Specific tight shadow for the arms when covering the face */}
              <filter id="contact-shadow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="15" stdDeviation="12" floodColor="#000000" floodOpacity="0.8" />
                <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#000000" floodOpacity="0.5" />
              </filter>
            </defs>

            {/* Left Ear */}
            <g id="ear-left" filter="url(#soft-shadow)">
              <ellipse cx="110" cy="120" rx="38" ry="38" fill="url(#fur-black)" transform="rotate(-20 110 120)" />
              <ellipse cx="110" cy="120" rx="20" ry="20" fill="#111317" transform="rotate(-20 110 120)" />
            </g>

            {/* Right Ear */}
            <g id="ear-right" filter="url(#soft-shadow)">
              <ellipse cx="290" cy="120" rx="38" ry="38" fill="url(#fur-black)" transform="rotate(20 290 120)" />
              <ellipse cx="290" cy="120" rx="20" ry="20" fill="#111317" transform="rotate(20 290 120)" />
            </g>

            {/* Head (Slightly overlapping the border below it) */}
            <g id="head" filter="url(#drop-shadow)">
              <ellipse cx="200" cy="180" rx="105" ry="90" fill="url(#fur-white)" />
            </g>

            {/* Left Eye Patch */}
            <g id="eye-patch-left">
              <ellipse cx="150" cy="185" rx="30" ry="42" fill="url(#eye-patch)" transform="rotate(-25 150 185)" />
            </g>

            {/* Right Eye Patch */}
            <g id="eye-patch-right">
              <ellipse cx="250" cy="185" rx="30" ry="42" fill="url(#eye-patch)" transform="rotate(25 250 185)" />
            </g>

            {/* Left Eyeball & Pupil */}
            <g id="eye-left" className="blinking-eye">
              <ellipse cx="145" cy="175" rx="14" ry="16" fill="url(#eyeball)" />
              <g className="pupil-group" style={{ transform: `translate(${pupilPosition.x}px, ${pupilPosition.y}px)` }}>
                <circle cx="145" cy="175" r="7.5" fill="#0b0d10" />
                <circle cx="141" cy="171" r="3" fill="#ffffff" opacity="0.9" />
                <circle cx="148" cy="178" r="1.5" fill="#ffffff" opacity="0.6" />
              </g>
            </g>

            {/* Right Eyeball & Pupil */}
            <g id="eye-right" className="blinking-eye">
              <ellipse cx="255" cy="175" rx="14" ry="16" fill="url(#eyeball)" />
              <g className="pupil-group" style={{ transform: `translate(${pupilPosition.x}px, ${pupilPosition.y}px)` }}>
                <circle cx="255" cy="175" r="7.5" fill="#0b0d10" />
                <circle cx="251" cy="171" r="3" fill="#ffffff" opacity="0.9" />
                <circle cx="258" cy="178" r="1.5" fill="#ffffff" opacity="0.6" />
              </g>
            </g>

            {/* Snout & Nose */}
            <g id="snout">
              <ellipse cx="200" cy="225" rx="40" ry="26" fill="url(#snout-gradient)" filter="url(#soft-shadow)" />
              <ellipse cx="200" cy="215" rx="13" ry="8" fill="#111" />
              <ellipse cx="200" cy="212" rx="6" ry="2.5" fill="#fff" opacity="0.3" />
              <path d="M 190 228 Q 200 238 210 228" stroke="#111" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </g>

            {/* EXTRA THICK, Softer Paws resting on the card edge */}
            {/* Left Arm/Paw */}
            <g id="arm-left" className={`panda-svg-arm left ${isPasswordFocused ? 'active-shadow' : ''}`} filter={isPasswordFocused ? "url(#contact-shadow)" : "url(#drop-shadow)"}>
              {/* Massive width to guarantee total eye eclipse */}
              <rect x="75" y="215" width="70" height="100" rx="35" fill="url(#fur-black)" />
            </g>

            {/* Right Arm/Paw */}
            <g id="arm-right" className={`panda-svg-arm right ${isPasswordFocused ? 'active-shadow' : ''}`} filter={isPasswordFocused ? "url(#contact-shadow)" : "url(#drop-shadow)"}>
              <rect x="255" y="215" width="70" height="100" rx="35" fill="url(#fur-black)" />
            </g>
            
          </svg>
        </div>

        {/* The Glassmorphism Login Card */}
        <div className="login-card">
          <div className="card-top-border-highlight"></div>
          
          <div className="login-header">
            <h1>{initialMode === 'login' ? 'WELCOME BACK' : 'CREATE ACCOUNT'}</h1>
            <p>{initialMode === 'login' ? 'Enter your credentials to continue.' : 'Join the future of streetwear.'}</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            
            {initialMode === 'signup' && (
              <>
                <div className="input-group">
                  <input 
                    type="text" 
                    placeholder="Full Name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required 
                  />
                  <User className="input-icon" size={20} />
                  <div className="input-glow"></div>
                </div>
                <div className="input-group">
                  <input 
                    type="tel" 
                    placeholder="Phone Number" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required 
                  />
                  <Phone className="input-icon" size={20} />
                  <button 
                    type="button" 
                    onClick={() => {
                      if (!phone || phone.length < 10) {
                        toast.error("Please enter a valid phone number first.");
                        return;
                      }
                      toast.success("OTP sent! Use 123456 to verify.");
                    }} 
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] uppercase tracking-wider font-bold text-[#00F3FF] hover:text-white transition-colors bg-black/50 px-2 py-1 rounded-sm border border-[#00F3FF]/30"
                  >
                    Get OTP
                  </button>
                  <div className="input-glow"></div>
                </div>
                <div className="input-group">
                  <input 
                    type="text" 
                    placeholder="Enter OTP" 
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required 
                  />
                  <Key className="input-icon" size={20} />
                  <div className="input-glow"></div>
                </div>
              </>
            )}

            <div className="input-group">
              <input 
                type="email" 
                placeholder="Email Address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
              <Mail className="input-icon" size={20} />
              <div className="input-glow"></div>
            </div>

            <div className="input-group">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
              />
              <Lock className="input-icon" size={20} />
              <button 
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#00F3FF] transition-colors z-10"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              <div className="input-glow"></div>
            </div>

            {initialMode === 'login' && (
              <div className="forgot-password">
                <a href="#">Forgot Password?</a>
              </div>
            )}

            <button type="submit" className="submit-btn mt-4">
              <span className="btn-text">{initialMode === 'login' ? 'LOGIN' : 'SIGN UP'}</span>
              <div className="btn-glow"></div>
            </button>

            <div className="mt-6 text-center">
              {initialMode === 'login' ? (
                <p className="text-gray-400 text-sm">
                  Don't have an account? <Link to="/signup" className="text-[#00F3FF] hover:text-[#B026FF] transition-colors font-semibold tracking-wide">Sign Up</Link>
                </p>
              ) : (
                <p className="text-gray-400 text-sm">
                  Already have an account? <Link to="/login" className="text-[#00F3FF] hover:text-[#B026FF] transition-colors font-semibold tracking-wide">Login</Link>
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;
