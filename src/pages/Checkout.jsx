import { useRef, useState } from 'react';
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
  const checkoutFormRef = useRef(null);
  const [checkoutStep, setCheckoutStep] = useState('address');
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

  const handleContinueToPayment = () => {
    const form = checkoutFormRef.current;
    const addressFields = ['firstName', 'lastName', 'email', 'address', 'city', 'postalCode'];
    const firstInvalidField = addressFields
      .map((fieldName) => form?.elements[fieldName])
      .find((field) => field && !field.checkValidity());

    if (firstInvalidField) {
      firstInvalidField.reportValidity();
      return;
    }

    setCheckoutStep('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    if (checkoutStep === 'address') {
      handleContinueToPayment();
      return;
    }
    
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
      
      toast.success("Order placed successfully! Thank you for shopping with Aura Maker.");
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
      <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} className="min-h-[70vh] flex flex-col items-center justify-center text-[#111111] px-6">
        <h2 className="text-3xl font-bold mb-4 tracking-tight">Your cart is empty</h2>
        <p className="text-[#625b52] mb-8 max-w-md text-center">Add some premium items to your cart before checking out.</p>
        <Link to="/products">
          <Button variant="primary">Return to Shop</Button>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} className="container mx-auto px-6 py-12 text-[#111111]">
      <h1 className="text-4xl font-black text-[#111111] mb-12 tracking-tighter uppercase">Checkout</h1>
      
      <form ref={checkoutFormRef} onSubmit={handleCheckout} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 space-y-8"
        >
          <div className="flex items-center gap-3 rounded-2xl border border-[#E8DCCF] bg-white/65 p-3 shadow-[0_18px_50px_rgba(72,53,34,0.08)] backdrop-blur-xl">
            <button
              type="button"
              onClick={() => setCheckoutStep('address')}
              className={`flex-1 rounded-xl px-4 py-3 text-xs font-black uppercase tracking-widest transition-all ${checkoutStep === 'address' ? 'bg-[#C8A2FF]/30 text-[#111111]' : 'text-[#625b52] hover:text-[#111111]'}`}
            >
              1. Address
            </button>
            <button
              type="button"
              onClick={handleContinueToPayment}
              className={`flex-1 rounded-xl px-4 py-3 text-xs font-black uppercase tracking-widest transition-all ${checkoutStep === 'payment' ? 'bg-[#C8A2FF]/30 text-[#111111]' : 'text-[#625b52] hover:text-[#111111]'}`}
            >
              2. Payment
            </button>
          </div>

          <div className="bg-white/65 p-8 rounded-2xl border border-[#E8DCCF] shadow-[0_20px_60px_rgba(72,53,34,0.08)] backdrop-blur-xl">
            <h2 className="text-xl font-bold uppercase tracking-wider text-[#111111] mb-6">Shipping Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="First Name" name="firstName" placeholder="Jane" required />
              <Input label="Last Name" name="lastName" placeholder="Doe" required />
              <Input label="Email Address" name="email" type="email" placeholder="jane@example.com" className="md:col-span-2" required />
              <Input label="Address" name="address" placeholder="123 Cream Ave" className="md:col-span-2" required />
              <Input label="City" name="city" placeholder="Mumbai" required />
              <Input label="Postal Code" name="postalCode" placeholder="100-0001" required />
            </div>
            {checkoutStep === 'address' && (
              <Button type="button" variant="primary" className="mt-8 px-8 py-4" onClick={handleContinueToPayment}>
                Continue to Payment
              </Button>
            )}
          </div>

          {checkoutStep === 'payment' && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/65 p-8 rounded-2xl border border-[#E8DCCF] shadow-[0_20px_60px_rgba(72,53,34,0.08)] backdrop-blur-xl"
            >
              <h2 className="text-xl font-bold uppercase tracking-wider text-[#111111] mb-6">Payment Method</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between bg-[#FFFDF9] p-4 rounded-xl border border-[#C8A2FF]/60 shadow-[0_0_18px_rgba(200,162,255,0.12)]">
                  <div className="flex items-center space-x-3">
                    <input type="radio" name="payment" id="card" className="text-[#C8A2FF] focus:ring-[#C8A2FF] bg-white border-[#E8DCCF]" defaultChecked />
                    <label htmlFor="card" className="text-[#111111] font-bold uppercase tracking-widest text-sm">Credit / Debit Card</label>
                  </div>
                  <div className="flex space-x-2">
                    <div className="w-8 h-5 bg-[#E8DCCF] rounded"></div>
                    <div className="w-8 h-5 bg-[#C8A2FF]/35 rounded"></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6 mt-4">
                  <Input name="cardNumber" placeholder="Card Number" className="col-span-2" required />
                  <Input name="cardExpiry" placeholder="MM/YY" required />
                  <Input name="cardCvc" placeholder="CVC" required />
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-white/70 p-8 rounded-2xl sticky top-24 border border-[#E8DCCF] shadow-[0_20px_60px_rgba(72,53,34,0.08)] backdrop-blur-xl">
            <h2 className="text-xl font-bold uppercase tracking-wider text-[#111111] mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2">
              {cart.map(item => (
                <div key={item.id} className="flex items-center space-x-4 bg-[#FFFDF9] p-3 rounded-xl border border-[#E8DCCF]">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-[#111111] line-clamp-1">{item.name}</h4>
                    <p className="text-[#7a7168] text-xs mt-1 font-bold">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-[#111111] font-bold">₹{(Number(item.price || 0) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-[#E8DCCF] pt-6 mb-6">
              <label htmlFor="coupon" className="block text-xs font-bold uppercase tracking-widest text-[#4f4942] mb-3">
                Coupon Code
              </label>
              <div className="flex gap-3">
                <input
                  id="coupon"
                  type="text"
                  value={couponCode}
                  onChange={(event) => setCouponCode(event.target.value)}
                  placeholder="AURAMAKER10"
                  className="min-w-0 flex-1 rounded-lg border border-[#E8DCCF] bg-white/60 px-4 py-3 text-sm font-bold uppercase tracking-wider text-[#111111] placeholder-[#8c8278] outline-none transition-all focus:border-[#C8A2FF] focus:ring-2 focus:ring-[#C8A2FF]/25"
                />
                <Button type="button" variant="secondary" className="px-5" onClick={applyCoupon} disabled={isApplyingCoupon}>
                  {isApplyingCoupon ? 'Checking' : 'Apply'}
                </Button>
              </div>
              {appliedCoupon && (
                <div className="mt-3 flex items-center justify-between rounded-lg border border-[#C8A2FF]/35 bg-[#C8A2FF]/10 px-4 py-3 text-sm">
                  <span className="font-bold text-[#7d55bd]">{appliedCoupon.code} applied</span>
                  <button type="button" onClick={removeCoupon} className="font-bold text-[#625b52] hover:text-[#111111]">
                    Remove
                  </button>
                </div>
              )}
            </div>

            <div className="border-t border-[#E8DCCF] pt-6 space-y-4 text-sm font-medium">
              <div className="flex justify-between text-[#625b52]">
                <span>Subtotal</span>
                <span className="text-[#111111] font-bold">₹{cartTotal.toFixed(2)}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-[#625b52]">
                  <span>Discount ({appliedCoupon.code})</span>
                  <span className="font-bold text-[#7d55bd]">-₹{couponDiscount.toFixed(2)}</span>
                </div>
              )}
              {appliedCoupon && (
                <div className="flex justify-between text-[#625b52]">
                  <span>After Discount</span>
                  <span className="text-[#111111] font-bold">₹{discountedSubtotal.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#625b52]">
                <span>Shipping</span>
                <span className="text-[#7d55bd] font-bold">Free</span>
              </div>
              <div className="flex justify-between text-[#625b52]">
                <span>Tax (10%)</span>
                <span className="text-[#111111] font-bold">₹{taxAmount.toFixed(2)}</span>
              </div>
              <div className="border-t border-[#E8DCCF] pt-6 flex justify-between font-black text-xl text-[#111111]">
                <span className="uppercase">Total</span>
                <span>
                  ₹{orderTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {checkoutStep === 'address' ? (
              <Button type="button" variant="primary" className="w-full mt-8 py-4" onClick={handleContinueToPayment}>
                Continue to Payment
              </Button>
            ) : (
              <Button type="submit" variant="primary" className="w-full mt-8 py-4">
                Complete Order
              </Button>
            )}
            
            <p className="text-center text-xs text-[#7a7168] mt-4 font-medium">
              By completing your order, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default Checkout;
