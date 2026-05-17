import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Chrome, ArrowRight } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { useToast } from '../../context/ToastContext';
import { useNavigate } from 'react-router-dom';

const AuthOverlay = ({ isVisible, initialMode = 'login' }) => {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const { login } = useShop();
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password || (!isLogin && !formData.name)) {
      toast.error('Please fill in all required fields.');
      return;
    }
    
    login({ name: isLogin ? 'AuraZen Member' : formData.name, email: formData.email });
    toast.success(isLogin ? 'Successfully logged in!' : 'Account created successfully!');
    navigate('/');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ opacity: 0, x: 50, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="absolute right-0 lg:right-32 top-1/2 -translate-y-1/2 w-full max-w-md px-6 z-10 pointer-events-auto"
        >
          <div className="bg-[#111111]/80 backdrop-blur-2xl p-10 rounded-3xl border border-[#1E1E1E] shadow-[0_0_50px_rgba(0,0,0,0.8),inset_0_0_20px_rgba(176,38,255,0.05)] relative overflow-hidden group">
            
            {/* Inner Glow Effects */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#00F3FF]/20 rounded-full blur-[60px] pointer-events-none group-hover:bg-[#00F3FF]/30 transition-colors duration-700"></div>
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#B026FF]/20 rounded-full blur-[60px] pointer-events-none group-hover:bg-[#B026FF]/30 transition-colors duration-700"></div>

            <div className="relative z-10">
              <div className="mb-10">
                <h2 className="text-4xl font-black text-white mb-2 tracking-tighter uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                  {isLogin ? 'Welcome Back' : 'Join AuraZen'}
                </h2>
                <p className="text-gray-400 font-medium">
                  {isLogin ? 'Enter your credentials to continue.' : 'Create an account to access premium drops.'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <AnimatePresence mode="wait">
                  {!isLogin && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }} 
                      animate={{ opacity: 1, height: 'auto' }} 
                      exit={{ opacity: 0, height: 0 }}
                      className="relative"
                    >
                      <User className="absolute left-4 top-3.5 text-gray-500" size={18} />
                      <input 
                        type="text" 
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-[#0a0a0a]/50 border border-[#333] rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#00F3FF] focus:ring-1 focus:ring-[#00F3FF] transition-all"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 text-gray-500" size={18} />
                  <input 
                    type="email" 
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-[#0a0a0a]/50 border border-[#333] rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#00F3FF] focus:ring-1 focus:ring-[#00F3FF] transition-all"
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 text-gray-500" size={18} />
                  <input 
                    type="password" 
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full bg-[#0a0a0a]/50 border border-[#333] rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#00F3FF] focus:ring-1 focus:ring-[#00F3FF] transition-all"
                  />
                </div>

                {isLogin && (
                  <div className="flex justify-end">
                    <button type="button" className="text-xs font-bold text-gray-500 hover:text-[#00F3FF] transition-colors uppercase tracking-wider">
                      Forgot Password?
                    </button>
                  </div>
                )}

                <button 
                  type="submit" 
                  className="w-full py-4 bg-[#00FF66] text-black font-black uppercase tracking-widest text-sm rounded-xl hover:bg-white hover:shadow-[0_0_20px_rgba(0,255,102,0.4)] transition-all duration-300 flex items-center justify-center group"
                >
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>

              <div className="mt-8 flex items-center justify-between">
                <div className="h-px bg-[#333] flex-1"></div>
                <span className="px-4 text-xs font-bold text-gray-600 uppercase tracking-widest">Or</span>
                <div className="h-px bg-[#333] flex-1"></div>
              </div>

              <button 
                type="button" 
                onClick={() => toast.info('Google login coming soon!')}
                className="w-full mt-8 py-3.5 bg-[#0a0a0a] border border-[#1E1E1E] text-white font-bold uppercase tracking-wider text-xs rounded-xl hover:border-[#B026FF] hover:shadow-[0_0_15px_rgba(176,38,255,0.2)] transition-all duration-300 flex items-center justify-center"
              >
                <Chrome size={16} className="mr-3" /> Continue with Google
              </button>

              <p className="mt-8 text-center text-sm font-medium text-gray-500">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button 
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-white font-bold hover:text-[#00F3FF] uppercase tracking-wider transition-colors"
                >
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthOverlay;
