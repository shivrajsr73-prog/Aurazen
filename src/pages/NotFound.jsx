import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Compass, Home, Cpu, Terminal, ShieldAlert, Radio } from 'lucide-react';

export default function NotFound() {
  const [time, setTime] = useState('');
  const [isHoveredBack, setIsHoveredBack] = useState(false);
  const [isHoveredExplore, setIsHoveredExplore] = useState(false);
  
  // Mouse coordinates for reactive cursor lighting and 3D parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Smooth spring physics for cursor follow
  const glowX = useSpring(mouseX, { stiffness: 80, damping: 20 });
  const glowY = useSpring(mouseY, { stiffness: 80, damping: 20 });
  
  // Parallax offsets for background elements
  const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 });
  
  // Refs for magnetic buttons
  const backBtnRef = useRef(null);
  const exploreBtnRef = useRef(null);
  const [backBtnPos, setBackBtnPos] = useState({ x: 0, y: 0 });
  const [exploreBtnPos, setExploreBtnPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Clock for telemetry
    const updateTime = () => {
      const now = new Date();
      setTime(now.toTimeString().split(' ')[0]);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);

    // Track mouse coordinates for viewport glow and parallax
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      mouseX.set(clientX - 125); // center of 250px radial light
      mouseY.set(clientY - 125);
      
      // Subtle parallax offset
      const px = (clientX - window.innerWidth / 2) * -0.03;
      const py = (clientY - window.innerHeight / 2) * -0.03;
      setParallaxOffset({ x: px, y: py });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      clearInterval(interval);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mouseX, mouseY]);

  // Magnetic button calculations
  const handleButtonMove = (e, ref, setPos) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    // Pull button 30% closer to the mouse within proximity
    const x = (clientX - centerX) * 0.35;
    const y = (clientY - centerY) * 0.35;
    setPos({ x, y });
  };

  const handleButtonLeave = (setPos) => {
    setPos({ x: 0, y: 0 });
  };

  // Generate slow drifting dust particles
  const particles = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    size: Math.random() * 3 + 1,
    left: Math.random() * 100,
    top: Math.random() * 100,
    duration: Math.random() * 12 + 12,
    delay: Math.random() * 4,
    drift: Math.random() * 50 - 25,
  }));

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-[#030303] text-white overflow-hidden font-sans select-none">
      
      {/* 1. Cinematic Background Noise overlay */}
      <div className="absolute inset-0 z-40 pointer-events-none opacity-[0.035] mix-blend-overlay">
        <svg className="w-full h-full">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>

      {/* 2. Cyberpunk Scanlines */}
      <div className="absolute inset-0 z-40 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%] opacity-20" />

      {/* 3. Deep Ambient Glow Blobs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Cyan blur light */}
        <motion.div 
          className="absolute w-[350px] h-[350px] md:w-[500px] md:h-[500px] rounded-full bg-accent-cyan/10 blur-[100px] md:blur-[130px] top-[10%] left-[5%]"
          animate={{
            x: [0, 40, -30, 0],
            y: [0, -50, 40, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        {/* Purple blur light */}
        <motion.div 
          className="absolute w-[350px] h-[350px] md:w-[500px] md:h-[500px] rounded-full bg-accent-purple/10 blur-[100px] md:blur-[130px] bottom-[10%] right-[5%]"
          animate={{
            x: [0, -40, 30, 0],
            y: [0, 50, -40, 0],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* 4. Interactive Mouse-Follow Glow Light */}
      <motion.div 
        className="absolute w-[250px] h-[250px] rounded-full bg-gradient-to-r from-accent-cyan/15 to-accent-purple/15 blur-[60px] pointer-events-none z-10 hidden md:block"
        style={{
          left: glowX,
          top: glowY,
        }}
      />

      {/* 5. Floating Particles */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-accent-cyan/40 shadow-[0_0_8px_#00F3FF]"
            style={{
              width: p.size,
              height: p.size,
              left: `${p.left}%`,
              top: `${p.top}%`,
            }}
            animate={{
              y: [0, -600],
              x: [0, p.drift],
              opacity: [0, 0.7, 0.7, 0],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* 6. Cyberpunk HUD Telemetry Overlay */}
      <div className="absolute inset-0 pointer-events-none z-30 p-6 flex flex-col justify-between font-mono text-[9px] md:text-[11px] text-zinc-500 tracking-wider">
        {/* Top HUD */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-cyan opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-cyan"></span>
            </span>
            <div className="leading-tight">
              <div>AURAZEN // VOID_ENGINE</div>
              <div className="text-zinc-600">SYSTEM: DEVIATED // LEVEL: 404</div>
            </div>
          </div>
          <div className="text-right leading-tight">
            <div>COORDINATES: [EXP_404_VOID]</div>
            <div className="text-zinc-600">UTC CLOCK: {time || '00:00:00'}</div>
          </div>
        </div>

        {/* Diagonal Tech Brackets in corners */}
        <div className="absolute top-[80px] left-[30px] border-t border-l border-zinc-800 w-8 h-8 opacity-45" />
        <div className="absolute top-[80px] right-[30px] border-t border-r border-zinc-800 w-8 h-8 opacity-45" />
        <div className="absolute bottom-[80px] left-[30px] border-b border-l border-zinc-800 w-8 h-8 opacity-45" />
        <div className="absolute bottom-[80px] right-[30px] border-b border-r border-zinc-800 w-8 h-8 opacity-45" />

        {/* Bottom HUD */}
        <div className="flex justify-between items-end mt-auto">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-zinc-600">
              <Cpu size={12} className="text-accent-purple animate-pulse" />
              <span>STREETWEAR_ENGINE_V4.0.4</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-zinc-600">
              <Terminal size={12} className="text-accent-cyan" />
              <span>MEM_LOAD: 98.7%</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-1.5 text-zinc-600">
              <Radio size={12} className="text-accent-purple animate-bounce" />
              <span>SECTOR: VOID_ZERO</span>
            </div>
            <div className="text-right">
              <span className="text-accent-cyan font-bold shadow-[0_0_8px_rgba(0,243,255,0.3)]">STATUS: DANGER_ZONE</span>
            </div>
          </div>
        </div>
      </div>

      {/* 7. Centered Holographic Rings & 404 Canvas */}
      <div className="relative z-20 flex flex-col items-center justify-center max-w-[90%] md:max-w-2xl text-center px-4">
        
        {/* 3D Holographic Concentric Rings */}
        <motion.div 
          className="absolute pointer-events-none opacity-40 md:opacity-50"
          style={{
            x: parallaxOffset.x,
            y: parallaxOffset.y,
          }}
        >
          {/* Inner ring */}
          <motion.div
            className="absolute rounded-full border border-dashed border-accent-cyan/35 w-[260px] h-[260px] md:w-[380px] md:h-[380px] -left-[130px] -top-[130px] md:-left-[190px] md:-top-[190px]"
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          />
          {/* Outer ring */}
          <motion.div
            className="absolute rounded-full border border-double border-accent-purple/20 w-[340px] h-[340px] md:w-[500px] md:h-[500px] -left-[170px] -top-[170px] md:-left-[250px] md:-top-[250px]"
            animate={{ rotate: -360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          />
          {/* Accent Crosshairs */}
          <div className="absolute w-[2px] h-[20px] bg-accent-cyan/60 -left-[1px] -top-[10px]" />
          <div className="absolute w-[2px] h-[20px] bg-accent-cyan/60 -left-[1px] top-[10px]" />
          <div className="absolute h-[2px] w-[20px] bg-accent-cyan/60 -left-[10px] -top-[1px]" />
          <div className="absolute h-[2px] w-[20px] bg-accent-cyan/60 left-[10px] -top-[1px]" />
        </motion.div>

        {/* Custom CSS for Glitch Animation */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes glitch-anim {
            0% {
              clip-path: inset(40% 0 61% 0);
              transform: skew(0.3deg);
            }
            20% {
              clip-path: inset(92% 0 1% 0);
              transform: skew(-0.5deg);
            }
            40% {
              clip-path: inset(15% 0 80% 0);
              transform: skew(0.5deg);
            }
            60% {
              clip-path: inset(80% 0 5% 0);
              transform: skew(-0.3deg);
            }
            80% {
              clip-path: inset(3% 0 92% 0);
              transform: skew(0.2deg);
            }
            100% {
              clip-path: inset(40% 0 61% 0);
              transform: skew(0deg);
            }
          }
          .glitch-text::after {
            content: attr(data-text);
            position: absolute;
            left: 2px;
            text-shadow: -1px 0 #b026ff;
            top: 0;
            color: #fff;
            background: #030303;
            overflow: hidden;
            clip: rect(0,900px,0,0); 
            animation: glitch-anim 2s infinite linear alternate-reverse;
          }
          .glitch-text::before {
            content: attr(data-text);
            position: absolute;
            left: -2px;
            text-shadow: -1px 0 #00f3ff, 0 1px #00f3ff;
            top: 0;
            color: #fff;
            background: #030303;
            overflow: hidden;
            clip: rect(0,900px,0,0); 
            animation: glitch-anim 3s infinite linear alternate-reverse;
          }
        `}} />

        {/* 8. Main Visual Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex flex-col items-center"
        >
          {/* Logo logomark */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 0.8, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-xs md:text-sm font-extrabold tracking-[0.35em] text-white uppercase mb-6 flex items-center gap-2"
          >
            <span>AURAZEN</span>
            <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan shadow-[0_0_8px_#00F3FF]" />
            <span className="text-zinc-500 font-normal font-mono">EST. 2026</span>
          </motion.div>

          {/* Massively glowing 404 Glitch heading */}
          <div className="relative mb-2">
            <motion.h1
              className="glitch-text text-[100px] sm:text-[140px] md:text-[180px] font-black leading-none tracking-tighter text-white relative shadow-glow shadow-accent-cyan/10"
              data-text="404"
              initial={{ letterSpacing: "-0.05em" }}
              animate={{ letterSpacing: "0.02em" }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              style={{
                textShadow: "0 0 35px rgba(0, 243, 255, 0.4), 0 0 65px rgba(176, 38, 255, 0.15)"
              }}
            >
              404
            </motion.h1>
          </div>

          {/* Subtitle */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-lg sm:text-2xl md:text-3xl font-light tracking-wide text-zinc-100 max-w-[20ch] sm:max-w-[25ch] md:max-w-[30ch] mb-4 uppercase"
          >
            Looks like this <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-purple shadow-sm">dimension</span> doesn’t exist.
          </motion.h2>

          {/* Small descriptions */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 0.6, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-xs sm:text-sm text-zinc-400 font-light max-w-sm tracking-wide mb-12"
          >
            The page you're searching for vanished into the digital void. We suggest returning to the grid.
          </motion.p>

          {/* Interactive Navigation Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-6 z-50">
            {/* Button 1: Return Home (Solid Glassmorphism Glow) */}
            <motion.div
              ref={backBtnRef}
              className="relative p-[1px] rounded-full overflow-hidden"
              style={{
                x: backBtnPos.x,
                y: backBtnPos.y,
              }}
              animate={{ x: backBtnPos.x, y: backBtnPos.y }}
              transition={{ type: "spring", stiffness: 160, damping: 14, mass: 0.1 }}
              onMouseMove={(e) => handleButtonMove(e, backBtnRef, setBackBtnPos)}
              onMouseLeave={() => {
                handleButtonLeave(setBackBtnPos);
                setIsHoveredBack(false);
              }}
              onMouseEnter={() => setIsHoveredBack(true)}
            >
              {/* Spinning gradient border border */}
              <div className="absolute inset-0 bg-gradient-to-r from-accent-cyan via-accent-purple to-accent-cyan animate-spin-slow opacity-80" />
              
              <Link
                to="/"
                className="relative flex items-center gap-3 px-8 py-4 rounded-full bg-[#0a0a0c]/90 text-sm font-bold tracking-[0.2em] uppercase text-white hover:text-accent-cyan transition-all duration-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_0_20px_rgba(0,243,255,0.15)] group"
              >
                <Home size={14} className="group-hover:-translate-y-[1px] transition-transform duration-200" />
                <span>Return Home</span>
                
                {/* Glow ring */}
                <span className="absolute inset-0 rounded-full border border-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            </motion.div>

            {/* Button 2: Explore Collection (Outlined futuristic button) */}
            <motion.div
              ref={exploreBtnRef}
              className="relative"
              style={{
                x: exploreBtnPos.x,
                y: exploreBtnPos.y,
              }}
              animate={{ x: exploreBtnPos.x, y: exploreBtnPos.y }}
              transition={{ type: "spring", stiffness: 160, damping: 14, mass: 0.1 }}
              onMouseMove={(e) => handleButtonMove(e, exploreBtnRef, setExploreBtnPos)}
              onMouseLeave={() => {
                handleButtonLeave(setExploreBtnPos);
                setIsHoveredExplore(false);
              }}
              onMouseEnter={() => setIsHoveredExplore(true)}
            >
              <Link
                to="/products"
                className="relative flex items-center gap-3 px-8 py-4 rounded-full border border-zinc-800 bg-transparent text-sm font-bold tracking-[0.2em] uppercase text-zinc-300 hover:text-white hover:border-accent-purple transition-all duration-300 backdrop-blur-md shadow-lg group"
                style={{
                  boxShadow: isHoveredExplore ? "0 0 25px rgba(176, 38, 255, 0.2)" : "none"
                }}
              >
                <Compass size={14} className="group-hover:rotate-45 transition-transform duration-300" />
                <span>Explore Collection</span>
                
                {/* Micro shine line */}
                <div className="absolute inset-0 rounded-full overflow-hidden">
                  <div className="absolute w-[20%] h-full bg-white/10 -skew-x-[25deg] -translate-x-[150%] group-hover:translate-x-[500%] transition-transform duration-1000 ease-out" />
                </div>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
