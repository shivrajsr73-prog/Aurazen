import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Heart, ShieldCheck, Truck, RotateCcw, Star, Zap } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/ui/Button';
import AnimatedAddToCartButton from '../components/AnimatedAddToCartButton';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState('M');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { allProducts, productsLoading, addToCart, wishlist, toggleWishlist } = useShop();
  const toast = useToast();

  const product = allProducts.find(p => String(p.id) === id);
  const isWishlisted = product ? wishlist.some(item => item.id === product.id) : false;
  const productImages = product?.productImages?.length ? product.productImages : [product?.image].filter(Boolean);
  const activeImage = productImages[activeImageIndex] || productImages[0] || '';
  const hasMultipleImages = productImages.length > 1;

  const showPreviousImage = () => {
    setActiveImageIndex((currentIndex) =>
      currentIndex === 0 ? productImages.length - 1 : currentIndex - 1
    );
  };

  const showNextImage = () => {
    setActiveImageIndex((currentIndex) =>
      currentIndex === productImages.length - 1 ? 0 : currentIndex + 1
    );
  };

  if (productsLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-white">
        <h2 className="text-3xl font-bold mb-4">Loading Product...</h2>
        <p className="text-gray-400">Fetching the latest product details.</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-white">
        <h2 className="text-3xl font-bold mb-4">Product Not Found</h2>
        <Link to="/products" className="text-gray-400 hover:text-white underline">Return to Shop</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({ ...product, size: selectedSize });
    toast.success(`Added ${product.name} to cart`);
  };

  const handleBuyNow = () => {
    addToCart({ ...product, size: selectedSize });
    navigate('/checkout');
  };

  const pageVariants = {
    initial: { opacity: 0 },
    in: { opacity: 1, transition: { duration: 0.4 } },
    out: { opacity: 0, transition: { duration: 0.4 } }
  };

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} className="container mx-auto px-6 py-12">
      <div className="mb-8">
        <div className="flex items-center text-sm text-gray-500 space-x-2 font-medium">
          <Link to="/" className="hover:text-[#00F3FF] transition-colors">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-[#00F3FF] transition-colors">Products</Link>
          <span>/</span>
          <span className="text-white">{product.name}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Product Image */}
        <div className="relative aspect-square bg-[#111111] rounded-3xl overflow-hidden border border-[#1E1E1E] flex items-center justify-center">
          <motion.img 
            key={activeImage}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            src={activeImage} 
            alt={product.name} 
            className="w-full h-full object-cover mix-blend-screen opacity-90 p-8"
          />
          <div className="absolute top-6 left-6 bg-[#0a0a0a]/90 text-white text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full border border-[#1E1E1E] z-10">
            {product.category}
          </div>

          {hasMultipleImages && (
            <>
              <button
                type="button"
                onClick={showPreviousImage}
                aria-label="Previous product image"
                className="absolute left-5 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/65 text-white backdrop-blur-md transition-all hover:border-[#00F3FF] hover:bg-[#00F3FF] hover:text-black"
              >
                <ChevronLeft size={24} strokeWidth={2.5} />
              </button>
              <button
                type="button"
                onClick={showNextImage}
                aria-label="Next product image"
                className="absolute right-5 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/65 text-white backdrop-blur-md transition-all hover:border-[#00F3FF] hover:bg-[#00F3FF] hover:text-black"
              >
                <ChevronRight size={24} strokeWidth={2.5} />
              </button>
              <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-black/60 px-3 py-2 backdrop-blur-md">
                {productImages.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setActiveImageIndex(index)}
                    aria-label={`Show product image ${index + 1}`}
                    className={`h-2.5 rounded-full transition-all ${
                      activeImageIndex === index ? 'w-8 bg-[#00F3FF]' : 'w-2.5 bg-white/40 hover:bg-white'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-center">
          <div className="flex items-center space-x-2 mb-4">
            <div className="flex text-[#00F3FF] drop-shadow-[0_0_8px_rgba(0,243,255,0.6)]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} className="fill-current" />
              ))}
            </div>
            <span className="text-white font-bold">{product.rating}</span>
            <span className="text-gray-500 font-medium text-sm">({product.reviews} Reviews)</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight leading-tight">{product.name}</h1>
          
          <div className="text-3xl font-black text-white mb-8 tracking-tighter">
            ₹{Number(product.price || 0).toFixed(2)}
          </div>

          <p className="text-gray-400 text-lg mb-10 leading-relaxed font-light">
            {product.description}
            <br/><br/>
            Crafted with premium materials and designed for the modern aesthetic. This piece features an oversized drop-shoulder fit, heavyweight cotton construction, and minimal branding.
          </p>

          {/* Sizing */}
          <div className="mb-10">
            <div className="flex justify-between items-end mb-3">
              <h3 className="text-white font-bold uppercase tracking-wider text-sm">Select Size</h3>
              <button className="text-gray-500 hover:text-[#00F3FF] text-sm font-medium underline underline-offset-4 transition-colors">Size Guide</button>
            </div>
            <div className="flex flex-wrap gap-3">
              {['S', 'M', 'L', 'XL'].map(size => (
                <button 
                  key={size} 
                  onClick={() => setSelectedSize(size)}
                  className={`w-14 h-14 rounded-xl border-2 font-bold transition-all flex items-center justify-center ${
                    selectedSize === size 
                      ? 'border-[#00F3FF] bg-[#00F3FF]/10 text-[#00F3FF] shadow-[0_0_15px_rgba(0,243,255,0.4)]' 
                      : 'border-[#333] text-white hover:border-[#00F3FF] hover:bg-[#181818] shadow-[0_0_0_rgba(0,243,255,0)] hover:shadow-[0_0_10px_rgba(0,243,255,0.3)]'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="flex space-x-4 mb-12">
            <div className="flex-1">
              <AnimatedAddToCartButton onClick={handleAddToCart} />
            </div>
            <motion.div whileTap={{ scale: 0.9, rotate: 2 }} className="flex-1">
              <Button variant="primary" className="w-full py-5 text-lg shadow-[0_0_15px_rgba(0,243,255,0.1)] hover:shadow-[0_0_20px_rgba(0,243,255,0.4)] bg-[#00F3FF] text-black font-black" onClick={handleBuyNow}>
                <Zap className="mr-2 inline-block" size={22} /> Buy Now
              </Button>
            </motion.div>
            <Button 
              variant="secondary" 
              className="w-16 flex items-center justify-center !px-0 bg-[#111111] border-[#333] hover:border-[#B026FF]"
              onClick={() => toggleWishlist(product)}
            >
              <Heart size={22} className={isWishlisted ? "fill-[#B026FF] text-[#B026FF] drop-shadow-[0_0_8px_rgba(176,38,255,0.8)]" : ""} />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-8 border-t border-[#1E1E1E]">
            <div className="flex items-center text-gray-400">
              <Truck size={20} className="mr-3 text-gray-200" />
              <span className="text-sm font-medium">Free Global Shipping over ₹200</span>
            </div>
            <div className="flex items-center text-gray-400">
              <RotateCcw size={20} className="mr-3 text-gray-200" />
              <span className="text-sm font-medium">7 Days Return</span>
            </div>
            <div className="flex items-center text-gray-400 md:col-span-2">
              <ShieldCheck size={20} className="mr-3 text-gray-200" />
              <span className="text-sm font-medium">Authenticity Guaranteed.</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductDetails;
