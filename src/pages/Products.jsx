import { useState } from 'react';
import { motion } from 'framer-motion';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';

const Products = () => {
  const { products, allProducts, productsLoading, productsError, selectedCategory, setSelectedCategory } = useShop();
  const [sortBy, setSortBy] = useState('newest');
  
  const categories = ['All', ...Array.from(new Set(allProducts.map(product => product.category).filter(Boolean)))];

  const filteredProducts = products
    .filter(p => selectedCategory === 'All' ? true : p.category === selectedCategory)
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return 0; // newest default
    });

  const pageVariants = {
    initial: { opacity: 0 },
    in: { opacity: 1, transition: { duration: 0.4 } },
    out: { opacity: 0, transition: { duration: 0.4 } }
  };

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} className="container mx-auto px-6 py-12 text-[#111111]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/65 p-6 rounded-2xl shadow-[0_20px_60px_rgba(72,53,34,0.08)] border border-[#E8DCCF]/80 backdrop-blur-xl">
        <div className="flex items-center space-x-4 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          <SlidersHorizontal size={20} className="text-gray-500 hidden md:block" />
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`whitespace-nowrap rounded-full border px-5 py-2.5 text-xs font-black uppercase tracking-[0.16em] transition-all duration-300 ${
                selectedCategory === category 
                  ? 'border-[#C8A2FF]/60 bg-[#C8A2FF]/18 text-[#111111] shadow-[0_0_22px_rgba(200,162,255,0.18)]' 
                  : 'border-[#E8DCCF] bg-white/45 text-[#625b52] hover:border-[#C8A2FF]/60 hover:bg-[#C8A2FF]/10 hover:text-[#111111] hover:shadow-[0_0_18px_rgba(200,162,255,0.16)] hover:scale-105'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-3 text-sm border-t md:border-t-0 md:border-l border-[#E8DCCF] pt-4 md:pt-0 md:pl-6">
          <span className="text-[#7a7168] font-medium">Sort by:</span>
          <div className="relative group">
            <button className="flex items-center space-x-1 font-bold text-[#111111] group-hover:text-[#7d55bd] transition-colors">
              <span>{sortBy === 'newest' ? 'Newest' : sortBy === 'price-low' ? 'Price: Low to High' : 'Price: High to Low'}</span>
              <ChevronDown size={16} />
            </button>
            <div className="absolute right-0 top-full mt-2 w-48 bg-[#FFFDF9] border border-[#E8DCCF] rounded-xl shadow-[0_20px_60px_rgba(72,53,34,0.14)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10 overflow-hidden">
              <button onClick={() => setSortBy('newest')} className="block w-full text-left px-4 py-3 text-[#4f4942] hover:bg-[#F8F3EC] hover:text-[#7d55bd] font-medium transition-colors">Newest Arrivals</button>
              <button onClick={() => setSortBy('price-low')} className="block w-full text-left px-4 py-3 text-[#4f4942] hover:bg-[#F8F3EC] hover:text-[#7d55bd] font-medium transition-colors">Price: Low to High</button>
              <button onClick={() => setSortBy('price-high')} className="block w-full text-left px-4 py-3 text-[#4f4942] hover:bg-[#F8F3EC] hover:text-[#7d55bd] font-medium transition-colors">Price: High to Low</button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 mb-4">
        <p className="text-[#7a7168] font-medium tracking-wide">Showing <span className="font-bold text-[#111111]">{filteredProducts.length}</span> products</p>
      </div>

      {productsLoading ? (
        <div className="text-center py-32 bg-white/65 rounded-3xl border border-[#E8DCCF]">
          <h3 className="text-2xl font-bold text-[#111111] mb-2">Loading products...</h3>
          <p className="text-[#7a7168]">Fetching the latest Aura Maker collection.</p>
        </div>
      ) : productsError ? (
        <div className="text-center py-32 bg-white/65 rounded-3xl border border-[#E8DCCF]">
          <h3 className="text-2xl font-bold text-[#111111] mb-2">Could not load products</h3>
          <p className="text-[#7a7168]">{productsError}</p>
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-32 bg-white/65 rounded-3xl border border-[#E8DCCF]">
          <h3 className="text-2xl font-bold text-[#111111] mb-2">No products found</h3>
          <p className="text-[#7a7168]">Try changing your category or search term.</p>
          <button 
            onClick={() => setSelectedCategory('All')} 
            className="luxury-button luxury-button-primary mt-6 rounded-2xl border border-[#E8DCCF] px-6 py-3 text-xs font-black uppercase tracking-[0.18em] text-[#111111] transition-all hover:scale-105"
          >
            Clear Filters
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default Products;
