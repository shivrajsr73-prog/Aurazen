import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import Button from './ui/Button';

const CartSidebar = () => {
  const { cart, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, cartTotal } = useShop();
  const toast = useToast();
  const navigate = useNavigate();

  const handleRemove = (item) => {
    removeFromCart(item.id);
    toast.info(`Removed ${item.name} from cart`);
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white dark:bg-dark-800/95 backdrop-blur-xl border-l border-gray-200 dark:border-white/10 z-50 flex flex-col shadow-2xl transition-colors duration-300"
          >
            <div className="p-6 border-b border-gray-200 dark:border-white/10 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <ShoppingBag className="text-neon-cyan" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Cart</h2>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4">
                  <ShoppingBag size={48} className="opacity-20" />
                  <p>Your cart is empty.</p>
                  <Button variant="secondary" onClick={() => setIsCartOpen(false)}>Continue Shopping</Button>
                </div>
              ) : (
                cart.map(item => (
                  <motion.div 
                    layout
                    key={item.id} 
                    className="flex space-x-4 bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-200 dark:border-white/5"
                  >
                    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg mix-blend-multiply dark:mix-blend-normal" />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1">{item.name}</h3>
                        <p className="text-neon-cyan font-medium">₹{Number(item.price || 0).toFixed(2)}</p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-3 bg-white dark:bg-dark-900 border border-gray-200 dark:border-transparent rounded-lg px-2 py-1">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"><Minus size={14} /></button>
                          <span className="text-sm font-medium w-4 text-center text-gray-900 dark:text-white">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"><Plus size={14} /></button>
                        </div>
                        <button onClick={() => handleRemove(item)} className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 p-1">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-dark-900/50">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-600 dark:text-gray-400">Total</span>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">₹{cartTotal.toFixed(2)}</span>
                </div>
                <Button 
                  variant="glow" 
                  className="w-full py-4 text-lg"
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/checkout');
                  }}
                >
                  Proceed to Checkout
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;
