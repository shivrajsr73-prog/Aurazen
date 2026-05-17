import { useState } from 'react';
import { motion } from 'framer-motion';
import { useShop } from '../context/ShopContext';
import { useToast } from '../context/ToastContext';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { supabase } from '../supabase';

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useShop();
  const toast = useToast();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const couponDiscount = appliedCoupon
    ? appliedCoupon.type === 'percent'
      ? cartTotal * (appliedCoupon.value / 100)
      : Math.min(appliedCoupon.value, cartTotal)
    : 0;
  const discountedSubtotal = Math.max(cartTotal - couponDiscount, 0);
  const taxAmount = discountedSubtotal * 0.1;
  const orderTotal = discountedSubtotal + taxAmount;

  const normalizeCoupon = (coupon) => {
    const discountType = String(coupon.discount_type || coupon.type || '').toLowerCase();
    const value = Number(coupon.discount_value ?? coupon.value ?? coupon.amount ?? 0);

    return {
      id: coupon.id,
      code: String(coupon.code || '').toUpperCase(),
      label: `${String(coupon.code || '').toUpperCase()} coupon`,
      type: discountType.includes('percent') ? 'percent' : 'fixed',
      value,
      expiryDate: coupon.expiry_date || coupon.expires_at || coupon.expiry || null,
      usageLimit: coupon.usage_limit ?? coupon.max_uses ?? null,
      usedCount: coupon.used_count ?? coupon.times_used ?? 0,
    };
  };

  const applyCoupon = async () => {
    const normalizedCode = couponCode.trim().toUpperCase();

    if (!normalizedCode) {
      toast.info('Please enter a coupon code.');
      return;
    }

    setIsApplyingCoupon(true);

    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .ilike('code', normalizedCode)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        setAppliedCoupon(null);
        toast.error('Invalid coupon code.');
        return;
      }

      const coupon = normalizeCoupon(data);

      if (!coupon.value || coupon.value <= 0) {
        setAppliedCoupon(null);
        toast.error('This coupon is not valid.');
        return;
      }

      if (coupon.expiryDate) {
        const expiresAt = new Date(coupon.expiryDate);
        expiresAt.setHours(23, 59, 59, 999);

        if (expiresAt < new Date()) {
          setAppliedCoupon(null);
          toast.error('This coupon has expired.');
          return;
        }
      }

      if (coupon.usageLimit !== null && Number(coupon.usedCount) >= Number(coupon.usageLimit)) {
        setAppliedCoupon(null);
        toast.error('This coupon usage limit is over.');
        return;
      }

      setAppliedCoupon(coupon);
      setCouponCode(coupon.code);
      toast.success(`${coupon.code} applied.`);
    } catch (error) {
      console.error('Error applying coupon:', error);
      toast.error('Could not validate coupon. Please try again.');
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    toast.info('Coupon removed.');
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    
    try {
      const formData = new FormData(e.target);
      const customerInfo = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        address: formData.get('address'),
        city: formData.get('city'),
        postalCode: formData.get('postalCode')
      };

      const orderData = {
        customer_name: `${customerInfo.firstName} ${customerInfo.lastName}`,
        customer_email: customerInfo.email,
        total_amount: orderTotal,
        status: 'Processing',
        items: cart.map(item => ({
          productId: item.docId || item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          size: item.size || 'M',
        }))
      };

      const { error } = await supabase.from('orders').insert([orderData]);
      if (error) throw error;
      
      toast.success("Order placed successfully! Thank you for shopping with AuraZen.");
      clearCart();
      navigate('/');
    } catch (error) {
      console.error("Error creating order: ", error);
      toast.error("Failed to place order.");
    }
  };

  const pageVariants = {
    initial: { opacity: 0 },
    in: { opacity: 1, transition: { duration: 0.4 } },
    out: { opacity: 0, transition: { duration: 0.4 } }
  };

  if (cart.length === 0) {
    return (
      <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} className="min-h-[70vh] flex flex-col items-center justify-center text-white px-6">
        <h2 className="text-3xl font-bold mb-4 tracking-tight">Your cart is empty</h2>
        <p className="text-gray-400 mb-8 max-w-md text-center">Add some premium items to your cart before checking out.</p>
        <Link to="/products">
          <Button variant="primary">Return to Shop</Button>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-black text-white mb-12 tracking-tighter uppercase">Checkout</h1>
      
      <form onSubmit={handleCheckout} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 space-y-8"
        >
          <div className="bg-[#111111] p-8 rounded-2xl border border-[#1E1E1E]">
            <h2 className="text-xl font-bold uppercase tracking-wider text-white mb-6">Shipping Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="First Name" name="firstName" placeholder="Jane" required />
              <Input label="Last Name" name="lastName" placeholder="Doe" required />
              <Input label="Email Address" name="email" type="email" placeholder="jane@example.com" className="md:col-span-2" required />
              <Input label="Address" name="address" placeholder="123 Cyber Ave" className="md:col-span-2" required />
              <Input label="City" name="city" placeholder="Neo Tokyo" required />
              <Input label="Postal Code" name="postalCode" placeholder="100-0001" required />
            </div>
          </div>

          <div className="bg-[#111111] p-8 rounded-2xl border border-[#1E1E1E]">
            <h2 className="text-xl font-bold uppercase tracking-wider text-white mb-6">Payment Method</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-[#0a0a0a] p-4 rounded-xl border border-[#00F3FF] shadow-[0_0_10px_rgba(0,243,255,0.1)]">
                <div className="flex items-center space-x-3">
                  <input type="radio" name="payment" id="card" className="text-[#00F3FF] focus:ring-[#00F3FF] bg-[#111111] border-[#333]" defaultChecked />
                  <label htmlFor="card" className="text-white font-bold uppercase tracking-widest text-sm">Credit / Debit Card</label>
                </div>
                <div className="flex space-x-2">
                  <div className="w-8 h-5 bg-[#333] rounded"></div>
                  <div className="w-8 h-5 bg-[#333] rounded"></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6 mt-4">
                <Input placeholder="Card Number" className="col-span-2" required />
                <Input placeholder="MM/YY" required />
                <Input placeholder="CVC" required />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-[#111111] p-8 rounded-2xl sticky top-24 border border-[#1E1E1E]">
            <h2 className="text-xl font-bold uppercase tracking-wider text-white mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2">
              {cart.map(item => (
                <div key={item.id} className="flex items-center space-x-4 bg-[#0a0a0a] p-3 rounded-xl border border-[#1E1E1E]">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg mix-blend-screen opacity-90" />
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-white line-clamp-1">{item.name}</h4>
                    <p className="text-gray-500 text-xs mt-1 font-bold">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-white font-bold">₹{(Number(item.price || 0) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-[#1E1E1E] pt-6 mb-6">
              <label htmlFor="coupon" className="block text-xs font-bold uppercase tracking-widest text-gray-300 mb-3">
                Coupon Code
              </label>
              <div className="flex gap-3">
                <input
                  id="coupon"
                  type="text"
                  value={couponCode}
                  onChange={(event) => setCouponCode(event.target.value)}
                  placeholder="AURAZEN10"
                  className="min-w-0 flex-1 rounded-lg border border-[#333] bg-[#0a0a0a] px-4 py-3 text-sm font-bold uppercase tracking-wider text-white placeholder-gray-600 outline-none transition-all focus:border-[#00F3FF] focus:ring-2 focus:ring-[#00F3FF]/30"
                />
                <Button type="button" variant="secondary" className="px-5" onClick={applyCoupon} disabled={isApplyingCoupon}>
                  {isApplyingCoupon ? 'Checking' : 'Apply'}
                </Button>
              </div>
              {appliedCoupon && (
                <div className="mt-3 flex items-center justify-between rounded-lg border border-[#00F3FF]/30 bg-[#00F3FF]/10 px-4 py-3 text-sm">
                  <span className="font-bold text-[#00F3FF]">{appliedCoupon.code} applied</span>
                  <button type="button" onClick={removeCoupon} className="font-bold text-gray-300 hover:text-white">
                    Remove
                  </button>
                </div>
              )}
            </div>

            <div className="border-t border-[#1E1E1E] pt-6 space-y-4 text-sm font-medium">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span className="text-white font-bold">₹{cartTotal.toFixed(2)}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-gray-400">
                  <span>Discount ({appliedCoupon.code})</span>
                  <span className="font-bold text-[#00F3FF]">-₹{couponDiscount.toFixed(2)}</span>
                </div>
              )}
              {appliedCoupon && (
                <div className="flex justify-between text-gray-400">
                  <span>After Discount</span>
                  <span className="text-white font-bold">₹{discountedSubtotal.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-400">
                <span>Shipping</span>
                <span className="text-[#00F3FF] font-bold">Free</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Tax (10%)</span>
                <span className="text-white font-bold">₹{taxAmount.toFixed(2)}</span>
              </div>
              <div className="border-t border-[#1E1E1E] pt-6 flex justify-between font-black text-xl text-white">
                <span className="uppercase">Total</span>
                <span>
                  ₹{orderTotal.toFixed(2)}
                </span>
              </div>
            </div>

            <Button type="submit" variant="primary" className="w-full mt-8 py-4">
              Complete Order
            </Button>
            
            <p className="text-center text-xs text-gray-500 mt-4 font-medium">
              By completing your order, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default Checkout;
