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
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} className="container mx-auto px-6 py-12">
      <div className="flex items-center mb-10">
        <Heart className="text-white mr-4" size={36} strokeWidth={2} />
        <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Your Wishlist</h1>
      </div>

      {wishlist.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {wishlist.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-[#111111] rounded-3xl border border-[#1E1E1E]">
          <div className="w-24 h-24 bg-[#0a0a0a] rounded-full flex items-center justify-center mb-6 border border-[#1E1E1E]">
            <Heart size={40} className="text-gray-600" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4 tracking-tight">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-8 max-w-md text-center">Save items you love to your wishlist. Review them anytime and easily move them to your cart.</p>
          <Button variant="primary" onClick={() => navigate('/products')} className="px-8 py-4">
            Discover Products
          </Button>
        </div>
      )}
    </motion.div>
  );
};

export default Wishlist;
