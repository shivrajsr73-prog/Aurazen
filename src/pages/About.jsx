import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Globe, Sparkles, ShieldCheck, Users } from 'lucide-react';
import Button from '../components/ui/Button';

const About = () => {
  const navigate = useNavigate();
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0, transition: { duration: 0.45 } },
    out: { opacity: 0, y: -20, transition: { duration: 0.35 } }
  };

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} className="container mx-auto px-6 py-16 lg:py-24">
      <div className="grid gap-12 lg:grid-cols-2 items-center">
        <div className="space-y-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#00F3FF]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.3em] text-[#00F3FF]">
            About AuraZen
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white">
            We craft premium streetwear for the future of fashion.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-gray-400">
            AuraZen blends bold minimalism with elevated fabrics and modern silhouettes. Every collection is designed to deliver confidence, comfort, and a distinct edge for style-conscious shoppers.
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-4">
            <Button type="button" variant="primary" className="px-8 py-4" onClick={() => navigate('/products')}>
              Shop Collection
            </Button>
            <Button type="button" variant="secondary" className="px-8 py-4" onClick={() => navigate('/contact')}>
              Contact Us
            </Button>
          </div>
        </div>

        <div className="rounded-[2rem] border border-[#1E1E1E] bg-[#0c0c0c]/80 p-8 shadow-2xl shadow-[#00F3FF]/10">
          <div className="grid gap-6">
            <div className="rounded-3xl bg-[#111111] border border-[#1E1E1E] p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-[#00F3FF]/10 text-[#00F3FF] mb-6">
                <Sparkles size={24} />
              </div>
              <h2 className="text-xl font-bold text-white mb-3">Design-Forward Apparel</h2>
              <p className="text-gray-400 leading-7">
                Our collections bring premium cuts, futuristic hues, and elevated details to everyday essentials.
              </p>
            </div>

            <div className="rounded-3xl bg-[#111111] border border-[#1E1E1E] p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-[#B026FF]/10 text-[#B026FF] mb-6">
                <Globe size={24} />
              </div>
              <h2 className="text-xl font-bold text-white mb-3">Global Style Influence</h2>
              <p className="text-gray-400 leading-7">
                We scout the latest streetwear trends and reimagine them with a clean, ultra-modern aesthetic.
              </p>
            </div>

            <div className="rounded-3xl bg-[#111111] border border-[#1E1E1E] p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-[#00F3FF]/10 text-[#00F3FF] mb-6">
                <ShieldCheck size={24} />
              </div>
              <h2 className="text-xl font-bold text-white mb-3">Trusted Quality</h2>
              <p className="text-gray-400 leading-7">
                Each piece is crafted with care from premium materials, built to last, and designed for everyday luxury.
              </p>
            </div>

            <div className="rounded-3xl bg-[#111111] border border-[#1E1E1E] p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-[#B026FF]/10 text-[#B026FF] mb-6">
                <Users size={24} />
              </div>
              <h2 className="text-xl font-bold text-white mb-3">Community Inspired</h2>
              <p className="text-gray-400 leading-7">
                Our brand is shaped by the people who live it — bold, creative, and always pushing the culture forward.
              </p>
            </div>
          </div>
        </div>
      </div>

      <section className="mt-20 grid gap-12 lg:grid-cols-3">
        <div className="rounded-[2rem] bg-[#111111] border border-[#1E1E1E] p-10">
          <h3 className="text-lg font-semibold text-[#00F3FF] uppercase tracking-[0.3em] mb-4">Our Story</h3>
          <p className="text-gray-400 leading-7">
            Born from a love of minimal silhouettes and bold attitude, AuraZen launched to create wardrobe essentials with a premium, modern edge.
          </p>
        </div>

        <div className="rounded-[2rem] bg-[#111111] border border-[#1E1E1E] p-10">
          <h3 className="text-lg font-semibold text-[#B026FF] uppercase tracking-[0.3em] mb-4">Our Mission</h3>
          <p className="text-gray-400 leading-7">
            We empower every customer to feel elevated in their daily looks through thoughtfully designed streetwear and effortless essentials.
          </p>
        </div>

        <div className="rounded-[2rem] bg-[#111111] border border-[#1E1E1E] p-10">
          <h3 className="text-lg font-semibold text-white uppercase tracking-[0.3em] mb-4">Our Vision</h3>
          <p className="text-gray-400 leading-7">
            To be the go-to destination for modern streetwear that celebrates confidence, craftsmanship, and boundary-pushing design.
          </p>
        </div>
      </section>
    </motion.div>
  );
};

export default About;
