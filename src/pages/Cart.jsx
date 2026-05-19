import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import Button from '../components/ui/Button';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, user } = useShop();
  const navigate = useNavigate();

  const pageVariants = {
    initial: { opacity: 0 },
    in: { opacity: 1, transition: { duration: 0.4 } },
    out: { opacity: 0, transition: { duration: 0.4 } }
  };

  if (cart.length === 0) {
    return (
      <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} className="min-h-[70vh] flex flex-col items-center justify-center text-[#111111] px-6">
        <div className="w-24 h-24 bg-white/65 rounded-full flex items-center justify-center mb-6 border border-[#E8DCCF] shadow-[0_20px_60px_rgba(72,53,34,0.08)]">
          <ShoppingBag size={40} className="text-[#7a7168]" />
        </div>
        <h2 className="text-3xl font-black mb-4 tracking-tighter uppercase">Your cart is empty</h2>
        <p className="text-[#625b52] mb-8 max-w-md text-center font-medium">Looks like you haven't added anything to your cart yet. Explore our latest collections.</p>
        <Button variant="primary" onClick={() => navigate('/products')} className="px-8 py-4">
          Start Shopping
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} className="container mx-auto px-6 py-12 text-[#111111]">
      <h1 className="text-4xl font-black text-[#111111] mb-10 tracking-tighter uppercase">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          {cart.map((item) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              key={item.id}
              className="flex flex-col sm:flex-row gap-6 bg-white/65 p-6 rounded-2xl border border-[#E8DCCF] shadow-[0_20px_60px_rgba(72,53,34,0.08)] backdrop-blur-xl"
            >
              <div className="w-full sm:w-32 h-32 bg-[#F8F3EC] rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-[#111111] line-clamp-1">{item.name}</h3>
                    <p className="text-[#7a7168] text-sm mt-1 uppercase tracking-wider font-bold">{item.category}</p>
                  </div>
                  <p className="text-xl font-black text-[#111111]">₹{Number(item.price || 0).toFixed(2)}</p>
                </div>
                
                <div className="flex items-center justify-between mt-4 sm:mt-0">
                  <div className="flex items-center border border-[#E8DCCF] rounded-lg bg-[#FFFDF9]">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2 text-[#7a7168] hover:text-[#7d55bd] transition-colors" disabled={item.quantity <= 1}>
                      <Minus size={16} />
                    </button>
                    <span className="w-10 text-center font-bold text-[#111111]">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 text-[#7a7168] hover:text-[#7d55bd] transition-colors">
                      <Plus size={16} />
                    </button>
                  </div>
                  
                  <button onClick={() => removeFromCart(item.id)} className="flex items-center text-[#7a7168] hover:text-red-500 transition-colors text-sm font-bold uppercase tracking-wider">
                    <Trash2 size={16} className="mr-1" /> Remove
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white/70 p-8 rounded-2xl border border-[#E8DCCF] sticky top-24 shadow-[0_20px_60px_rgba(72,53,34,0.08)] backdrop-blur-xl">
            <h2 className="text-2xl font-black text-[#111111] mb-6 uppercase tracking-tight">Order Summary</h2>
            
            <div className="space-y-4 text-[#625b52] mb-6 font-medium">
              <div className="flex justify-between">
                <span>Subtotal ({cart.length} items)</span>
                <span className="text-[#111111]">₹{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-[#7d55bd] font-bold">Free</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (Estimated)</span>
                <span className="text-[#111111]">₹{(cartTotal * 0.1).toFixed(2)}</span>
              </div>
            </div>
            
            <div className="border-t border-[#E8DCCF] pt-6 mb-8">
              <div className="flex justify-between items-end">
                <span className="text-lg font-bold text-[#111111] uppercase">Total</span>
                <span className="text-3xl font-black text-[#111111]">₹{(cartTotal * 1.1).toFixed(2)}</span>
              </div>
            </div>
            
            <Button variant="primary" className="w-full py-4 text-lg" onClick={() => {
              if (!user) {
                navigate('/login');
              } else {
                navigate('/checkout');
              }
            }}>
              Secure Checkout
            </Button>
            
            <div className="mt-6 text-center">
              <Link to="/products" className="text-[#7a7168] hover:text-[#7d55bd] font-semibold text-sm flex items-center justify-center transition-colors">
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
