import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useShop();
  const navigate = useNavigate();

  const pageVariants = {
    initial: { opacity: 0 },
    in: { opacity: 1, transition: { duration: 0.4 } },
    out: { opacity: 0, transition: { duration: 0.4 } }
  };

  if (cart.length === 0) {
    return (
      <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} className="min-h-[70vh] flex flex-col items-center justify-center text-white px-6">
        <div className="w-24 h-24 bg-[#111111] rounded-full flex items-center justify-center mb-6 border border-[#1E1E1E]">
          <ShoppingBag size={40} className="text-gray-600" />
        </div>
        <h2 className="text-3xl font-black mb-4 tracking-tighter uppercase">Your cart is empty</h2>
        <p className="text-gray-400 mb-8 max-w-md text-center font-medium">Looks like you haven't added anything to your cart yet. Explore our latest collections.</p>
        <Button variant="primary" onClick={() => navigate('/products')} className="px-8 py-4">
          Start Shopping
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-black text-white mb-10 tracking-tighter uppercase">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          {cart.map((item) => (
            <motion.div 
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              key={item.id} 
              className="flex flex-col sm:flex-row gap-6 bg-[#111111] p-6 rounded-2xl border border-[#1E1E1E] shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
            >
              <div className="w-full sm:w-32 h-32 bg-[#181818] rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-screen opacity-90" />
              </div>
              
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-white line-clamp-1">{item.name}</h3>
                    <p className="text-gray-500 text-sm mt-1 uppercase tracking-wider font-bold">{item.category}</p>
                  </div>
                  <p className="text-xl font-black text-white">₹{Number(item.price || 0).toFixed(2)}</p>
                </div>
                
                <div className="flex items-center justify-between mt-4 sm:mt-0">
                  <div className="flex items-center border border-[#333] rounded-lg bg-[#0a0a0a]">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-2 text-gray-400 hover:text-[#00F3FF] transition-colors"
                      disabled={item.quantity <= 1}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-10 text-center font-bold text-white">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 text-gray-400 hover:text-[#00F3FF] transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="flex items-center text-gray-500 hover:text-red-500 transition-colors text-sm font-bold uppercase tracking-wider"
                  >
                    <Trash2 size={16} className="mr-1" /> Remove
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-[#111111] p-8 rounded-2xl border border-[#1E1E1E] sticky top-24">
            <h2 className="text-2xl font-black text-white mb-6 uppercase tracking-tight">Order Summary</h2>
            
            <div className="space-y-4 text-gray-400 mb-6 font-medium">
              <div className="flex justify-between">
                <span>Subtotal ({cart.length} items)</span>
                <span className="text-white">₹{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-[#00F3FF] font-bold">Free</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (Estimated)</span>
                <span className="text-white">₹{(cartTotal * 0.1).toFixed(2)}</span>
              </div>
            </div>
            
            <div className="border-t border-[#1E1E1E] pt-6 mb-8">
              <div className="flex justify-between items-end">
                <span className="text-lg font-bold text-white uppercase">Total</span>
                <span className="text-3xl font-black text-white">₹{(cartTotal * 1.1).toFixed(2)}</span>
              </div>
            </div>
            
            <Button 
              variant="primary" 
              className="w-full py-4 text-lg"
              onClick={() => navigate('/checkout')}
            >
              Secure Checkout
            </Button>
            
            <div className="mt-6 text-center">
              <Link to="/products" className="text-gray-500 hover:text-[#00F3FF] font-semibold text-sm flex items-center justify-center transition-colors">
                Continue Shopping <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Cart;
