
import { useEffect, useState } from 'react';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';
import { ASSETS } from '../../constants/assets';

export default function WhyChooseUs() {
  // CMS Data State
  const [whyChooseUsHero, setWhyChooseUsHero] = useState<any>(null);
  const [whyChooseUsOfferings, setWhyChooseUsOfferings] = useState<any>(null);
  const [whyChooseUsAdvantages, setWhyChooseUsAdvantages] = useState<any>(null);

  // Fetch CMS Data
  const fetchWhyChooseUsHero = async () => {
    try {
      const res = await fetch('/api/cms/why-choose-us-page/hero');
      if (res.ok) {
        const json = await res.json();
        setWhyChooseUsHero(json?.data || json || null);
      }
    } catch (error) {
      console.error('Error fetching why choose us hero:', error);
    }
  };

  const fetchWhyChooseUsOfferings = async () => {
    try {
      const res = await fetch('/api/cms/why-choose-us-page/offerings');
      if (res.ok) {
        const json = await res.json();
        setWhyChooseUsOfferings(json?.data || json || null);
      }
    } catch (error) {
      console.error('Error fetching why choose us offerings:', error);
    }
  };

  const fetchWhyChooseUsAdvantages = async () => {
    try {
      const res = await fetch('/api/cms/why-choose-us-page/advantages');
      if (res.ok) {
        const json = await res.json();
        setWhyChooseUsAdvantages(json?.data || json || null);
      }
    } catch (error) {
      console.error('Error fetching why choose us advantages:', error);
    }
  };

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.fade-up, .fade-in, .fade-right').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Fetch CMS data
    fetchWhyChooseUsHero();
    fetchWhyChooseUsOfferings();
    fetchWhyChooseUsAdvantages();

    // Listen for data changes from Dashboard
    const handleWhyChooseUsHeroChange = () => fetchWhyChooseUsHero();
    const handleWhyChooseUsOfferingsChange = () => fetchWhyChooseUsOfferings();
    const handleWhyChooseUsAdvantagesChange = () => fetchWhyChooseUsAdvantages();

    window.addEventListener('whyChooseUsHeroChanged', handleWhyChooseUsHeroChange);
    window.addEventListener('whyChooseUsOfferingsChanged', handleWhyChooseUsOfferingsChange);
    window.addEventListener('whyChooseUsAdvantagesChanged', handleWhyChooseUsAdvantagesChange);

    return () => {
      window.removeEventListener('whyChooseUsHeroChanged', handleWhyChooseUsHeroChange);
      window.removeEventListener('whyChooseUsOfferingsChanged', handleWhyChooseUsOfferingsChange);
      window.removeEventListener('whyChooseUsAdvantagesChanged', handleWhyChooseUsAdvantagesChange);
    };
  }, []);

  return (
    <div className="why-choose-us-page">
      <Header />

      {/* Hero Section - CMS or Fallback */}
      {whyChooseUsHero?.isActive !== false && (
        <section className="relative bg-cover bg-center h-[400px] mt-20 flex items-center" style={{
          backgroundImage: `url(${whyChooseUsHero?.backgroundImage || ASSETS.BANNERS.WHY_CHOOSE_US})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}>
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center text-white">
              <h1 className="text-3xl lg:text-5xl font-bold mb-6">
                {whyChooseUsHero?.title || 'Why Choose Us'}
              </h1>
              <h4 
                className="text-white"
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: 500,
                  color: 'white',
                  fontSize: '1.25rem',
                  lineHeight: '1.35em'
                }}
              >
                {whyChooseUsHero?.description || 'With a combined experience of delivering and installing thousands of imaging systems across India, our team boasts deep industry knowledge and a proven track record of success. Our strategic focus on Tier 2 and Tier 3 markets ensures that healthcare facilities in every corner of the country benefit from our advanced technology.'}
              </h4>
              {whyChooseUsHero?.buttonText && (
                <div className="mt-8">
                  <a
                    href={whyChooseUsHero.buttonLink || '/contact'}
                    className="relative inline-flex items-center justify-center px-8 py-3 rounded-full text-lg font-semibold transition-all duration-300 cursor-pointer whitespace-nowrap group/link overflow-hidden border-2 border-white text-white"
                  >
                    <span className="relative z-10 flex items-center">
                      {whyChooseUsHero.buttonText}
                    </span>
                    <span className="absolute inset-0 bg-[#E6662F] transform translate-y-full group-hover/link:translate-y-0 transition-transform duration-300 ease-out rounded-full"></span>
                    <span className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover/link:opacity-100 transition-opacity duration-300 z-20">
                      {whyChooseUsHero.buttonText}
                    </span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Horizontal Navigation Tabs */}
      <div className="bg-white border-b border-gray-200" style={{ marginTop: '0' }}>
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-center space-x-10 py-2">
            <a
              href="/about"
              className="relative inline-block text-[#1B3A57] text-base font-medium transition-colors duration-300 group pb-2"
              onMouseEnter={(e) => e.currentTarget.style.color = '#E6662F'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#1B3A57'}
            >
              About
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#E6662F] transition-all duration-500 ease-out group-hover:w-full"></span>
            </a>
            <a
              href="/mission-vision-and-values"
              className="relative inline-block text-[#1B3A57] text-base font-medium transition-colors duration-300 group pb-2"
              onMouseEnter={(e) => e.currentTarget.style.color = '#E6662F'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#1B3A57'}
            >
              Mission &amp; Vision
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#E6662F] transition-all duration-500 ease-out group-hover:w-full"></span>
            </a>
            <a
              href="/why-choose-us"
              className="relative inline-block text-[#1B3A57] text-base font-bold transition-colors duration-300 group pb-2"
              onMouseEnter={(e) => e.currentTarget.style.color = '#E6662F'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#1B3A57'}
            >
              Why Choose Us
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#E6662F]"></span>
            </a>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-16 lg:py-20">
        <div className="container mx-auto px-4">
          {/* Our Offerings Section - CMS or Fallback */}
          {whyChooseUsOfferings?.isActive !== false && (
            <section className="max-w-6xl mx-auto mb-20 fade-right">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Image - Left Side */}
                <div className="order-1 lg:order-1">
                  <img
                    src={whyChooseUsOfferings?.image || ASSETS.BANNERS.WHY_CHOOSE_US}
                    alt="Our Offerings"
                    className="w-full h-auto rounded-xl shadow-lg"
                    style={{ objectFit: 'cover' }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = ASSETS.BANNERS.WHY_CHOOSE_US;
                    }}
                  />
                </div>

                {/* Content - Right Side */}
                <div className="order-2 lg:order-2">
                  <h3 className="text-3xl lg:text-4xl font-bold mb-8" style={{ color: '#2879b6' }}>
                    {whyChooseUsOfferings?.title || 'Our Offerings'}
                  </h3>
                  <ul className="space-y-6 text-[#555] text-base lg:text-lg leading-relaxed">
                    {whyChooseUsOfferings?.listItems ? (
                      (typeof whyChooseUsOfferings.listItems === 'string' 
                        ? JSON.parse(whyChooseUsOfferings.listItems) 
                        : whyChooseUsOfferings.listItems).map((item: any, idx: number) => (
                        <li key={idx}>
                          <strong className="text-black">{item.boldText || item.title}:</strong> {item.description || item.text}
                        </li>
                      ))
                    ) : (
                      <>
                        <li>
                          <strong className="text-black">Comprehensive Product Portfolio:</strong> Our product range encompasses X-ray systems, digital radiography solutions, C-Arms, mammography equipment, and pre-owned MRI scanners.
                        </li>
                        <li>
                          <strong className="text-black">Patented Innovations:</strong> We are proud to offer specialty products like the Dream ERA range of DR systems, showcasing our commitment to research and development.
                        </li>
                        <li>
                          <strong className="text-black">Pre-owned Equipment Expertise:</strong> Our expertise in processing and marketing high-end pre-owned imaging systems provides cost-effective solutions for healthcare facilities.
                        </li>
                        <li>
                          <strong className="text-black">Exceptional Service:</strong> Our dedicated service team ensures maximum uptime, rapid response, and comprehensive support for all our products.
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </section>
          )}

          {/* Advantages Section - CMS or Fallback - HIDDEN */}
          {false && whyChooseUsAdvantages?.isActive !== false && (
            <section className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <p className="text-[#2A7EAE] uppercase tracking-wider text-sm font-semibold mb-4">
                  {whyChooseUsAdvantages?.subtitle || 'OUR ADVANTAGES'}
                </p>
                <h2 className="text-3xl lg:text-4xl font-bold text-[#1B3A57]">
                  {whyChooseUsAdvantages?.title || 'Why Choose 3i MedTech?'}
                </h2>
              </div>

              {whyChooseUsAdvantages?.cards ? (
                (() => {
                  const cards = typeof whyChooseUsAdvantages.cards === 'string' 
                    ? JSON.parse(whyChooseUsAdvantages.cards) 
                    : whyChooseUsAdvantages.cards;
                  const firstRow = cards.slice(0, 3);
                  const secondRow = cards.slice(3, 6);
                  
                  return (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                        {firstRow.map((card: any, idx: number) => (
                          <div key={idx} className="bg-white rounded-lg p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 fade-in" style={{ animationDelay: `${idx * 100}ms` }}>
                            <div className="flex justify-center mb-6">
                              <div className="w-16 h-16 flex items-center justify-center" style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}>
                                <i className={`${card.icon || 'ri-star-line'} text-5xl text-[#2A7EAE]`}></i>
                              </div>
                            </div>
                            <h3 className="text-xl font-bold text-[#1B3A57] mb-4 text-center">{card.title}</h3>
                            <p className="text-[#555] text-center leading-relaxed">{card.description}</p>
                          </div>
                        ))}
                      </div>
                      {secondRow.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                          {secondRow.map((card: any, idx: number) => (
                            <div key={idx + 3} className="bg-white rounded-lg p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 fade-in" style={{ animationDelay: `${(idx + 3) * 100}ms` }}>
                              <div className="flex justify-center mb-6">
                                <div className="w-16 h-16 flex items-center justify-center" style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}>
                                  <i className={`${card.icon || 'ri-star-line'} text-5xl text-[#2A7EAE]`}></i>
                                </div>
                              </div>
                              <h3 className="text-xl font-bold text-[#1B3A57] mb-4 text-center">{card.title}</h3>
                              <p className="text-[#555] text-center leading-relaxed">{card.description}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  );
                })()
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    <div className="bg-white rounded-lg p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 fade-in" style={{ animationDelay: '0ms' }}>
                      <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 flex items-center justify-center" style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}>
                          <i className="ri-heart-pulse-line text-5xl text-[#2A7EAE]"></i>
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-[#1B3A57] mb-4 text-center">Comprehensive Product Portfolio</h3>
                      <p className="text-[#555] text-center leading-relaxed">
                        From X-ray systems to MRI scanners, we offer a complete range of medical imaging solutions.
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 fade-in" style={{ animationDelay: '100ms' }}>
                      <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 flex items-center justify-center" style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}>
                          <i className="ri-lightbulb-line text-5xl text-[#2A7EAE]"></i>
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-[#1B3A57] mb-4 text-center">Patented Innovations</h3>
                      <p className="text-[#555] text-center leading-relaxed">
                        Our Dream ERA range showcases our commitment to cutting-edge research and development.
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 fade-in" style={{ animationDelay: '200ms' }}>
                      <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 flex items-center justify-center" style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}>
                          <i className="ri-customer-service-2-line text-5xl text-[#2A7EAE]"></i>
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-[#1B3A57] mb-4 text-center">Exceptional Service</h3>
                      <p className="text-[#555] text-center leading-relaxed">
                        Our dedicated team ensures maximum uptime and comprehensive support for all products.
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white rounded-lg p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 fade-in" style={{ animationDelay: '300ms' }}>
                      <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 flex items-center justify-center" style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}>
                          <i className="ri-funds-line text-5xl text-[#2A7EAE]"></i>
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-[#1B3A57] mb-4 text-center">Cost-Effective Solutions</h3>
                      <p className="text-[#555] text-center leading-relaxed">
                        Pre-owned equipment expertise provides affordable options without compromising quality.
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 fade-in" style={{ animationDelay: '400ms' }}>
                      <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 flex items-center justify-center" style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}>
                          <i className="ri-map-pin-line text-5xl text-[#2A7EAE]"></i>
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-[#1B3A57] mb-4 text-center">Tier 2 & 3 Market Focus</h3>
                      <p className="text-[#555] text-center leading-relaxed">
                        Strategic focus ensures healthcare facilities across India benefit from advanced technology.
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 fade-in" style={{ animationDelay: '500ms' }}>
                      <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 flex items-center justify-center" style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}>
                          <i className="ri-award-line text-5xl text-[#2A7EAE]"></i>
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-[#1B3A57] mb-4 text-center">Proven Track Record</h3>
                      <p className="text-[#555] text-center leading-relaxed">
                        Thousands of successful installations demonstrate our deep industry knowledge and expertise.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </section>
          )}
        </div>
      </div>

      <Footer />

      <style>{`
        .fade-up {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.35s ease-out, transform 0.35s ease-out;
        }

        .fade-in {
          opacity: 0;
          transition: opacity 0.35s ease-out;
        }

        .fade-right {
          opacity: 0;
          transform: translateX(-30px);
          transition: opacity 0.35s ease-out, transform 0.35s ease-out;
        }

        .animate-in {
          opacity: 1;
          transform: translateY(0) translateX(0);
        }
      `}</style>
    </div>
  );
}
