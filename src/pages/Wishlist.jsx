import { motion } from 'framer-motion';
import { ShoppingBag, Heart } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

const Wishlist = () => {
  const { wishlist } = useShop();
  const navigate = useNavigate();

  const pageVariants = {
    initial: { opacity: 0 },
    in: { opacity: 1, transition: { duration: 0.4 } },
    out: { opacity: 0, transition: { duration: 0.4 } }
  };

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} className="container mx-auto px-6 py-12 text-[#111111]">
      <div className="flex items-center mb-10">
        <Heart className="text-[#7d55bd] mr-4" size={36} strokeWidth={2} />
        <h1 className="text-4xl font-black text-[#111111] tracking-tighter uppercase">Your Wishlist</h1>
      </div>

      {wishlist.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {wishlist.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-white/65 rounded-3xl border border-[#E8DCCF] shadow-[0_20px_60px_rgba(72,53,34,0.08)] backdrop-blur-xl">
          <div className="w-24 h-24 bg-[#F8F3EC] rounded-full flex items-center justify-center mb-6 border border-[#E8DCCF]">
            <Heart size={40} className="text-[#7a7168]" />
          </div>
          <h2 className="text-2xl font-bold text-[#111111] mb-4 tracking-tight">Your wishlist is empty</h2>
          <p className="text-[#7a7168] mb-8 max-w-md text-center">Save items you love to your wishlist. Review them anytime and easily move them to your cart.</p>
          <Button variant="primary" onClick={() => navigate('/products')} className="px-8 py-4">
            Discover Products
          </Button>
        </div>
      )}
    </motion.div>
  );
};

export default Wishlist;
