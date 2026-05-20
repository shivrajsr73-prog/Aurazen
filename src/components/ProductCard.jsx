import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Star, Minus, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useShop } from '../context/ShopContext';
import { useToast } from '../context/ToastContext';
import Button from './ui/Button';

const ProductCard = ({ product }) => {
  const { addToCart, cart, wishlist, toggleWishlist, updateQuantity } = useShop();
  const toast = useToast();
  const navigate = useNavigate();

  const isWishlisted = wishlist.some(item => item.id === product.id);
  const cartItem = cart.find(item => item.id === product.id);
  const cartQuantity = cartItem?.quantity || 0;

  const handleAddToCart = () => {
    toast.error('Please select a size first!');
    navigate(`/product/${product.id}`);
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
      className="group bg-white/65 rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(72,53,34,0.08)] hover:shadow-[0_28px_80px_rgba(200,162,255,0.16)] border border-[#E8DCCF]/80 hover:border-[#C8A2FF]/60 transition-all duration-500 flex flex-col h-full relative backdrop-blur-xl"
    >
      <div className="relative h-44 sm:h-64 md:h-80 overflow-hidden bg-gradient-to-br from-[#FFFDF9] via-[#F8F3EC] to-[#E8DCCF] transition-colors duration-500 flex items-center justify-center p-3 sm:p-6">
        <Link to={`/product/${product.id}`} className="w-full h-full block">
          <motion.img 
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover rounded-xl drop-shadow-[0_18px_42px_rgba(72,53,34,0.18)]"
          />
        </Link>
        <div className="absolute top-2 right-2 sm:top-5 sm:right-5 space-y-3 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 translate-x-0 sm:translate-x-4 sm:group-hover:translate-x-0 transition-all duration-500">
          <button 
            onClick={handleWishlist}
            className="luxury-icon-button h-7 w-7 sm:h-10 sm:w-10 rounded-full flex items-center justify-center"
          >
            <Heart className={`h-4 w-4 sm:h-[18px] sm:w-[18px] ${isWishlisted ? "fill-[#C8A2FF] text-[#7d55bd] drop-shadow-[0_0_10px_rgba(200,162,255,0.55)]" : ""}`} strokeWidth={1.5} />
          </button>
        </div>
        <div className="absolute top-2 left-2 sm:top-5 sm:left-5 bg-white/70 backdrop-blur-md text-[#111111] text-[8px] sm:text-[10px] uppercase tracking-widest font-black px-2 py-0.5 sm:px-4 sm:py-1.5 rounded-full border border-[#E8DCCF]">
          {product.category}
        </div>
      </div>
      
      <div className="p-3 sm:p-6 flex-1 flex flex-col">
        <div className="flex items-center space-x-1 mb-1.5 sm:mb-3">
          <Star className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#C8A2FF] fill-current drop-shadow-[0_0_8px_rgba(200,162,255,0.35)]" />
          <span className="text-[10px] sm:text-xs font-bold text-[#4f4942]">{product.rating}</span>
          <span className="text-[10px] sm:text-xs text-[#7a7168] font-medium">({product.reviews})</span>
        </div>
        <Link to={`/product/${product.id}`} className="block mb-1 sm:mb-2">
          <h3 className="text-sm sm:text-lg md:text-xl font-bold text-[#111111] line-clamp-1 group-hover:text-[#7d55bd] transition-colors">{product.name}</h3>
        </Link>
        <p className="text-[#625b52] text-xs sm:text-sm mb-2 sm:mb-6 line-clamp-1 sm:line-clamp-2 flex-1 font-medium">{product.description}</p>
        
        <div className="flex items-center justify-between mt-auto pt-2 sm:pt-4 border-t border-[#E8DCCF]">
          <span className="text-base sm:text-xl md:text-2xl font-black text-[#111111] tracking-tight">
            ₹{Number(product.price || 0).toFixed(2)}
          </span>
          {cartQuantity > 0 ? (
            <div className="flex h-7 sm:h-9 items-center rounded-lg border border-[#E8DCCF] bg-[#FFFDF9]">
              <button
                type="button"
                onClick={() => updateQuantity(product.id, cartQuantity - 1)}
                className="flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center text-[#7a7168] transition-colors hover:text-[#7d55bd]"
                aria-label={`Decrease ${product.name} quantity`}
              >
                <Minus className="h-3 w-3 sm:h-[15px] sm:w-[15px]" />
              </button>
              <span className="w-6 sm:w-8 text-center text-xs sm:text-sm font-black text-[#111111]">{cartQuantity}</span>
              <button
                type="button"
                onClick={() => updateQuantity(product.id, cartQuantity + 1)}
                className="flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center text-[#7a7168] transition-colors hover:text-[#7d55bd]"
                aria-label={`Increase ${product.name} quantity`}
              >
                <Plus className="h-3 w-3 sm:h-[15px] sm:w-[15px]" />
              </button>
            </div>
          ) : (
            <Button
              variant="ghost"
              className="!h-8 !w-8 sm:!h-11 sm:!w-11 !rounded-full !p-0"
              onClick={handleAddToCart}
              aria-label={`Add ${product.name} to cart`}
            >
              <ShoppingCart className="h-4 w-4 sm:h-[18px] sm:w-[18px]" strokeWidth={2} />
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
