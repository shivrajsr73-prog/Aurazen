import { createContext, useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const success = (message) => addToast(message, 'success');
  const error = (message) => addToast(message, 'error');
  const info = (message) => addToast(message, 'info');

  return (
    <ToastContext.Provider value={{ success, error, info }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => {
            const icons = {
              success: <CheckCircle className="text-[#7d55bd] drop-shadow-[0_0_8px_rgba(200,162,255,0.45)]" size={20} />,
              error: <AlertCircle className="text-red-500" size={20} />,
              info: <Info className="text-[#168aa0] drop-shadow-[0_0_8px_rgba(139,233,253,0.45)]" size={20} />
            };

            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                className="pointer-events-auto flex items-center gap-3 bg-[#FFFDF9]/92 backdrop-blur-md px-4 py-3 rounded-lg shadow-[0_18px_46px_rgba(72,53,34,0.14)] border border-[#E8DCCF] min-w-[300px]"
              >
                {icons[toast.type]}
                <p className="text-sm font-bold text-[#111111] tracking-wide flex-1">{toast.message}</p>
                <button 
                  onClick={() => removeToast(toast.id)}
                  className="text-[#7a7168] hover:text-[#111111] transition-colors"
                >
                  <X size={16} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
