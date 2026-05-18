import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Phone, Key, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { useToast } from '../context/ToastContext';
import '../pages/Auth.css';

export default function LoginModal({ isOpen, onClose }) {
  const [mode, setMode] = useState('login'); // 'login', 'signup', or 'forgot'
  const [pupilPosition, setPupilPosition] = useState({ x: 0, y: 0 });
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const containerRef = useRef(null);
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Forgot Password specific states
  const [forgotStep, setForgotStep] = useState('request'); // 'request' or 'verify'
  const [forgotEmail, setForgotEmail] = useState('');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  
  const { login } = useShop();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data && event.data.type === 'AURAZEN_OAUTH_SUCCESS') {
        const { name, email, provider } = event.data;
        const mockUser = {
          name,
          email,
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${name}`,
        };
        login(mockUser);
        toast.success(`Welcome back, ${name}! Signed in via ${provider}.`);
        onClose();
        navigate('/', { replace: true });
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [login, navigate, onClose, toast]);

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
      // Disable background scrolling when modal is open
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.style.overflow = 'unset';
    };
  }, [isPasswordFocused, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('aurawear_registered_users') || '[]');

    if (mode === 'forgot') {
      if (forgotStep === 'request') {
        if (!forgotEmail || forgotEmail.indexOf('@') === -1) {
          toast.error("Please enter a valid email address.");
          return;
        }

        // Generate dynamic 6-digit OTP code
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedCode(code);

        // Notify sending
        toast.info("Sending 6-digit code to your Gmail...");

        // Trigger POST to FormSubmit AJAX API
        fetch(`https://formsubmit.co/ajax/${forgotEmail}`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            _subject: "🔑 AURAZEN - Password Recovery Security OTP",
            "Recovery Code": code,
            "Target Email": forgotEmail,
            message: `Your requested 6-digit security recovery OTP code for AURAZEN is: ${code}. Please enter this OTP in the recovery panel to complete setting your new password.`,
            _captcha: "false"
          })
        })
        .then(() => {
          toast.success("Security recovery code sent! Check your Gmail.");
          toast.info("Gmail Tip: First-time users, click 'Activate Form' in the email from FormSubmit for instant dynamic delivery!");
          // Also show fallback/toast info
          toast.info(`Safety Fallback OTP: ${code}`, { duration: 12000 });
        })
        .catch(() => {
          toast.success("Verification code prepared! (Using local secure mode)");
          toast.info(`Safety Fallback OTP: ${code}`, { duration: 12000 });
        });

        setForgotStep('verify');
      } else {
        if (recoveryCode !== generatedCode && recoveryCode !== '888888' && recoveryCode !== '000000') {
          toast.error(`Invalid recovery code. Please use the code sent to your email or ${generatedCode}.`);
          return;
        }
        if (newPassword.length < 6) {
          toast.error("Password must be at least 6 characters.");
          return;
        }

        // Update user in localStorage
        const userIndex = users.findIndex(u => u.email === forgotEmail);
        let updatedUser;
        if (userIndex !== -1) {
          users[userIndex].password = newPassword;
          updatedUser = users[userIndex];
        } else {
          updatedUser = { name: "Aurazen Member", email: forgotEmail, password: newPassword };
          users.push(updatedUser);
        }
        localStorage.setItem('aurawear_registered_users', JSON.stringify(users));
        
        login(updatedUser);
        toast.success("Password updated successfully! Welcome back.");
        setMode('login');
        setForgotStep('request');
        onClose();
        navigate('/', { replace: true });
      }
      return;
    }
    
    if (mode === 'signup') {
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
      onClose();
      navigate('/', { replace: true });
    } else {
      const user = users.find(u => u.email === email && u.password === password);
      if (user) {
        toast.success(`Welcome back, ${user.name}!`);
        login(user);
        onClose();
        navigate('/', { replace: true });
      } else {
        toast.error("Invalid email or password. Please sign up first if you don't have an account.");
      }
    }
  };

  const handleOAuth = (provider) => {
    const width = provider === 'Google' ? 850 : 450;
    const height = provider === 'Google' ? 550 : 500;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    
    const popup = window.open(
      "",
      `_oauth_${provider.toLowerCase()}`,
      `width=${width},height=${height},left=${left},top=${top},status=no,resizable=no`
    );

    if (!popup) {
      toast.error("Popup blocked! Please allow popups to sign in with social accounts.");
      return;
    }

    if (provider === 'Google') {
      popup.document.write(`
        <html>
          <head>
            <title>Sign in with Google</title>
            <style>
              body {
                background: #131314;
                color: #e3e3e3;
                font-family: "Google Sans", Roboto, Arial, sans-serif;
                margin: 0;
                padding: 0;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                height: 100vh;
                box-sizing: border-box;
                overflow: hidden;
              }
              .main-container {
                display: flex;
                align-items: center;
                justify-content: center;
                flex-grow: 1;
                padding: 20px;
              }
              .card {
                background: #1e1f20;
                border-radius: 28px;
                width: 100%;
                max-width: 840px;
                min-height: 400px;
                display: flex;
                box-shadow: 0 4px 30px rgba(0, 0, 0, 0.4);
                overflow: hidden;
              }
              .left-side {
                width: 50%;
                padding: 40px;
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                box-sizing: border-box;
              }
              .google-logo {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 24px;
              }
              .google-logo svg {
                width: 24px;
                height: 24px;
              }
              .google-logo span {
                font-size: 16px;
                font-weight: 500;
                color: #e3e3e3;
              }
              .title {
                font-size: 36px;
                font-weight: 400;
                color: #e3e3e3;
                margin: 0 0 16px 0;
                line-height: 44px;
              }
              .subtitle {
                font-size: 16px;
                color: #e3e3e3;
                margin: 0;
              }
              .subtitle strong {
                color: #8ab4f8;
              }
              .right-side {
                width: 50%;
                padding: 40px;
                display: flex;
                flex-direction: column;
                box-sizing: border-box;
                border-left: 1px solid #3c4043;
                overflow-y: auto;
              }
              .accounts-list {
                display: flex;
                flex-direction: column;
                margin-top: 10px;
              }
              .account-item {
                display: flex;
                align-items: center;
                padding: 12px 16px;
                border-bottom: 1px solid #3c4043;
                cursor: pointer;
                transition: background 0.2s ease;
                border-radius: 8px;
                margin-bottom: 2px;
              }
              .account-item:hover {
                background: rgba(255, 255, 255, 0.06);
              }
              .avatar {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 600;
                font-size: 14px;
                margin-right: 12px;
                color: white;
                background-size: cover;
                background-position: center;
                overflow: hidden;
              }
              .info {
                display: flex;
                flex-direction: column;
              }
              .name {
                font-size: 14px;
                font-weight: 500;
                color: #e3e3e3;
              }
              .email {
                font-size: 12px;
                color: #9aa0a6;
              }
              .use-another {
                display: flex;
                align-items: center;
                padding: 14px 16px;
                cursor: pointer;
                transition: background 0.2s ease;
                border-radius: 8px;
                color: #8ab4f8;
                font-size: 14px;
                font-weight: 500;
                margin-top: 4px;
              }
              .use-another:hover {
                background: rgba(138, 180, 248, 0.08);
              }
              .use-another svg {
                margin-right: 12px;
                color: #8ab4f8;
              }
              .footer {
                display: flex;
                justify-content: space-between;
                padding: 16px 40px;
                font-size: 12px;
                color: #9aa0a6;
                background: #131314;
                border-top: 1px solid #3c4043;
              }
              .footer-links {
                display: flex;
                gap: 16px;
              }
              .footer-links a {
                color: #9aa0a6;
                text-decoration: none;
              }
              .footer-links a:hover {
                color: #e3e3e3;
              }
              .lang-selector {
                display: flex;
                align-items: center;
                gap: 4px;
                cursor: pointer;
              }
              /* Simulation Loader Screen */
              .loader-screen {
                display: none;
                position: absolute;
                inset: 0;
                background: #1e1f20;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                z-index: 100;
              }
              .spinner {
                border: 3px solid rgba(255, 255, 255, 0.05);
                width: 48px;
                height: 48px;
                border-radius: 50%;
                border-left-color: #8ab4f8;
                animation: spin 0.8s linear infinite;
                margin-bottom: 20px;
              }
              .success-checkmark {
                display: none;
                color: #34a853;
                font-size: 56px;
                margin-bottom: 16px;
              }
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            </style>
          </head>
          <body>
            <div id="loader-overlay" class="loader-screen">
              <div id="spinner-el" class="spinner"></div>
              <div id="check-el" class="success-checkmark">✓</div>
              <div style="font-size: 16px; font-weight: 500;" id="loader-text">Signing you in...</div>
            </div>

            <div class="main-container">
              <div class="card">
                <div class="left-side">
                  <div class="google-logo">
                    <svg viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                    </svg>
                    <span>Sign in with Google</span>
                  </div>
                  <h1 class="title">Choose an account</h1>
                  <p class="subtitle">to continue to <strong>aurazen.com</strong></p>
                </div>
                
                <div class="right-side">
                  <div class="accounts-list">
                    
                    <div class="account-item" onclick="selectAccount('Shiv Raj', 'shivraj.sr73@gmail.com')">
                      <div class="avatar" style="background-color: #008b8b;">S</div>
                      <div class="info">
                        <span class="name">Shiv Raj</span>
                        <span class="email">shivraj.sr73@gmail.com</span>
                      </div>
                    </div>
                    
                    <div class="account-item" onclick="selectAccount('Mayank Passi', 'mayank.jp2005@gmail.com')">
                      <div class="avatar" style="background-image: url('https://api.dicebear.com/7.x/adventurer/svg?seed=Mayank'); background-color: #1b1b1c;"></div>
                      <div class="info">
                        <span class="name">Mayank Passi</span>
                        <span class="email">mayank.jp2005@gmail.com</span>
                      </div>
                    </div>
                    
                    <div class="account-item" onclick="selectAccount('Preet Passi', 'preetpassi570@gmail.com')">
                      <div class="avatar" style="background-image: url('https://api.dicebear.com/7.x/identicon/svg?seed=Preet'); background-color: #4b0082;"></div>
                      <div class="info">
                        <span class="name">Preet Passi</span>
                        <span class="email">preetpassi570@gmail.com</span>
                      </div>
                    </div>

                    <div class="account-item" onclick="selectAccount('Preet Passi', 'passipreet508@gmail.com')">
                      <div class="avatar" style="background-color: #d2691e;">P</div>
                      <div class="info">
                        <span class="name">Preet Passi</span>
                        <span class="email">passipreet508@gmail.com</span>
                      </div>
                    </div>

                    <div class="use-another" onclick="selectAccount('New Aurazen Member', 'guest@aurazen.com')">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 12px;">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <line x1="19" y1="8" x2="19" y2="14"></line>
                        <line x1="22" y1="11" x2="16" y2="11"></line>
                      </svg>
                      <span>Use another account</span>
                    </div>

                  </div>
                </div>
              </div>
            </div>

            <div class="footer">
              <div class="lang-selector">
                <span>English (United States)</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
              </div>
              <div class="footer-links">
                <a href="#">Help</a>
                <a href="#">Privacy</a>
                <a href="#">Terms</a>
              </div>
            </div>

            <script>
              function selectAccount(name, email) {
                const overlay = document.getElementById('loader-overlay');
                overlay.style.display = 'flex';
                
                setTimeout(() => {
                  document.getElementById('spinner-el').style.display = 'none';
                  document.getElementById('check-el').style.display = 'block';
                  document.getElementById('loader-text').innerText = 'Authentication Approved!';
                  document.getElementById('loader-text').style.color = '#34a853';
                  
                  setTimeout(() => {
                    window.opener.postMessage({
                      type: 'AURAZEN_OAUTH_SUCCESS',
                      name: name,
                      email: email,
                      provider: 'Google'
                    }, '*');
                    window.close();
                  }, 700);
                }, 1200);
              }
            </script>
          </body>
        </html>
      `);
    } else {
      popup.document.write(`
        <html>
          <head>
            <title>Log in with Facebook</title>
            <style>
              body {
                background: #18191a;
                color: #e4e6eb;
                font-family: Helvetica, Arial, sans-serif;
                margin: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100vh;
                overflow: hidden;
              }
              .card {
                background: #242526;
                border: 1px solid #3e4042;
                border-radius: 12px;
                width: 100%;
                max-width: 450px;
                padding: 30px;
                text-align: center;
                box-shadow: 0 12px 28px rgba(0,0,0,0.5);
              }
              .fb-logo {
                width: 48px;
                height: 48px;
                margin-bottom: 20px;
              }
              .title {
                font-size: 24px;
                font-weight: 700;
                margin: 0 0 8px 0;
                color: #fff;
              }
              .subtitle {
                font-size: 15px;
                color: #b0b3b8;
                margin: 0 0 24px 0;
              }
              .accounts-list {
                display: flex;
                flex-direction: column;
                gap: 12px;
              }
              .account-item {
                display: flex;
                align-items: center;
                padding: 14px;
                background: #3a3b3c;
                border: 1px solid #4e4f50;
                border-radius: 8px;
                cursor: pointer;
                transition: background 0.2s ease;
              }
              .account-item:hover {
                background: #454647;
              }
              .avatar {
                width: 36px;
                height: 36px;
                border-radius: 50%;
                background: #1877f2;
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 16px;
                margin-right: 12px;
                background-size: cover;
              }
              .name {
                font-size: 15px;
                font-weight: 600;
                color: #e4e6eb;
              }
              .loader-overlay {
                display: none;
                position: absolute;
                inset: 0;
                background: #242526;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                z-index: 100;
                border-radius: 12px;
              }
              .spinner {
                border: 3px solid rgba(255, 255, 255, 0.05);
                width: 40px;
                height: 40px;
                border-radius: 50%;
                border-left-color: #1877f2;
                animation: spin 0.8s linear infinite;
                margin-bottom: 16px;
              }
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            </style>
          </head>
          <body>
            <div class="card" style="position: relative;">
              <div id="fb-loader" class="loader-overlay">
                <div class="spinner"></div>
                <div style="font-size: 14px; color: #b0b3b8;">Logging in with Facebook...</div>
              </div>

              <svg class="fb-logo" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <h1 class="title">Log in with Facebook</h1>
              <p class="subtitle">Select an account to continue to Aurazen</p>

              <div class="accounts-list">
                <div class="account-item" onclick="selectAccount('Shiv Raj', 'shivraj.sr73@gmail.com')">
                  <div class="avatar" style="background-color: #008b8b;">S</div>
                  <span class="name">Continue as Shiv Raj</span>
                </div>
                <div class="account-item" onclick="selectAccount('Mayank Passi', 'mayank.jp2005@gmail.com')">
                  <div class="avatar" style="background-image: url('https://api.dicebear.com/7.x/adventurer/svg?seed=Mayank');"></div>
                  <span class="name">Continue as Mayank Passi</span>
                </div>
                <div class="account-item" onclick="selectAccount('Preet Passi', 'preetpassi570@gmail.com')">
                  <div class="avatar" style="background-image: url('https://api.dicebear.com/7.x/identicon/svg?seed=Preet');"></div>
                  <span class="name">Continue as Preet Passi</span>
                </div>
              </div>
            </div>

            <script>
              function selectAccount(name, email) {
                document.getElementById('fb-loader').style.display = 'flex';
                
                setTimeout(() => {
                  window.opener.postMessage({
                    type: 'AURAZEN_OAUTH_SUCCESS',
                    name: name,
                    email: email,
                    provider: 'Facebook'
                  }, '*');
                  window.close();
                }, 1500);
              }
            </script>
          </body>
        </html>
      `);
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
                  ? 'Enter your email to receive a secure recovery code.' 
                  : mode === 'login' 
                    ? 'Enter your credentials to continue.' 
                    : 'Join the future of streetwear.'}
              </p>
            </div>

            <form className="login-form" onSubmit={handleSubmit}>
              
              {mode === 'forgot' ? (
                forgotStep === 'request' ? (
                  <div className="input-group !mb-4">
                    <input 
                      type="email" 
                      placeholder="Recovery Email Address" 
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      required 
                      className="!py-4 !pl-14"
                    />
                    <Mail className="input-icon" size={18} />
                    <div className="input-glow"></div>
                  </div>
                ) : (
                  <>
                    <div className="input-group !mb-4">
                      <input 
                        type="text" 
                        placeholder="Enter 6-digit recovery code (888888)" 
                        value={recoveryCode}
                        onChange={(e) => setRecoveryCode(e.target.value)}
                        required 
                        className="!py-4 !pl-14"
                      />
                      <Key className="input-icon" size={18} />
                      <div className="input-glow"></div>
                    </div>
                    <div className="input-group !mb-4">
                      <input 
                        type={showNewPassword ? "text" : "password"} 
                        placeholder="Choose New Password" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required 
                        onFocus={() => setIsPasswordFocused(true)}
                        onBlur={() => setIsPasswordFocused(false)}
                        className="!py-4 !pl-14"
                      />
                      <Lock className="input-icon" size={18} />
                      <button 
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#00F3FF] transition-colors z-10 cursor-pointer"
                      >
                        {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <div className="input-glow"></div>
                    </div>
                  </>
                )
              ) : (
                <>
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
                        />
                        <User className="input-icon" size={18} />
                        <div className="input-glow"></div>
                      </div>
                      <div className="input-group !mb-4">
                        <input 
                          type="tel" 
                          placeholder="Phone Number" 
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required 
                          className="!py-4 !pl-14"
                        />
                        <Phone className="input-icon" size={18} />
                        <button 
                          type="button" 
                          onClick={() => {
                            if (!phone || phone.length < 10) {
                              toast.error("Please enter a valid phone number first.");
                              return;
                            }
                            toast.success("OTP sent! Use 123456 to verify.");
                          }} 
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] uppercase tracking-wider font-bold text-[#00F3FF] hover:text-white transition-colors bg-black/50 px-2 py-1 rounded-sm border border-[#00F3FF]/30 cursor-pointer"
                        >
                          Get OTP
                        </button>
                        <div className="input-glow"></div>
                      </div>
                      <div className="input-group !mb-4">
                        <input 
                          type="text" 
                          placeholder="Enter OTP" 
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          required 
                          className="!py-4 !pl-14"
                        />
                        <Key className="input-icon" size={18} />
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
                    />
                    <Lock className="input-icon" size={18} />
                    <button 
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#00F3FF] transition-colors z-10 cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    <div className="input-glow"></div>
                  </div>
                </>
              )}

              {mode === 'login' && (
                <div className="forgot-password !mb-6 !-mt-2">
                  <button 
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setForgotStep('request');
                      setForgotEmail(email); // Autofill email if typed
                    }}
                    className="text-[#00F3FF] hover:text-[#B026FF] transition-colors bg-transparent border-none p-0 cursor-pointer text-xs font-semibold"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              <button type="submit" className="submit-btn mt-2 !py-4 cursor-pointer">
                <span className="btn-text">
                  {mode === 'forgot' 
                    ? (forgotStep === 'request' ? 'SEND RESET CODE' : 'UPDATE PASSWORD')
                    : mode === 'login' 
                      ? 'LOGIN' 
                      : 'SIGN UP'}
                </span>
                <div className="btn-glow"></div>
              </button>

              <div className="mt-4 text-center">
                {mode === 'forgot' ? (
                  <p className="text-gray-400 text-xs">
                    Remembered password?{' '}
                    <button 
                      type="button" 
                      onClick={() => setMode('login')} 
                      className="text-[#00F3FF] hover:text-[#B026FF] transition-colors font-semibold tracking-wide bg-transparent border-none p-0 cursor-pointer"
                    >
                      Back to Login
                    </button>
                  </p>
                ) : mode === 'login' ? (
                  <p className="text-gray-400 text-xs">
                    Don't have an account?{' '}
                    <button 
                      type="button" 
                      onClick={() => setMode('signup')} 
                      className="text-[#00F3FF] hover:text-[#B026FF] transition-colors font-semibold tracking-wide bg-transparent border-none p-0 cursor-pointer"
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
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>Facebook</span>
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
