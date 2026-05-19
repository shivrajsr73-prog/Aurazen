import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const { login } = useShop();
  const toast = useToast();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      login({ name: formData.name, email: formData.email });
      toast.success('Account created successfully!');
      navigate('/');
    } else {
      toast.error('Please fix the errors in the form.');
    }
  };

  const pageVariants = {
    initial: { opacity: 0, scale: 0.95 },
    in: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
    out: { opacity: 0, scale: 1.05, transition: { duration: 0.4 } }
  };

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} className="min-h-[85vh] flex items-center justify-center py-24 px-6 relative">
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-full max-w-2xl h-[500px] bg-[#B026FF]/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
      
      <div className="w-full max-w-lg">
        <div className="bg-[#111111] p-8 md:p-10 rounded-3xl border border-[#1E1E1E] shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden">
          
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-white mb-2 tracking-tighter uppercase">Create Account</h2>
            <p className="text-gray-400 font-medium">Join the Aura Maker exclusive club.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input 
              label="Full Name" 
              type="text" 
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={errors.name}
            />

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
                className="absolute right-4 top-9 text-gray-500 hover:text-[#B026FF] transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <Input 
              label="Confirm Password" 
              type={showPassword ? 'text' : 'password'} 
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              error={errors.confirmPassword}
            />

            <Button variant="primary" type="submit" className="w-full py-4 mt-4 bg-gradient-to-r from-[#B026FF] to-[#00F3FF] text-white border-0 shadow-[0_0_20px_rgba(176,38,255,0.4)] hover:shadow-[0_0_30px_rgba(176,38,255,0.6)]">Sign Up</Button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-400 font-medium">
            Already have an account? <Link to="/login" className="text-white font-bold hover:text-[#B026FF] uppercase tracking-wider ml-1 hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Signup;
