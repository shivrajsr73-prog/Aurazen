import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import Button from './ui/Button';

const Footer = () => {
  return (
    <footer className="bg-[#050505] border-t border-[#1E1E1E] pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <Link to="/" className="inline-block mb-6">
              <span className="text-2xl font-black text-white tracking-tighter uppercase">
                Aura<span className="font-light text-gray-500">Zen</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed max-w-sm">
              Premium oversized streetwear crafted for the modern individual. Merging minimal aesthetics with unmatched luxury.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-[#111111] border border-[#1E1E1E] flex items-center justify-center text-gray-400 hover:bg-[#00F3FF] hover:text-black hover:border-[#00F3FF] transition-all shadow-[0_0_0_rgba(0,243,255,0)] hover:shadow-[0_0_15px_rgba(0,243,255,0.5)]">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#111111] border border-[#1E1E1E] flex items-center justify-center text-gray-400 hover:bg-[#00F3FF] hover:text-black hover:border-[#00F3FF] transition-all shadow-[0_0_0_rgba(0,243,255,0)] hover:shadow-[0_0_15px_rgba(0,243,255,0.5)]">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#111111] border border-[#1E1E1E] flex items-center justify-center text-gray-400 hover:bg-[#00F3FF] hover:text-black hover:border-[#00F3FF] transition-all shadow-[0_0_0_rgba(0,243,255,0)] hover:shadow-[0_0_15px_rgba(0,243,255,0.5)]">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#111111] border border-[#1E1E1E] flex items-center justify-center text-gray-400 hover:bg-[#00F3FF] hover:text-black hover:border-[#00F3FF] transition-all shadow-[0_0_0_rgba(0,243,255,0)] hover:shadow-[0_0_15px_rgba(0,243,255,0.5)]">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-widest text-sm mb-6">Shop</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link to="/products" className="text-gray-400 hover:text-[#00F3FF] transition-colors">All Products</Link></li>
              <li><Link to="/products" className="text-gray-400 hover:text-[#00F3FF] transition-colors">New Arrivals</Link></li>
              <li><Link to="/products" className="text-gray-400 hover:text-[#00F3FF] transition-colors">Best Sellers</Link></li>
              <li><Link to="/products" className="text-gray-400 hover:text-[#00F3FF] transition-colors">Accessories</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-widest text-sm mb-6">Support</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link to="/contact" className="text-gray-400 hover:text-[#00F3FF] transition-colors">Contact Us</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-[#00F3FF] transition-colors">FAQ</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-[#00F3FF] transition-colors">Shipping & Returns</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-[#00F3FF] transition-colors">Size Guide</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-widest text-sm mb-6">Join the Club</h4>
            <p className="text-gray-400 text-sm mb-4 font-medium">Subscribe for exclusive drops, early access, and minimal style guides.</p>
            <form className="flex flex-col space-y-3">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full px-4 py-3 bg-[#111111] border border-[#1E1E1E] rounded-lg text-sm text-white focus:outline-none focus:border-[#00F3FF] focus:ring-1 focus:ring-[#00F3FF] transition-colors"
                required
              />
              <Button variant="primary" className="w-full">Subscribe</Button>
            </form>
          </div>
        </div>

        <div className="border-t border-[#1E1E1E] pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-gray-500 text-sm font-medium mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} AuraZen. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm font-medium">
            <Link to="/contact" className="text-gray-500 hover:text-[#00F3FF] transition-colors">Privacy Policy</Link>
            <Link to="/contact" className="text-gray-500 hover:text-[#00F3FF] transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
