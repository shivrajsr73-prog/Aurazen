import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Shirt } from 'lucide-react';

const AnimatedAddToCartButton = ({ onClick, className }) => {
  const [status, setStatus] = useState('idle'); // idle, animating, added

  const handleClick = () => {
    if (status !== 'idle') return;
    setStatus('animating');
    onClick();
  };

  useEffect(() => {
    if (status === 'animating') {
      const timer = setTimeout(() => {
        setStatus('added');
        setTimeout(() => {
          setStatus('idle');
        }, 2000);
      }, 2200); // matches animation duration
      return () => clearTimeout(timer);
    }
  }, [status]);

  return (
    <button
      className={`luxury-button relative flex w-full items-center justify-center overflow-hidden rounded-2xl border py-5 text-sm font-black uppercase tracking-[0.18em] transition-all ${
        status === 'added' ? 'luxury-button-glow text-black' : 'luxury-button-secondary text-white hover:border-[#00F3FF]/70 hover:shadow-[0_0_26px_rgba(0,243,255,0.22)]'
      } ${className}`}
      onClick={handleClick}
      disabled={status !== 'idle'}
    >
      <span className="luxury-button-shine" />
      <AnimatePresence mode="wait">
        {status === 'idle' && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center"
          >
            <ShoppingCart className="mr-2" size={22} /> Add to Cart
          </motion.div>
        )}

        {status === 'animating' && (
          <motion.div key="animating" className="absolute inset-0 flex items-center justify-center w-full h-full">
            {/* Cart moving from left to center, then right */}
            <motion.div
              initial={{ x: -150 }}
              animate={{ x: [-150, 0, 0, 0, 150] }}
              transition={{ duration: 2.2, times: [0, 0.2, 0.5, 0.75, 1], ease: "easeInOut" }}
              className="absolute z-10"
            >
              <ShoppingCart size={28} className="text-[#00F3FF]" />
            </motion.div>

            {/* Shirt dropping into cart and leaving with it */}
            <motion.div
              initial={{ y: -60, opacity: 0 }}
              animate={{ 
                y: [-60, -60, -5, -5, -5], 
                opacity: [0, 0, 1, 1, 1],
                x: [0, 0, 0, 0, 150],
                scale: [1, 1, 0.5, 0.5, 0.5]
              }}
              transition={{ 
                duration: 2.2,
                times: [0, 0.2, 0.5, 0.75, 1],
                ease: "easeInOut" 
              }}
              className="absolute z-20 flex items-center justify-center"
            >
              <Shirt size={20} className="text-white fill-white" />
            </motion.div>
          </motion.div>
        )}

        {status === 'added' && (
          <motion.div
            key="added"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center font-black"
          >
            Item Added!
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
};

export default AnimatedAddToCartButton;
