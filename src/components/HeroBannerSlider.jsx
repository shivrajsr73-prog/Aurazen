import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';

import banner01 from '../../images/banner01.png';
import banner02 from '../../images/banner02.png';
import banner03 from '../../images/banner03.png';

// Banner config — category maps to which product category to navigate
const BANNER_CONFIG = [
  { id: 1, image: banner01, alt: 'Hoodies Collection', keyword: 'black', category: 'Hoodies' },
  { id: 2, image: banner02, alt: 'T-Shirts Collection', keyword: 'anime t-shirt', category: 'T-Shirts' },
  { id: 3, image: banner03, alt: 'New Drops', keyword: 'new anime', category: 'T-Shirts' },
];

export default function HeroBannerSlider() {
  const navigate = useNavigate();
  const { allProducts } = useShop();

  // ── Navigate to specific product or fallback category ──
  const handleBannerClick = (banner) => {
    let matchedProduct = null;

    // 1. Try to find the exact product by keyword in the name
    if (banner.keyword) {
      matchedProduct = allProducts?.find((p) => 
        p.name?.toLowerCase().includes(banner.keyword.toLowerCase())
      );
    }

    // 2. Fallback to the first product in the category
    if (!matchedProduct) {
      matchedProduct = allProducts?.find((p) => 
        p.category?.toLowerCase() === banner.category?.toLowerCase()
      );
    }

    if (matchedProduct?.id) {
      navigate(`/product/${matchedProduct.id}`);
    } else {
      // 3. Fallback: go to products page
      navigate('/products');
    }
  };

  // Duplicate banners to ensure smooth endless scroll
  // We use multiple copies to ensure wide screens are fully covered during scrolling
  const scrollBanners = [...BANNER_CONFIG, ...BANNER_CONFIG, ...BANNER_CONFIG];

  return (
    <section className="w-full bg-[#F8F3EC] pt-4 pb-6 md:py-6 overflow-hidden">
      <style>{`
        @keyframes scrollRight {
          0% { transform: translateX(calc(-100% - 1.5rem)); }
          100% { transform: translateX(0); }
        }
        .animate-scroll {
          animation: scrollRight 40s linear infinite;
        }
      `}</style>

      <div className="slider-wrapper flex w-full overflow-hidden gap-6 group">
        {/* First scrolling block */}
        <div className="flex shrink-0 animate-scroll gap-6">
          {scrollBanners.map((banner, idx) => (
            <div
              key={`block1-${banner.id}-${idx}`}
              className="w-[92vw] md:w-[88vw] max-w-[1400px] shrink-0 cursor-pointer overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.05)] rounded-2xl hover:shadow-[0_8px_30px_rgba(200,162,255,0.2)] transition-shadow duration-300 border border-[#E8DCCF]/50"
              onClick={() => handleBannerClick(banner)}
            >
              <img
                src={banner.image}
                alt={banner.alt}
                className="w-full h-auto select-none pointer-events-none"
                style={{ objectFit: 'contain', objectPosition: 'center center', maxHeight: '82vh' }}
                draggable={false}
              />
            </div>
          ))}
        </div>
        
        {/* Second scrolling block (identical) for seamless loop */}
        <div className="flex shrink-0 animate-scroll gap-6" aria-hidden="true">
          {scrollBanners.map((banner, idx) => (
            <div
              key={`block2-${banner.id}-${idx}`}
              className="w-[92vw] md:w-[88vw] max-w-[1400px] shrink-0 cursor-pointer overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.05)] rounded-2xl hover:shadow-[0_8px_30px_rgba(200,162,255,0.2)] transition-shadow duration-300 border border-[#E8DCCF]/50"
              onClick={() => handleBannerClick(banner)}
            >
              <img
                src={banner.image}
                alt={banner.alt}
                className="w-full h-auto select-none pointer-events-none"
                style={{ objectFit: 'contain', objectPosition: 'center center', maxHeight: '82vh' }}
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
