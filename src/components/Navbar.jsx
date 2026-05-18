import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, X, User, Heart, Search, LogOut, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useShop } from '../context/ShopContext';
import { useToast } from '../context/ToastContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { cartCount, wishlist, user, logout, searchQuery, setSearchQuery } = useShop();
  const toast = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      <header className="absolute top-0 w-full z-40 px-3 py-5 md:py-6 transition-all duration-500">
        <div className={`luxury-navbar-panel w-full px-4 lg:px-8 flex items-center justify-between gap-5 ${isScrolled ? 'is-scrolled' : ''}`}>
          <div className="flex items-center gap-6 lg:gap-8 min-w-0">
            <Link to="/" className="group flex items-center space-x-2">
              <span className="luxury-logo text-2xl font-black text-white tracking-widest uppercase transition-colors duration-300">
                AURA<span className="font-light text-gray-500 group-hover:text-[#00F3FF] transition-colors duration-300">ZEN</span>
              </span>
            </Link>

            <form onSubmit={handleSearch} className="aurazen-search-shell hidden md:flex">
              <div className="aurazen-search-inner">
                <Search size={18} strokeWidth={1.8} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="min-w-0 flex-1 bg-transparent text-sm font-medium text-white placeholder-gray-500 outline-none"
                />
                <button
                  type="submit"
                  aria-label="Search products"
                  className="luxury-icon-button h-8 w-8"
                >
                  <Search size={15} strokeWidth={2} />
                </button>
              </div>
            </form>
          </div>

          <div className="flex items-center space-x-6 ml-auto">
            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-2 rounded-full border border-white/5 bg-white/[0.025] p-1 backdrop-blur-md">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path || (link.path === '/products' && location.pathname.includes('/product'));
                return (
                  <Link 
                    key={link.name} 
                    to={link.path}
                    className={`luxury-nav-link group ${isActive ? 'is-active' : ''}`}
                  >
                    {link.name}
                    {isActive && (
                      <motion.div 
                        layoutId="navbar-indicator"
                        className="luxury-active-indicator"
                      />
                    )}
                  </Link>
                );
              })}
              <Link
                to="/orders"
                className={`luxury-nav-link group flex items-center gap-2 ${location.pathname === '/orders' ? 'is-active' : ''}`}
              >
                <Package size={15} strokeWidth={1.8} />
                My Orders
                {location.pathname === '/orders' && (
                  <motion.div 
                    layoutId="navbar-indicator"
                    className="luxury-active-indicator"
                  />
                )}
              </Link>
            </nav>
            
            {/* Login Link (Only shown when NOT logged in) */}
            {!user && (
              <div className="hidden md:flex items-center relative">
                <Link to="/login" className="luxury-nav-link">
                  LOGIN
                </Link>
              </div>
            )}

            {user && (
              <div className="hidden md:flex items-center relative z-50">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)} 
                  className="luxury-icon-button h-10 w-10 rounded-full"
                >
                  <User size={18} strokeWidth={1.5} />
                </button>
                
              <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-12 right-0 w-56 overflow-hidden rounded-2xl border border-white/10 bg-[#070707]/90 py-2 shadow-[0_24px_80px_rgba(0,0,0,0.75)] backdrop-blur-2xl z-50"
                    >
                      <div className="px-4 py-3 border-b border-[#1E1E1E]">
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Logged in as</p>
                        <p className="text-sm font-medium text-white truncate">{user.phone || user.email}</p>
                      </div>
                      <div className="py-1">
                        <Link to="/orders" className="flex items-center px-4 py-2 text-sm text-gray-300 hover:text-[#00F3FF] hover:bg-[#111111] transition-colors">
                          <Package size={16} className="mr-3" />
                          Your Orders
                        </Link>
                        <button 
                          onClick={() => {
                            logout();
                            setIsProfileOpen(false);
                            toast.success("Logged out successfully");
                          }}
                          className="w-full flex items-center px-4 py-2 text-sm text-gray-300 hover:text-[#FF3366] hover:bg-[#111111] transition-colors"
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

            {/* Mobile Search Icon */}
            <button
              onClick={() => navigate('/products')}
              className="hidden text-gray-400 hover:text-[#00F3FF] transition-colors hover:scale-110 duration-300"
              aria-label="Search products"
            >
              <Search size={20} strokeWidth={1.5} />
            </button>

            {/* Wishlist */}
            <Link to="/wishlist" className="luxury-icon-button hidden md:flex relative h-10 w-10 rounded-full">
              <Heart size={20} strokeWidth={1.5} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#B026FF] rounded-full shadow-[0_0_8px_rgba(176,38,255,0.8)]"></span>
              )}
            </Link>

            <Link 
              to="/cart"
              className="luxury-icon-button relative h-10 w-10 rounded-full"
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
              {cartCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1.5 -right-1.5 bg-[#00F3FF] text-black text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-[0_0_8px_rgba(0,243,255,0.8)]"
                >
                  {cartCount}
                </motion.span>
              )}
            </Link>

            <button 
              className="luxury-icon-button h-10 w-10 rounded-full md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-30 pt-28 bg-[#0a0a0a]/95 backdrop-blur-2xl md:hidden flex flex-col"
          >
            <div className="container mx-auto px-6 flex flex-col space-y-8 flex-1">
              <form onSubmit={handleSearch} className="flex items-center mb-4">
                <input 
                  type="text" 
                  placeholder="Search collection..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 rounded-2xl border border-white/10 bg-white/[0.045] px-5 py-4 text-white shadow-[0_0_24px_rgba(0,243,255,0.08)] outline-none backdrop-blur-md transition-all focus:border-[#00F3FF] focus:shadow-[0_0_28px_rgba(0,243,255,0.18)]"
                />
              </form>

              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-2xl border border-white/5 bg-white/[0.03] px-5 py-4 text-3xl font-black text-white tracking-tighter uppercase transition-all hover:border-[#00F3FF]/50 hover:bg-[#00F3FF]/10 hover:text-[#00F3FF] hover:shadow-[0_0_24px_rgba(0,243,255,0.16)]"
                >
                  {link.name}
                </Link>
              ))}

              <Link 
                to="/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-2xl border border-white/5 bg-white/[0.03] px-5 py-4 text-3xl font-black text-white tracking-tighter uppercase transition-all hover:border-[#00F3FF]/50 hover:bg-[#00F3FF]/10 hover:text-[#00F3FF] hover:shadow-[0_0_24px_rgba(0,243,255,0.16)]"
              >
                My Orders
              </Link>
              
              <div className="h-px bg-[#1E1E1E] w-full my-4"></div>
              
              <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)} className="flex items-center text-xl font-medium text-gray-400 hover:text-[#B026FF]">
                <Heart className="mr-4" strokeWidth={1.5}/> Wishlist ({wishlist.length})
              </Link>

              {user ? (
                <button className="flex items-center text-xl font-medium text-gray-400 hover:text-[#00F3FF]" onClick={() => setMobileMenuOpen(false)}>
                  <User className="mr-4" strokeWidth={1.5}/> Profile
                </button>
              ) : (
                <div className="flex flex-col space-y-5">
                  <Link to="/login" className="text-xl font-medium text-gray-400 hover:text-[#00F3FF]" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
                  <Link to="/signup" className="text-xl font-medium text-white hover:text-[#B026FF]" onClick={() => setMobileMenuOpen(false)}>Create Account</Link>
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
