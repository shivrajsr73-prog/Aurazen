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
        .eq('customer_email', user.email)
        .order('created_at', { ascending: false });

      if (ordersError) {
        setError(ordersError.message);
        setOrders([]);
      } else {
        setOrders(data || []);
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
      <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center text-white">
        <Package size={44} className="mb-5 text-[#00F3FF]" strokeWidth={1.5} />
        <h1 className="text-3xl font-black uppercase tracking-tight mb-3">My Orders</h1>
        <p className="text-gray-400 max-w-md mb-8">Sign in with the same email used at checkout to view your order history.</p>
        <Link to="/login">
          <Button variant="primary">Sign In</Button>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} className="container mx-auto px-6 py-12">
      <div className="mb-10 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-white">My Orders</h1>
          <p className="mt-2 text-sm font-medium text-gray-500">{user.email}</p>
        </div>
        <Link to="/products">
          <Button variant="secondary" className="hidden sm:inline-flex">
            Shop More
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-[#1E1E1E] bg-[#111111] p-12 text-center text-gray-400">
          Loading orders...
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-12 text-center text-red-300">
          {error}
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-2xl border border-[#1E1E1E] bg-[#111111] p-12 text-center">
          <ShoppingBag size={42} className="mx-auto mb-5 text-gray-600" strokeWidth={1.5} />
          <h2 className="text-2xl font-bold text-white mb-2">No orders yet</h2>
          <p className="text-gray-500 mb-8">Your completed orders will appear here.</p>
          <Link to="/products">
            <Button variant="primary">Start Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => (
            <div key={order.id} className="rounded-2xl border border-[#1E1E1E] bg-[#111111] p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Order #{String(order.id).slice(0, 8)}</p>
                  <h2 className="mt-1 text-xl font-bold text-white">{order.status || 'Processing'}</h2>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-2xl font-black text-white">₹{Number(order.total_amount || 0).toFixed(2)}</p>
                  <p className="text-xs font-medium text-gray-500">
                    {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'Recent order'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Orders;
