import { useEffect, useState } from 'react';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';
import { ASSETS } from '../../constants/assets';

export default function MissionVision() {
  // CMS Data State
  const [missionVisionHero, setMissionVisionHero] = useState<any>(null);
  const [missionVisionMission, setMissionVisionMission] = useState<any>(null);
  const [missionVisionVision, setMissionVisionVision] = useState<any>(null);

  // Fetch CMS Data
  const fetchMissionVisionHero = async () => {
    try {
      const res = await fetch('/api/cms/mission-vision/hero');
      if (res.ok) {
        const json = await res.json();
        setMissionVisionHero(json?.data || json || null);
      }
    } catch (error) {
      console.error('Error fetching mission vision hero:', error);
    }
  };

  const fetchMissionVisionMission = async () => {
    try {
      const res = await fetch('/api/cms/mission-vision/content/mission');
      if (res.ok) {
        const json = await res.json();
        setMissionVisionMission(json?.data || json || null);
      }
    } catch (error) {
      console.error('Error fetching mission:', error);
    }
  };

  const fetchMissionVisionVision = async () => {
    try {
      const res = await fetch('/api/cms/mission-vision/content/vision');
      if (res.ok) {
        const json = await res.json();
        setMissionVisionVision(json?.data || json || null);
      }
    } catch (error) {
      console.error('Error fetching vision:', error);
    }
  };


  useEffect(() => {
    // Fetch CMS data
    fetchMissionVisionHero();
    fetchMissionVisionMission();
    fetchMissionVisionVision();

    // Listen for data changes from Dashboard
    const handleMissionVisionHeroChange = () => fetchMissionVisionHero();
    const handleMissionVisionMissionChange = () => fetchMissionVisionMission();
    const handleMissionVisionVisionChange = () => fetchMissionVisionVision();

    window.addEventListener('missionVisionHeroChanged', handleMissionVisionHeroChange);
    window.addEventListener('missionVisionMissionChanged', handleMissionVisionMissionChange);
    window.addEventListener('missionVisionVisionChanged', handleMissionVisionVisionChange);

    return () => {
      window.removeEventListener('missionVisionHeroChanged', handleMissionVisionHeroChange);
      window.removeEventListener('missionVisionMissionChanged', handleMissionVisionMissionChange);
      window.removeEventListener('missionVisionVisionChanged', handleMissionVisionVisionChange);
    };
  }, []);

  return (
    <div className="mission-vision-page">
      <Header />

      {/* Hero Section - CMS or Fallback */}
      {missionVisionHero?.isActive !== false && (
        <section
          className="relative flex items-center justify-center text-white"
          style={{
            backgroundImage: `url(${missionVisionHero?.backgroundImage || ASSETS.BANNERS.MISSION_VISION})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'scroll',
            height: '400px',
            marginTop: '80px'
          }}
        >
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6" data-aos="fade-up" data-aos-duration="800">
              {missionVisionHero?.title || 'Mission &amp; Vision'}
            </h1>
            <p className="text-lg md:text-xl leading-relaxed max-w-3xl mx-auto" data-aos="fade-up" data-aos-delay="200" data-aos-duration="800">
              {missionVisionHero?.description || 'To empower healthcare providers with innovative imaging solutions that improve patient care, enhance diagnostic accuracy, and optimize efficiency.'}
            </p>
          </div>
        </section>
      )}

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200" style={{ marginTop: '0' }}>
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-center gap-12 py-2">
            <a
              href="/about"
              className="relative inline-block text-base font-medium transition-colors duration-300 group pb-2"
              style={{ color: '#1E3A8A' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#E6662F'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#1E3A8A'}
            >
              About
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#E6662F] transition-all duration-500 ease-out group-hover:w-full"></span>
            </a>
            <a
              href="/mission-vision-and-values"
              className="relative inline-block text-base font-medium transition-colors duration-300 group pb-2"
              style={{ color: '#1E3A8A' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#E6662F'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#1E3A8A'}
            >
              Mission &amp; Vision
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#E6662F]"></span>
            </a>
            <a
              href="/why-choose-us"
              className="relative inline-block text-base font-medium transition-colors duration-300 group pb-2"
              style={{ color: '#1E3A8A' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#E6662F'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#1E3A8A'}
            >
              Why Choose Us
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#E6662F] transition-all duration-500 ease-out group-hover:w-full"></span>
            </a>
          </nav>
        </div>
      </div>

      {/* Our Mission Section - CMS or Fallback */}
      {missionVisionMission?.isActive !== false && (
        <section className="bg-white py-20" data-aos="fade-in" data-aos-duration="1000">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              <div className="md:col-span-3 flex flex-col items-center md:items-start">
                <div
                  className="mb-3"
                  style={{
                    width: '100px',
                    height: '100px',
                    filter: 'drop-shadow(0 10px 26px rgba(0,0,0,0.08))'
                  }}
                  data-aos="zoom-in"
                  data-aos-delay="100"
                  data-aos-duration="800"
                >
                  <img
                    src={missionVisionMission?.icon || ASSETS.ICONS.VISION}
                    alt="Our Mission"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = ASSETS.ICONS.VISION;
                    }}
                  />
                </div>
                <h2
                  className="text-2xl font-bold"
                  style={{ color: '#2879b6' }}
                  data-aos="slide-up"
                  data-aos-delay="200"
                  data-aos-duration="800"
                >
                  {missionVisionMission?.title || 'Our Mission'}
                </h2>
              </div>
              <div className="md:col-span-9">
                <div
                  className="text-base leading-relaxed"
                  style={{ color: '#475569', lineHeight: '1.65', maxWidth: '620px' }}
                  data-aos="fade-up"
                  data-aos-delay="300"
                  data-aos-duration="800"
                >
                  <p>
                    {missionVisionMission?.description || 'To bring "Affordable Luxury" to our products &amp; solutions to serve our customers with advanced technology with lower life cycle costs without compromising on quality, reliability, and patient safety. To promote the role of imaging in preventive medicine, helping to diagnose diseases early when they are most easily treatable. To collaborate with healthcare service providers, research institutions, and technology companies to share knowledge and data to push the boundaries of possibilities in medical imaging using technology.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Our Vision Section - CMS or Fallback */}
      {missionVisionVision?.isActive !== false && (
        <section className="py-20" style={{ backgroundColor: '#F4F7FA' }} data-aos="fade-in" data-aos-duration="1000">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              <div className="md:col-span-3 flex flex-col items-center md:items-start">
                <div
                  className="mb-3"
                  style={{
                    width: '100px',
                    height: '100px',
                    filter: 'drop-shadow(0 10px 26px rgba(0,0,0,0.08))'
                  }}
                  data-aos="zoom-in"
                  data-aos-delay="100"
                  data-aos-duration="800"
                >
                  <img
                    src={missionVisionVision?.icon || ASSETS.ICONS.MISSION}
                    alt="Our Vision"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = ASSETS.ICONS.MISSION;
                    }}
                  />
                </div>
                <h2
                  className="text-2xl font-bold"
                  style={{ color: '#2879b6' }}
                  data-aos="slide-up"
                  data-aos-delay="200"
                  data-aos-duration="800"
                >
                  {missionVisionVision?.title || 'Our Vision'}
                </h2>
              </div>
              <div className="md:col-span-9">
                <div
                  className="text-base leading-relaxed"
                  style={{ color: '#475569', lineHeight: '1.65', maxWidth: '620px' }}
                  data-aos="fade-up"
                  data-aos-delay="300"
                  data-aos-duration="800"
                >
                  <p>
                    {missionVisionVision?.description || 'Our vision is to revolutionize the future of healthcare by providing advanced and safer medical imaging solutions that enhance diagnostic accuracy and improve patient experience. We strive to empower healthcare professionals with the most innovative imaging technologies and data-driven insights with highest accuracy.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
