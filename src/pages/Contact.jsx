import { motion } from 'framer-motion';
import { Mail, MapPin, Clock } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useToast } from '../context/ToastContext';

const Contact = () => {
  const toast = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Message sent successfully. Our team will get back to you shortly.');
    e.target.reset();
  };

  const pageVariants = {
    initial: { opacity: 0 },
    in: { opacity: 1, transition: { duration: 0.4 } },
    out: { opacity: 0, transition: { duration: 0.4 } }
  };

  const info = [
    { icon: MapPin, title: 'Our Studio', text: <>123 Cream Avenue<br />Neo Tokyo, NT 100-0001</> },
    { icon: Mail, title: 'Email', text: <>support@auramaker.com<br />press@auramaker.com</> },
    { icon: Clock, title: 'Business Hours', text: <>Monday - Friday: 9am - 6pm EST<br />Weekend: Closed</> },
  ];

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} className="container mx-auto px-6 py-12 text-[#111111]">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-black text-[#111111] mb-6 tracking-tighter uppercase">Get in Touch</h1>
        <p className="text-lg text-[#625b52] font-medium">Have a question about an order, styling advice, or a general inquiry? Our dedicated team is here to assist you.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="space-y-12">
          <div className="bg-white/65 p-8 rounded-3xl border border-[#E8DCCF] shadow-[0_24px_80px_rgba(72,53,34,0.08)] backdrop-blur-xl">
            <h2 className="text-2xl font-black text-[#111111] mb-8 tracking-tight uppercase">Contact Information</h2>
            <div className="space-y-6">
              {info.map((item) => (
                <div key={item.title} className="flex items-start">
                  <div className="w-12 h-12 bg-[#F8F3EC] border border-[#E8DCCF] rounded-full flex items-center justify-center flex-shrink-0 text-[#7d55bd] shadow-sm">
                    <item.icon size={20} />
                  </div>
                  <div className="ml-5">
                    <h3 className="text-lg font-bold text-[#111111] mb-1">{item.title}</h3>
                    <p className="text-[#625b52] font-medium">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white/65 p-10 rounded-3xl border border-[#E8DCCF] shadow-[0_24px_80px_rgba(72,53,34,0.08)] backdrop-blur-xl">
            <h2 className="text-2xl font-black text-[#111111] mb-8 tracking-tight uppercase">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="First Name" placeholder="Jane" required />
                <Input label="Last Name" placeholder="Doe" required />
              </div>
              <Input label="Email Address" type="email" placeholder="jane@example.com" required />
              <Input label="Subject" placeholder="Order Inquiry" required />
              <div>
                <label className="block text-sm font-bold text-[#4f4942] mb-1.5 uppercase tracking-wider">Message</label>
                <textarea
                  placeholder="How can we help you?"
                  required
                  className="w-full px-4 py-3 bg-white/60 border border-[#E8DCCF] rounded-lg text-[#111111] placeholder-[#8c8278] focus:outline-none focus:ring-2 focus:ring-[#C8A2FF]/25 focus:border-[#C8A2FF] transition-all duration-300 min-h-[150px] resize-y"
                />
              </div>
              <Button type="submit" variant="primary" className="w-full py-4 mt-4">
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Contact;
