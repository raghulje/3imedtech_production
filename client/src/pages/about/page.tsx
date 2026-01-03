
import { useEffect, useState } from 'react';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';
import { ASSETS } from '../../constants/assets';

export default function About() {
  // CMS Data State
  const [aboutHero, setAboutHero] = useState<any>(null);
  const [aboutRedefiningHealthcare, setAboutRedefiningHealthcare] = useState<any>(null);
  const [aboutRefexGroup, setAboutRefexGroup] = useState<any>(null);

  // Fetch CMS Data
  const fetchAboutHero = async () => {
    try {
      const res = await fetch('/api/cms/about-page/hero');
      if (res.ok) {
        const json = await res.json();
        setAboutHero(json?.data || json || null);
      }
    } catch (error) {
      console.error('Error fetching about hero:', error);
    }
  };

  const fetchAboutRedefiningHealthcare = async () => {
    try {
      const res = await fetch('/api/cms/about-page/redefining-healthcare');
      if (res.ok) {
        const json = await res.json();
        const data = json?.data || json || null;
        setAboutRedefiningHealthcare(data);
        // Debug log to check data
        if (data) {
          console.log('📋 Redefining Healthcare data:', {
            title: data.title,
            buttonText: data.buttonText,
            buttonLink: data.buttonLink,
            buttonIcon: data.buttonIcon,
            isActive: data.isActive
          });
        }
      }
    } catch (error) {
      console.error('Error fetching redefining healthcare:', error);
    }
  };

  const fetchAboutRefexGroup = async () => {
    try {
      const res = await fetch('/api/cms/about-page/refex-group');
      if (res.ok) {
        const json = await res.json();
        setAboutRefexGroup(json?.data || json || null);
      }
    } catch (error) {
      console.error('Error fetching refex group:', error);
    }
  };


  useEffect(() => {
    // Fetch CMS data
    fetchAboutHero();
    fetchAboutRedefiningHealthcare();
    fetchAboutRefexGroup();

    // Listen for data changes from Dashboard
    const handleAboutDataChange = () => {
      fetchAboutHero();
      fetchAboutRedefiningHealthcare();
      fetchAboutRefexGroup();
    };

    window.addEventListener('aboutHeroChanged', fetchAboutHero);
    window.addEventListener('aboutRedefiningHealthcareChanged', fetchAboutRedefiningHealthcare);
    window.addEventListener('aboutRefexGroupChanged', fetchAboutRefexGroup);

    return () => {
      window.removeEventListener('aboutHeroChanged', fetchAboutHero);
      window.removeEventListener('aboutRedefiningHealthcareChanged', fetchAboutRedefiningHealthcare);
      window.removeEventListener('aboutRefexGroupChanged', fetchAboutRefexGroup);
    };
  }, []);

  return (
    <div className="about-page">
      <Header />

      {/* Hero Section - CMS or Fallback */}
      {aboutHero?.isActive !== false && (
        <section className="relative bg-cover bg-center h-[400px] mt-20 flex items-center" style={{
          backgroundImage: `url(${aboutHero?.backgroundImage || ASSETS.BANNERS.ABOUT})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}>
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center text-white">
              <h1 className="text-4xl lg:text-5xl font-bold mb-6" data-aos="fade-up" data-aos-duration="800">
                {aboutHero?.title || 'About 3i Medical Technologies'}
              </h1>
              <p className="text-lg lg:text-xl leading-relaxed" data-aos="fade-up" data-aos-delay="200" data-aos-duration="800">
                {aboutHero?.description || '3i Med Tech is an esteemed player in the medical devices industry with a core competency in the manufacturing of sophisticated diagnostic imaging equipment such as Digital X-rays, MRI machines, Digital C-arm.'}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Horizontal Tab Navigation */}
      <div className="bg-white border-b border-gray-200" style={{ marginTop: '0' }}>
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-center gap-10 py-2">
            <a
              href="/about"
              className="relative inline-block text-[#1B3A57] font-medium py-4 transition-colors duration-300 group"
              onMouseEnter={(e) => e.currentTarget.style.color = '#E6662F'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#1B3A57'}
            >
              About
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#E6662F]"></span>
            </a>
            <a
              href="/mission-vision-and-values"
              className="relative inline-block text-[#1B3A57] font-medium py-4 transition-colors duration-300 group"
              onMouseEnter={(e) => e.currentTarget.style.color = '#E6662F'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#1B3A57'}
            >
              Mission &amp; Vision
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#E6662F] transition-all duration-500 ease-out group-hover:w-full"></span>
            </a>
            <a
              href="/why-choose-us"
              className="relative inline-block text-[#1B3A57] font-medium py-4 transition-colors duration-300 group"
              onMouseEnter={(e) => e.currentTarget.style.color = '#E6662F'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#1B3A57'}
            >
              Why Choose Us
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#E6662F] transition-all duration-500 ease-out group-hover:w-full"></span>
            </a>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-16 lg:py-14" style={{ paddingTop: '48px' }}>
        <div className="container mx-auto px-4">
          {/* Redefining Healthcare Section - CMS or Fallback */}
          {aboutRedefiningHealthcare?.isActive !== false && (
            <section className="max-w-4xl mx-auto text-center mb-8 lg:mb-10" data-aos="fade-up" data-aos-duration="1000">
              <h2 className="text-3xl lg:text-4xl font-bold text-[#0e2b5c] mb-6 lg:mb-8" data-aos="slide-up" data-aos-delay="100" data-aos-duration="800">
                {aboutRedefiningHealthcare?.title || 'Redefining Healthcare Through Innovation'}
              </h2>
              <div className="text-base lg:text-lg text-gray-700 leading-relaxed mb-8 lg:mb-10">
                {(() => {
                  // Parse paragraphs - support both JSON array format and legacy string format
                  let paragraphs: string[] = [];
                  
                  if (aboutRedefiningHealthcare?.description) {
                    const trimmed = aboutRedefiningHealthcare.description.trim();
                    if (trimmed.startsWith('[')) {
                      try {
                        const parsed = JSON.parse(aboutRedefiningHealthcare.description);
                        paragraphs = Array.isArray(parsed) ? parsed : [aboutRedefiningHealthcare.description];
                      } catch {
                        paragraphs = [aboutRedefiningHealthcare.description];
                      }
                    } else {
                      paragraphs = [aboutRedefiningHealthcare.description];
                    }
                  }
                  
                  if (paragraphs.length > 0) {
                    return paragraphs.map((para, idx) => (
                      <p 
                        key={idx} 
                        data-aos="fade-up" 
                        data-aos-delay={`${200 + idx * 100}`} 
                        data-aos-duration="800"
                        className={para.trim() === '' ? 'h-4' : 'mb-4 last:mb-0'}
                      >
                        {para || '\u00A0'}
                      </p>
                    ));
                  }
                  return (
                    <p data-aos="fade-up" data-aos-delay="200" data-aos-duration="800">
                      3i Medical Technologies is a leading provider of advanced diagnostic imaging solutions, dedicated to improving healthcare accessibility and quality. With a strong emphasis on cost-effective innovation, we offer a comprehensive range of products, including X-ray systems, digital radiography, C-arms, mammography equipment, and pre-owned MRI scanners.
              </p>
                  );
                })()}
              </div>
              <div data-aos="zoom-in" data-aos-delay="300" data-aos-duration="600">
                <a
                  href={(aboutRedefiningHealthcare?.buttonLink && aboutRedefiningHealthcare.buttonLink.trim() !== '') ? aboutRedefiningHealthcare.buttonLink : ASSETS.DOCUMENTS.PRODUCT_BROCHURE}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="about-btn inline-flex items-center gap-3 bg-[#2879b6] text-white px-8 py-4 rounded-full text-base lg:text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl whitespace-nowrap cursor-pointer relative overflow-hidden group"
                >
                  <span className="absolute inset-0 bg-[#E6662F] transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out rounded-full"></span>
                  {aboutRedefiningHealthcare?.buttonIcon && <i className={`${aboutRedefiningHealthcare.buttonIcon} text-2xl relative z-10`}></i>}
                  <span className="relative z-10">{aboutRedefiningHealthcare?.buttonText || 'Download Our Brochure'}</span>
                </a>
              </div>
            </section>
          )}

          {/* Explore Refex Group Section - CMS or Fallback */}
          {aboutRefexGroup?.isActive !== false && (
            <section className="max-w-4xl mx-auto text-center" style={{ marginTop: '16px' }} data-aos="fade-up" data-aos-duration="1000">
              <h2 className="text-3xl lg:text-4xl font-bold text-[#0e2b5c] mb-6 lg:mb-8" data-aos="slide-up" data-aos-delay="100" data-aos-duration="800">
                {aboutRefexGroup?.title || 'Explore Refex Group'}
              </h2>
              <div className="text-base lg:text-lg text-gray-700 leading-relaxed space-y-6 mb-8 lg:mb-10">
                {(() => {
                  // Parse paragraphs - support both JSON array format and legacy format
                  let paragraphs: string[] = [];
                  
                  if (aboutRefexGroup?.descriptionParagraph1) {
                    // Check if it's a JSON array
                    if (aboutRefexGroup.descriptionParagraph1.trim().startsWith('[')) {
                      try {
                        const parsed = JSON.parse(aboutRefexGroup.descriptionParagraph1);
                        if (Array.isArray(parsed)) {
                          paragraphs = parsed;
                        } else {
                          paragraphs = [aboutRefexGroup.descriptionParagraph1];
                        }
                      } catch {
                        paragraphs = [aboutRefexGroup.descriptionParagraph1];
                      }
                    } else {
                      // Legacy format - single paragraph or multiple paragraphs
                      paragraphs = [aboutRefexGroup.descriptionParagraph1];
                      if (aboutRefexGroup.descriptionParagraph2) {
                        paragraphs.push(aboutRefexGroup.descriptionParagraph2);
                      }
                    }
                  } else if (aboutRefexGroup?.descriptionParagraph2) {
                    paragraphs = [aboutRefexGroup.descriptionParagraph2];
                  }
                  
                  if (paragraphs.length > 0) {
                    return paragraphs.map((para, idx) => (
                      <p 
                        key={idx} 
                        data-aos="fade-up" 
                        data-aos-delay={`${200 + idx * 100}`} 
                        data-aos-duration="800"
                        className={para.trim() === '' ? 'h-4' : ''} // Preserve blank lines
                      >
                        {para || '\u00A0'} {/* Non-breaking space for empty paragraphs */}
                      </p>
                    ));
                  }
                  return null;
                })()}
                {!aboutRefexGroup?.descriptionParagraph1 && !aboutRefexGroup?.descriptionParagraph2 && (
                  <>
                    <p data-aos="fade-up" data-aos-delay="200" data-aos-duration="800">
                      3i MedTech, part of the Refex Group, is rapidly emerging as one of India's leading MedTech companies. With ambitious growth strategies, the company has strengthened its position in the diagnostic imaging sector through the acquisition of Cura and Adonis Medical Systems—both highly reputed companies with over two decades of expertise.
                    </p>
                    <p data-aos="fade-up" data-aos-delay="300" data-aos-duration="800">
                      Refex Group is among the leading business conglomerates of India and it has expanded during the past 2 decades of its operation across multiple business verticals – Renewables (Solar IPP), Chemicals (refilling of environment friendly refrigerant gases), Medical Technologies (manufacturing Digital X-rays, Flat Panel Detectors, and refurbishing MRI machines), Pharma (API manufacturing pertaining to the Central Nervous System), Green Mobility (offering 4 wheeler EV as a technology backed service), Ash handling (mitigating environmental pollution from the thermal power plants by handling the ash), and Airport operations among other such business verticals.
                    </p>
                  </>
                )}
              </div>
              {aboutRefexGroup?.buttonLink && (
                <div data-aos="zoom-in" data-aos-delay="400" data-aos-duration="600">
                  <a
                    href={aboutRefexGroup.buttonLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="about-btn inline-flex items-center justify-center bg-[#2879b6] text-white px-8 py-4 rounded-full text-base lg:text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl whitespace-nowrap cursor-pointer relative overflow-hidden group"
                  >
                    <span className="absolute inset-0 bg-[#E6662F] transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out rounded-full"></span>
                    <span className="relative z-10">{aboutRefexGroup?.buttonText || 'Explore Refex Group'}</span>
                  </a>
                </div>
              )}
            </section>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
