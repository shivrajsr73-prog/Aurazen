import { motion } from 'framer-motion';

const Button = ({ children, onClick, className = '', variant = 'primary', type = 'button', disabled = false, ...props }) => {
  const baseStyles = "luxury-button relative inline-flex items-center justify-center px-6 py-3 font-black uppercase tracking-[0.18em] text-xs rounded-2xl transition-all duration-500 overflow-hidden outline-none disabled:opacity-50 disabled:cursor-not-allowed group border";
  
  const variants = {
    primary: "luxury-button-primary text-black border-white/70",
    secondary: "luxury-button-secondary text-white border-white/10",
    ghost: "luxury-button-ghost text-gray-300 border-transparent",
    glow: "luxury-button-glow text-black border-[#00F3FF]/70"
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.035, y: disabled ? 0 : -1 }}
      whileTap={{ scale: disabled ? 1 : 0.965, y: 0 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      <span className="luxury-button-shine" />
      <span className="relative z-10 flex items-center justify-center">{children}</span>
    </motion.button>
  );
};

export default Button;
