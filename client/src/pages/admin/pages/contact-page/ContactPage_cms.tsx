import { useState, useEffect } from 'react';
import { DataTable } from '../../shared/DataTable';
import { authHeaders, getApiUrl } from '../../shared/utils';
import { showToast } from '@/components/admin/Toast';

interface ContactPageProps {
  token: string;
  user?: any;
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  modalType: 'add' | 'edit';
  setModalType: (type: 'add' | 'edit') => void;
  editingItem: any;
  setEditingItem: (item: any) => void;
  formData: any;
  setFormData: (data: any) => void;
  handleInputChange: (key: string, value: any) => void;
  handleSubmit: (e?: any) => void;
  handleDelete: (item: any) => void;
}

export default function ContactPage_cms({
  token,
  user,
  showModal,
  setShowModal,
  modalType,
  setModalType,
  editingItem,
  setEditingItem,
  formData,
  setFormData,
  handleInputChange,
  handleSubmit,
  handleDelete
}: ContactPageProps) {
  const [activeContactSection, setActiveContactSection] = useState('hero');
  const [contactHero, setContactHero] = useState<any>(null);
  const [contactInfoCards, setContactInfoCards] = useState<any[]>([]);
  const [contactMap, setContactMap] = useState<any>(null);
  const [contactForm, setContactForm] = useState<any>(null);
  const [emailSettings, setEmailSettings] = useState<any>(null);
  const [testingEmail, setTestingEmail] = useState(false);

  const fetchContactHero = async () => {
    try {
      const res = await fetch('/api/cms/contact-page/hero');
      if (res.ok) {
        const json = await res.json();
        setContactHero(json?.data || json || null);
      }
    } catch { }
  };

  const fetchContactInfoCards = async () => {
    try {
      const res = await fetch('/api/cms/contact-page/info-cards');
      if (res.ok) {
        const json = await res.json();
        const cards = Array.isArray(json?.data) ? json.data : json;
        setContactInfoCards(cards || []);
      }
    } catch { }
  };

  const fetchContactMap = async () => {
    try {
      const res = await fetch('/api/cms/contact-page/map');
      if (res.ok) {
        const json = await res.json();
        setContactMap(json?.data || json || null);
      }
    } catch { }
  };

  const fetchContactForm = async () => {
    try {
      const res = await fetch('/api/cms/contact-page/form');
      if (res.ok) {
        const json = await res.json();
        setContactForm(json?.data || json || null);
      }
    } catch { }
  };

  const fetchEmailSettings = async () => {
    try {
      const res = await fetch(getApiUrl('/api/cms/email-settings'), {
        headers: authHeaders(token)
      });
      if (res.ok) {
        const json = await res.json();
        setEmailSettings(json?.data || json || null);
      }
    } catch { }
  };


  const handleTestEmail = async () => {
    if (!formData.testEmail) {
      showToast.error('Please enter a test email address');
      return;
    }

    setTestingEmail(true);
    try {
      const res = await fetch(getApiUrl('/api/cms/email-settings/test'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders(token)
        },
        body: JSON.stringify({ testEmail: formData.testEmail })
      });

      if (res.ok) {
        showToast.success('Test email sent successfully!');
      } else {
        const error = await res.json();
        showToast.error(error.message || 'Failed to send test email');
      }
    } catch (error) {
      console.error('Error sending test email:', error);
      showToast.error('Error sending test email');
    } finally {
      setTestingEmail(false);
    }
  };

  useEffect(() => {
    fetchContactHero();
    fetchContactInfoCards();
    fetchContactMap();
    fetchContactForm();
    fetchEmailSettings();
    
    // Listen for updates to refetch data
    const handleContactHeroChange = () => fetchContactHero();
    const handleContactInfoCardsChange = () => fetchContactInfoCards();
    const handleContactMapChange = () => fetchContactMap();
    const handleContactFormChange = () => fetchContactForm();
    const handleEmailSettingsChange = () => fetchEmailSettings();
    
    window.addEventListener('contactHeroChanged', handleContactHeroChange);
    window.addEventListener('contactInfoCardsChanged', handleContactInfoCardsChange);
    window.addEventListener('contactMapChanged', handleContactMapChange);
    window.addEventListener('contactFormChanged', handleContactFormChange);
    window.addEventListener('emailSettingsChanged', handleEmailSettingsChange);
    
    return () => {
      window.removeEventListener('contactHeroChanged', handleContactHeroChange);
      window.removeEventListener('contactInfoCardsChanged', handleContactInfoCardsChange);
      window.removeEventListener('contactMapChanged', handleContactMapChange);
      window.removeEventListener('contactFormChanged', handleContactFormChange);
      window.removeEventListener('emailSettingsChanged', handleEmailSettingsChange);
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Contact Page Management</h2>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex space-x-4 overflow-x-auto">
          {[
            { id: 'hero', label: 'Hero Section', icon: 'ri-layout-top-line', count: contactHero ? 1 : 0 },
            { id: 'info-cards', label: 'Contact Info', icon: 'ri-phone-line', count: contactInfoCards.length },
            { id: 'map', label: 'Map', icon: 'ri-map-pin-line', count: contactMap ? 1 : 0 },
            { id: 'form', label: 'Form', icon: 'ri-file-edit-line', count: contactForm ? 1 : 0 },
            ...(user?.user_type === 'Admin' ? [{ id: 'email-settings', label: 'Email Settings', icon: 'ri-mail-settings-line', count: emailSettings ? 1 : 0 }] : [])
          ].map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveContactSection(section.id)}
              className={`flex items-center px-4 py-3 rounded-lg transition-colors whitespace-nowrap ${activeContactSection === section.id
                ? 'bg-blue-100 text-blue-700 border-2 border-blue-200'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-2 border-transparent'
                }`}
            >
              <i className={`${section.icon} mr-2`}></i>
              <span className="font-medium">{section.label}</span>
              {section.count !== undefined && (
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${section.count > 0 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                  {section.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {activeContactSection === 'hero' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-800">Hero Section</h3>
            <button
              onClick={() => {
                setModalType('edit');
                setEditingItem('contact-hero');
                setFormData({
                  title: contactHero?.title || 'Contact Us',
                  isActive: contactHero?.isActive ?? true
                });
                setShowModal(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              <i className="ri-edit-line mr-2"></i>
              Edit Hero
            </button>
          </div>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <p className="text-sm text-gray-500 mb-1">Title</p>
              <p className="text-gray-900 font-semibold text-2xl">{contactHero?.title || 'Contact Us'}</p>
            </div>
          </div>
        </div>
      )}

      {activeContactSection === 'info-cards' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-800">Contact Info Cards</h3>
            <button
              onClick={() => {
                setModalType('add');
                setEditingItem('contact-info-card');
                setFormData({
                  cardType: 'registered-office',
                  icon: 'fas fa-map-marked-alt',
                  title: '',
                  content: '',
                  link: '',
                  order: contactInfoCards.length,
                  isActive: true
                });
                setShowModal(true);
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              <i className="ri-add-line mr-2"></i>
              Add Info Card
            </button>
          </div>
          <DataTable
            title="Contact Info Cards"
            data={contactInfoCards.sort((a: any, b: any) => (a.order || 0) - (b.order || 0))}
            columns={[
              { key: 'order', header: 'Order' },
              { key: 'cardType', header: 'Type' },
              { key: 'title', header: 'Title' },
              {
                key: 'content',
                header: 'Content',
                render: (value: string) => (
                  <span className="max-w-xs truncate block" title={value}>{value || '-'}</span>
                )
              },
              {
                key: 'isActive',
                header: 'Status',
                render: (value: boolean) => (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                    {value ? 'Active' : 'Inactive'}
                  </span>
                )
              }
            ]}
            onEdit={(item: any) => {
              setModalType('edit');
              setEditingItem({ type: 'contact-info-card', id: item.id });
              setFormData({
                cardType: item.cardType || 'registered-office',
                icon: item.icon || '',
                title: item.title || '',
                content: item.content || '',
                link: item.link || '',
                order: item.order || 0,
                isActive: item.isActive !== undefined ? item.isActive : true
              });
              setShowModal(true);
            }}
            onDelete={handleDelete}
          />
        </div>
      )}

      {activeContactSection === 'map' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-800">Map Section</h3>
            <button
              onClick={() => {
                setModalType('edit');
                setEditingItem('contact-map');
                setFormData({
                  mapUrl: contactMap?.mapUrl || '',
                  isActive: contactMap?.isActive ?? true
                });
                setShowModal(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              <i className="ri-edit-line mr-2"></i>
              Edit Map
            </button>
          </div>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <p className="text-sm text-gray-500 mb-2">Map URL</p>
              {contactMap?.mapUrl ? (
                <iframe 
                  src={contactMap.mapUrl}
                  width="100%" 
                  height="300" 
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  title="Contact Map"
                />
              ) : (
                <p className="text-gray-400">No map URL set</p>
              )}
            </div>
          </div>
        </div>
      )}

      {activeContactSection === 'form' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-800">Contact Form Section</h3>
            <button
              onClick={() => {
                setModalType('edit');
                setEditingItem('contact-form');
                setFormData({
                  title: contactForm?.title || 'Get in Touch',
                  description: contactForm?.description || '',
                  isActive: contactForm?.isActive ?? true
                });
                setShowModal(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              <i className="ri-edit-line mr-2"></i>
              Edit Form
            </button>
          </div>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <p className="text-sm text-gray-500 mb-1">Title</p>
              <p className="text-gray-900 font-semibold text-xl mb-4">{contactForm?.title || 'Get in Touch'}</p>
              <p className="text-sm text-gray-500 mb-1">Description</p>
              <p className="text-gray-900">{contactForm?.description || ''}</p>
            </div>
          </div>
        </div>
      )}

      {activeContactSection === 'email-settings' && (user?.user_type === 'Admin') && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-800">Email Settings</h3>
            <button
              onClick={() => {
                setModalType('edit');
                setEditingItem('email-settings');
                setFormData({
                  smtpHost: emailSettings?.smtpHost || '',
                  smtpPort: emailSettings?.smtpPort || 587,
                  smtpSecure: emailSettings?.smtpSecure !== undefined ? emailSettings.smtpSecure : false,
                  smtpUser: emailSettings?.smtpUser || '',
                  smtpPassword: emailSettings?.smtpPassword || '',
                  fromEmail: emailSettings?.fromEmail || '',
                  fromName: emailSettings?.fromName || '3i MedTech',
                  toEmail: emailSettings?.toEmail || '',
                  isActive: emailSettings?.isActive ?? true,
                  testEmail: ''
                });
                setShowModal(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              <i className="ri-edit-line mr-2"></i>
              {emailSettings ? 'Edit Settings' : 'Configure Email'}
            </button>
          </div>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              {emailSettings ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">SMTP Host</p>
                    <p className="text-gray-900 font-medium">{emailSettings.smtpHost || 'Not configured'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">SMTP Port</p>
                    <p className="text-gray-900 font-medium">{emailSettings.smtpPort || 'Not configured'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">From Email</p>
                    <p className="text-gray-900 font-medium">{emailSettings.fromEmail || 'Not configured'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">To Email (Contact Form Recipient)</p>
                    <p className="text-gray-900 font-medium">{emailSettings.toEmail || 'Not configured'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Status</p>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${emailSettings.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {emailSettings.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Email settings not configured. Click "Configure Email" to set up SMTP settings.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function ContactHeroForm({ formData, handleInputChange }: any) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
        <input
          type="text"
          value={formData.title || ''}
          onChange={(e) => handleInputChange('title', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          id="contactHeroIsActive"
          checked={formData.isActive !== false}
          onChange={(e) => handleInputChange('isActive', e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="contactHeroIsActive" className="text-sm font-medium text-gray-700">Active</label>
      </div>
    </>
  );
}

export function ContactInfoCardForm({ formData, handleInputChange }: any) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Card Type</label>
        <select
          value={formData.cardType || 'registered-office'}
          onChange={(e) => handleInputChange('cardType', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="registered-office">Registered Office</option>
          <option value="corporate-office">Corporate Office</option>
          <option value="phone">Phone</option>
          <option value="email">Email</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Icon (CSS class)</label>
        <input
          type="text"
          value={formData.icon || ''}
          onChange={(e) => handleInputChange('icon', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="fas fa-map-marked-alt"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
        <input
          type="text"
          value={formData.title || ''}
          onChange={(e) => handleInputChange('title', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
        <textarea
          value={formData.content || ''}
          onChange={(e) => handleInputChange('content', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={4}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Link (optional)</label>
        <input
          type="text"
          value={formData.link || ''}
          onChange={(e) => handleInputChange('link', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
        <input
          type="number"
          value={formData.order || 0}
          onChange={(e) => handleInputChange('order', parseInt(e.target.value) || 0)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          min="0"
        />
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          id="contactInfoCardIsActive"
          checked={formData.isActive !== false}
          onChange={(e) => handleInputChange('isActive', e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="contactInfoCardIsActive" className="text-sm font-medium text-gray-700">Active</label>
      </div>
    </>
  );
}

export function ContactMapForm({ formData, handleInputChange }: any) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Map Embed Code (HTML/iframe)</label>
        <textarea
          value={formData.embedCode || ''}
          onChange={(e) => handleInputChange('embedCode', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-xs"
          rows={8}
          placeholder='<iframe src="..."></iframe>'
        />
        <p className="text-xs text-gray-500 mt-1">Paste the embed code from Google Maps or other map service</p>
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          id="contactMapIsActive"
          checked={formData.isActive !== false}
          onChange={(e) => handleInputChange('isActive', e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="contactMapIsActive" className="text-sm font-medium text-gray-700">Active</label>
      </div>
    </>
  );
}

export function ContactFormForm({ formData, handleInputChange }: any) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
        <input
          type="text"
          value={formData.title || ''}
          onChange={(e) => handleInputChange('title', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          value={formData.description || ''}
          onChange={(e) => handleInputChange('description', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={4}
        />
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          id="contactFormIsActive"
          checked={formData.isActive !== false}
          onChange={(e) => handleInputChange('isActive', e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="contactFormIsActive" className="text-sm font-medium text-gray-700">Active</label>
      </div>
    </>
  );
}

