import { forwardRef } from 'react';

const Input = forwardRef(({ label, error, className = '', ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-bold text-[#4f4942] mb-1.5 uppercase tracking-wider">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`
          w-full px-4 py-3 bg-white/60 border rounded-lg text-[#111111] placeholder-[#8c8278]
          focus:outline-none focus:ring-2 focus:ring-[#C8A2FF]/25 focus:border-[#C8A2FF]
          transition-all duration-300
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-[#E8DCCF]'}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500 font-medium">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
