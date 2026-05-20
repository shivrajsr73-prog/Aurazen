import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, X, User, Heart, Search, LogOut, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useShop } from '../context/ShopContext';
import { useToast } from '../context/ToastContext';
import logoImg from '../../images/logo.png';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const { cartCount, wishlist, user, logout, searchQuery, setSearchQuery } = useShop();
  const toast = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isProfileOpen) return;
    const handleOutsideClick = (event) => {
      if (!profileMenuRef.current?.contains(event.target)) setIsProfileOpen(false);
    };
    document.addEventListener('pointerdown', handleOutsideClick);
    return () => document.removeEventListener('pointerdown', handleOutsideClick);
  }, [isProfileOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate('/products');
  };

  const navLinks = [
    { name: 'HOME', path: '/' },
    { name: 'COLLECTION', path: '/products' },
    { name: 'ABOUT', path: '/about' },
  ];

  return (
    <>
      <style>{`
        @keyframes rgbBorderGlow {
          0%, 100% {
            border-color: rgba(200, 162, 255, 0.6);
            box-shadow: 0 0 8px rgba(200, 162, 255, 0.25);
          }
          33% {
            border-color: rgba(125, 85, 189, 0.6);
            box-shadow: 0 0 8px rgba(125, 85, 189, 0.25);
          }
          66% {
            border-color: rgba(232, 220, 207, 0.85);
            box-shadow: 0 0 8px rgba(232, 220, 207, 0.35);
          }
        }
        .mobile-search-glow {
          animation: rgbBorderGlow 5s ease-in-out infinite;
          border: 1.5px solid transparent;
        }
      `}</style>
      <header className="absolute top-0 w-full z-40 px-2 py-3 md:px-3 md:py-6 transition-all duration-500">
        <div className={`luxury-navbar-panel w-full px-2.5 md:px-6 lg:px-8 flex items-center justify-between gap-2 md:gap-5 ${isScrolled ? 'is-scrolled' : ''}`}>
          <div className="flex items-center gap-2 md:gap-6 lg:gap-8 min-w-0 flex-1 md:flex-initial">
            <Link to="/" className="group flex flex-col items-center leading-none gap-0.5 -ml-1 md:-ml-4 shrink-0">
              <img
                src={logoImg}
                alt="Aura Maker"
                className="w-8 h-8 md:w-20 md:h-20 object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_4px_18px_rgba(200,162,255,0.4)]"
              />
              <span className="luxury-logo font-black text-[#111111] tracking-widest uppercase transition-colors duration-300 whitespace-nowrap text-[8px] md:text-base leading-tight -mt-1 md:-mt-3">
                AURA <span className="font-extralight text-[#7a7168] group-hover:text-[#7d55bd] transition-colors duration-300">MAKER</span>
              </span>
            </Link>

            {/* Mobile Search Bar */}
            <form onSubmit={handleSearch} className="flex md:hidden flex-1 max-w-[130px] sm:max-w-xs">
              <div className="mobile-search-glow flex items-center w-full h-8 rounded-full bg-white/50 px-2.5 gap-1 backdrop-blur-md">
                <Search size={13} className="text-[#6b6259] shrink-0" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-[10px] font-semibold text-[#111111] placeholder-[#8c8278] outline-none"
                />
              </div>
            </form>

            <form onSubmit={handleSearch} className="aurazen-search-shell hidden md:flex">
              <div className="aurazen-search-inner">
                <Search size={18} strokeWidth={1.8} className="text-[#6b6259]" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="min-w-0 flex-1 bg-transparent text-sm font-medium text-[#111111] placeholder-[#8c8278] outline-none"
                />
                <button type="submit" aria-label="Search products" className="luxury-icon-button h-8 w-8 rounded-full">
                  <Search size={15} strokeWidth={2} />
                </button>
              </div>
            </form>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3 md:gap-6 ml-auto shrink-0">
            <nav className="hidden md:flex items-center space-x-2 rounded-full border border-[#E8DCCF]/80 bg-white/45 p-1 backdrop-blur-xl shadow-[0_18px_48px_rgba(72,53,34,0.08)]">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path || (link.path === '/products' && location.pathname.includes('/product'));
                return (
                  <Link key={link.name} to={link.path} className={`luxury-nav-link group ${isActive ? 'is-active' : ''}`}>
                    {link.name}
                    {isActive && <motion.div layoutId="navbar-indicator" className="luxury-active-indicator" />}
                  </Link>
                );
              })}
              <Link to="/orders" className={`luxury-nav-link group flex items-center gap-2 ${location.pathname === '/orders' ? 'is-active' : ''}`}>
                <Package size={15} strokeWidth={1.8} />
                My Orders
                {location.pathname === '/orders' && <motion.div layoutId="navbar-indicator" className="luxury-active-indicator" />}
              </Link>
            </nav>

            {!user && (
              <div className="hidden md:flex items-center relative">
                <Link to="/login" className="luxury-nav-link">LOGIN</Link>
              </div>
            )}

            {user && (
              <div ref={profileMenuRef} className="hidden md:flex items-center relative z-50">
                <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="luxury-icon-button h-10 w-10 rounded-full">
                  <User size={18} strokeWidth={1.5} />
                </button>
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-12 right-0 w-56 overflow-hidden rounded-2xl border border-[#E8DCCF] bg-[#FFFDF9]/92 py-2 shadow-[0_24px_80px_rgba(72,53,34,0.18)] backdrop-blur-2xl z-50">
                      <div className="px-4 py-3 border-b border-[#E8DCCF]">
                        <p className="text-[10px] text-[#7a7168] uppercase tracking-widest mb-1">Logged in as</p>
                        <p className="text-sm font-medium text-[#111111] truncate">{user.phone || user.email}</p>
                      </div>
                      <div className="py-1">
                        <Link to="/orders" onClick={() => setIsProfileOpen(false)} className="flex items-center px-4 py-2 text-sm text-[#4f4942] hover:text-[#7d55bd] hover:bg-[#F8F3EC] transition-colors">
                          <Package size={16} className="mr-3" />
                          Your Orders
                        </Link>
                        <button
                          onClick={() => {
                            logout();
                            setIsProfileOpen(false);
                            toast.success('Logged out successfully');
                          }}
                          className="w-full flex items-center px-4 py-2 text-sm text-[#4f4942] hover:text-red-600 hover:bg-[#F8F3EC] transition-colors"
                        >
                          <LogOut size={16} className="mr-3" />
                          Log Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            <Link to="/wishlist" className="luxury-icon-button relative h-8 w-8 md:h-10 md:w-10 rounded-full flex items-center justify-center">
              <Heart className="h-4 w-4 md:h-5 md:w-5" strokeWidth={1.5} />
              {wishlist.length > 0 && <span className="absolute -top-0.5 -right-0.5 md:-top-1 md:-right-1 w-1.5 h-1.5 md:w-2 md:h-2 bg-[#C8A2FF] rounded-full shadow-[0_0_10px_rgba(200,162,255,0.75)]" />}
            </Link>

            <Link to="/cart" className="luxury-icon-button relative h-8 w-8 md:h-10 md:w-10 rounded-full flex items-center justify-center">
              <ShoppingBag className="h-4 w-4 md:h-5 md:w-5" strokeWidth={1.5} />
              {cartCount > 0 && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 -right-1 md:-top-1.5 md:-right-1.5 bg-[#C8A2FF] text-[#111111] text-[8px] md:text-[10px] font-bold w-3.5 h-3.5 md:w-4 md:h-4 flex items-center justify-center rounded-full shadow-[0_0_10px_rgba(200,162,255,0.7)]">
                  {cartCount}
                </motion.span>
              )}
            </Link>

            <button className="luxury-icon-button h-8 w-8 md:h-10 md:w-10 rounded-full md:hidden flex items-center justify-center" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Open menu">
              {mobileMenuOpen ? <X className="h-5 w-5 md:h-6 md:w-6" strokeWidth={1.5} /> : <Menu className="h-5 w-5 md:h-6 md:w-6" strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed inset-0 z-30 pt-28 bg-[#F8F3EC]/95 backdrop-blur-2xl md:hidden flex flex-col">
            <div className="container mx-auto px-6 flex flex-col space-y-6 flex-1">
              <form onSubmit={handleSearch} className="flex items-center mb-4">
                <input
                  type="text"
                  placeholder="Search collection..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 rounded-2xl border border-[#E8DCCF] bg-white/60 px-5 py-4 text-[#111111] shadow-[0_18px_44px_rgba(72,53,34,0.1)] outline-none backdrop-blur-md transition-all focus:border-[#C8A2FF] focus:shadow-[0_0_28px_rgba(200,162,255,0.18)]"
                />
              </form>

              {navLinks.map((link) => (
                <Link key={link.name} to={link.path} onClick={() => setMobileMenuOpen(false)} className="rounded-2xl border border-[#E8DCCF] bg-white/50 px-5 py-4 text-3xl font-black text-[#111111] tracking-tighter uppercase transition-all hover:border-[#C8A2FF]/60 hover:bg-white/80 hover:text-[#7d55bd]">
                  {link.name}
                </Link>
              ))}

              <Link to="/orders" onClick={() => setMobileMenuOpen(false)} className="rounded-2xl border border-[#E8DCCF] bg-white/50 px-5 py-4 text-3xl font-black text-[#111111] tracking-tighter uppercase transition-all hover:border-[#C8A2FF]/60 hover:bg-white/80 hover:text-[#7d55bd]">
                My Orders
              </Link>

              <div className="h-px bg-[#E8DCCF] w-full my-4" />

              <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)} className="flex items-center text-xl font-medium text-[#4f4942] hover:text-[#7d55bd]">
                <Heart className="mr-4" strokeWidth={1.5} /> Wishlist ({wishlist.length})
              </Link>

              {user ? (
                <button className="flex items-center text-xl font-medium text-[#4f4942] hover:text-[#7d55bd]" onClick={() => setMobileMenuOpen(false)}>
                  <User className="mr-4" strokeWidth={1.5} /> Profile
                </button>
              ) : (
                <div className="flex flex-col space-y-5">
                  <Link to="/login" className="text-xl font-medium text-[#4f4942] hover:text-[#7d55bd]" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
                  <Link to="/signup" className="text-xl font-medium text-[#111111] hover:text-[#7d55bd]" onClick={() => setMobileMenuOpen(false)}>Create Account</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
