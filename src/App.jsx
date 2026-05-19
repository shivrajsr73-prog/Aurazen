import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ShopProvider, useShop } from './context/ShopContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Wishlist from './pages/Wishlist';
import Auth from './pages/Auth';
import Contact from './pages/Contact';
import About from './pages/About';
import Showcase from './pages/Showcase';
import Orders from './pages/Orders';
import NotFound from './pages/NotFound';
import LoginModal from './components/LoginModal';

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/login" element={<Auth initialMode="login" />} />
        <Route path="/signup" element={<Auth initialMode="signup" />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/showcase" element={<Showcase />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const Layout = () => {
  const location = useLocation();
  const { setIsCartOpen, user } = useShop();
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  // Detect showcase and non-existent pages (404) to hide global Nav/Footer
  const validRoutes = [
    '/', '/products', '/cart', '/checkout', '/wishlist', 
    '/login', '/signup', '/contact', '/about', '/orders', '/showcase'
  ];
  const isKnownRoute = validRoutes.includes(location.pathname) || location.pathname.startsWith('/product/');
  const isShowcase = location.pathname === '/showcase';
  const is404 = !isKnownRoute;
  const isSpecialPage = isShowcase || is404;

  useEffect(() => {
    setIsCartOpen(false);
  }, [location.pathname, setIsCartOpen]);

  useEffect(() => {
    // Show login popup only once per session for unauthenticated visitors
    const hasPrompted = sessionStorage.getItem('aurazen_login_prompt_shown');
    if (!user && !hasPrompted) {
      // 1.5s delay for smooth premium entrance after landing visual load
      const timer = setTimeout(() => {
        setShowLoginModal(true);
        sessionStorage.setItem('aurazen_login_prompt_shown', 'true');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [user]);

  return (
    <div className={`flex flex-col min-h-screen bg-[#F8F3EC] text-[#111111] transition-colors duration-300 ${isSpecialPage ? 'overflow-hidden' : ''}`}>
      {!isSpecialPage && <Navbar />}
      <main className={`flex-grow ${isSpecialPage ? '' : 'pt-36'}`}>
        <AnimatedRoutes />
      </main>
      {!isSpecialPage && <Footer />}

      {/* Global Peeking Panda Login Modal */}
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <ShopProvider>
            <Router>
              <Layout />
            </Router>
          </ShopProvider>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
