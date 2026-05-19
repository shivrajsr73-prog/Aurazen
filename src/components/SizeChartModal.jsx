import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const sizeData = [
  { size: 'S', in: { chest: 38, length: 27, shoulder: 17, sleeve: 8 }, cm: { chest: 97, length: 69, shoulder: 43, sleeve: 20 } },
  { size: 'M', in: { chest: 40, length: 28, shoulder: 18, sleeve: 8.5 }, cm: { chest: 102, length: 71, shoulder: 46, sleeve: 22 } },
  { size: 'L', in: { chest: 42, length: 29, shoulder: 19, sleeve: 9 }, cm: { chest: 107, length: 74, shoulder: 48, sleeve: 23 } },
  { size: 'XL', in: { chest: 44, length: 30, shoulder: 20, sleeve: 9.5 }, cm: { chest: 112, length: 76, shoulder: 51, sleeve: 24 } },
  { size: 'XXL', in: { chest: 46, length: 31, shoulder: 21, sleeve: 10 }, cm: { chest: 117, length: 79, shoulder: 53, sleeve: 25 } },
];

const SizeChartModal = ({ isOpen, onClose }) => {
  const [unit, setUnit] = useState('in'); // 'in' or 'cm'

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden border border-[#E8DCCF] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#E8DCCF]">
              <div>
                <h2 className="text-2xl font-black text-[#111111] tracking-tight">Size Chart</h2>
                <p className="text-[#625b52] text-sm mt-1 font-medium">Find your perfect fit</p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-[#111111] transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Unit Toggle */}
              <div className="flex justify-end mb-6">
                <div className="flex bg-gray-100 rounded-xl p-1 border border-gray-200 relative">
                  <button 
                    onClick={() => setUnit('in')}
                    className={`relative z-10 px-4 py-1.5 text-sm font-bold rounded-lg transition-colors ${unit === 'in' ? 'text-white' : 'text-gray-500 hover:text-[#111111]'}`}
                  >
                    INCHES
                  </button>
                  <button 
                    onClick={() => setUnit('cm')}
                    className={`relative z-10 px-4 py-1.5 text-sm font-bold rounded-lg transition-colors ${unit === 'cm' ? 'text-white' : 'text-gray-500 hover:text-[#111111]'}`}
                  >
                    CM
                  </button>
                  <motion.div 
                    layout
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className="absolute inset-1 w-[calc(50%-4px)] bg-[#C8A2FF] rounded-lg shadow-[0_4px_10px_rgba(200,162,255,0.4)]"
                    style={{ left: unit === 'cm' ? 'calc(50% + 2px)' : '4px' }}
                  />
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr>
                      <th className="py-4 px-4 text-[#625b52] font-semibold text-sm uppercase tracking-wider border-b border-[#E8DCCF]">Size</th>
                      <th className="py-4 px-4 text-[#625b52] font-semibold text-sm uppercase tracking-wider border-b border-[#E8DCCF]">Chest</th>
                      <th className="py-4 px-4 text-[#625b52] font-semibold text-sm uppercase tracking-wider border-b border-[#E8DCCF]">Length</th>
                      <th className="py-4 px-4 text-[#625b52] font-semibold text-sm uppercase tracking-wider border-b border-[#E8DCCF]">Shoulder</th>
                      <th className="py-4 px-4 text-[#625b52] font-semibold text-sm uppercase tracking-wider border-b border-[#E8DCCF]">Sleeve</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sizeData.map((row, index) => (
                      <motion.tr 
                        key={row.size}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 + 0.1 }}
                        className="group hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                      >
                        <td className="py-4 px-4 text-[#111111] font-bold text-lg group-hover:text-[#7d55bd] transition-colors">{row.size}</td>
                        <td className="py-4 px-4 text-gray-700">{row[unit].chest}</td>
                        <td className="py-4 px-4 text-gray-700">{row[unit].length}</td>
                        <td className="py-4 px-4 text-gray-700">{row[unit].shoulder}</td>
                        <td className="py-4 px-4 text-gray-700">{row[unit].sleeve}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 flex items-center justify-center p-4 bg-gray-50 rounded-2xl border border-gray-200">
                <p className="text-[#625b52] text-sm font-medium">
                  Measurements may vary by 1-2 {unit === 'in' ? 'inches' : 'cm'}.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SizeChartModal;
