import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Compass } from 'lucide-react';

export default function NotFound() {
  // Soft floating particles
  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    size: Math.random() * 6 + 3,
    left: Math.random() * 100,
    top: Math.random() * 100,
    duration: Math.random() * 14 + 10,
    delay: Math.random() * 6,
    drift: Math.random() * 40 - 20,
    color: i % 2 === 0 ? 'rgba(200,162,255,0.45)' : 'rgba(139,233,253,0.35)',
    glow:  i % 2 === 0 ? 'rgba(200,162,255,0.3)' : 'rgba(139,233,253,0.25)',
  }));

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden select-none font-sans"
      style={{
        background: 'radial-gradient(circle at 25% 15%, rgba(200,162,255,0.15) 0%, transparent 38%), radial-gradient(circle at 78% 80%, rgba(139,233,253,0.12) 0%, transparent 38%), linear-gradient(160deg, #FFFDF9 0%, #F8F3EC 55%, #EFE6D9 100%)'
      }}
    >
      {/* Soft ambient blobs */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{ width: 480, height: 480, top: '-8%', left: '-8%', background: 'radial-gradient(circle, rgba(200,162,255,0.18) 0%, transparent 70%)' }}
        animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{ width: 420, height: 420, bottom: '-8%', right: '-6%', background: 'radial-gradient(circle, rgba(139,233,253,0.15) 0%, transparent 70%)' }}
        animate={{ x: [0, -25, 0], y: [0, -18, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              width: p.size, height: p.size,
              left: `${p.left}%`, top: `${p.top}%`,
              background: p.color,
              boxShadow: `0 0 ${p.size * 2}px ${p.glow}`,
            }}
            animate={{ y: [0, -500], x: [0, p.drift], opacity: [0, 0.8, 0.8, 0] }}
            transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'linear' }}
          />
        ))}
      </div>

      {/* Decorative corner brackets */}
      <div className="absolute top-8 left-8 w-10 h-10 border-t-2 border-l-2 border-[#C8A2FF]/30 rounded-tl-lg pointer-events-none" />
      <div className="absolute top-8 right-8 w-10 h-10 border-t-2 border-r-2 border-[#8BE9FD]/30 rounded-tr-lg pointer-events-none" />
      <div className="absolute bottom-8 left-8 w-10 h-10 border-b-2 border-l-2 border-[#C8A2FF]/30 rounded-bl-lg pointer-events-none" />
      <div className="absolute bottom-8 right-8 w-10 h-10 border-b-2 border-r-2 border-[#8BE9FD]/30 rounded-br-lg pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-20 flex flex-col items-center text-center px-6 max-w-2xl">

        {/* Brand badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex items-center gap-2.5 mb-10 px-5 py-2.5 rounded-full bg-white/60 backdrop-blur-xl border border-[#E8DCCF]/80 shadow-[0_4px_24px_rgba(72,53,34,0.08)]"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#C8A2FF] shadow-[0_0_10px_rgba(200,162,255,0.7)]" />
          <span className="text-[10px] font-black tracking-[0.3em] uppercase text-[#111111]">AURA MAKER</span>
          <span className="text-[#E8DCCF] text-xs">·</span>
          <span className="text-[10px] font-medium tracking-wider text-[#7a7168]">EST. 2026</span>
        </motion.div>

        {/* 404 Number */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-4"
        >
          {/* Decorative rotating rings behind 404 */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            animate={{ rotate: 360 }}
            transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
          >
            <div
              className="rounded-full border border-dashed border-[#C8A2FF]/20"
              style={{ width: 320, height: 320, marginLeft: -30 }}
            />
          </motion.div>
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            animate={{ rotate: -360 }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          >
            <div
              className="rounded-full border border-[#8BE9FD]/15"
              style={{ width: 400, height: 400, marginLeft: -30 }}
            />
          </motion.div>

          <h1
            className="text-[120px] sm:text-[160px] md:text-[200px] font-black leading-none tracking-tighter text-[#111111] relative"
            style={{
              fontFamily: "'Cormorant Garamond', 'Didot', Georgia, serif",
              textShadow: '0 4px 40px rgba(200,162,255,0.25), 0 8px 80px rgba(72,53,34,0.08)',
            }}
          >
            <span className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(135deg, #111111 0%, #4a3f5c 50%, #111111 100%)' }}>
              404
            </span>
          </h1>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex items-center gap-4 mb-8"
        >
          <div className="w-16 h-px bg-gradient-to-r from-transparent to-[#C8A2FF]/50" />
          <div className="w-2 h-2 rounded-full bg-[#C8A2FF]/60 shadow-[0_0_12px_rgba(200,162,255,0.5)]" />
          <div className="w-16 h-px bg-gradient-to-l from-transparent to-[#C8A2FF]/50" />
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="text-2xl sm:text-3xl md:text-4xl font-black text-[#111111] tracking-tight mb-4 leading-tight"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          This page doesn't{' '}
          <span className="text-transparent bg-clip-text"
            style={{ backgroundImage: 'linear-gradient(135deg, #C8A2FF, #8BE9FD)' }}>
            exist.
          </span>
        </motion.h2>

        {/* Sub text */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 0.75, y: 0 }}
          transition={{ delay: 0.45, duration: 0.6 }}
          className="text-sm text-[#7a7168] font-medium max-w-sm leading-relaxed mb-12 tracking-wide"
        >
          The page you're looking for has wandered into the void. Let's bring you back to the collection.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center gap-4 z-50"
        >
          {/* Primary — Return Home */}
          <Link
            to="/"
            className="group flex items-center gap-3 px-8 py-4 rounded-full bg-[#111111] text-white text-xs font-black tracking-[0.2em] uppercase transition-all duration-300 hover:bg-[#2a2a2a] hover:scale-105 shadow-[0_8px_32px_rgba(17,17,17,0.22)] hover:shadow-[0_12px_44px_rgba(17,17,17,0.32)]"
          >
            <Home size={14} className="group-hover:-translate-y-[1px] transition-transform duration-200" />
            Return Home
          </Link>

          {/* Secondary — Explore */}
          <Link
            to="/products"
            className="group flex items-center gap-3 px-8 py-4 rounded-full bg-white/65 backdrop-blur-xl text-[#111111] text-xs font-black tracking-[0.2em] uppercase border border-[#E8DCCF]/90 transition-all duration-300 hover:border-[#C8A2FF]/60 hover:bg-white/90 hover:scale-105 shadow-[0_4px_20px_rgba(72,53,34,0.08)] hover:shadow-[0_8px_32px_rgba(200,162,255,0.18)]"
          >
            <Compass size={14} className="group-hover:rotate-45 transition-transform duration-300" />
            Explore Collection
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
