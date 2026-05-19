import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, ArrowLeft, XCircle, AlertTriangle, X } from 'lucide-react';
import Button from '../components/ui/Button';
import { supabase } from '../supabase';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      setIsLoading(true);
      const { data, error } = await supabase.from('orders').select('*').eq('id', id).single();
      
      if (error) {
        setError('Could not find this order.');
      } else {
        setOrder(data);
      }
      setIsLoading(false);
    };

    if (id) fetchOrder();
  }, [id]);

  const handleCancelOrder = async () => {
    if (!cancelReason) {
      alert("Please select a reason for cancellation.");
      return;
    }

    setIsCancelling(true);
    try {
      // Update order status to Cancelled. 
      // A complete system might also store the cancelReason somewhere.
      const { error } = await supabase.from('orders').update({ status: 'Cancelled' }).eq('id', id);
      if (error) throw error;
      
      setOrder({ ...order, status: 'Cancelled' });
      setShowCancelModal(false);
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert("Failed to cancel order.");
    } finally {
      setIsCancelling(false);
    }
  };

  const pageVariants = {
    initial: { opacity: 0 },
    in: { opacity: 1, transition: { duration: 0.4 } },
    out: { opacity: 0, transition: { duration: 0.4 } }
  };

  if (isLoading) {
    return <div className="min-h-[70vh] flex items-center justify-center text-[#625b52]">Loading order details...</div>;
  }

  if (error || !order) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-[#111111] px-6 text-center">
        <AlertTriangle size={48} className="text-red-500 mb-4" />
        <h2 className="text-2xl font-black mb-4">Order Not Found</h2>
        <p className="text-[#625b52] mb-8">{error}</p>
        <Link to="/orders"><Button variant="primary">Back to Orders</Button></Link>
      </div>
    );
  }

  const canCancel = ['Pending', 'Processing'].includes(order.status);

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} className="container mx-auto px-6 py-12 text-[#111111] max-w-4xl">
      <Link to="/orders" className="inline-flex items-center gap-2 text-sm font-bold text-[#7a7168] hover:text-[#111111] transition-colors mb-8">
        <ArrowLeft size={16} /> Back to My Orders
      </Link>

      <div className="bg-white/65 border border-[#E8DCCF] rounded-3xl p-8 sm:p-12 shadow-[0_24px_80px_rgba(72,53,34,0.08)] backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-[#E8DCCF] pb-8 mb-8">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter text-[#111111] mb-2">Order Details</h1>
            <p className="text-sm font-bold uppercase tracking-widest text-[#7a7168]">Order #{String(order.id).slice(0, 8)}</p>
          </div>
          <div className="mt-4 sm:mt-0 text-left sm:text-right">
            <h2 className="text-2xl font-bold text-[#111111]">
              {order.status || 'Processing'}
              {order.status === 'Cancelled' && <span className="ml-3 text-xs text-red-500 bg-red-100 px-3 py-1 rounded-full uppercase font-black align-middle">Cancelled</span>}
            </h2>
            <p className="text-sm font-medium text-[#7a7168] mt-1">
              Placed on {new Date(order.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="mb-8 p-6 bg-[#F8F3EC] rounded-2xl border border-[#E8DCCF]">
          <h3 className="text-sm font-black uppercase tracking-widest text-[#7a7168] mb-2">Customer Info</h3>
          <p className="text-[#111111] font-bold text-lg">{order.customer_name}</p>
          {(order.shipping_address || order.address || (order.items && order.items[0] && order.items[0]._fallback_address)) ? (
            <p className="text-[#111111] font-medium mt-1">{order.shipping_address || order.address || order.items[0]._fallback_address}</p>
          ) : (
            <p className="text-[#7a7168] italic mt-1 text-sm">Address details will be shown here once available.</p>
          )}
        </div>

        <div className="mb-12">
          <h3 className="text-lg font-black uppercase tracking-wider text-[#111111] mb-6">Items Ordered</h3>
          <div className="space-y-4">
            {(order.items || []).map((item, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row justify-between sm:items-center bg-white/40 p-4 rounded-2xl border border-[#E8DCCF]/50 gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-[#F8F3EC] rounded-xl overflow-hidden flex-shrink-0 border border-[#E8DCCF] flex items-center justify-center text-[#7a7168]">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <Package size={24} />
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-[#111111] text-lg">{item.name || 'Product Name'}</p>
                    <p className="text-sm font-medium text-[#7a7168] mt-1">Size: {item.size || 'M'} | Qty: {item.quantity || 1}</p>
                  </div>
                </div>
                <div className="font-black text-[#111111] text-xl">
                  ₹{Number((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                </div>
              </div>
            ))}
            {(!order.items || order.items.length === 0) && (
              <p className="text-sm font-medium text-[#7a7168] italic p-6 bg-white/30 rounded-2xl text-center border border-[#E8DCCF]/50">No items data available.</p>
            )}
          </div>
        </div>

        <div className="border-t border-[#E8DCCF] pt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="bg-[#F8F3EC] px-6 py-4 rounded-2xl border border-[#E8DCCF]">
            <p className="text-sm font-bold uppercase tracking-widest text-[#7a7168] mb-1">Total Amount</p>
            <p className="text-3xl font-black text-[#111111]">₹{Number(order.total_amount || 0).toFixed(2)}</p>
          </div>

          {canCancel && (
            <button
              onClick={() => setShowCancelModal(true)}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white rounded-2xl text-sm font-black uppercase tracking-wider transition-all border border-red-200"
            >
              <XCircle size={20} />
              Cancel Order
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showCancelModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#111111]/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#FFFDF9] rounded-3xl p-8 sm:p-10 max-w-md w-full shadow-[0_24px_80px_rgba(200,162,255,0.2)] relative border border-[#C8A2FF]/30"
            >
              <button onClick={() => setShowCancelModal(false)} className="absolute top-6 right-6 text-[#7a7168] hover:text-[#111111] bg-[#F8F3EC] p-2 rounded-full transition-colors">
                <X size={20} />
              </button>
              
              <h3 className="text-2xl font-black uppercase tracking-wider text-[#111111] mb-2">Cancel Order</h3>
              <p className="text-[#625b52] font-medium mb-6">Please tell us why you are cancelling this order.</p>

              <div className="space-y-3 mb-8">
                {['Changed my mind', 'Found a better price elsewhere', 'Ordered by mistake', 'Delivery is taking too long', 'Other reason'].map((reason) => (
                  <label key={reason} className="flex items-center gap-3 p-4 border border-[#E8DCCF] rounded-xl cursor-pointer hover:bg-[#F8F3EC] transition-colors">
                    <input 
                      type="radio" 
                      name="cancelReason" 
                      value={reason} 
                      checked={cancelReason === reason} 
                      onChange={(e) => setCancelReason(e.target.value)}
                      className="text-[#7d55bd] focus:ring-[#C8A2FF]"
                    />
                    <span className="text-sm font-bold text-[#111111]">{reason}</span>
                  </label>
                ))}
              </div>

              <div className="flex gap-4">
                <Button type="button" variant="secondary" className="flex-1 py-4" onClick={() => setShowCancelModal(false)}>
                  Keep Order
                </Button>
                <Button 
                  type="button" 
                  variant="primary" 
                  className="flex-1 py-4 bg-red-500 hover:bg-red-600 border-red-500 hover:border-red-600" 
                  onClick={handleCancelOrder}
                  disabled={isCancelling}
                >
                  {isCancelling ? 'Processing...' : 'Confirm Cancel'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default OrderDetails;
