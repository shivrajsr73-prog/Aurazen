import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Clock } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useToast } from '../context/ToastContext';

const Contact = () => {
  const toast = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Message sent successfully. Our team will get back to you shortly.");
    e.target.reset();
  };

  const pageVariants = {
    initial: { opacity: 0 },
    in: { opacity: 1, transition: { duration: 0.4 } },
    out: { opacity: 0, transition: { duration: 0.4 } }
  };

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} className="container mx-auto px-6 py-12">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tighter uppercase">Get in Touch</h1>
        <p className="text-lg text-gray-400 font-medium">Have a question about an order, styling advice, or a general inquiry? Our dedicated team is here to assist you.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Contact Information */}
        <div className="space-y-12">
          <div className="bg-[#111111] p-8 rounded-3xl border border-[#1E1E1E]">
            <h2 className="text-2xl font-black text-white mb-8 tracking-tight uppercase">Contact Information</h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-[#0a0a0a] border border-[#1E1E1E] rounded-full flex items-center justify-center flex-shrink-0 text-white shadow-sm">
                  <MapPin size={20} />
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-bold text-white mb-1">Our Studio</h3>
                  <p className="text-gray-400 font-medium">123 Cyber Avenue<br />Neo Tokyo, NT 100-0001</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 bg-[#0a0a0a] border border-[#1E1E1E] rounded-full flex items-center justify-center flex-shrink-0 text-white shadow-sm">
                  <Mail size={20} />
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-bold text-white mb-1">Email</h3>
                  <p className="text-gray-400 font-medium">support@aurawear.com<br />press@aurawear.com</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 bg-[#0a0a0a] border border-[#1E1E1E] rounded-full flex items-center justify-center flex-shrink-0 text-white shadow-sm">
                  <Clock size={20} />
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-bold text-white mb-1">Business Hours</h3>
                  <p className="text-gray-400 font-medium">Monday - Friday: 9am - 6pm EST<br />Weekend: Closed</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div>
          <div className="bg-[#111111] p-10 rounded-3xl border border-[#1E1E1E]">
            <h2 className="text-2xl font-black text-white mb-8 tracking-tight uppercase">Send a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="First Name" placeholder="Jane" required />
                <Input label="Last Name" placeholder="Doe" required />
              </div>
              
              <Input label="Email Address" type="email" placeholder="jane@example.com" required />
              
              <Input label="Subject" placeholder="Order Inquiry" required />
              
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-1.5 uppercase tracking-wider">Message</label>
                <textarea 
                  placeholder="How can we help you?" 
                  required
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#1E1E1E] rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#00F3FF]/20 focus:border-[#00F3FF] transition-all duration-300 min-h-[150px] resize-y"
                ></textarea>
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
