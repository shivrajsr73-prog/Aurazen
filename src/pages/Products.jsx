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
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} className="container mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#111111] p-6 rounded-2xl shadow-sm border border-[#1E1E1E]">
        <div className="flex items-center space-x-4 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          <SlidersHorizontal size={20} className="text-gray-500 hidden md:block" />
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`whitespace-nowrap rounded-full border px-5 py-2.5 text-xs font-black uppercase tracking-[0.16em] transition-all duration-300 ${
                selectedCategory === category 
                  ? 'border-[#00F3FF]/60 bg-[#00F3FF]/15 text-white shadow-[0_0_22px_rgba(0,243,255,0.24)]' 
                  : 'border-white/5 bg-white/[0.03] text-gray-400 hover:border-[#B026FF]/60 hover:bg-[#B026FF]/10 hover:text-white hover:shadow-[0_0_18px_rgba(176,38,255,0.18)] hover:scale-105'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-3 text-sm border-t md:border-t-0 md:border-l border-[#1E1E1E] pt-4 md:pt-0 md:pl-6">
          <span className="text-gray-500 font-medium">Sort by:</span>
          <div className="relative group">
            <button className="flex items-center space-x-1 font-bold text-white group-hover:text-[#00F3FF] transition-colors">
              <span>{sortBy === 'newest' ? 'Newest' : sortBy === 'price-low' ? 'Price: Low to High' : 'Price: High to Low'}</span>
              <ChevronDown size={16} />
            </button>
            <div className="absolute right-0 top-full mt-2 w-48 bg-[#111111] border border-[#1E1E1E] rounded-xl shadow-[0_4px_30px_rgba(0,0,0,0.8)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10 overflow-hidden">
              <button onClick={() => setSortBy('newest')} className="block w-full text-left px-4 py-3 text-gray-300 hover:bg-[#181818] hover:text-[#00F3FF] font-medium transition-colors">Newest Arrivals</button>
              <button onClick={() => setSortBy('price-low')} className="block w-full text-left px-4 py-3 text-gray-300 hover:bg-[#181818] hover:text-[#00F3FF] font-medium transition-colors">Price: Low to High</button>
              <button onClick={() => setSortBy('price-high')} className="block w-full text-left px-4 py-3 text-gray-300 hover:bg-[#181818] hover:text-[#00F3FF] font-medium transition-colors">Price: High to Low</button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 mb-4">
        <p className="text-gray-500 font-medium tracking-wide">Showing <span className="font-bold text-white">{filteredProducts.length}</span> products</p>
      </div>

      {productsLoading ? (
        <div className="text-center py-32 bg-[#111111] rounded-3xl border border-[#1E1E1E]">
          <h3 className="text-2xl font-bold text-white mb-2">Loading products...</h3>
          <p className="text-gray-500">Fetching the latest AuraZen collection.</p>
        </div>
      ) : productsError ? (
        <div className="text-center py-32 bg-[#111111] rounded-3xl border border-[#1E1E1E]">
          <h3 className="text-2xl font-bold text-white mb-2">Could not load products</h3>
          <p className="text-gray-500">{productsError}</p>
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-32 bg-[#111111] rounded-3xl border border-[#1E1E1E]">
          <h3 className="text-2xl font-bold text-white mb-2">No products found</h3>
          <p className="text-gray-500">Try changing your category or search term.</p>
          <button 
            onClick={() => setSelectedCategory('All')} 
            className="luxury-button luxury-button-primary mt-6 rounded-2xl border border-white/70 px-6 py-3 text-xs font-black uppercase tracking-[0.18em] text-black transition-all hover:scale-105"
          >
            Clear Filters
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default Products;
