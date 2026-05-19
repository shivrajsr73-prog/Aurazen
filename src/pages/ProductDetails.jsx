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
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-[#111111]">
        <h2 className="text-3xl font-bold mb-4">Loading Product...</h2>
        <p className="text-[#625b52]">Fetching the latest product details.</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-[#111111]">
        <h2 className="text-3xl font-bold mb-4">Product Not Found</h2>
        <Link to="/products" className="text-[#625b52] hover:text-[#7d55bd] underline">Return to Shop</Link>
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
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} className="container mx-auto px-6 py-12 text-[#111111]">
      <div className="mb-8">
        <div className="flex items-center text-sm text-[#7a7168] space-x-2 font-medium">
          <Link to="/" className="hover:text-[#7d55bd] transition-colors">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-[#7d55bd] transition-colors">Products</Link>
          <span>/</span>
          <span className="text-[#111111]">{product.name}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Product Image */}
        <div className="relative aspect-square bg-gradient-to-br from-[#FFFDF9] via-[#F8F3EC] to-[#E8DCCF] rounded-3xl overflow-hidden border border-[#E8DCCF] flex items-center justify-center shadow-[0_28px_90px_rgba(72,53,34,0.1)]">
          <motion.img 
            key={activeImage}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            src={activeImage} 
            alt={product.name} 
            className="w-full h-full object-cover p-8 drop-shadow-[0_22px_52px_rgba(72,53,34,0.16)]"
          />
          <div className="absolute top-6 left-6 bg-white/70 text-[#111111] text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full border border-[#E8DCCF] z-10 backdrop-blur-md">
            {product.category}
          </div>

          {hasMultipleImages && (
            <>
              <button
                type="button"
                onClick={showPreviousImage}
                aria-label="Previous product image"
                className="absolute left-5 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-[#E8DCCF] bg-white/65 text-[#111111] backdrop-blur-md transition-all hover:border-[#C8A2FF] hover:bg-[#C8A2FF]/25"
              >
                <ChevronLeft size={24} strokeWidth={2.5} />
              </button>
              <button
                type="button"
                onClick={showNextImage}
                aria-label="Next product image"
                className="absolute right-5 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-[#E8DCCF] bg-white/65 text-[#111111] backdrop-blur-md transition-all hover:border-[#C8A2FF] hover:bg-[#C8A2FF]/25"
              >
                <ChevronRight size={24} strokeWidth={2.5} />
              </button>
              <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full border border-[#E8DCCF] bg-white/65 px-3 py-2 backdrop-blur-md">
                {productImages.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setActiveImageIndex(index)}
                    aria-label={`Show product image ${index + 1}`}
                    className={`h-2.5 rounded-full transition-all ${
                      activeImageIndex === index ? 'w-8 bg-[#C8A2FF]' : 'w-2.5 bg-[#d8c8b9] hover:bg-[#8BE9FD]'
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
            <div className="flex text-[#C8A2FF] drop-shadow-[0_0_10px_rgba(200,162,255,0.32)]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} className="fill-current" />
              ))}
            </div>
            <span className="text-[#111111] font-bold">{product.rating}</span>
            <span className="text-[#7a7168] font-medium text-sm">({product.reviews} Reviews)</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-[#111111] mb-6 tracking-tight leading-tight">{product.name}</h1>
          
          <div className="text-3xl font-black text-[#111111] mb-8 tracking-tighter">
            ₹{Number(product.price || 0).toFixed(2)}
          </div>

          <p className="text-[#625b52] text-lg mb-10 leading-relaxed font-light">
            {product.description}
            <br/><br/>
            Crafted with premium materials and designed for the modern aesthetic. This piece features an oversized drop-shoulder fit, heavyweight cotton construction, and minimal branding.
          </p>

          {/* Sizing */}
          <div className="mb-10">
            <div className="flex justify-between items-end mb-3">
              <h3 className="text-[#111111] font-bold uppercase tracking-wider text-sm">Select Size</h3>
              <button className="text-[#7a7168] hover:text-[#7d55bd] text-sm font-medium underline underline-offset-4 transition-colors">Size Guide</button>
            </div>
            <div className="flex flex-wrap gap-3">
              {['S', 'M', 'L', 'XL'].map(size => (
                <button 
                  key={size} 
                  onClick={() => setSelectedSize(size)}
                  className={`w-14 h-14 rounded-xl border-2 font-bold transition-all flex items-center justify-center ${
                    selectedSize === size 
                      ? 'border-[#C8A2FF] bg-[#C8A2FF]/15 text-[#7d55bd] shadow-[0_0_18px_rgba(200,162,255,0.28)]' 
                      : 'border-[#E8DCCF] text-[#111111] hover:border-[#C8A2FF] hover:bg-white/60 shadow-[0_0_0_rgba(200,162,255,0)] hover:shadow-[0_0_14px_rgba(200,162,255,0.18)]'
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
              <Button variant="primary" className="w-full py-5 text-lg font-black" onClick={handleBuyNow}>
                <Zap className="mr-2 inline-block" size={22} /> Buy Now
              </Button>
            </motion.div>
            <Button 
              variant="secondary" 
              className="w-16 flex items-center justify-center !px-0"
              onClick={() => toggleWishlist(product)}
            >
              <Heart size={22} className={isWishlisted ? "fill-[#C8A2FF] text-[#7d55bd] drop-shadow-[0_0_10px_rgba(200,162,255,0.55)]" : ""} />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-8 border-t border-[#E8DCCF]">
            <div className="flex items-center text-[#625b52]">
              <Truck size={20} className="mr-3 text-[#111111]" />
              <span className="text-sm font-medium">Free Global Shipping over ₹200</span>
            </div>
            <div className="flex items-center text-[#625b52]">
              <RotateCcw size={20} className="mr-3 text-[#111111]" />
              <span className="text-sm font-medium">7 Days Return</span>
            </div>
            <div className="flex items-center text-[#625b52] md:col-span-2">
              <ShieldCheck size={20} className="mr-3 text-[#111111]" />
              <span className="text-sm font-medium">Authenticity Guaranteed.</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductDetails;
