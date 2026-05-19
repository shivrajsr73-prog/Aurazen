import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Zap, Truck, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';
import Button from '../components/ui/Button';
import HeroBannerSlider from '../components/HeroBannerSlider';

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
      className="w-full bg-[#F8F3EC] text-[#111111]"
    >
      {/* ── Hero Banner Slider ── */}
      <HeroBannerSlider />

      <section className="py-28 bg-[#FFFDF9] border-y border-[#E8DCCF]/70">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: 'Lightning Fast', desc: 'Same-day delivery in select premium areas.' },
              { icon: ShieldCheck, title: 'Secure Checkout', desc: 'Encrypted transactions for your peace of mind.' },
              { icon: Truck, title: 'Global Shipping', desc: 'Delivering luxury streetwear worldwide.' }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="flex items-center space-x-6 p-8 rounded-3xl bg-white/65 hover:bg-white/90 transition-all duration-500 group border border-[#E8DCCF]/80 hover:border-[#C8A2FF]/60 shadow-[0_24px_80px_rgba(72,53,34,0.08)] backdrop-blur-xl"
              >
                <div className="w-16 h-16 rounded-full bg-[#F8F3EC] flex items-center justify-center text-[#111111] border border-[#E8DCCF] group-hover:scale-110 transition-transform duration-500 group-hover:shadow-[0_0_26px_rgba(200,162,255,0.28)] group-hover:text-[#7d55bd] group-hover:border-[#C8A2FF]/60">
                  <feature.icon size={28} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-[#111111] font-bold text-lg mb-1 group-hover:text-[#7d55bd] transition-colors">{feature.title}</h3>
                  <p className="text-[#625b52] text-sm leading-relaxed">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="trending" className="py-28 bg-[#F8F3EC] relative">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-5xl font-black text-[#111111] mb-4 tracking-tighter uppercase">Trending Now</h2>
              <p className="text-[#625b52] text-lg font-medium">Discover our most sought-after minimal gear.</p>
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

      <section className="py-28 bg-[#FFFDF9] text-[#111111] text-center relative overflow-hidden border-t border-[#E8DCCF]/70">
        <div className="absolute inset-0 bg-gradient-to-b from-[#FFFDF9] to-[#F8F3EC] z-0" />
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#C8A2FF]/15 rounded-full blur-[150px] z-0 pointer-events-none" />

        <div className="container mx-auto px-6 max-w-5xl relative z-10">
          <h2 className="text-4xl md:text-5xl font-black mb-16 tracking-tighter uppercase">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[
              { text: 'The quality of these oversized hoodies is unmatched. True luxury streetwear without the crazy markup.', author: 'James T.', role: 'Fashion Blogger' },
              { text: "I've bought from many premium brands, but Aura Maker's attention to detail and packaging is on another level.", author: 'Sarah L.', role: 'Verified Buyer' }
            ].map((test, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="bg-white/60 backdrop-blur-xl p-10 rounded-3xl text-left border border-[#E8DCCF]/80 hover:border-[#C8A2FF]/50 transition-all duration-300 hover:shadow-[0_24px_70px_rgba(200,162,255,0.14)]">
                <div className="flex text-[#C8A2FF] mb-8 drop-shadow-[0_0_10px_rgba(200,162,255,0.32)]">
                  {[...Array(5)].map((_, i) => <Star key={i} size={20} className="fill-current" />)}
                </div>
                <p className="text-xl text-[#332f2a] mb-10 leading-relaxed font-light">"{test.text}"</p>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[#F8F3EC] rounded-full flex items-center justify-center font-bold text-lg text-[#7d55bd] border border-[#E8DCCF]">{test.author.charAt(0)}</div>
                  <div>
                    <p className="font-bold tracking-wide text-[#111111]">{test.author}</p>
                    <p className="text-[#625b52] text-sm">{test.role}</p>
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
