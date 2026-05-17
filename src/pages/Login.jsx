import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Facebook, Chrome } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const { login } = useShop();
  const toast = useToast();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      login({ name: 'AuraZen Member', email: formData.email });
      toast.success('Successfully logged in!');
      navigate('/');
    } else {
      toast.error('Please fix the errors in the form.');
    }
  };

  const handleSocialLogin = (provider) => {
    toast.info(`${provider} login is coming soon!`);
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    if (!formData.email) {
      toast.error("Please enter your email address first.");
    } else {
      toast.success(`Password reset link sent to ${formData.email}`);
    }
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    out: { opacity: 0, y: -20, transition: { duration: 0.4 } }
  };

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} className="min-h-[85vh] flex items-center justify-center py-20 px-6 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-[400px] bg-[#00F3FF]/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
      
      <div className="w-full max-w-md">
        <div className="bg-[#111111] p-8 md:p-10 rounded-3xl border border-[#1E1E1E] shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden">
          
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-white mb-2 tracking-tighter uppercase">Welcome Back</h2>
            <p className="text-gray-400 font-medium">Enter your credentials to access your AuraZen account.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input 
              label="Email Address" 
              type="email" 
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={errors.email}
            />

            <div className="relative">
              <Input 
                label="Password" 
                type={showPassword ? 'text' : 'password'} 
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                error={errors.password}
              />
              <button 
                type="button"
                className="absolute right-4 top-9 text-gray-500 hover:text-[#00F3FF] transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="flex items-center justify-between text-sm font-medium">
              <label className="flex items-center space-x-2 cursor-pointer group">
                <input type="checkbox" className="rounded border-[#333] bg-[#0a0a0a] text-[#00F3FF] focus:ring-[#00F3FF]/20" />
                <span className="text-gray-400 group-hover:text-white transition-colors">Remember me</span>
              </label>
              <button type="button" onClick={handleForgotPassword} className="text-gray-400 hover:text-[#00F3FF] font-medium transition-colors">Forgot password?</button>
            </div>

            <Button variant="primary" type="submit" className="w-full py-4">Sign In</Button>
          </form>

          <div className="mt-8">
            <div className="relative flex items-center justify-center mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#1E1E1E]"></div>
              </div>
              <span className="relative bg-[#111111] px-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Or continue with</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="secondary" onClick={() => handleSocialLogin('Google')} className="flex items-center justify-center space-x-2 py-3 bg-[#0a0a0a] border-[#1E1E1E]">
                <Chrome size={18} strokeWidth={1.5} /> <span className="font-bold text-sm uppercase">Google</span>
              </Button>
              <Button variant="secondary" onClick={() => handleSocialLogin('Facebook')} className="flex items-center justify-center space-x-2 py-3 bg-[#0a0a0a] border-[#1E1E1E]">
                <Facebook size={18} strokeWidth={1.5} /> <span className="font-bold text-sm uppercase">Facebook</span>
              </Button>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-gray-400 font-medium">
            Don't have an account? <Link to="/signup" className="text-white font-bold hover:text-[#00F3FF] uppercase tracking-wider ml-1 hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Login;
