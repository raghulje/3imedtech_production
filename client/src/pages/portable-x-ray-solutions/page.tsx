import { useEffect, useState } from 'react';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';
import { ASSETS } from '../../constants/assets';
import AOS from 'aos';
import { smoothScrollToHash, smoothScrollToTop } from '../../utils/smoothScroll';

const PortableXRaySolutionsPage = () => {
  // CMS Data State
  const [hero, setHero] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [highlightedSection, setHighlightedSection] = useState<string | null>(null);

  // Fetch CMS Data
  const fetchHero = async () => {
    try {
      const res = await fetch('/api/cms/portable-xray/hero');
      if (res.ok) {
        const json = await res.json();
        setHero(json?.data || json || null);
      }
    } catch (error) {
      console.error('Error fetching portable xray hero:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/cms/portable-xray/products');
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
      console.error('Error fetching portable xray products:', error);
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
    const handleProductsChange = () => {
      fetchProducts();
      // Refresh AOS when products change
      setTimeout(() => {
        AOS.refresh();
      }, 100);
    };

    window.addEventListener('portableXRayHeroChanged', handleHeroChange);
    window.addEventListener('portableXRayProductsChanged', handleProductsChange);

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
      window.removeEventListener('portableXRayHeroChanged', handleHeroChange);
      window.removeEventListener('portableXRayProductsChanged', handleProductsChange);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Re-run hash navigation when products are loaded
  useEffect(() => {
    if (products.length > 0 && window.location.hash) {
      scrollToHashSection();
    }
  }, [products]);

  // Refresh AOS when products change
  useEffect(() => {
    if (products.length > 0) {
      setTimeout(() => {
        AOS.refresh();
      }, 100);
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
      <section 
        className="relative pt-32 pb-16 flex items-center min-h-[300px]"
        style={{
          backgroundImage: hero?.backgroundImage ? `url(${hero.backgroundImage})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: hero?.backgroundImage ? 'transparent' : undefined
        }}
      >
        <div className={`absolute inset-0 ${hero?.backgroundImage ? 'bg-black/50' : 'bg-gradient-to-r from-[#7AB730] to-[#4A90A4]'}`}></div>
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10 w-full">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-up" data-aos="fade-up">
            {hero?.title || 'Portable X-Ray Solutions'}
          </h1>
          {hero?.subtitle && (
            <p className="text-xl md:text-2xl text-white mb-4 opacity-90" data-aos="fade-up" data-aos-delay="100">
              {hero.subtitle}
            </p>
          )}
          {hero?.description && (
            <p className="text-base md:text-lg text-white opacity-80 max-w-3xl mx-auto" data-aos="fade-up" data-aos-delay="200">
              {hero.description}
            </p>
          )}
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
              className={`pt-8 pb-6 bg-gradient-to-br ${backgroundColor} transition-all duration-500 ${
                isHighlighted ? 'ring-4 ring-[#E6662F] ring-opacity-75 shadow-2xl' : ''
              }`}
              style={{ 
                scrollMarginTop: '100px',
                background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 10%, rgba(40, 121, 182, 0.08) 90%)'
              }}
            >
              <div className="container mx-auto px-4">
                <div className={`flex flex-col lg:flex-row gap-12 items-start ${
                  imagePosition === 'right' ? 'lg:flex-row-reverse' : ''
                }`}>
                  {/* Image */}
                  <div 
                    className={`w-full lg:w-[52%] ${imagePosition === 'right' ? '' : ''}`}
                    data-aos={imagePosition === 'right' ? 'fade-left' : 'fade-right'}
                    style={{ alignSelf: 'flex-start' }}
                  >
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-auto rounded-lg shadow-lg object-contain scale-[0.8]"
                        style={{ 
                          display: 'block',
                          verticalAlign: 'top',
                          margin: 0,
                          padding: 0,
                          transformOrigin: 'top center'
                        }}
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
                    style={{ alignSelf: 'flex-start' }}
                  >
                    <h3 className="text-3xl font-bold mb-4" style={{ 
                      color: '#2879b6',
                      marginTop: 0,
                      paddingTop: 0,
                      lineHeight: '1.2'
                    }}>
                      {product.title}
                    </h3>
                    <ul className="space-y-3 text-gray-700">
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
      {/* Mini 90 Point-of-Care X-Ray */}
      <section 
        id="mini90pointofcarexray" 
        className={`pt-8 pb-6 bg-gradient-to-br from-gray-50 to-white transition-all duration-500 ${
          highlightedSection === 'mini90pointofcarexray' ? 'ring-4 ring-[#E6662F] ring-opacity-75 shadow-2xl' : ''
        }`}
        style={{ 
          scrollMarginTop: '100px',
          background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 10%, #2879b6 90%)'
        }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            <div className="w-full lg:w-[52%]" data-aos="fade-right" style={{ alignSelf: 'flex-start' }}>
              <img
                src={ASSETS.PRODUCTS.PORTABLE.MINI_90}
                alt="Mini 90 Point-of-Care X-ray"
                className="w-full h-auto rounded-lg shadow-lg object-contain scale-[0.8]"
                style={{ 
                  display: 'block',
                  verticalAlign: 'top',
                  margin: 0,
                  padding: 0,
                  transformOrigin: 'top center'
                }}
              />
            </div>
            <div className="w-full lg:w-[48%]" data-aos="fade-left" style={{ alignSelf: 'flex-start' }}>
              <h3 className="text-3xl font-bold mb-4" style={{ 
                color: '#2879b6',
                marginTop: 0,
                paddingTop: 0,
                lineHeight: '1.2'
              }}>
                Mini 90 Point-of-Care X-Ray
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li>
                  <strong>Overview:</strong> The Mini 90 is a lightweight, compact, portable X-Ray unit designed for point-of-care emergencies, homecare, accident sites, and smaller clinics.
                </li>
                <li>
                  <strong>Features:</strong>
                  <ul className="ml-6 mt-2 space-y-2 list-disc">
                    <li>High penetration with selectable kV range from 40 kV to 90 kV</li>
                    <li>Programmable exposure settings</li>
                    <li>Small focal spot of 0.8mm</li>
                    <li>Built-in Lithium-polymer batteries for up to 150 exposures per charge</li>
                  </ul>
                </li>
                <li>
                  <strong>Benefits:</strong> Offers exceptional portability with high-quality imaging in critical and remote care situations.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ADONIS HF Mobile DR */}
      <section 
        id="adonishfmobiledr" 
        className={`pt-8 pb-6 bg-gradient-to-br from-white to-gray-50 transition-all duration-500 ${
          highlightedSection === 'adonishfmobiledr' ? 'ring-4 ring-[#E6662F] ring-opacity-75 shadow-2xl' : ''
        }`}
        style={{ 
          scrollMarginTop: '100px',
          background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 10%, #2879b6 90%)'
        }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row-reverse gap-12 items-start">
            <div className="w-full lg:w-[48%]" data-aos="fade-right" style={{ alignSelf: 'flex-start' }}>
              <h3 className="text-3xl font-bold mb-4" style={{ 
                color: '#2879b6',
                marginTop: 0,
                paddingTop: 0,
                lineHeight: '1.2'
              }}>
                ADONIS HF Mobile DR
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li>
                  <strong>Overview:</strong> The ADONIS HF Mobile DR system is a compact and lightweight digital radiography solution that ensures productivity and flexibility in ICUs, ERs, and operating rooms.
                </li>
                <li>
                  <strong>Features:</strong>
                  <ul className="ml-6 mt-2 space-y-2 list-disc">
                    <li>Featherweight design</li>
                    <li>Actuator-based motorized vertical movement</li>
                    <li>Dual battery system</li>
                    <li>Soft touch keypad with auto-programmable features</li>
                  </ul>
                </li>
                <li>
                  <strong>Benefits:</strong> Ensures ease of use and mobility for high-demand environments where space and flexibility are crucial.
                </li>
              </ul>
            </div>
            <div className="w-full lg:w-[52%]" data-aos="fade-left" style={{ alignSelf: 'flex-start' }}>
              <img
                src={ASSETS.PRODUCTS.PORTABLE.ADONIS_HF_MOBILE_DR}
                alt="ADONIS HF Mobile DR"
                className="w-full h-auto rounded-lg shadow-lg object-contain scale-[0.8]"
                style={{ 
                  display: 'block',
                  verticalAlign: 'top',
                  margin: 0,
                  padding: 0,
                  transformOrigin: 'top center'
                }}
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

export default PortableXRaySolutionsPage;
