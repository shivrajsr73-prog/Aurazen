import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Phone, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { useToast } from '../context/ToastContext';
import { supabase } from '../supabase';
import '../pages/Auth.css';

export default function LoginModal({ isOpen, onClose }) {
  const [mode, setMode] = useState('login'); // 'login', 'signup', or 'forgot'
  const [pupilPosition, setPupilPosition] = useState({ x: 0, y: 0 });
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const containerRef = useRef(null);
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Forgot Password specific states
  const [forgotStep, setForgotStep] = useState('request'); // 'request', 'sent', or 'new-password'
  const [forgotEmail, setForgotEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Timer for Resend Recovery Link
  const [resendCooldown, setResendCooldown] = useState(0);

  const [loading, setLoading] = useState(false);
  
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

    if (isOpen) {
      window.addEventListener('mousemove', handleMouseMove);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.style.overflow = 'unset';
    };
  }, [isPasswordFocused, isOpen]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => {
      setResendCooldown(prev => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleSendResetEmail = async (e) => {
    if (e) e.preventDefault();
    if (!forgotEmail || forgotEmail.indexOf('@') === -1) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
      redirectTo: `${window.location.origin}/login`
    });
    setLoading(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password reset email sent! Check your inbox.");
      setForgotStep('sent');
      setResendCooldown(60); // 60 seconds cooldown
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    
    if (error) {
      setLoading(false);
      toast.error(error.message);
    } else {
      await supabase.auth.signOut();
      setLoading(false);
      toast.success("Password updated successfully! Please log in.");
      setMode('login');
      setForgotStep('request');
      setForgotEmail('');
      setNewPassword('');
      setConfirmPassword('');
      onClose();
      navigate('/login');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (mode === 'signup') {
      if (password.length < 6) {
        toast.error("Password must be at least 6 characters.");
        return;
      }

      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            phone
          }
        }
      });
      setLoading(false);

      if (error) {
        toast.error(error.message);
      } else {
        if (data.session) {
          toast.success("Account created successfully! Welcome back.");
          onClose();
          navigate('/', { replace: true });
        } else {
          toast.success("Signup successful! Please check your email for verification.");
          setMode('login');
        }
      }
    } else {
      // Login
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      setLoading(false);

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Welcome back!");
        onClose();
        navigate('/', { replace: true });
      }
    }
  };

  const handleOAuth = async (provider) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider.toLowerCase(),
        options: {
          redirectTo: `${window.location.origin}/login`
        }
      });
      if (error) throw error;
    } catch (err) {
      toast.error(err.message || `Failed to sign in with ${provider}`);
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="login-modal-backdrop" onClick={onClose} ref={containerRef}>
        <motion.div 
          className="login-wrapper relative !mt-12"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Close button in top-right */}
          <button 
            type="button" 
            onClick={onClose} 
            className="absolute right-6 top-6 z-50 text-zinc-500 hover:text-white p-2 rounded-full bg-black/40 hover:bg-black/80 hover:scale-110 transition-all border border-white/5 shadow-md flex items-center justify-center cursor-pointer"
            title="Skip / Close"
            disabled={loading}
          >
            <X size={18} />
          </button>
          
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

              {/* Head */}
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

              {/* Left Arm/Paw */}
              <g id="arm-left" className={`panda-svg-arm left ${isPasswordFocused ? 'active-shadow' : ''}`} filter={isPasswordFocused ? "url(#contact-shadow)" : "url(#drop-shadow)"}>
                <rect x="75" y="215" width="70" height="100" rx="35" fill="url(#fur-black)" />
              </g>

              {/* Right Arm/Paw */}
              <g id="arm-right" className={`panda-svg-arm right ${isPasswordFocused ? 'active-shadow' : ''}`} filter={isPasswordFocused ? "url(#contact-shadow)" : "url(#drop-shadow)"}>
                <rect x="255" y="215" width="70" height="100" rx="35" fill="url(#fur-black)" />
              </g>
            </svg>
          </div>

          {/* The Glassmorphism Login Card */}
          <div className="login-card !py-10 !px-8">
            <div className="card-top-border-highlight"></div>
            
            <div className="login-header !mb-6">
              <h1 className="!text-2xl">
                {mode === 'forgot' 
                  ? 'RESET PASSWORD' 
                  : mode === 'login' 
                    ? 'WELCOME BACK' 
                    : 'CREATE ACCOUNT'}
              </h1>
              <p className="!text-xs !mt-2">
                {mode === 'forgot' 
                  ? (forgotStep === 'request' 
                      ? 'Enter your email to receive a password recovery link.' 
                      : forgotStep === 'sent' 
                        ? `We've sent a secure recovery link to ${forgotEmail}.` 
                        : 'Create a secure new password for your account.')
                  : mode === 'login' 
                    ? 'Enter your credentials to continue.' 
                    : 'Join the future of streetwear.'}
              </p>
            </div>

            {mode === 'forgot' ? (
              forgotStep === 'request' ? (
                <form className="login-form" onSubmit={handleSendResetEmail}>
                  <div className="input-group !mb-4">
                    <input 
                      type="email" 
                      placeholder="Recovery Email Address" 
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      required 
                      className="!py-4 !pl-14"
                      disabled={loading}
                    />
                    <Mail className="input-icon" size={18} />
                    <div className="input-glow"></div>
                  </div>

                  <button type="submit" className="submit-btn mt-2 !py-4 cursor-pointer" disabled={loading}>
                    <span className="btn-text">
                      {loading ? (
                        <span className="inline-block animate-spin rounded-full h-3 w-3 border-2 border-current border-t-transparent mr-2" />
                      ) : null}
                      SEND RECOVERY LINK
                    </span>
                    <div className="btn-glow"></div>
                  </button>

                  <div className="mt-4 text-center">
                    <button 
                      type="button" 
                      onClick={() => setMode('login')} 
                      className="text-[#00F3FF] hover:text-[#B026FF] transition-colors font-semibold tracking-wide bg-transparent border-none p-0 cursor-pointer text-xs"
                      disabled={loading}
                    >
                      Back to Login
                    </button>
                  </div>
                </form>
              ) : forgotStep === 'sent' ? (
                <div className="login-form text-center">
                  <div className="text-gray-400 text-xs mb-4 leading-relaxed">
                    Please click the secure recovery link in the email to set your new password. You can close this tab or return to login below.
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSendResetEmail()}
                    className="submit-btn cursor-pointer mb-3"
                    disabled={loading || resendCooldown > 0}
                  >
                    <span className="btn-text">
                      {resendCooldown > 0 ? `RESEND LINK IN ${resendCooldown}S` : 'RESEND RECOVERY LINK'}
                    </span>
                    <div className="btn-glow"></div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setForgotStep('request');
                    }}
                    className="text-[#00F3FF] hover:text-[#B026FF] transition-colors font-semibold tracking-wide bg-transparent border-none p-0 cursor-pointer text-xs"
                    disabled={loading}
                  >
                    Back to Login
                  </button>
                </div>
              ) : (
                <form className="login-form" onSubmit={handleUpdatePassword}>
                  <div className="input-group !mb-4">
                    <input 
                      type={showNewPassword ? "text" : "password"} 
                      placeholder="Choose New Password (min 6 chars)" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required 
                      onFocus={() => setIsPasswordFocused(true)}
                      onBlur={() => setIsPasswordFocused(false)}
                      className="!py-4 !pl-14"
                      disabled={loading}
                    />
                    <Lock className="input-icon" size={18} />
                    <button 
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#00F3FF] transition-colors z-10 cursor-pointer"
                      disabled={loading}
                    >
                      {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    <div className="input-glow"></div>
                  </div>

                  <div className="input-group !mb-4">
                    <input 
                      type={showConfirmPassword ? "text" : "password"} 
                      placeholder="Confirm New Password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required 
                      onFocus={() => setIsPasswordFocused(true)}
                      onBlur={() => setIsPasswordFocused(false)}
                      className="!py-4 !pl-14"
                      disabled={loading}
                    />
                    <Lock className="input-icon" size={18} />
                    <button 
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#00F3FF] transition-colors z-10 cursor-pointer"
                      disabled={loading}
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    <div className="input-glow"></div>
                  </div>

                  <button type="submit" className="submit-btn mt-2 !py-4 cursor-pointer" disabled={loading}>
                    <span className="btn-text">
                      {loading ? (
                        <span className="inline-block animate-spin rounded-full h-3 w-3 border-2 border-current border-t-transparent mr-2" />
                      ) : null}
                      UPDATE PASSWORD
                    </span>
                    <div className="btn-glow"></div>
                  </button>
                </form>
              )
            ) : (
              // Login & Signup Forms
              <form className="login-form" onSubmit={handleSubmit}>
                {mode === 'signup' && (
                  <>
                    <div className="input-group !mb-4">
                      <input 
                        type="text" 
                        placeholder="Full Name" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required 
                        className="!py-4 !pl-14"
                        disabled={loading}
                      />
                      <User className="input-icon" size={18} />
                      <div className="input-glow"></div>
                    </div>
                    <div className="input-group !mb-4">
                      <input 
                        type="tel" 
                        placeholder="Phone Number (Optional)" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="!py-4 !pl-14"
                        disabled={loading}
                      />
                      <Phone className="input-icon" size={18} />
                      <div className="input-glow"></div>
                    </div>
                  </>
                )}

                <div className="input-group !mb-4">
                  <input 
                    type="email" 
                    placeholder="Email Address" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                    className="!py-4 !pl-14"
                    disabled={loading}
                  />
                  <Mail className="input-icon" size={18} />
                  <div className="input-glow"></div>
                </div>

                <div className="input-group !mb-4">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                    className="!py-4 !pl-14"
                    disabled={loading}
                  />
                  <Lock className="input-icon" size={18} />
                  <button 
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#00F3FF] transition-colors z-10 cursor-pointer"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <div className="input-glow"></div>
                </div>

                {mode === 'login' && (
                  <div className="forgot-password !mb-6 !-mt-2">
                    <button 
                      type="button"
                      onClick={() => {
                        setMode('forgot');
                        setForgotStep('request');
                        setForgotEmail(email);
                      }}
                      className="text-[#00F3FF] hover:text-[#B026FF] transition-colors bg-transparent border-none p-0 cursor-pointer text-xs font-semibold"
                      disabled={loading}
                    >
                      Forgot Password?
                    </button>
                  </div>
                )}

                <button type="submit" className="submit-btn mt-2 !py-4 cursor-pointer" disabled={loading}>
                  <span className="btn-text">
                    {loading ? (
                      <span className="inline-block animate-spin rounded-full h-3 w-3 border-2 border-current border-t-transparent mr-2" />
                    ) : null}
                    {mode === 'login' ? 'LOGIN' : 'SIGN UP'}
                  </span>
                  <div className="btn-glow"></div>
                </button>

                <div className="mt-4 text-center">
                  {mode === 'login' ? (
                    <p className="text-gray-400 text-xs">
                      Don't have an account?{' '}
                      <button 
                        type="button" 
                        onClick={() => setMode('signup')} 
                        className="text-[#00F3FF] hover:text-[#B026FF] transition-colors font-semibold tracking-wide bg-transparent border-none p-0 cursor-pointer"
                        disabled={loading}
                      >
                        Sign Up
                      </button>
                    </p>
                  ) : (
                    <p className="text-gray-400 text-xs">
                      Already have an account?{' '}
                      <button 
                        type="button" 
                        onClick={() => setMode('login')} 
                        className="text-[#00F3FF] hover:text-[#B026FF] transition-colors font-semibold tracking-wide bg-transparent border-none p-0 cursor-pointer"
                        disabled={loading}
                      >
                        Login
                      </button>
                    </p>
                  )}
                </div>

                {/* OAuth Separator & Social Buttons */}
                <div className="oauth-divider">OR</div>
                <div className="oauth-buttons">
                  <button
                    type="button"
                    onClick={() => handleOAuth('Google')}
                    className="oauth-btn cursor-pointer"
                    disabled={loading}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                    </svg>
                    <span>Google</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOAuth('Facebook')}
                    className="oauth-btn cursor-pointer"
                    disabled={loading}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2" xmlns="http://www.w3.org/2000/svg">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <span>Facebook</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
