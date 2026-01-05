import { useEffect, useState } from 'react';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';
import { ASSETS } from '../../constants/assets';
import { smoothScrollToHash, smoothScrollToTop } from '../../utils/smoothScroll';

const MammographySystemsPage = () => {
  // CMS Data State
  const [hero, setHero] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [highlightedSection, setHighlightedSection] = useState<string | null>(null);

  // Fetch CMS Data
  const fetchHero = async () => {
    try {
      const res = await fetch('/api/cms/mammography/hero');
      if (res.ok) {
        const json = await res.json();
        setHero(json?.data || json || null);
      }
    } catch (error) {
      console.error('Error fetching mammography hero:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/cms/mammography/products');
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
      console.error('Error fetching mammography products:', error);
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

    window.addEventListener('mammographyHeroChanged', handleHeroChange);
    window.addEventListener('mammographyProductsChanged', handleProductsChange);

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
      window.removeEventListener('mammographyHeroChanged', handleHeroChange);
      window.removeEventListener('mammographyProductsChanged', handleProductsChange);
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
      <section className="relative bg-gradient-to-r from-[#7AB730] to-[#4A90A4] pt-28 md:pt-28 lg:pt-32 pb-12 md:pb-16 flex items-center min-h-[250px] md:min-h-[300px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center w-full flex flex-col justify-center items-center h-full">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 md:mb-6 animate-fade-up">
            {hero?.title || 'Mammography Systems'}
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
              key={product.id || sectionId || index}
              id={sectionId}
              className={`py-8 md:py-12 lg:py-20 bg-gradient-to-br ${backgroundColor} relative overflow-hidden transition-all duration-500 ${isHighlighted ? 'ring-4 ring-[#E6662F] ring-opacity-75 shadow-2xl' : ''
                }`}
              style={{
                scrollMarginTop: '100px',
                background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 10%, rgba(40, 121, 182, 0.08) 90%)'
              }}
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className={`flex flex-col lg:flex-row gap-4 md:gap-6 items-start ${imagePosition === 'right' ? 'lg:flex-row-reverse' : ''
                  }`} >
                  {/* Image */}
                  <div
                    className={`w-full lg:w-[48%] flex justify-center ${imagePosition === 'right' ? 'lg:justify-end' : 'lg:justify-start'}`}
                    data-aos={imagePosition === 'right' ? 'fade-left' : 'fade-right'}
                    style={{ alignSelf: 'flex-start' }}
                  >
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.title}
                        className="max-w-full h-auto object-contain max-h-[300px] md:max-h-[495px]"
                        style={{
                          display: 'block',
                          verticalAlign: 'top',
                          margin: 0,
                          padding: 0,
                          paddingBottom: 0,
                          objectFit: 'contain',
                          maxWidth: '100%'
                        }}
                        onError={(e) => {
                          // Fallback to placeholder if image fails to load
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x400?text=Product+Image';
                        }}
                      />
                    ) : (
                      <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">No image available</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div
                    className={`w-full lg:w-[48%]`}
                    data-aos={imagePosition === 'right' ? 'fade-right' : 'fade-left'}
                    style={{ alignSelf: 'flex-start', wordWrap: 'break-word', overflowWrap: 'break-word' }}
                  >
                    <h3 className="text-2xl md:text-3xl font-bold mb-3 md:mb-5 text-center" style={{
                      color: '#2879b6',
                      marginTop: 0,
                      paddingTop: 0,
                      lineHeight: '1.2'
                    }}>{product.title}</h3>
                    <ul className="space-y-2 text-sm md:text-base text-gray-700" style={{ marginBottom: 0, paddingBottom: 0 }}>
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
          {/* PINKVIEW DR PLUS */}
          <section
            id="pinkviewdrplusdigitalmammography"
            className={`py-8 md:py-12 lg:py-20 bg-white relative overflow-hidden transition-all duration-500 ${highlightedSection === 'pinkviewdrplusdigitalmammography' ? 'ring-4 ring-[#E6662F] ring-opacity-75 shadow-2xl' : ''
              }`}
            style={{
              scrollMarginTop: '100px',
              background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 10%, #2879b6 90%)'
            }}
          >
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="flex flex-col lg:flex-row gap-6 items-start" >
                <div className="w-full lg:w-[48%] flex justify-center lg:justify-start" data-aos="fade-right" style={{ alignSelf: 'flex-start' }}>
                  {/* Product Image - Local Asset */}
                  <img
                    src={ASSETS.PRODUCTS.MAMMOGRAPHY.PINKVIEW_DR_PLUS}
                    alt="PINKVIEW DR PLUS (Digital Mammography)"
                    className="max-w-full h-auto object-contain"
                    style={{ maxHeight: '495px', objectFit: 'contain', maxWidth: '100%' }}
                  />
                </div>
                <div className="w-full lg:w-[48%]" data-aos="fade-left" style={{ alignSelf: 'flex-start', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                  <h3 className="text-3xl font-bold mb-5 text-center" style={{ color: '#2879b6' }}>
                    PINKVIEW DR PLUS (Digital Mammography)
                  </h3>
                  <ul className="space-y-2 text-gray-700" style={{ marginBottom: 0, paddingBottom: 0 }}>
                    <li>
                      <strong>Overview:</strong> The PINKVIEW DR PLUS system is designed for best-in-class breast cancer detection with advanced high-resolution mammography detectors.
                    </li>
                    <li>
                      <strong>Features:</strong>
                      <ul className="ml-6 mt-2 space-y-2 list-disc">
                        <li>75-micron pixel size for high-quality images</li>
                        <li>Convenient digital pressure control using a microcomputer</li>
                        <li>Soft compression force control for patient comfort</li>
                        <li>Automatic standard positioning with single-touch shooting</li>
                      </ul>
                    </li>
                    <li>
                      <strong>Benefits:</strong> Offers superior imaging quality with patient comfort, making it an ideal choice for early breast cancer detection.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* PINKVIEW RT */}
          <section
            id="pinkviewrtanalogmammography"
            className={`py-8 md:py-12 lg:py-20 bg-[#F8F9FA] relative overflow-hidden transition-all duration-500 ${highlightedSection === 'pinkviewrtanalogmammography' ? 'ring-4 ring-[#E6662F] ring-opacity-75 shadow-2xl' : ''
              }`}
            style={{
              scrollMarginTop: '100px',
              background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 10%, #2879b6 90%)'
            }}
          >
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="flex flex-col lg:flex-row-reverse gap-6 items-start" >
                <div className="w-full lg:w-[48%] flex justify-center lg:justify-end" data-aos="fade-left" style={{ alignSelf: 'flex-start' }}>
                  {/* Product Image - Local Asset */}
                  <img
                    src={ASSETS.PRODUCTS.MAMMOGRAPHY.PINKVIEW_RT}
                    alt="PINKVIEW RT (Analog Mammography)"
                    className="max-w-full h-auto object-contain"
                    style={{ maxHeight: '495px', objectFit: 'contain', maxWidth: '100%' }}
                  />
                </div>
                <div className="w-full lg:w-[48%]" data-aos="fade-right" style={{ alignSelf: 'flex-start', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                  <h3 className="text-3xl font-bold mb-5 text-center" style={{ color: '#2879b6' }}>
                    PINKVIEW RT (Analog Mammography)
                  </h3>
                  <ul className="space-y-2 text-gray-700" style={{ marginBottom: 0, paddingBottom: 0 }}>
                    <li>
                      <strong>Overview:</strong> The PINKVIEW RT system provides a cost-effective analog mammography solution with easy operation and installation.
                    </li>
                    <li>
                      <strong>Features:</strong>
                      <ul className="ml-6 mt-2 space-y-2 list-disc">
                        <li>18×24 cm and 24×30 cm film sizes for digitization</li>
                        <li>High DQE/low noise</li>
                        <li>Built-in generator in a slim body</li>
                        <li>Easy movement with 4 wheels</li>
                      </ul>
                    </li>
                    <li>
                      <strong>Benefits:</strong> Delivers reliable analog mammography with easy operability, ideal for facilities looking for cost-effective solutions.
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

export default MammographySystemsPage;
