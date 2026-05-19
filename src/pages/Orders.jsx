import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, ShoppingBag } from 'lucide-react';
import Button from '../components/ui/Button';
import { useShop } from '../context/ShopContext';
import { supabase } from '../supabase';

const Orders = () => {
  const { user } = useShop();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.email) return;

      setIsLoading(true);
      setError('');

      const { data, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (ordersError) {
        setError(ordersError.message);
        setOrders([]);
      } else {
        const filtered = (data || []).filter(o => 
          o.customer_email?.toLowerCase().trim() === user.email.toLowerCase().trim()
        );
        setOrders(filtered);
      }

      setIsLoading(false);
    };

    fetchOrders();
  }, [user?.email]);

  const pageVariants = {
    initial: { opacity: 0 },
    in: { opacity: 1, transition: { duration: 0.4 } },
    out: { opacity: 0, transition: { duration: 0.4 } }
  };

  if (!user?.email) {
    return (
      <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center text-[#111111]">
        <Package size={44} className="mb-5 text-[#7d55bd]" strokeWidth={1.5} />
        <h1 className="text-3xl font-black uppercase tracking-tight mb-3">My Orders</h1>
        <p className="text-[#625b52] max-w-md mb-8">Sign in with the same email used at checkout to view your order history.</p>
        <Link to="/login">
          <Button variant="primary">Sign In</Button>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} className="container mx-auto px-6 py-12 text-[#111111]">
      <div className="mb-10 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-[#111111]">My Orders</h1>
          <p className="mt-2 text-sm font-medium text-[#7a7168]">{user.email}</p>
        </div>
        <Link to="/products">
          <Button variant="secondary" className="hidden sm:inline-flex">
            Shop More
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-[#E8DCCF] bg-white/65 p-12 text-center text-[#625b52]">
          Loading orders...
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-12 text-center text-red-300">
          {error}
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-2xl border border-[#E8DCCF] bg-white/65 p-12 text-center shadow-[0_20px_60px_rgba(72,53,34,0.08)] backdrop-blur-xl">
          <ShoppingBag size={42} className="mx-auto mb-5 text-[#7a7168]" strokeWidth={1.5} />
          <h2 className="text-2xl font-bold text-[#111111] mb-2">No orders yet</h2>
          <p className="text-[#7a7168] mb-8">Your completed orders will appear here.</p>
          <Link to="/products">
            <Button variant="primary">Start Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => (
            <Link 
              key={order.id} 
              to={`/order/${order.id}`}
              className="block rounded-2xl border border-[#E8DCCF] bg-white/65 p-6 shadow-[0_18px_50px_rgba(72,53,34,0.08)] backdrop-blur-xl transition-all hover:bg-white/80 hover:shadow-[0_24px_60px_rgba(72,53,34,0.12)] hover:-translate-y-1"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-[#C8A2FF]/10 p-3 rounded-xl text-[#7d55bd] hidden sm:block">
                    <Package size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-[#7a7168]">Order #{String(order.id).slice(0, 8)}</p>
                    <h2 className="mt-1 text-xl font-bold text-[#111111]">
                      {order.status || 'Processing'}
                      {order.status === 'Cancelled' && <span className="ml-2 text-[10px] text-red-500 bg-red-100 px-2 py-0.5 rounded-full uppercase font-bold align-middle">Cancelled</span>}
                    </h2>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-6 text-left sm:text-right w-full sm:w-auto">
                  <div>
                    <p className="text-2xl font-black text-[#111111]">₹{Number(order.total_amount || 0).toFixed(2)}</p>
                    <p className="text-xs font-medium text-[#7a7168]">
                      {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'Recent order'}
                    </p>
                  </div>
                  <div className="text-[#7a7168] bg-white/50 p-2 rounded-full border border-[#E8DCCF]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Orders;
