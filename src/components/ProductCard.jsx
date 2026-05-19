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
      className="group bg-white/65 rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(72,53,34,0.08)] hover:shadow-[0_28px_80px_rgba(200,162,255,0.16)] border border-[#E8DCCF]/80 hover:border-[#C8A2FF]/60 transition-all duration-500 flex flex-col h-full relative backdrop-blur-xl"
    >
      <div className="relative h-80 overflow-hidden bg-gradient-to-br from-[#FFFDF9] via-[#F8F3EC] to-[#E8DCCF] transition-colors duration-500 flex items-center justify-center p-6">
        <Link to={`/product/${product.id}`} className="w-full h-full block">
          <motion.img 
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover rounded-xl drop-shadow-[0_18px_42px_rgba(72,53,34,0.18)]"
          />
        </Link>
        <div className="absolute top-5 right-5 space-y-3 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500">
          <button 
            onClick={handleWishlist}
            className="luxury-icon-button h-10 w-10 rounded-full"
          >
            <Heart size={18} className={isWishlisted ? "fill-[#C8A2FF] text-[#7d55bd] drop-shadow-[0_0_10px_rgba(200,162,255,0.55)]" : ""} strokeWidth={1.5} />
          </button>
        </div>
        <div className="absolute top-5 left-5 bg-white/70 backdrop-blur-md text-[#111111] text-[10px] uppercase tracking-widest font-black px-4 py-1.5 rounded-full border border-[#E8DCCF]">
          {product.category}
        </div>
      </div>
      
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center space-x-1 mb-3">
          <Star size={14} className="text-[#C8A2FF] fill-current drop-shadow-[0_0_8px_rgba(200,162,255,0.35)]" />
          <span className="text-xs font-bold text-[#4f4942]">{product.rating}</span>
          <span className="text-xs text-[#7a7168] font-medium">({product.reviews})</span>
        </div>
        <Link to={`/product/${product.id}`} className="block mb-2">
          <h3 className="text-xl font-bold text-[#111111] line-clamp-1 group-hover:text-[#7d55bd] transition-colors">{product.name}</h3>
        </Link>
        <p className="text-[#625b52] text-sm mb-6 line-clamp-2 flex-1 font-medium">{product.description}</p>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#E8DCCF]">
          <span className="text-2xl font-black text-[#111111] tracking-tight">
            ₹{Number(product.price || 0).toFixed(2)}
          </span>
          {cartQuantity > 0 ? (
            <div className="flex h-9 items-center rounded-lg border border-[#E8DCCF] bg-[#FFFDF9]">
              <button
                type="button"
                onClick={() => updateQuantity(product.id, cartQuantity - 1)}
                className="flex h-9 w-9 items-center justify-center text-[#7a7168] transition-colors hover:text-[#7d55bd]"
                aria-label={`Decrease ${product.name} quantity`}
              >
                <Minus size={15} />
              </button>
              <span className="w-8 text-center text-sm font-black text-[#111111]">{cartQuantity}</span>
              <button
                type="button"
                onClick={() => updateQuantity(product.id, cartQuantity + 1)}
                className="flex h-9 w-9 items-center justify-center text-[#7a7168] transition-colors hover:text-[#7d55bd]"
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
