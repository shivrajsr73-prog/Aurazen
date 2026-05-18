import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star, Minus, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useShop } from '../context/ShopContext';
import { useToast } from '../context/ToastContext';
import Button from './ui/Button';

const ProductCard = ({ product }) => {
  const { addToCart, cart, wishlist, toggleWishlist, updateQuantity } = useShop();
  const toast = useToast();

  const isWishlisted = wishlist.some(item => item.id === product.id);
  const cartItem = cart.find(item => item.id === product.id);
  const cartQuantity = cartItem?.quantity || 0;

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`Added ${product.name} to cart`);
  };

  const handleWishlist = () => {
    toggleWishlist(product);
    if (!isWishlisted) {
      toast.success(`Added ${product.name} to wishlist`);
    } else {
      toast.info(`Removed ${product.name} from wishlist`);
    }
  };

  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="group bg-[#111111] rounded-2xl overflow-hidden shadow-sm hover:shadow-[0_10px_40px_rgba(0,243,255,0.05)] border border-[#1E1E1E] hover:border-[#00F3FF]/50 transition-all duration-500 flex flex-col h-full relative"
    >
      <div className="relative h-80 overflow-hidden bg-[#181818] group-hover:bg-[#222] transition-colors duration-500 flex items-center justify-center p-6">
        <Link to={`/product/${product.id}`} className="w-full h-full block">
          <motion.img 
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover rounded-xl mix-blend-screen drop-shadow-lg opacity-90"
          />
        </Link>
        <div className="absolute top-5 right-5 space-y-3 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500">
          <button 
            onClick={handleWishlist}
            className="luxury-icon-button h-10 w-10 rounded-full"
          >
            <Heart size={18} className={isWishlisted ? "fill-[#B026FF] text-[#B026FF] drop-shadow-[0_0_8px_rgba(176,38,255,0.8)]" : ""} strokeWidth={1.5} />
          </button>
        </div>
        <div className="absolute top-5 left-5 bg-[#0a0a0a]/90 backdrop-blur-md text-white text-[10px] uppercase tracking-widest font-black px-4 py-1.5 rounded-full border border-[#1E1E1E]">
          {product.category}
        </div>
      </div>
      
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center space-x-1 mb-3">
          <Star size={14} className="text-[#00F3FF] fill-current drop-shadow-[0_0_5px_rgba(0,243,255,0.8)]" />
          <span className="text-xs font-bold text-gray-300">{product.rating}</span>
          <span className="text-xs text-gray-500 font-medium">({product.reviews})</span>
        </div>
        <Link to={`/product/${product.id}`} className="block mb-2">
          <h3 className="text-xl font-bold text-white line-clamp-1 group-hover:text-[#00F3FF] transition-colors">{product.name}</h3>
        </Link>
        <p className="text-gray-400 text-sm mb-6 line-clamp-2 flex-1 font-medium">{product.description}</p>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#1E1E1E]">
          <span className="text-2xl font-black text-white tracking-tight">
            ₹{Number(product.price || 0).toFixed(2)}
          </span>
          {cartQuantity > 0 ? (
            <div className="flex h-9 items-center rounded-lg border border-[#333] bg-[#0a0a0a]">
              <button
                type="button"
                onClick={() => updateQuantity(product.id, cartQuantity - 1)}
                className="flex h-9 w-9 items-center justify-center text-gray-400 transition-colors hover:text-[#00F3FF]"
                aria-label={`Decrease ${product.name} quantity`}
              >
                <Minus size={15} />
              </button>
              <span className="w-8 text-center text-sm font-black text-white">{cartQuantity}</span>
              <button
                type="button"
                onClick={() => updateQuantity(product.id, cartQuantity + 1)}
                className="flex h-9 w-9 items-center justify-center text-gray-400 transition-colors hover:text-[#00F3FF]"
                aria-label={`Increase ${product.name} quantity`}
              >
                <Plus size={15} />
              </button>
            </div>
          ) : (
            <Button
              variant="ghost"
              className="!h-11 !w-11 !rounded-full !p-0"
              onClick={handleAddToCart}
              aria-label={`Add ${product.name} to cart`}
            >
              <ShoppingCart size={18} strokeWidth={2} />
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
