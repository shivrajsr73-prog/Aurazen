import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import Button from './ui/Button';

const Footer = () => {
  const socialClass = 'w-10 h-10 rounded-full bg-white/55 border border-[#E8DCCF] flex items-center justify-center text-[#4f4942] hover:bg-[#C8A2FF]/25 hover:text-[#111111] hover:border-[#C8A2FF] transition-all shadow-[0_14px_32px_rgba(72,53,34,0.08)]';
  const linkClass = 'text-[#625b52] hover:text-[#7d55bd] transition-colors';

  return (
    <footer className="bg-[#FFFDF9] border-t border-[#E8DCCF]/80 pt-16 pb-8 text-[#111111]">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <Link to="/" className="inline-block mb-6">
              <span className="text-2xl font-black text-[#111111] tracking-tighter uppercase">
                Aura <span className="font-light text-[#7a7168]">Maker</span>
              </span>
            </Link>
            <p className="text-[#625b52] text-sm mb-6 leading-relaxed max-w-sm">
              Premium oversized streetwear crafted for the modern individual. Merging minimal aesthetics with effortless luxury.
            </p>
            <div className="flex space-x-4">
              <a href="#" className={socialClass} aria-label="Instagram"><Instagram size={18} /></a>
              <a href="#" className={socialClass} aria-label="Twitter"><Twitter size={18} /></a>
              <a href="#" className={socialClass} aria-label="Facebook"><Facebook size={18} /></a>
              <a href="#" className={socialClass} aria-label="Youtube"><Youtube size={18} /></a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-[#111111] uppercase tracking-widest text-sm mb-6">Shop</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link to="/products" className={linkClass}>All Products</Link></li>
              <li><Link to="/products" className={linkClass}>New Arrivals</Link></li>
              <li><Link to="/products" className={linkClass}>Best Sellers</Link></li>
              <li><Link to="/products" className={linkClass}>Accessories</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[#111111] uppercase tracking-widest text-sm mb-6">Support</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link to="/contact" className={linkClass}>Contact Us</Link></li>
              <li><Link to="/contact" className={linkClass}>FAQ</Link></li>
              <li><Link to="/contact" className={linkClass}>Shipping & Returns</Link></li>
              <li><Link to="/contact" className={linkClass}>Size Guide</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[#111111] uppercase tracking-widest text-sm mb-6">Join the Club</h4>
            <p className="text-[#625b52] text-sm mb-4 font-medium">Subscribe for exclusive drops, early access, and minimal style guides.</p>
            <form className="flex flex-col space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-white/60 border border-[#E8DCCF] rounded-lg text-sm text-[#111111] placeholder-[#8c8278] focus:outline-none focus:border-[#C8A2FF] focus:ring-2 focus:ring-[#C8A2FF]/25 transition-colors"
                required
              />
              <Button variant="primary" className="w-full">Subscribe</Button>
            </form>
          </div>
        </div>

        <div className="border-t border-[#E8DCCF] pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-[#7a7168] text-sm font-medium mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Aura Maker. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm font-medium">
            <Link to="/contact" className="text-[#7a7168] hover:text-[#7d55bd] transition-colors">Privacy Policy</Link>
            <Link to="/contact" className="text-[#7a7168] hover:text-[#7d55bd] transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
