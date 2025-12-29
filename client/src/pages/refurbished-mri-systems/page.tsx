import { useEffect, useState } from 'react';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';
import { ASSETS } from '../../constants/assets';
import { smoothScrollToHash, smoothScrollToTop } from '../../utils/smoothScroll';

const RefurbishedMRISystemsPage = () => {
  // CMS Data State
  const [hero, setHero] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [highlightedSection, setHighlightedSection] = useState<string | null>(null);

  // Fetch CMS Data
  const fetchHero = async () => {
    try {
      const res = await fetch('/api/cms/refurbished-mri/hero');
      if (res.ok) {
        const json = await res.json();
        setHero(json?.data || json || null);
      }
    } catch (error) {
      console.error('Error fetching refurbished MRI hero:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/cms/refurbished-mri/products');
      if (res.ok) {
        const json = await res.json();
        const productsData = Array.isArray(json?.data) ? json.data : json;
        // Filter active products and sort by order
        const activeProducts = (productsData || [])
          .filter((p: any) => p.isActive !== false && !p.isDeleted)
          .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
        setProducts(activeProducts);
      }
    } catch (error) {
      console.error('Error fetching refurbished MRI products:', error);
    }
  };

  // Function to scroll to section with hash and highlight
  const scrollToHashSection = () => {
    if (window.location.hash) {
      setTimeout(() => {
        const hash = window.location.hash.replace('#', '');
        const element = document.getElementById(hash);
        if (element) {
        smoothScrollToHash(window.location.hash, {
          offset: 100,
          duration: 800,
        });
          
          // Add highlight effect
          setHighlightedSection(hash);
          setTimeout(() => {
            setHighlightedSection(null);
          }, 2000);
        }
      }, 300); // Wait for products to render
    }
  };

  useEffect(() => {
    smoothScrollToTop(400);
    fetchHero();
    fetchProducts();

    // Listen for data changes from Dashboard
    const handleHeroChange = () => fetchHero();
    const handleProductsChange = () => fetchProducts();

    window.addEventListener('refurbishedMRIHeroChanged', handleHeroChange);
    window.addEventListener('refurbishedMRIProductsChanged', handleProductsChange);

    // Handle hash navigation after products load
    const handleHashChange = () => {
      scrollToHashSection();
    };

    // Handle initial hash and hash changes
    if (window.location.hash) {
      scrollToHashSection();
    }
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('refurbishedMRIHeroChanged', handleHeroChange);
      window.removeEventListener('refurbishedMRIProductsChanged', handleProductsChange);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Re-run hash navigation when products are loaded
  useEffect(() => {
    if (products.length > 0 && window.location.hash) {
      scrollToHashSection();
    }
  }, [products]);

  // Parse features from JSON string or array
  const parseFeatures = (features: any): string[] => {
    if (!features) return [];
    if (Array.isArray(features)) return features;
    if (typeof features === 'string') {
      try {
        const parsed = JSON.parse(features);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        // If not JSON, treat as newline-separated string
        return features.split('\n').filter((f: string) => f.trim());
      }
    }
    return [];
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[#7AB730] to-[#4A90A4] pt-32 pb-16 flex items-center min-h-[300px]">
        <div className="max-w-7xl mx-auto px-6 text-center w-full">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-fade-up">
            {hero?.title || 'Refurbished MRI Systems'}
          </h1>
        </div>
      </section>

      {/* Products Section */}
      {products.length > 0 ? (
        products.map((product, index) => {
          const features = parseFeatures(product.features);
          const imagePosition = product.imagePosition || 'left';
          const backgroundColor = product.backgroundColor || 'from-gray-50 to-white';
          const sectionId = product.sectionId || `product-${index}`;
          const isHighlighted = highlightedSection === sectionId;
          
          return (
            <section 
              key={product.id || index} 
              id={sectionId} 
              className={`py-20 bg-gradient-to-br ${backgroundColor} transition-all duration-500 ${
                isHighlighted ? 'ring-4 ring-[#E6662F] ring-opacity-75 shadow-2xl' : ''
              }`}
              style={{ scrollMarginTop: '100px' }}
            >
              <div className="max-w-7xl mx-auto px-6">
                <div className={`flex flex-col lg:flex-row gap-12 items-start ${
                  imagePosition === 'right' ? 'lg:flex-row-reverse' : ''
                }`}>
                  {/* Image */}
                  <div 
                    className={`w-full lg:w-[52%] ${imagePosition === 'right' ? '' : ''}`}
                    data-aos={imagePosition === 'right' ? 'fade-left' : 'fade-right'}
                  >
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-auto rounded-lg shadow-lg object-contain"
                        onError={(e) => {
                          // Fallback to placeholder if image fails to load
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x400?text=Product+Image';
                        }}
                      />
                    ) : (
                      <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-400">No image available</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div 
                    className={`w-full lg:w-[48%]`}
                    data-aos={imagePosition === 'right' ? 'fade-right' : 'fade-left'}
                  >
                    <h3 className="text-3xl font-bold mb-6" style={{ color: '#2879b6' }}>
                      {product.title}
                    </h3>
                    <ul className="space-y-4 text-gray-700">
                      {product.overview && (
                        <li>
                          <strong>Overview:</strong> {product.overview}
                        </li>
                      )}
                      {features.length > 0 && (
                        <li>
                          <strong>Features:</strong>
                          <ul className="ml-6 mt-2 space-y-2 list-disc">
                            {features.map((feature: string, idx: number) => (
                              <li key={idx}>{feature}</li>
                            ))}
                          </ul>
                        </li>
                      )}
                      {product.benefits && (
                        <li>
                          <strong>Benefits:</strong> {product.benefits}
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          );
        })
      ) : (
        // Fallback to hardcoded content if no CMS data
        <>
      {/* GE Signa HDxt 1.5Tesla */}
      <section id="gesignahdxt15tesla" className="py-20 bg-gradient-to-br from-gray-50 to-white" style={{ scrollMarginTop: '100px' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            <div className="w-full lg:w-[52%]" data-aos="fade-right">
              {/* Product Image - Local Asset */}
              <img
                src={ASSETS.PRODUCTS.MRI.GE_SIGNA_HDXT}
                alt="GE Signa HDxt 1.5Tesla"
                className="w-full h-auto rounded-lg shadow-lg object-contain"
              />
            </div>
            <div className="w-full lg:w-[48%]" data-aos="fade-left">
              <h3 className="text-3xl font-bold mb-6" style={{ color: '#2879b6' }}>
                GE Signa HDxt 1.5Tesla
              </h3>
              <ul className="space-y-4 text-gray-700">
                <li>
                  <strong>Overview:</strong> The GE Signa HDxt 1.5T delivers superior imaging results, equipped with advanced gradient systems and optimized for high-performance image generation across all applications.
                </li>
                <li>
                  <strong>Features:</strong>
                  <ul className="ml-6 mt-2 space-y-2 list-disc">
                    <li>48 cm field of view (FOV)</li>
                    <li>High accuracy gradients and real-time image processing</li>
                    <li>Enhanced contrast and reduced blurring for small FOV</li>
                    <li>Advanced applications including Propeller 3.0, Lavaflex, DTI</li>
                  </ul>
                </li>
                <li>
                  <strong>Benefits:</strong> Provides high-definition imaging for a wide range of clinical applications, ensuring top-quality diagnostic performance.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Philips Achieva 3.0Tesla X-Series */}
      <section 
        id="philipsachieva30teslaxseries" 
        className={`py-20 bg-gradient-to-br from-white to-gray-50 transition-all duration-500 ${
          highlightedSection === 'philipsachieva30teslaxseries' ? 'ring-4 ring-[#E6662F] ring-opacity-75 shadow-2xl' : ''
        }`}
        style={{ scrollMarginTop: '100px' }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row-reverse gap-12 items-center">
            <div className="w-full lg:w-[52%]" data-aos="fade-left">
              {/* Product Image - Local Asset */}
              <img
                src={ASSETS.PRODUCTS.MRI.PHILIPS_ACHIEVA}
                alt="Philips Achieva 3.0Tesla X-Series"
                className="w-full h-auto rounded-lg shadow-lg object-contain"
              />
            </div>
            <div className="w-full lg:w-[48%]" data-aos="fade-right">
              <h3 className="text-3xl font-bold mb-6" style={{ color: '#2879b6' }}>
                Philips Achieva 3.0Tesla X-Series
              </h3>
              <ul className="space-y-4 text-gray-700">
                <li>
                  <strong>Overview:</strong> The Philips Achieva 3.0T X-series offers comprehensive MRI capabilities, featuring advanced imaging technology for a broad range of clinical needs.
                </li>
                <li>
                  <strong>Features:</strong>
                  <ul className="ml-6 mt-2 space-y-2 list-disc">
                    <li>Exclusive quaser gradient systems for superb performance</li>
                    <li>SENSE for reduced scan times and enhanced resolution</li>
                    <li>Smart Exams for consistent MRI examination results</li>
                    <li>Powerful Transmit Technology for optimal RF uniformity</li>
                  </ul>
                </li>
                <li>
                  <strong>Benefits:</strong> Delivers exceptional image quality and operational efficiency, making it a preferred choice for advanced MRI imaging.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
        </>
      )}

      <Footer />
    </div>
  );
};

export default RefurbishedMRISystemsPage;
