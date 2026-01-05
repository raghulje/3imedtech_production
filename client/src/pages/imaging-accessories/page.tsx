import { useEffect, useState } from 'react';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';
import { ASSETS } from '../../constants/assets';

const ImagingAccessoriesPage = () => {
  const [heroData, setHeroData] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [highlightedSection, setHighlightedSection] = useState<string | null>(null);

  // Function to scroll to section with highlighting
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // Remove previous highlight
      setHighlightedSection(null);

      // Calculate offset for fixed header (header height + some padding)
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      // Add highlight effect
      setHighlightedSection(sectionId);

      // Remove highlight after animation
      setTimeout(() => {
        setHighlightedSection(null);
      }, 2000);
    }
  };

  // Fetch CMS data function
  const fetchData = async () => {
    try {
      const [heroRes, productsRes] = await Promise.all([
        fetch('/api/cms/imaging-accessories/hero'),
        fetch('/api/cms/imaging-accessories/products')
      ]);

      if (heroRes.ok) {
        const heroJson = await heroRes.json();
        setHeroData(heroJson?.data || heroJson);
      }

      if (productsRes.ok) {
        const productsJson = await productsRes.json();
        const productsData = Array.isArray(productsJson?.data) ? productsJson.data : productsJson;
        const sortedProducts = productsData
          .filter((p: any) => p.isActive !== false && !p.isDeleted)
          .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
        setProducts(sortedProducts);
      }

      // Handle hash navigation after data is loaded (works for both CMS products and fallback sections)
      if (window.location.hash) {
        const hash = window.location.hash.substring(1);
        // Wait for DOM to update (longer delay for fallback sections)
        setTimeout(() => {
          scrollToSection(hash);
        }, 500);
      }
    } catch (error) {
      console.error('Error fetching Imaging Accessories data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Listen for CMS updates
    const handleHeroChange = () => {
      fetch('/api/cms/imaging-accessories/hero')
        .then(res => res.json())
        .then(json => setHeroData(json?.data || json))
        .catch(err => console.error('Error fetching hero:', err));
    };

    const handleProductsChange = () => {
      fetch('/api/cms/imaging-accessories/products')
        .then(res => res.json())
        .then(json => {
          const productsData = Array.isArray(json?.data) ? json.data : json;
          const sortedProducts = productsData
            .filter((p: any) => p.isActive !== false && !p.isDeleted)
            .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
          setProducts(sortedProducts);
        })
        .catch(err => console.error('Error fetching products:', err));
    };

    window.addEventListener('imagingAccessoriesHeroChanged', handleHeroChange);
    window.addEventListener('imagingAccessoriesProductsChanged', handleProductsChange);

    // Handle hash changes (when clicking links on the same page)
    const handleHashChange = () => {
      if (window.location.hash) {
        const hash = window.location.hash.substring(1);
        setTimeout(() => {
          scrollToSection(hash);
        }, 100);
      }
    };

    window.addEventListener('hashchange', handleHashChange);

    // AOS is initialized globally in App.tsx
    return () => {
      window.removeEventListener('imagingAccessoriesHeroChanged', handleHeroChange);
      window.removeEventListener('imagingAccessoriesProductsChanged', handleProductsChange);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section
        className="relative h-[200px] md:h-[250px] lg:h-[280px] bg-gradient-to-r from-[#7AB730] to-[#7AB730] flex items-center justify-center mt-28 md:mt-20"
        data-aos="fade-up"
        style={{
          backgroundImage: heroData?.backgroundImage ? `url(${heroData.backgroundImage})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#7AB730]/90 to-[#7AB730]/90"></div>
        <div className="text-center relative z-10 px-4 flex flex-col justify-center items-center h-full w-full">
          <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold">
            {heroData?.title || 'Imaging Accessories'}
          </h1>
          {heroData?.subtitle && (
            <p className="text-white text-xl mt-4">{heroData.subtitle}</p>
          )}
          {heroData?.description && (
            <p className="text-white text-base md:text-lg mt-2 opacity-90 max-w-3xl mx-auto">{heroData.description}</p>
          )}
        </div>
      </section>

      {/* Products from CMS or Static Fallback */}
      {loading ? (
        <div className="py-14 text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      ) : products.length > 0 ? (
        products.map((product: any, index: number) => {
          const features = typeof product.features === 'string'
            ? (() => {
              try {
                return JSON.parse(product.features);
              } catch {
                return product.features.split('\n').filter((f: string) => f.trim());
              }
            })()
            : product.features || [];

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
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-16 h-32 bg-gradient-to-r from-[#027C8E] to-transparent"></div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-16 h-32 bg-gradient-to-l from-[#E6662F] to-transparent"></div>

              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {(() => {
                  const imagePosition = product.imagePosition || 'left';
                  const isImageRight = imagePosition === 'right';
                  return (
                    <div className={`flex flex-col lg:flex-row gap-4 md:gap-6 items-start ${isImageRight ? 'lg:flex-row-reverse' : ''}`}>
                      <div className={`w-full lg:w-[48%]`} data-aos={isImageRight ? 'fade-right' : 'fade-left'} style={{ alignSelf: 'flex-start', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
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
                      <div className={`w-full lg:w-[48%] flex justify-center ${isImageRight ? 'lg:justify-end' : 'lg:justify-start'}`} data-aos={isImageRight ? 'fade-left' : 'fade-right'} style={{ alignSelf: 'flex-start' }}>
                        <img
                          src={product.image || ASSETS.PRODUCTS.IMAGING_ACCESSORIES.DMD_D_2000}
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
                        />
                      </div>
                    </div>
                  );
                })()}
              </div>
            </section>
          );
        })
      ) : (
        <>
          {/* DMD D 2000, X-Ray Film Digitizer - Static Fallback */}
          <section
            id="dmdd2000xrayfilmdigitizer"
            className={`py-8 md:py-12 lg:py-20 bg-white relative overflow-hidden transition-all duration-500 ${highlightedSection === 'dmdd2000xrayfilmdigitizer' ? 'ring-4 ring-[#E6662F] ring-opacity-75 shadow-2xl' : ''
              }`}
            style={{ scrollMarginTop: '128px' }}
          >
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-16 h-32 bg-gradient-to-r from-[#027C8E] to-transparent"></div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-16 h-32 bg-gradient-to-l from-[#E6662F] to-transparent"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
              <div className="flex flex-col lg:flex-row gap-4 md:gap-6 items-start">
                <div className="w-full lg:w-[48%]" data-aos="fade-right" style={{ alignSelf: 'flex-start', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                  <h3 className="text-2xl md:text-3xl font-bold mb-3 md:mb-5 text-center" style={{ color: '#2879b6' }}>DMD D 2000, X-Ray Film Digitizer</h3>
                  <ul className="space-y-2 text-gray-700" style={{ marginBottom: 0, paddingBottom: 0 }}>
                    <li>
                      <strong>Overview:</strong> The DMD D 2000 is a medical-grade X-ray film digitizer designed to convert conventional radiographic films into digital formats for easy comparison and storage.
                    </li>
                    <li>
                      <strong>Features:</strong>
                      <ul className="ml-6 mt-2 space-y-2 list-disc">
                        <li>High brightness for enhanced images</li>
                        <li>Slim data size for efficient storage</li>
                        <li>Support for various data formats</li>
                        <li>Auto-sizing and brightness control</li>
                      </ul>
                    </li>
                    <li>
                      <strong>Benefits:</strong> Facilitates easy digitization of X-ray films, ensuring high-quality digital storage and comparison.
                    </li>
                  </ul>
                </div>
                <div className="w-full lg:w-[48%] flex items-start justify-center lg:justify-end" data-aos="fade-left" style={{}}>
                  <img
                    src={ASSETS.PRODUCTS.IMAGING_ACCESSORIES.DMD_D_2000}
                    alt="DMD D 2000, X-Ray Film Digitizer"
                    className="max-w-full h-auto object-contain"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Image Display Monitors */}
          <section
            id="imagedisplaymonitors"
            className={`py-8 md:py-12 lg:py-20 bg-[#F8F9FA] relative overflow-hidden transition-all duration-500 ${highlightedSection === 'imagedisplaymonitors' ? 'ring-4 ring-[#E6662F] ring-opacity-75 shadow-2xl' : ''
              }`}
            style={{ scrollMarginTop: '128px' }}
          >
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-16 h-32 bg-gradient-to-r from-[#027C8E] to-transparent"></div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-16 h-32 bg-gradient-to-l from-[#E6662F] to-transparent"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
              <div className="flex flex-col lg:flex-row-reverse gap-4 md:gap-6 items-start">
                <div className="w-full lg:w-[48%] flex items-start justify-center lg:justify-start" data-aos="fade-right" style={{}}>
                  <img
                    src={ASSETS.PRODUCTS.IMAGING_ACCESSORIES.IMAGE_DISPLAY_MONITORS}
                    alt="Image Display Monitors"
                    className="max-w-full h-auto object-contain"
                    className="max-h-[300px] md:max-h-[495px]"
                    style={{ objectFit: 'contain', maxWidth: '100%' }}
                  />
                </div>
                <div className="w-full lg:w-[48%]" data-aos="fade-left" style={{ alignSelf: 'flex-start', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                  <h3 className="text-2xl md:text-3xl font-bold mb-3 md:mb-5 text-center" style={{ color: '#2879b6' }}>Image Display Monitors</h3>
                  <ul className="space-y-2 text-gray-700" style={{ marginBottom: 0, paddingBottom: 0 }}>
                    <li>
                      <strong>Overview:</strong> USFDA/CE-certified display monitors support accurate display of monochrome and color images, ensuring reliable diagnostic quality.
                    </li>
                    <li>
                      <strong>Features:</strong>
                      <ul className="ml-6 mt-2 space-y-2 list-disc">
                        <li>Multi-monitor configuration</li>
                        <li>Backlight stabilization and ambient sensor</li>
                        <li>Maintains image quality over time</li>
                        <li>High brightness for performance standards</li>
                      </ul>
                    </li>
                    <li>
                      <strong>Benefits:</strong> Provides reliable and accurate image display, crucial for diagnostic confidence.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* CT/MR/Mammograph Multi-Modality Workstations */}
          <section
            id="ctmrmammographmultimodalityworkstations"
            className={`py-8 md:py-12 lg:py-20 bg-white relative overflow-hidden transition-all duration-500 ${highlightedSection === 'ctmrmammographmultimodalityworkstations' ? 'ring-4 ring-[#E6662F] ring-opacity-75 shadow-2xl' : ''
              }`}
            style={{ scrollMarginTop: '128px' }}
          >
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-16 h-32 bg-gradient-to-r from-[#027C8E] to-transparent"></div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-16 h-32 bg-gradient-to-l from-[#E6662F] to-transparent"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
              <div className="flex flex-col lg:flex-row gap-4 md:gap-6 items-start">
                <div className="w-full lg:w-[48%]" data-aos="fade-right" style={{ alignSelf: 'flex-start', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                  <h3 className="text-2xl md:text-3xl font-bold mb-3 md:mb-5 text-center" style={{ color: '#2879b6' }}>CT/MR/Mammograph Multi-Modality Workstations</h3>
                  <ul className="space-y-2 text-gray-700" style={{ marginBottom: 0, paddingBottom: 0 }}>
                    <li>
                      <strong>Overview:</strong> These workstations provide vendor-neutral access to a large set of dedicated tools for viewing and analyzing CT, MR, and mammography images.
                    </li>
                    <li>
                      <strong>Features:</strong>
                      <ul className="ml-6 mt-2 space-y-2 list-disc">
                        <li>Access to current and prior studies for direct comparison</li>
                        <li>Customized hanging protocols</li>
                        <li>2D/3D CAD support</li>
                        <li>Images can be viewed on a single station</li>
                      </ul>
                    </li>
                    <li>
                      <strong>Benefits:</strong> Enhances workflow efficiency and diagnostic accuracy with comprehensive imaging tools.
                    </li>
                  </ul>
                </div>
                <div className="w-full lg:w-[48%] flex items-start justify-center lg:justify-end" data-aos="fade-left" style={{}}>
                  <img
                    src={ASSETS.PRODUCTS.IMAGING_ACCESSORIES.CT_MR_MAMMOGRAPH_WORKSTATIONS}
                    alt="CT/MR/Mammograph Multi-Modality Workstations"
                    className="max-w-full h-auto object-contain"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* CD/DVD Publishers */}
          <section
            id="cddvdpublishers"
            className={`py-8 md:py-12 lg:py-20 bg-[#F8F9FA] relative overflow-hidden transition-all duration-500 ${highlightedSection === 'cddvdpublishers' ? 'ring-4 ring-[#E6662F] ring-opacity-75 shadow-2xl' : ''
              }`}
            style={{ scrollMarginTop: '128px' }}
          >
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-16 h-32 bg-gradient-to-r from-[#027C8E] to-transparent"></div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-16 h-32 bg-gradient-to-l from-[#E6662F] to-transparent"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
              <div className="flex flex-col lg:flex-row-reverse gap-4 md:gap-6 items-start">
                <div className="w-full lg:w-[48%] flex items-start justify-center lg:justify-start" data-aos="fade-right" style={{}}>
                  <img
                    src={ASSETS.PRODUCTS.IMAGING_ACCESSORIES.CD_DVD_PUBLISHERS}
                    alt="CD/DVD Publishers"
                    className="max-w-full h-auto object-contain"
                    className="max-h-[300px] md:max-h-[495px]"
                    style={{ objectFit: 'contain', maxWidth: '100%' }}
                  />
                </div>
                <div className="w-full lg:w-[48%]" data-aos="fade-left" style={{ alignSelf: 'flex-start', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                  <h3 className="text-2xl md:text-3xl font-bold mb-3 md:mb-5 text-center" style={{ color: '#2879b6' }}>CD/DVD Publishers</h3>
                  <ul className="space-y-2 text-gray-700" style={{ marginBottom: 0, paddingBottom: 0 }}>
                    <li>
                      <strong>Overview:</strong> DICOM calibrated publishers designed for auto-labelling, printing, and storage of DICOM images, suitable for hospital and center use.
                    </li>
                    <li>
                      <strong>Features:</strong>
                      <ul className="ml-6 mt-2 space-y-2 list-disc">
                        <li>Easy integration with PACS</li>
                        <li>Auto-pick of CD or DVD based on file size</li>
                        <li>DICOM calibrated for accuracy</li>
                        <li>High reliability for long-term storage</li>
                      </ul>
                    </li>
                    <li>
                      <strong>Benefits:</strong> Ensures seamless and accurate storage and distribution of DICOM images, supporting efficient data management.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* MedE Drive for Patient Data Storage */}
          <section
            id="mededrive"
            className={`py-8 md:py-12 lg:py-20 bg-white relative overflow-hidden transition-all duration-500 ${highlightedSection === 'mededrive' ? 'ring-4 ring-[#E6662F] ring-opacity-75 shadow-2xl' : ''
              }`}
            style={{ scrollMarginTop: '128px' }}
          >
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-16 h-32 bg-gradient-to-r from-[#027C8E] to-transparent"></div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-16 h-32 bg-gradient-to-l from-[#E6662F] to-transparent"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
              <div className="flex flex-col lg:flex-row gap-4 md:gap-6 items-start">
                <div className="w-full lg:w-[48%]" data-aos="fade-right" style={{ alignSelf: 'flex-start', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                  <h3 className="text-2xl md:text-3xl font-bold mb-3 md:mb-5 text-center" style={{ color: '#2879b6' }}>MedE Drive for Patient Data Storage</h3>
                  <ul className="space-y-2 text-gray-700" style={{ marginBottom: 0, paddingBottom: 0 }}>
                    <li>
                      <strong>Overview:</strong> MedE Drive is a chip-based digital health card designed for storing all types of health records, offering a convenient way to carry patient data.
                    </li>
                    <li>
                      <strong>Features:</strong>
                      <ul className="ml-6 mt-2 space-y-2 list-disc">
                        <li>32 GB storage capacity</li>
                        <li>Write protection to avoid data tampering</li>
                        <li>Personalized card with patient details</li>
                        <li>Compatible with various devices</li>
                      </ul>
                    </li>
                    <li>
                      <strong>Benefits:</strong> Ensures secure and portable storage of patient data, making it accessible anytime, anywhere.
                    </li>
                  </ul>
                </div>
                <div className="w-full lg:w-[48%] flex items-start justify-center lg:justify-end" data-aos="fade-left" style={{}}>
                  <img
                    src={ASSETS.PRODUCTS.IMAGING_ACCESSORIES.MEDE_DRIVE}
                    alt="MedE Drive for Patient Data Storage"
                    className="max-w-full h-auto object-contain"
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

export default ImagingAccessoriesPage;
