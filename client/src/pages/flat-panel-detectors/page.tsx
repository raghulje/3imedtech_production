import { useEffect, useState } from 'react';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';
import { ASSETS } from '../../constants/assets';
import { smoothScrollToHash, smoothScrollToTop } from '../../utils/smoothScroll';

const FlatPanelDetectorsPage = () => {
  // CMS Data State
  const [hero, setHero] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [highlightedSection, setHighlightedSection] = useState<string | null>(null);

  // Fetch CMS Data
  const fetchHero = async () => {
    try {
      const res = await fetch('/api/cms/flat-panel/hero');
      if (res.ok) {
        const json = await res.json();
        setHero(json?.data || json || null);
      }
    } catch (error) {
      console.error('Error fetching flat panel hero:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/cms/flat-panel/products');
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
      console.error('Error fetching flat panel products:', error);
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
        } else {
          // If element not found, try again after a longer delay (for hardcoded sections)
          setTimeout(() => {
            const retryElement = document.getElementById(hash);
            if (retryElement) {
              smoothScrollToHash(window.location.hash, {
                offset: 100,
                duration: 800,
              });
              setHighlightedSection(hash);
              setTimeout(() => {
                setHighlightedSection(null);
              }, 2000);
            }
          }, 1000);
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

    window.addEventListener('flatPanelHeroChanged', handleHeroChange);
    window.addEventListener('flatPanelProductsChanged', handleProductsChange);

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
      window.removeEventListener('flatPanelHeroChanged', handleHeroChange);
      window.removeEventListener('flatPanelProductsChanged', handleProductsChange);
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
            {hero?.title || 'Flat Panel Detectors'}
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
                    className={`w-full lg:w-[52%] flex items-center justify-center ${imagePosition === 'right' ? '' : ''}`}
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
                    className={`w-full lg:w-[48%] ${imagePosition === 'right' ? '' : ''}`}
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
      {/* Glass-Free Flat Panel Detector */}
      <section 
        id="glassfreeflatpaneldetector" 
        className={`py-20 bg-gradient-to-br from-gray-50 to-white transition-all duration-500 ${
          highlightedSection === 'glassfreeflatpaneldetector' ? 'ring-4 ring-[#E6662F] ring-opacity-75 shadow-2xl' : ''
        }`}
        style={{ scrollMarginTop: '100px' }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            <div className="w-full lg:w-[52%] flex items-center justify-center" data-aos="fade-right">
              {/* Product Image - Local Asset */}
              <img
                src={ASSETS.PRODUCTS.DETECTORS.GLASS_FREE}
                alt="Glass-Free Flat Panel Detector"
                className="w-full h-auto rounded-lg shadow-lg object-contain"
              />
            </div>
            <div className="w-full lg:w-[48%]" data-aos="fade-left">
              <h3 className="text-3xl font-bold mb-6" style={{ color: '#2879b6' }}>
                Glass-Free Flat Panel Detector
              </h3>
              <ul className="space-y-4 text-gray-700">
                <li>
                  <strong>Overview:</strong> The new generation glass-free flat panel detector offers high DQE for excellent image quality with robust construction designed to handle up to 150 kg.
                </li>
                <li>
                  <strong>Features:</strong>
                  <ul className="ml-6 mt-2 space-y-2 list-disc">
                    <li>17″×17″ and 14″×17″ sizes available</li>
                    <li>Wired and wireless CSI Technology</li>
                    <li>Unprecedented weight of 3 kg</li>
                    <li>Advanced software technology for easy deployment</li>
                  </ul>
                </li>
                <li>
                  <strong>Benefits:</strong> Provides unmatched image quality and durability, ideal for a wide range of clinical applications.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Retrofit Mammography Panel */}
      <section 
        id="retrofitmammographypanel" 
        className={`py-20 bg-gradient-to-br from-white to-gray-50 transition-all duration-500 ${
          highlightedSection === 'retrofitmammographypanel' ? 'ring-4 ring-[#E6662F] ring-opacity-75 shadow-2xl' : ''
        }`}
        style={{ scrollMarginTop: '100px' }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row-reverse gap-12 items-start">
            <div className="w-full lg:w-[48%]" data-aos="fade-right">
              <h3 className="text-3xl font-bold mb-6" style={{ color: '#2879b6' }}>
                Retrofit Mammography Panel
              </h3>
              <ul className="space-y-4 text-gray-700">
                <li>
                  <strong>Overview:</strong> This slim cassette-type digital mammography upgrade solution is designed by radiologists to provide an optimal user experience.
                </li>
                <li>
                  <strong>Features:</strong>
                  <ul className="ml-6 mt-2 space-y-2 list-disc">
                    <li>18×24 cm and 24×30 cm sizes available</li>
                    <li>76-micron pixel size for excellent image quality</li>
                    <li>High DQE/low noise</li>
                    <li>Mobile application for easy use</li>
                  </ul>
                </li>
                <li>
                  <strong>Benefits:</strong> Offers a cost-effective solution for upgrading existing mammography systems to digital without the need for a complete overhaul.
                </li>
              </ul>
            </div>
            <div className="w-full lg:w-[52%] flex items-center justify-center" data-aos="fade-left">
              {/* Product Image - Local Asset */}
              <img
                src={ASSETS.PRODUCTS.DETECTORS.RETROFIT_MAMMOGRAPHY}
                alt="Retrofit Mammography Panel"
                className="w-full h-auto rounded-lg shadow-lg object-contain"
              />
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

export default FlatPanelDetectorsPage;
