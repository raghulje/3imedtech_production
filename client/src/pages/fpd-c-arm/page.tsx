import { useEffect, useState } from 'react';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';
import { smoothScrollToTop } from '../../utils/smoothScroll';

const FPDCArmPage = () => {
  // CMS Data State
  const [hero, setHero] = useState<any>(null);
  const [content, setContent] = useState<any>(null);

  // Fetch CMS Data
  const fetchHero = async () => {
    try {
      const res = await fetch('/api/cms/fpd-carm/hero');
      if (res.ok) {
        const json = await res.json();
        setHero(json?.data || json || null);
      }
    } catch (error) {
      console.error('Error fetching FPD C-ARM hero:', error);
    }
  };

  const fetchContent = async () => {
    try {
      const res = await fetch('/api/cms/fpd-carm/content');
      if (res.ok) {
        const json = await res.json();
        setContent(json?.data || json || null);
      }
    } catch (error) {
      console.error('Error fetching FPD C-ARM content:', error);
    }
  };

  useEffect(() => {
    smoothScrollToTop(400);
    fetchHero();
    fetchContent();

    // Listen for data changes from Dashboard
    const handleHeroChange = () => fetchHero();
    const handleContentChange = () => fetchContent();

    window.addEventListener('fpdCarmHeroChanged', handleHeroChange);
    window.addEventListener('fpdCarmContentChanged', handleContentChange);

    return () => {
      window.removeEventListener('fpdCarmHeroChanged', handleHeroChange);
      window.removeEventListener('fpdCarmContentChanged', handleContentChange);
    };
  }, []);

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

  // Parse benefits from JSON string or array
  const parseBenefits = (benefits: any): string[] => {
    if (!benefits) return [];
    if (Array.isArray(benefits)) return benefits;
    if (typeof benefits === 'string') {
      try {
        const parsed = JSON.parse(benefits);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        // If not JSON, treat as newline-separated string
        return benefits.split('\n').filter((b: string) => b.trim());
      }
    }
    return [];
  };

  // Fallback data
  const defaultOverview = 'A Made-in-India advanced imaging system offering high-resolution, low-dose imaging for a wide range of surgical procedures.';
  
  const defaultFeatures = [
    'CsI Flat Panel Detector',
    'Large Field of View',
    'ADONIS TIALIC low-dose technology',
    'Wireless connectivity with PACS',
    'Compact, space-saving design'
  ];

  const defaultBenefits = [
    'Clear, detailed images',
    'Reduced radiation exposure',
    'Faster, smoother workflow',
    'Suitable for multiple surgical specialties',
    'Easy hospital system integration'
  ];

  const features = content?.features ? parseFeatures(content.features) : defaultFeatures;
  const benefits = content?.benefits ? parseBenefits(content.benefits) : defaultBenefits;

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      {hero?.isActive !== false && (
        <section 
          className="relative bg-gradient-to-r from-[#7AB730] to-[#4A90A4] pt-32 pb-16 flex items-center min-h-[300px]"
          style={hero?.backgroundImage ? {
            backgroundImage: `url(${hero.backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          } : {}}
        >
          <div className={`absolute inset-0 ${hero?.backgroundImage ? 'bg-black/50' : ''}`}></div>
          <div className="container mx-auto px-4 text-center relative z-10 w-full">
            <h1 
              className="text-4xl md:text-5xl font-bold text-white mb-6 animate-fade-up"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {hero?.title || 'FPD C-ARM'}
            </h1>
            {hero?.subtitle && (
              <p 
                className="text-xl md:text-2xl text-white/90 mb-4"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {hero.subtitle}
              </p>
            )}
            {hero?.description && (
              <p 
                className="text-base md:text-lg text-white/80 max-w-3xl mx-auto"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {hero.description}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Product Content Section */}
      {content?.isActive !== false && (
        <section className="pt-32 pb-14 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-12 items-start">
              {/* Content - Left Side */}
              <div 
                className="w-full lg:w-[48%]"
                style={{ fontFamily: 'Montserrat, sans-serif', alignSelf: 'flex-start' }}
              >
                <h2 
                  className="text-4xl font-bold mb-8 uppercase"
                  style={{ 
                    fontFamily: 'Montserrat, sans-serif',
                    color: '#2879b6',
                    marginTop: 0,
                    paddingTop: 0,
                    lineHeight: '1.2'
                  }}
                >
                  FPD C-ARM
                </h2>
                
                <div className="mb-8">
                  <p 
                    className="text-gray-700 leading-relaxed mb-6"
                    style={{ 
                      fontFamily: 'Montserrat, sans-serif',
                      fontSize: '1rem',
                      lineHeight: '1.625em'
                    }}
                  >
                    <strong>Overview:</strong> {content?.overview || defaultOverview}
                  </p>
                </div>

                {features.length > 0 && (
                  <div className="mb-8">
                    <p 
                      className="text-gray-700 mb-3"
                      style={{ 
                        fontFamily: 'Montserrat, sans-serif',
                        fontSize: '1rem',
                        fontWeight: 600
                      }}
                    >
                      <strong>Features:</strong>
                    </p>
                    <ul className="space-y-2 list-none">
                      {features.map((feature, index) => (
                        <li 
                          key={index} 
                          className="flex items-start"
                          style={{ 
                            fontFamily: 'Montserrat, sans-serif',
                            fontSize: '1rem',
                            color: '#333842'
                          }}
                        >
                          <span className="mr-3 mt-1" style={{ color: '#333842' }}>•</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {benefits.length > 0 && (
                  <div>
                    <p 
                      className="text-gray-700 mb-3"
                      style={{ 
                        fontFamily: 'Montserrat, sans-serif',
                        fontSize: '1rem',
                        fontWeight: 600
                      }}
                    >
                      <strong>Benefits:</strong>
                    </p>
                    <ul className="space-y-2 list-none">
                      {benefits.map((benefit, index) => (
                        <li 
                          key={index} 
                          className="flex items-start"
                          style={{ 
                            fontFamily: 'Montserrat, sans-serif',
                            fontSize: '1rem',
                            color: '#333842'
                          }}
                        >
                          <span className="mr-3 mt-1" style={{ color: '#333842' }}>•</span>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Product Image - Right Side */}
              <div 
                className="w-full lg:w-[52%]"
                style={{ alignSelf: 'flex-start' }}
              >
                <img
                  src={content?.productImage || 'https://3imedtech.com/wp-content/uploads/2025/11/fpd-crm.jpg'}
                  alt="FPD C-ARM Product"
                  className="w-full h-auto object-contain"
                  style={{ 
                    display: 'block',
                    verticalAlign: 'top',
                    margin: 0,
                    padding: 0
                  }}
                  onError={(e) => {
                    // Fallback to default image if CMS image fails
                    (e.target as HTMLImageElement).src = 'https://3imedtech.com/wp-content/uploads/2025/11/fpd-crm.jpg';
                  }}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default FPDCArmPage;

