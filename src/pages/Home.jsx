import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Zap, Truck, Star, ArrowDown, User } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';
import Button from '../components/ui/Button';
import ThreeCanvas from '../components/ThreeCanvas';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { products } = useShop();
  const navigate = useNavigate();

  const pageVariants = {
    initial: { opacity: 0 },
    in: { opacity: 1, transition: { duration: 0.5 } },
    out: { opacity: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      className="w-full bg-[#0a0a0a]"
    >
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-[#0a0a0a]">

        {/* Animated Background Blobs */}
        <div className="absolute top-[-10%] right-[10%] w-[40%] h-[50%] bg-[#B026FF]/20 rounded-full blur-[150px] mix-blend-screen animate-blob pointer-events-none"></div>
        <div className="absolute bottom-[0%] left-[40%] w-[30%] h-[40%] bg-[#00F3FF]/15 rounded-full blur-[150px] mix-blend-screen animate-blob animation-delay-2000 pointer-events-none"></div>

        <div className="absolute inset-0 z-0">
          <ThreeCanvas />
        </div>

        {/* Subtle background gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent z-10 pointer-events-none"></div>

        <div className="container mx-auto px-6 relative z-20 pt-20 flex-1 flex flex-col justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-2xl lg:ml-12"
            >
              <div className="inline-flex items-center space-x-3 px-4 py-2 rounded-full border border-gray-800 mb-8 bg-[#0a0a0a]/50 backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-[#00F3FF] shadow-[0_0_8px_rgba(0,243,255,0.8)]"></span>
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white">New Season Drop</span>
              </div>

              <h1 className="text-[5.5rem] md:text-[7rem] lg:text-[8rem] font-black text-white mb-6 leading-[0.85] tracking-tighter uppercase">
                Redefine <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F3FF] to-[#B026FF]">Luxury.</span>
              </h1>

              <p className="text-lg text-gray-400 mb-10 max-w-md font-medium leading-relaxed">
                Premium oversized fits, minimalist aesthetics, and unparalleled luxury in modern streetwear. Experience the future of fashion.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Button
                  variant="glow"
                  className="px-8 py-4"
                  onClick={() => navigate('/products')}
                >
                  Shop Collection <ArrowRight className="ml-3" size={16} />
                </Button>
                <Button
                  variant="secondary"
                  className="px-8 py-4"
                  onClick={() => document.getElementById('trending').scrollIntoView({ behavior: 'smooth' })}
                >
                  Explore <ArrowDown className="ml-3" size={16} />
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Floating stats / badges */}
          <div className="mt-auto pt-40 pb-8 lg:px-12 z-20">
            <div className="bg-[#0f0f0f]/80 backdrop-blur-md border border-gray-800 rounded-2xl p-8 flex flex-wrap lg:flex-nowrap justify-between items-center gap-8 shadow-2xl relative z-20">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 flex items-center justify-center text-gray-400">
                  <User size={32} strokeWidth={1} />
                </div>
                <div>
                  <h4 className="text-2xl font-black text-white tracking-tight">50K+</h4>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Happy Clients</p>
                </div>
              </div>
              <div className="w-px h-12 bg-gray-800 hidden lg:block"></div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 flex items-center justify-center text-gray-400">
                  <span className="text-3xl">☁️</span>
                </div>
                <div>
                  <h4 className="text-2xl font-black text-white tracking-tight">100%</h4>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Premium Cotton</p>
                </div>
              </div>
              <div className="w-px h-12 bg-gray-800 hidden lg:block"></div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 flex items-center justify-center text-gray-400">
                  <Star size={32} strokeWidth={1} />
                </div>
                <div>
                  <h4 className="text-2xl font-black text-white tracking-tight flex items-center">
                    4.9 <Star size={14} className="fill-[#00F3FF] text-[#00F3FF] ml-2 drop-shadow-[0_0_5px_rgba(0,243,255,0.8)]" />
                  </h4>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Overall Rating</p>
                </div>
              </div>
              <div className="w-px h-12 bg-gray-800 hidden lg:block"></div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 flex items-center justify-center text-gray-400">
                  <span className="text-3xl">🌐</span>
                </div>
                <div>
                  <h4 className="text-2xl font-black text-white tracking-tight">WORLDWIDE</h4>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Shipping</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-[#0a0a0a] border-y border-[#1E1E1E]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: "Lightning Fast", desc: "Same-day delivery in select premium areas." },
              { icon: ShieldCheck, title: "Secure Checkout", desc: "Encrypted transactions for your peace of mind." },
              { icon: Truck, title: "Global Shipping", desc: "Delivering luxury streetwear worldwide." }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="flex items-center space-x-6 p-8 rounded-3xl bg-[#111111] hover:bg-[#181818] transition-colors duration-500 group border border-[#1E1E1E] hover:border-[#00F3FF]/50"
              >
                <div className="w-16 h-16 rounded-full bg-[#0a0a0a] flex items-center justify-center text-white border border-[#1E1E1E] group-hover:scale-110 transition-transform duration-500 group-hover:shadow-[0_0_20px_rgba(0,243,255,0.3)] group-hover:text-[#00F3FF] group-hover:border-[#00F3FF]/50">
                  <feature.icon size={28} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg mb-1 group-hover:text-[#00F3FF] transition-colors">{feature.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section id="trending" className="py-24 bg-[#0a0a0a] relative">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-5xl font-black text-white mb-4 tracking-tighter uppercase">Trending Now</h2>
              <p className="text-gray-400 text-lg font-medium">Discover our most sought-after minimal gear.</p>
            </div>
            <Button variant="ghost" className="hidden md:flex items-center group font-bold tracking-wider uppercase text-sm" onClick={() => navigate('/products')}>
              View All <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {products.slice(0, 3).map((product, idx) => (
              <motion.div key={product.id} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1, duration: 0.6 }}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>

          <div className="mt-16 text-center md:hidden">
            <Button variant="secondary" className="w-full py-4 font-bold tracking-wider uppercase text-sm" onClick={() => navigate('/products')}>
              View All Products
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-28 bg-[#111111] text-white text-center relative overflow-hidden border-t border-[#1E1E1E]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#111111] to-[#0a0a0a] z-0"></div>
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#B026FF]/10 rounded-full blur-[150px] z-0 pointer-events-none"></div>

        <div className="container mx-auto px-6 max-w-5xl relative z-10">
          <h2 className="text-4xl md:text-5xl font-black mb-16 tracking-tighter uppercase">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[
              { text: "The quality of these oversized hoodies is unmatched. True luxury streetwear without the crazy markup.", author: "James T.", role: "Fashion Blogger" },
              { text: "I've bought from many premium brands, but AuraZen's attention to detail and packaging is on another level.", author: "Sarah L.", role: "Verified Buyer" }
            ].map((test, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="bg-[#181818]/50 backdrop-blur-lg p-10 rounded-3xl text-left border border-[#1E1E1E] hover:border-[#00F3FF]/30 transition-colors duration-300 hover:shadow-[0_0_30px_rgba(0,243,255,0.05)]">
                <div className="flex text-[#00F3FF] mb-8 drop-shadow-[0_0_5px_rgba(0,243,255,0.8)]">
                  {[...Array(5)].map((_, i) => <Star key={i} size={20} className="fill-current" />)}
                </div>
                <p className="text-xl text-gray-200 mb-10 leading-relaxed font-light">"{test.text}"</p>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[#222222] rounded-full flex items-center justify-center font-bold text-lg text-[#00F3FF]">{test.author.charAt(0)}</div>
                  <div>
                    <p className="font-bold tracking-wide text-white">{test.author}</p>
                    <p className="text-gray-500 text-sm">{test.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default Home;
