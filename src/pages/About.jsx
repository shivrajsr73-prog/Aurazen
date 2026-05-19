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

  const values = [
    { icon: Sparkles, title: 'Design-Forward Apparel', desc: 'Premium cuts, soft futuristic finishes, and elevated details for everyday essentials.', tone: 'cyan' },
    { icon: Globe, title: 'Global Style Influence', desc: 'Streetwear references reimagined with a clean, ultra-modern luxury aesthetic.', tone: 'purple' },
    { icon: ShieldCheck, title: 'Trusted Quality', desc: 'Each piece is crafted with care from premium materials, built to last and move easily.', tone: 'cyan' },
    { icon: Users, title: 'Community Inspired', desc: 'Our brand is shaped by people who live with confidence, creativity, and restraint.', tone: 'purple' },
  ];

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} className="container mx-auto px-6 py-16 lg:py-24 text-[#111111]">
      <div className="grid gap-12 lg:grid-cols-2 items-center">
        <div className="space-y-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/65 border border-[#E8DCCF] px-4 py-2 text-xs font-bold uppercase tracking-[0.3em] text-[#7d55bd] shadow-[0_16px_44px_rgba(72,53,34,0.08)]">
            About Aura Maker
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-[#111111]">
            We craft premium streetwear for the brighter future of fashion.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-[#625b52]">
            Aura Maker blends bold minimalism with elevated fabrics, warm cream tones, and modern silhouettes. Every collection is designed to feel confident, clean, and quietly futuristic.
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

        <div className="rounded-[2rem] border border-[#E8DCCF] bg-white/50 p-8 shadow-[0_28px_90px_rgba(72,53,34,0.1)] backdrop-blur-xl">
          <div className="grid gap-6">
            {values.map((item) => (
              <div key={item.title} className="rounded-3xl bg-[#FFFDF9]/75 border border-[#E8DCCF] p-8">
                <div className={`flex h-12 w-12 items-center justify-center rounded-3xl mb-6 ${item.tone === 'cyan' ? 'bg-[#8BE9FD]/18 text-[#168aa0]' : 'bg-[#C8A2FF]/18 text-[#7d55bd]'}`}>
                  <item.icon size={24} />
                </div>
                <h2 className="text-xl font-bold text-[#111111] mb-3">{item.title}</h2>
                <p className="text-[#625b52] leading-7">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="mt-20 grid gap-12 lg:grid-cols-3">
        {[
          { title: 'Our Story', color: 'text-[#168aa0]', copy: 'Born from a love of minimal silhouettes and restrained attitude, Aura Maker creates wardrobe essentials with a premium, modern edge.' },
          { title: 'Our Mission', color: 'text-[#7d55bd]', copy: 'We empower every customer to feel elevated in their daily looks through thoughtfully designed streetwear and effortless essentials.' },
          { title: 'Our Vision', color: 'text-[#111111]', copy: 'To be the go-to destination for modern streetwear that celebrates confidence, craftsmanship, and boundary-pushing design.' },
        ].map((item) => (
          <div key={item.title} className="rounded-[2rem] bg-white/65 border border-[#E8DCCF] p-10 shadow-[0_20px_60px_rgba(72,53,34,0.08)] backdrop-blur-xl">
            <h3 className={`text-lg font-semibold ${item.color} uppercase tracking-[0.3em] mb-4`}>{item.title}</h3>
            <p className="text-[#625b52] leading-7">{item.copy}</p>
          </div>
        ))}
      </section>
    </motion.div>
  );
};

export default About;
