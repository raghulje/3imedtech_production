import { useState, useEffect } from 'react';
import { authHeaders, getApiUrl, getImageUrl } from '../../shared/utils';
import { OfferingsListItemsField } from './OfferingsListItemsField';

interface WhyChooseUsPageProps {
  token: string;
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  modalType: 'add' | 'edit';
  setModalType: (type: 'add' | 'edit') => void;
  editingItem: any;
  setEditingItem: (item: any) => void;
  formData: any;
  setFormData: (data: any) => void;
  handleInputChange: (key: string, value: any) => void;
  uploadImage: (file: File) => Promise<string | null>;
}

export default function WhyChooseUsPage_cms({
  token,
  showModal,
  setShowModal,
  modalType,
  setModalType,
  editingItem,
  setEditingItem,
  formData,
  setFormData,
  handleInputChange,
  uploadImage
}: WhyChooseUsPageProps) {
  const [activeWhyChooseUsSection, setActiveWhyChooseUsSection] = useState('hero');
  const [whyChooseUsHero, setWhyChooseUsHero] = useState<any>(null);
  const [whyChooseUsOfferings, setWhyChooseUsOfferings] = useState<any>(null);
  const [whyChooseUsAdvantages, setWhyChooseUsAdvantages] = useState<any>(null);

  const fetchWhyChooseUsHero = async () => {
    try {
      const res = await fetch(getApiUrl('/api/cms/why-choose-us-page/hero'));
      if (res.ok) {
        const json = await res.json();
        setWhyChooseUsHero(json?.data || json || null);
      }
    } catch { }
  };

  const fetchWhyChooseUsOfferings = async () => {
    try {
      const res = await fetch(getApiUrl('/api/cms/why-choose-us-page/offerings'));
      if (res.ok) {
        const json = await res.json();
        setWhyChooseUsOfferings(json?.data || json || null);
      }
    } catch { }
  };

  const fetchWhyChooseUsAdvantages = async () => {
    try {
      const res = await fetch('/api/cms/why-choose-us-page/advantages');
      if (res.ok) {
        const json = await res.json();
        setWhyChooseUsAdvantages(json?.data || json || null);
      }
    } catch { }
  };

  useEffect(() => {
    fetchWhyChooseUsHero();
    fetchWhyChooseUsOfferings();
    fetchWhyChooseUsAdvantages();
  }, []);

  // Listen for updates to refetch data
  useEffect(() => {
    const handleWhyChooseUsHeroChange = () => fetchWhyChooseUsHero();
    const handleWhyChooseUsOfferingsChange = () => fetchWhyChooseUsOfferings();

    window.addEventListener('whyChooseUsHeroChanged', handleWhyChooseUsHeroChange);
    window.addEventListener('whyChooseUsOfferingsChanged', handleWhyChooseUsOfferingsChange);

    return () => {
      window.removeEventListener('whyChooseUsHeroChanged', handleWhyChooseUsHeroChange);
      window.removeEventListener('whyChooseUsOfferingsChanged', handleWhyChooseUsOfferingsChange);
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Why Choose Us Page Management</h2>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex space-x-4 overflow-x-auto">
          {[
            { id: 'hero', label: 'Hero Section', icon: 'ri-layout-top-line', count: whyChooseUsHero ? 1 : 0 },
            { id: 'offerings', label: 'Our Offerings', icon: 'ri-list-check', count: whyChooseUsOfferings ? 1 : 0 }
            // { id: 'advantages', label: 'Advantages', icon: 'ri-star-line', count: whyChooseUsAdvantages ? 1 : 0 } // Hidden
          ].map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveWhyChooseUsSection(section.id)}
              className={`flex items-center px-4 py-3 rounded-lg transition-colors whitespace-nowrap ${activeWhyChooseUsSection === section.id
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

      {activeWhyChooseUsSection === 'hero' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-800">Hero Section</h3>
            <button
              onClick={() => {
                setModalType('edit');
                setEditingItem('why-choose-us-hero');
                setFormData({
                  backgroundImage: whyChooseUsHero?.backgroundImage || '',
                  title: whyChooseUsHero?.title || 'Why Choose Us',
                  description: whyChooseUsHero?.description || '',
                  buttonText: whyChooseUsHero?.buttonText || 'Get in Touch',
                  buttonLink: whyChooseUsHero?.buttonLink || '/contact',
                  isActive: whyChooseUsHero?.isActive ?? true
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
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Title</p>
                <p className="text-gray-900 font-semibold">{whyChooseUsHero?.title || 'Why Choose Us'}</p>
                <p className="text-sm text-gray-500 mt-4 mb-1">Description</p>
                <p className="text-gray-900">{whyChooseUsHero?.description || ''}</p>
                {whyChooseUsHero?.buttonText && (
                  <>
                    <p className="text-sm text-gray-500 mt-4 mb-1">Button</p>
                    <p className="text-gray-900">{whyChooseUsHero.buttonText} → {whyChooseUsHero.buttonLink}</p>
                  </>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Background Preview</p>
                {whyChooseUsHero?.backgroundImage ? (
                  <img src={whyChooseUsHero.backgroundImage} alt="Hero Background" className="w-full h-40 object-cover rounded" />
                ) : (
                  <div className="w-full h-40 bg-gray-100 rounded flex items-center justify-center text-gray-400">No background image</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeWhyChooseUsSection === 'offerings' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-800">Our Offerings Section</h3>
            <button
              onClick={() => {
                setModalType('edit');
                setEditingItem('why-choose-us-offerings');
                // Parse listItems - could be JSON array or string
                let listItems: Array<{boldText: string, description: string}> = [];
                if (whyChooseUsOfferings?.listItems) {
                  try {
                    const parsed = typeof whyChooseUsOfferings.listItems === 'string'
                      ? JSON.parse(whyChooseUsOfferings.listItems)
                      : whyChooseUsOfferings.listItems;
                    if (Array.isArray(parsed)) {
                      listItems = parsed.map((item: any) => ({
                        boldText: item.boldText || item.title || '',
                        description: item.description || item.text || item || ''
                      }));
                    }
                  } catch {
                    // If parsing fails, try to treat as string
                    listItems = [];
                  }
                }
                if (listItems.length === 0) {
                  listItems = [{ boldText: '', description: '' }];
                }
                setFormData({
                  title: whyChooseUsOfferings?.title || 'Our Offerings',
                  image: whyChooseUsOfferings?.image || '',
                  listItems: listItems,
                  isActive: whyChooseUsOfferings?.isActive ?? true
                });
                setShowModal(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              <i className="ri-edit-line mr-2"></i>
              Edit Offerings
            </button>
          </div>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Title</p>
                <p className="text-gray-900 font-semibold text-xl mb-4">{whyChooseUsOfferings?.title || 'Our Offerings'}</p>
                <p className="text-sm text-gray-500 mb-2">Image Preview</p>
                {whyChooseUsOfferings?.image ? (
                  <img 
                    src={getImageUrl(whyChooseUsOfferings.image)} 
                    alt="Offerings" 
                    className="w-full h-40 object-cover rounded"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-40 bg-gray-100 rounded flex items-center justify-center text-gray-400">No image</div>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">List Items</p>
                <ul className="list-disc list-inside text-gray-900 space-y-2">
                  {(() => {
                    try {
                      const items = whyChooseUsOfferings?.listItems
                        ? (typeof whyChooseUsOfferings.listItems === 'string'
                          ? JSON.parse(whyChooseUsOfferings.listItems)
                          : whyChooseUsOfferings.listItems)
                        : [];
                      return Array.isArray(items) ? items.map((item: any, idx: number) => {
                        // Handle both string and object formats
                        if (typeof item === 'string') {
                          return <li key={idx}>{item}</li>;
                        } else if (item && typeof item === 'object') {
                          // Handle object format with boldText and description
                          const boldText = item.boldText || item.bold || '';
                          const description = item.description || item.desc || '';
                          return (
                            <li key={idx}>
                              {boldText && <strong className="text-black">{boldText}: </strong>}
                              {description}
                            </li>
                          );
                        }
                        return null;
                      }) : null;
                    } catch {
                      return null;
                    }
                  })()}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Advantages Section - HIDDEN */}
      {false && activeWhyChooseUsSection === 'advantages' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-800">Advantages Section</h3>
            <button
              onClick={() => {
                setModalType('edit');
                setEditingItem('why-choose-us-advantages');
                setFormData({
                  title: whyChooseUsAdvantages?.title || 'Our Advantages',
                  description: whyChooseUsAdvantages?.description || '',
                  isActive: whyChooseUsAdvantages?.isActive ?? true
                });
                setShowModal(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              <i className="ri-edit-line mr-2"></i>
              Edit Advantages
            </button>
          </div>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <p className="text-sm text-gray-500 mb-1">Title</p>
              <p className="text-gray-900 font-semibold text-xl mb-4">{whyChooseUsAdvantages?.title || 'Our Advantages'}</p>
              <p className="text-sm text-gray-500 mb-1">Description</p>
              <p className="text-gray-900">{whyChooseUsAdvantages?.description || ''}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function WhyChooseUsHeroForm({ formData, handleInputChange, uploadImage, uploadingImage }: any) {
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
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          value={formData.description || ''}
          onChange={(e) => handleInputChange('description', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={6}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Background Image</label>
        <input
          type="text"
          value={formData.backgroundImage || ''}
          onChange={(e) => handleInputChange('backgroundImage', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <input
          type="file"
          accept="image/*"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (file) {
              const url = await uploadImage(file);
              if (url) handleInputChange('backgroundImage', url);
            }
          }}
          className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {formData.backgroundImage && (
          <img src={formData.backgroundImage} alt="Preview" className="mt-2 w-full max-h-60 object-cover rounded" />
        )}
        {uploadingImage && <p className="text-xs text-blue-600 mt-1">Uploading...</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
        <input
          type="text"
          value={formData.buttonText || ''}
          onChange={(e) => handleInputChange('buttonText', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Button Link</label>
        <input
          type="text"
          value={formData.buttonLink || ''}
          onChange={(e) => handleInputChange('buttonLink', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          id="whyChooseUsHeroIsActive"
          checked={formData.isActive !== false}
          onChange={(e) => handleInputChange('isActive', e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="whyChooseUsHeroIsActive" className="text-sm font-medium text-gray-700">Active</label>
      </div>
    </>
  );
}

export function WhyChooseUsOfferingsForm({ formData, handleInputChange, uploadImage, uploadingImage }: any) {
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
        <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
        <input
          type="text"
          value={formData.image || ''}
          onChange={(e) => handleInputChange('image', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
          placeholder="/assets/images/banners/why-choose-us.jpg"
        />
        <input
          type="file"
          accept="image/*"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (file) {
              const url = await uploadImage(file);
              if (url) handleInputChange('image', url);
            }
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {formData.image && (
          <div className="mt-2">
            <img src={formData.image} alt="Preview" className="w-full h-40 object-cover rounded" />
          </div>
        )}
        {uploadingImage && <p className="text-xs text-blue-600 mt-1">Uploading...</p>}
      </div>
      <OfferingsListItemsField
        items={formData.listItems || [{ boldText: '', description: '' }]}
        onChange={(items) => handleInputChange('listItems', items)}
        label="List Items"
      />
      <div className="flex items-center">
        <input
          type="checkbox"
          id="whyChooseUsOfferingsIsActive"
          checked={formData.isActive !== false}
          onChange={(e) => handleInputChange('isActive', e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="whyChooseUsOfferingsIsActive" className="text-sm font-medium text-gray-700">Active</label>
      </div>
    </>
  );
}

export function WhyChooseUsAdvantagesForm({ formData, handleInputChange }: any) {
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
          rows={6}
        />
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          id="whyChooseUsAdvantagesIsActive"
          checked={formData.isActive !== false}
          onChange={(e) => handleInputChange('isActive', e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="whyChooseUsAdvantagesIsActive" className="text-sm font-medium text-gray-700">Active</label>
      </div>
    </>
  );
}

