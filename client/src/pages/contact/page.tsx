import { useState, useEffect } from 'react';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';

export default function Contact() {
  // CMS Data State
  const [contactHero, setContactHero] = useState<any>(null);
  const [contactInfoCards, setContactInfoCards] = useState<any[]>([]);
  const [contactMap, setContactMap] = useState<any>(null);
  const [contactForm, setContactForm] = useState<any>(null);
  const [recaptchaVerified, setRecaptchaVerified] = useState(false);

  // Fetch CMS Data
  const fetchContactHero = async () => {
    try {
      const res = await fetch('/api/cms/contact-page/hero');
      if (res.ok) {
        const json = await res.json();
        setContactHero(json?.data || json || null);
      }
    } catch (error) {
      console.error('Error fetching contact hero:', error);
    }
  };

  const fetchContactInfoCards = async () => {
    try {
      const res = await fetch('/api/cms/contact-page/info-cards');
      if (res.ok) {
        const json = await res.json();
        const cards = Array.isArray(json?.data) ? json.data : json;
        setContactInfoCards(cards.filter((c: any) => c.isActive !== false).sort((a: any, b: any) => (a.order || 0) - (b.order || 0)));
      }
    } catch (error) {
      console.error('Error fetching contact info cards:', error);
    }
  };

  const fetchContactMap = async () => {
    try {
      const res = await fetch('/api/cms/contact-page/map');
      if (res.ok) {
        const json = await res.json();
        setContactMap(json?.data || json || null);
      }
    } catch (error) {
      console.error('Error fetching contact map:', error);
    }
  };

  const fetchContactForm = async () => {
    try {
      const res = await fetch('/api/cms/contact-page/form');
      if (res.ok) {
        const json = await res.json();
        setContactForm(json?.data || json || null);
      }
    } catch (error) {
      console.error('Error fetching contact form:', error);
    }
  };


  useEffect(() => {
    // Fetch CMS data
    fetchContactHero();
    fetchContactInfoCards();
    fetchContactMap();
    fetchContactForm();

    // Listen for data changes from Dashboard
    const handleContactHeroChange = () => fetchContactHero();
    const handleContactInfoCardsChange = () => fetchContactInfoCards();
    const handleContactMapChange = () => fetchContactMap();
    const handleContactFormChange = () => fetchContactForm();

    window.addEventListener('contactHeroChanged', handleContactHeroChange);
    window.addEventListener('contactInfoCardsChanged', handleContactInfoCardsChange);
    window.addEventListener('contactMapChanged', handleContactMapChange);
    window.addEventListener('contactFormChanged', handleContactFormChange);

    return () => {
      window.removeEventListener('contactHeroChanged', handleContactHeroChange);
      window.removeEventListener('contactInfoCardsChanged', handleContactInfoCardsChange);
      window.removeEventListener('contactMapChanged', handleContactMapChange);
      window.removeEventListener('contactFormChanged', handleContactFormChange);
    };
  }, []);

  const [formData, setFormData] = useState({
    fname: '',
    organization: '',
    email: '',
    phone: '',
    companySize: '',
    inquiry: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);
    
    // Check if reCAPTCHA checkbox is checked
    if (!recaptchaVerified) {
      setSubmitMessage({ type: 'error', text: 'Please verify that you are not a robot by checking the box.' });
      setIsSubmitting(false);
      return;
    }
    
    // Validate required fields
    if (!formData.fname || !formData.email || !formData.organization || !formData.message || !formData.companySize || !formData.inquiry) {
      setSubmitMessage({ type: 'error', text: 'Please fill in all required fields.' });
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Submit form to server
      const response = await fetch('/api/contact/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitMessage({ 
          type: 'success', 
          text: 'Thank you! Your message has been sent successfully. We will get back to you soon.' 
        });
        
        // Reset form and checkbox after submission
        setFormData({
          fname: '',
          organization: '',
          email: '',
          phone: '',
          companySize: '',
          inquiry: '',
          message: ''
        });
            setRecaptchaVerified(false);
        
        // Clear success message after 5 seconds
        setTimeout(() => {
          setSubmitMessage(null);
        }, 5000);
      } else {
        setSubmitMessage({ 
          type: 'error', 
          text: result.message || 'Sorry, there was an error sending your message. Please try again later.' 
        });
        console.error('Form submission error:', result);
      }
    } catch (error: any) {
      console.error('Error submitting form:', error);
      setSubmitMessage({ 
        type: 'error', 
        text: 'Sorry, there was an error sending your message. Please check your connection and try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="contact-page">
      <Header />
      
      {/* Page Title - CMS or Fallback */}
      {contactHero?.isActive !== false && (
      <div className="bg-gray-50 py-12 mt-20">
        <div className="container mx-auto px-4">
            <h1 className="text-4xl lg:text-5xl font-bold text-center text-gray-900">
              {contactHero?.title || 'Contact Us'}
            </h1>
          </div>
        </div>
      )}

      {/* Contact Info Section - CMS or Fallback */}
      <section className="py-16 bg-gradient-to-r from-[#4A90A4]/10 to-[#7AB730]/10">
        <div className="container mx-auto px-4">
          {contactInfoCards.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {contactInfoCards.map((card: any, idx: number) => (
                <div key={card.id || idx} className="bg-white rounded-lg p-8 shadow-lg relative">
                  {card.icon && (
                    <div className="absolute top-8 right-8 text-[#4A90A4] text-4xl">
                      <i className={card.icon}></i>
                    </div>
                  )}
                  <h4 className="text-2xl font-bold text-[#4A90A4] mb-4">{card.title}</h4>
                  {card.link ? (
                    <p className="text-gray-700 leading-relaxed">
                      <a href={card.link} target={card.link.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="hover:text-[#7AB730] transition-colors">
                        {card.content}
                      </a>
                    </p>
                  ) : (
                    <p className="text-gray-700 leading-relaxed">{card.content}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-lg p-8 shadow-lg relative">
              <div className="absolute top-8 right-8 text-[#4A90A4] text-4xl">
                <i className="fas fa-map-marked-alt"></i>
              </div>
              <h4 className="text-2xl font-bold text-[#4A90A4] mb-4">Registered Office</h4>
              <p className="text-gray-700 leading-relaxed">
                <a href="https://maps.app.goo.gl/MheuF5TBoDraFrgD8" target="_blank" rel="noopener noreferrer" className="hover:text-[#7AB730] transition-colors">
                  Second Floor, Refex Towers, Sterling Road Signal, 313, Valluvar Kottam High Road, Nungambakkam,<br />Chennai – 600034, Tamil Nadu
                </a>
              </p>
            </div>
            <div className="bg-white rounded-lg p-8 shadow-lg relative">
              <div className="absolute top-8 right-8 text-[#4A90A4] text-4xl">
                <i className="fas fa-map-marked-alt"></i>
              </div>
              <h4 className="text-2xl font-bold text-[#4A90A4] mb-4">Corporate Office</h4>
              <p className="text-gray-700 leading-relaxed">
                <a href="https://maps.app.goo.gl/Kifm5u8hDDXqoT898" target="_blank" rel="noopener noreferrer" className="hover:text-[#7AB730] transition-colors">
                  Refex Building, 67, Bazullah Road, Parthasarathy Puram, T Nagar, Chennai – 600017
                </a>
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-8 shadow-lg relative">
              <div className="absolute top-8 right-8 text-[#4A90A4] text-4xl">
                <i className="fas fa-phone-volume"></i>
              </div>
              <h4 className="text-2xl font-bold text-[#4A90A4] mb-4">Phone</h4>
              <p className="text-gray-700">
                <a href="tel:+919444026307" className="hover:text-[#7AB730] transition-colors text-lg">
                  +91 94440 26307
                </a>
              </p>
            </div>
            <div className="bg-white rounded-lg p-8 shadow-lg relative">
              <div className="absolute top-8 right-8 text-[#4A90A4] text-4xl">
                <i className="fas fa-envelope-open-text"></i>
              </div>
              <h4 className="text-2xl font-bold text-[#4A90A4] mb-4">Email</h4>
              <p className="text-gray-700">
                <a href="mailto:info@3imedtech.com" className="hover:text-[#7AB730] transition-colors text-lg">
                  info@3imedtech.com
                </a>
              </p>
            </div>
          </div>
            </>
          )}
        </div>
      </section>

      {/* Map Section - CMS or Fallback */}
      {contactMap?.isActive !== false && (
      <section className="w-full">
        <iframe 
            src={contactMap?.mapUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2748.1873197906534!2d80.24098097527796!3d13.06595648541996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5267b450aa54e9%3A0xf906e87011428643!2sRefex%20Towers!5e0!3m2!1sen!2sin!4v1733296964599!5m2!1sen!2sin"}
          width="100%" 
          height="450" 
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          title="Refex Towers Location"
        ></iframe>
      </section>
      )}

      {/* Contact Form Section - CMS or Fallback */}
      {contactForm?.isActive !== false && (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
              {contactForm?.title && (
                <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">{contactForm.title}</h2>
              )}
              {contactForm?.description && (
                <p className="text-gray-700 mb-8 text-center">{contactForm.description}</p>
              )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Full name *
                  </label>
                  <input 
                    type="text"
                    name="fname"
                    value={formData.fname}
                    onChange={handleChange}
                    placeholder="e.g., John Doe"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[#4A90A4]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Organization *
                  </label>
                  <input 
                    type="text"
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    placeholder="Company Name"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[#4A90A4]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Work email address *
                  </label>
                  <input 
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@company.com"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[#4A90A4]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Phone number
                  </label>
                  <input 
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Full Number (incl. prefix)"
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[#4A90A4]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Company size *
                  </label>
                  <select 
                    name="companySize"
                    value={formData.companySize}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 pr-8 border border-gray-300 rounded focus:outline-none focus:border-[#4A90A4] appearance-none bg-white"
                  >
                    <option value="">Please Select</option>
                    <option value="1">1 (freelancer)</option>
                    <option value="2-19">2-19</option>
                    <option value="20-49">20-49</option>
                    <option value="50+">50+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    What is your inquiry about? *
                  </label>
                  <select 
                    name="inquiry"
                    value={formData.inquiry}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 pr-8 border border-gray-300 rounded focus:outline-none focus:border-[#4A90A4] appearance-none bg-white"
                  >
                    <option value="">Please Select</option>
                    <option value="General Information Request">General Information Request</option>
                    <option value="Partner Relations">Partner Relations</option>
                    <option value="Careers">Careers</option>
                    <option value="Product Licencing">Product Licencing</option>
                    <option value="I need help">I need help</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  How we can help you? *
                </label>
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Let us know what you need."
                  rows={6}
                  maxLength={500}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[#4A90A4] resize-none"
                ></textarea>
                <p className="text-sm text-gray-500 mt-2">Maximum 500 characters</p>
              </div>

              {/* Dummy reCAPTCHA Widget */}
              <div className="flex justify-start">
                <div className="relative" style={{ marginBottom: '20px' }}>
                  <div 
                    className="bg-white border-2 rounded cursor-pointer hover:border-gray-400 transition-colors"
                    style={{
                      width: '304px',
                      height: '78px',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '8px 14px',
                      boxShadow: '0 0 4px rgba(0,0,0,0.1)',
                      borderColor: recaptchaVerified ? '#4285F4' : '#d3d3d3',
                      fontFamily: 'Roboto, Helvetica, Arial, sans-serif'
                    }}
                    onClick={() => setRecaptchaVerified(!recaptchaVerified)}
                  >
                    <div className="flex items-center gap-3 flex-1 h-full">
                      {/* Checkbox */}
                      <div 
                        className={`flex items-center justify-center transition-all ${
                          recaptchaVerified 
                            ? 'bg-[#4285F4] border-[#4285F4]' 
                            : 'bg-white border-gray-400'
                        }`}
                        style={{ 
                          width: '24px', 
                          height: '24px', 
                          border: '2px solid',
                          borderColor: recaptchaVerified ? '#4285F4' : '#d3d3d3',
                          borderRadius: '3px',
                          flexShrink: 0
                        }}
                      >
                        {recaptchaVerified && (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="white"/>
                          </svg>
                        )}
                      </div>
                      
                      {/* Text */}
                      <div className="flex-1">
                        <div style={{ fontSize: '14px', fontWeight: 400, color: '#202124', lineHeight: '20px' }}>
                          I'm not a robot
                        </div>
                        <div style={{ fontSize: '10px', color: '#5f6368', lineHeight: '12px', marginTop: '2px' }}>
                          reCAPTCHA
                        </div>
                      </div>
                      
                      {/* Privacy & Terms Links */}
                      <div className="flex items-center gap-1" style={{ fontSize: '10px', color: '#5f6368' }}>
                        <a href="#" onClick={(e) => e.preventDefault()} style={{ textDecoration: 'none', color: '#5f6368' }}>Privacy</a>
                        <span> - </span>
                        <a href="#" onClick={(e) => e.preventDefault()} style={{ textDecoration: 'none', color: '#5f6368' }}>Terms</a>
                      </div>
                    </div>
                  </div>
                  
                  {/* reCAPTCHA Branding Below */}
                  <div className="absolute" style={{ bottom: '-18px', left: '0', fontSize: '10px', color: '#5f6368', fontFamily: 'Roboto, Helvetica, Arial, sans-serif' }}>
                    <div className="flex items-center gap-1">
                      <span>Protected by</span>
                      <svg width="30" height="12" viewBox="0 0 30 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.5 0C3.36 0 0 2.69 0 6s3.36 6 7.5 6c1.74 0 3.36-.72 4.5-1.89L9.9 8.55c-.72.54-1.68.87-2.7.87-2.28 0-4.14-1.8-4.14-4.02 0-2.22 1.86-4.02 4.14-4.02 1.02 0 1.98.33 2.7.87L12 1.89C10.86.72 9.24 0 7.5 0z" fill="#1A73E8"/>
                        <path d="M15 2.25h-1.5v7.5H15c1.65 0 3-1.35 3-3s-1.35-3-3-3zm0 4.5h-.75v-3H15c.825 0 1.5.675 1.5 1.5s-.675 1.5-1.5 1.5z" fill="#EA4335"/>
                        <path d="M22.5 2.25c-1.65 0-3 1.35-3 3v3c0 1.65 1.35 3 3 3s3-1.35 3-3v-3c0-1.65-1.35-3-3-3zm1.5 6c0 .825-.675 1.5-1.5 1.5s-1.5-.675-1.5-1.5v-3c0-.825.675-1.5 1.5-1.5s1.5.675 1.5 1.5v3z" fill="#4285F4"/>
                        <path d="M30 2.25h-1.5v7.5H30V2.25z" fill="#FBBC04"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Message */}
              {submitMessage && (
                <div className={`p-4 rounded ${
                  submitMessage.type === 'success' 
                    ? 'bg-green-50 text-green-800 border border-green-200' 
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  <p className="font-medium">{submitMessage.text}</p>
                </div>
              )}

              <div>
                <button 
                  type="submit"
                  disabled={!recaptchaVerified || isSubmitting}
                  className={`w-full md:w-auto px-12 py-4 font-semibold rounded transition-colors ${
                    recaptchaVerified && !isSubmitting
                      ? 'bg-[#4A90A4] text-white hover:bg-[#3a7a8a] cursor-pointer'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <i className="ri-loader-4-line animate-spin mr-2"></i>
                      Submitting...
                    </>
                  ) : recaptchaVerified ? (
                    'Submit'
                  ) : (
                    'Complete reCAPTCHA to Submit'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
      )}
      
      <Footer />
    </div>
  );
}
