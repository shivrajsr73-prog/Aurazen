import { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../supabase';

const ShopContext = createContext();

export const useShop = () => useContext(ShopContext);

export const ShopProvider = ({ children }) => {
  const [productsList, setProductsList] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(null);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [storageReady, setStorageReady] = useState(false);

  const normalizeProduct = (product) => {
    const toImageArray = (value) => {
      if (!value) return [];
      if (Array.isArray(value)) return value.filter(Boolean);
      if (typeof value !== 'string') return [];

      const trimmed = value.trim();
      if (!trimmed) return [];

      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) return parsed.filter(Boolean);
      } catch {
        // Some admin forms save multiple URLs as comma-separated text.
      }

      return trimmed.includes(',')
        ? trimmed.split(',').map((image) => image.trim()).filter(Boolean)
        : [trimmed];
    };

    const imageList = [
      ...toImageArray(product.images),
      ...toImageArray(product.image_urls),
      ...toImageArray(product.gallery),
      product.image_url,
      product.image,
      product.thumbnail_url,
      product.thumbnail,
      product.product_image,
      product.image_1,
      product.image_2,
      product.image_3,
    ].filter(Boolean);

    const productImages = Array.from(new Set(imageList));

    const image =
      productImages[0] ||
      '';

    return {
      ...product,
      image,
      productImages,
      price: Number(product.price ?? 0),
      rating: Number(product.rating ?? 4.8),
      reviews: Number(product.reviews ?? 0),
      category: product.category || 'Uncategorized',
      description: product.description || '',
    };
  };

  // Fetch Products from Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      setProductsLoading(true);
      setProductsError(null);

      const { data, error } = await supabase.from('products').select('*');

      if (error) {
        setProductsError(error.message);
        setProductsList([]);
      } else {
        setProductsList(
          (data || [])
            .map(normalizeProduct)
            .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
        );
      }

      setProductsLoading(false);
    };

    fetchProducts();

    // Subscribe to realtime changes
    const subscription = supabase
      .channel('products_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, payload => {
        fetchProducts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  // Load from LocalStorage
  useEffect(() => {
    const readStoredJson = (key, fallback) => {
      try {
        const storedValue = localStorage.getItem(key);
        return storedValue ? JSON.parse(storedValue) : fallback;
      } catch {
        localStorage.removeItem(key);
        return fallback;
      }
    };

    setCart(readStoredJson('aurawear_cart', []));
    setWishlist(readStoredJson('aurawear_wishlist', []));
    setStorageReady(true);

    // Initialize Supabase Auth Session
    console.log('[ShopContext] Initializing Supabase Auth Session...');
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('[ShopContext] getSession resolved:', session);
      if (session) {
        setUser(session.user);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(`[ShopContext] onAuthStateChange event: ${event}`, session);
      if (session) {
        setUser(session.user);
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    if (storageReady) localStorage.setItem('aurawear_cart', JSON.stringify(cart));
  }, [cart, storageReady]);

  useEffect(() => {
    if (storageReady) localStorage.setItem('aurawear_wishlist', JSON.stringify(wishlist));
  }, [wishlist, storageReady]);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId) => setCart(prev => prev.filter(item => item.id !== productId));
  
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) return removeFromCart(productId);
    setCart(prev => prev.map(item => item.id === productId ? { ...item, quantity } : item));
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (product) => {
    setWishlist(prev => {
      if (prev.find(item => item.id === product.id)) {
        return prev.filter(item => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const login = (userData) => setUser(userData);
  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('SignOut error:', error);
    setUser(null);
  };

  const cartTotal = cart.reduce((total, item) => total + (Number(item.price || 0) * item.quantity), 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);
  
  // Filtering logic
  const filteredProducts = productsList.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Group by name for display in lists
  const groupedProducts = [];
  const seenProductNames = new Set();
  for (const product of filteredProducts) {
    const nameKey = (product.name || '').trim().toLowerCase();
    if (!seenProductNames.has(nameKey)) {
      seenProductNames.add(nameKey);
      groupedProducts.push(product);
    }
  }

  return (
    <ShopContext.Provider value={{
      products: groupedProducts,
      allProducts: productsList,
      productsLoading,
      productsError,
      cart,
      wishlist,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      toggleWishlist,
      cartTotal,
      cartCount,
      isCartOpen,
      setIsCartOpen,
      user,
      login,
      logout,
      searchQuery,
      setSearchQuery,
      selectedCategory,
      setSelectedCategory
    }}>
      {children}
    </ShopContext.Provider>
  );
};
