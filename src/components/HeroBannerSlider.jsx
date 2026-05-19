import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';

import banner01 from '../../images/banner01.png';
import banner02 from '../../images/banner02.png';

const SLIDE_DURATION = 5000;

// Banner config — category maps to which product category to navigate
const BANNER_CONFIG = [
  { id: 1, image: banner01, alt: 'T-Shirts Collection', category: 'T-Shirts' },
  { id: 2, image: banner02, alt: 'Hoodies Collection',  category: 'Hoodies'  },
];

export default function HeroBannerSlider() {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState(null);
  const [animating, setAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const intervalRef = useRef(null);
  const progressRef = useRef(null);
  const progressStartRef = useRef(null);

  const navigate = useNavigate();
  const { allProducts } = useShop();

  // ── Navigate to first product of the matching category ──
  const handleBannerClick = (banner) => {
    // Try to find matching product in Supabase allProducts first
    const matchedProduct = allProducts?.find(
      (p) => p.category?.toLowerCase() === banner.category.toLowerCase()
    );

    if (matchedProduct?.id) {
      navigate(`/product/${matchedProduct.id}`);
    } else {
      // Fallback: go to products page filtered by category
      navigate('/products');
    }
  };

  // ── Slide transition ──
  const goToSlide = (nextIdx) => {
    if (animating || nextIdx === current) return;
    setPrev(current);
    setCurrent(nextIdx);
    setAnimating(true);
    setProgress(0);
    setTimeout(() => {
      setPrev(null);
      setAnimating(false);
    }, 700); // match CSS transition duration
  };

  // ── Progress bar animation ──
  const startProgress = () => {
    cancelAnimationFrame(progressRef.current);
    progressStartRef.current = performance.now();

    const tick = (now) => {
      const elapsed = now - progressStartRef.current;
      const pct = Math.min((elapsed / SLIDE_DURATION) * 100, 100);
      setProgress(pct);
      if (pct < 100) {
        progressRef.current = requestAnimationFrame(tick);
      }
    };
    progressRef.current = requestAnimationFrame(tick);
  };

  // ── Auto-slide interval ──
  const startInterval = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => {
        const next = (prev + 1) % BANNER_CONFIG.length;
        setPrev(prev);
        setAnimating(true);
        setProgress(0);
        setTimeout(() => {
          setPrev(null);
          setAnimating(false);
        }, 700);
        return next;
      });
    }, SLIDE_DURATION);
  };

  useEffect(() => {
    if (!isPaused) {
      startInterval();
      startProgress();
    } else {
      clearInterval(intervalRef.current);
      cancelAnimationFrame(progressRef.current);
    }
    return () => {
      clearInterval(intervalRef.current);
      cancelAnimationFrame(progressRef.current);
    };
  }, [isPaused, current]);

  const handleDotClick = (idx) => {
    goToSlide(idx);
    startProgress();
    if (!isPaused) startInterval();
  };

  return (
    <section className="w-full bg-[#F8F3EC]">
      <style>{`
        .banner-slide {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          transition: transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                      opacity 0.5s ease;
        }
        .banner-slide.active {
          transform: translateX(0%);
          opacity: 1;
          z-index: 2;
        }
        .banner-slide.entering {
          transform: translateX(100%);
          opacity: 0;
          z-index: 2;
        }
        .banner-slide.exiting {
          transform: translateX(-100%);
          opacity: 0;
          z-index: 1;
        }
        .banner-slide.hidden-left {
          transform: translateX(-100%);
          opacity: 0;
          z-index: 0;
        }
        .banner-slide.hidden-right {
          transform: translateX(100%);
          opacity: 0;
          z-index: 0;
        }
      `}</style>

      {/* ── Slider Container ── */}
      <div
        className="relative w-full overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Invisible height anchor — drives natural image height */}
        <img
          src={BANNER_CONFIG[current].image}
          alt=""
          aria-hidden="true"
          className="w-full block pointer-events-none select-none invisible"
          style={{ height: 'auto', maxHeight: '88vh' }}
        />

        {/* Slide layers */}
        {BANNER_CONFIG.map((banner, idx) => {
          let cls = 'hidden-right';
          if (idx === current) cls = animating ? 'active' : 'active';
          else if (idx === prev) cls = 'exiting';

          return (
            <div
              key={banner.id}
              className={`banner-slide ${cls} cursor-pointer`}
              onClick={() => handleBannerClick(banner)}
            >
              <img
                src={banner.image}
                alt={banner.alt}
                className="w-full h-full select-none pointer-events-none"
                style={{ objectFit: 'contain', objectPosition: 'center center' }}
                draggable={false}
              />
            </div>
          );
        })}

        {/* Slide counter pill */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-1 bg-white/50 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm border border-white/60">
          <span className="text-[11px] font-black text-[#111111]/80 tabular-nums">
            {String(current + 1).padStart(2, '0')}
          </span>
          <span className="text-[#111111]/30 text-[10px] mx-0.5">/</span>
          <span className="text-[11px] font-medium text-[#111111]/40 tabular-nums">
            {String(BANNER_CONFIG.length).padStart(2, '0')}
          </span>
        </div>

        {/* Progress bar */}
        <div
          className="absolute bottom-0 left-0 h-[3px] bg-gradient-to-r from-[#C8A2FF] via-[#8BE9FD] to-[#C8A2FF] z-20 transition-none"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* ── Dot Navigation ── */}
      <div className="flex justify-center items-center gap-3 py-3 bg-[#F8F3EC]">
        {BANNER_CONFIG.map((banner, idx) => (
          <button
            key={banner.id}
            onClick={() => handleDotClick(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className="focus:outline-none flex items-center"
          >
            <div
              className="h-2 rounded-full transition-all duration-350"
              style={{
                width: idx === current ? 32 : 8,
                minWidth: 8,
                backgroundColor: idx === current ? '#111111' : '#D6CCC0',
                transition: 'width 0.35s cubic-bezier(0.32,0.72,0,1), background-color 0.35s ease',
              }}
            />
          </button>
        ))}
      </div>
    </section>
  );
}
