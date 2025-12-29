import { useState, useEffect } from 'react';
import { authHeaders, getApiUrl, getImageUrl } from '../../shared/utils';

interface FPDCArmPageProps {
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
  handleSubmit: (e: React.FormEvent) => void;
  handleDelete: (item: any) => void;
  uploadImage: (file: File) => Promise<string | null>;
  uploadingImage: boolean;
  setUploadingImage: (uploading: boolean) => void;
}

export default function FPDCArmPage_cms({
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
  handleSubmit,
  handleDelete,
  uploadImage,
  uploadingImage,
  setUploadingImage
}: FPDCArmPageProps) {
  const [activeSection, setActiveSection] = useState('hero');
  const [hero, setHero] = useState<any>(null);
  const [content, setContent] = useState<any>(null);

  const fetchHero = async () => {
    try {
      const res = await fetch(getApiUrl('/api/cms/fpd-carm/hero'));
      if (res.ok) {
        const json = await res.json();
        setHero(json?.data || json || null);
      }
    } catch { }
  };

  const fetchContent = async () => {
    try {
      const res = await fetch(getApiUrl('/api/cms/fpd-carm/content'));
      if (res.ok) {
        const json = await res.json();
        setContent(json?.data || json || null);
      }
    } catch { }
  };

  useEffect(() => {
    fetchHero();
    fetchContent();

    // Listen for data changes
    const handleHeroChange = () => fetchHero();
    const handleContentChange = () => fetchContent();

    window.addEventListener('fpdCarmHeroChanged', handleHeroChange);
    window.addEventListener('fpdCarmContentChanged', handleContentChange);

    return () => {
      window.removeEventListener('fpdCarmHeroChanged', handleHeroChange);
      window.removeEventListener('fpdCarmContentChanged', handleContentChange);
    };
  }, []);

  const handleHeroEdit = () => {
    setModalType('edit');
    setEditingItem('fpd-carm-hero');
    setFormData({
      title: hero?.title || 'FPD C-ARM',
      subtitle: hero?.subtitle || '',
      description: hero?.description || '',
      backgroundImage: hero?.backgroundImage || '',
      isActive: hero?.isActive ?? true
    });
    setShowModal(true);
  };

  const handleContentEdit = () => {
    setModalType('edit');
    setEditingItem('fpd-carm-content');
    // Parse features and benefits if they're JSON strings
    let featuresText = content?.features || '';
    let benefitsText = content?.benefits || '';
    
    if (typeof featuresText === 'string' && featuresText.trim().startsWith('[')) {
      try {
        const parsed = JSON.parse(featuresText);
        featuresText = Array.isArray(parsed) ? parsed.join('\n') : featuresText;
      } catch { }
    }
    
    if (typeof benefitsText === 'string' && benefitsText.trim().startsWith('[')) {
      try {
        const parsed = JSON.parse(benefitsText);
        benefitsText = Array.isArray(parsed) ? parsed.join('\n') : benefitsText;
      } catch { }
    }
    
    setFormData({
      overview: content?.overview || '',
      features: featuresText,
      benefits: benefitsText,
      productImage: content?.productImage || '',
      isActive: content?.isActive ?? true
    });
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">FPD C-ARM Page Management</h2>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex space-x-4 overflow-x-auto">
          {[
            { id: 'hero', label: 'Hero Section', icon: 'ri-layout-top-line' },
            { id: 'content', label: 'Content', icon: 'ri-file-text-line' }
          ].map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center px-4 py-3 rounded-lg transition-colors whitespace-nowrap ${activeSection === section.id
                ? 'bg-blue-100 text-blue-700 border-2 border-blue-200'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-2 border-transparent'
                }`}
            >
              <i className={`${section.icon} mr-2`}></i>
              <span className="font-medium">{section.label}</span>
            </button>
          ))}
        </div>
      </div>

      {activeSection === 'hero' && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Hero Section</h3>
            <button
              onClick={handleHeroEdit}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              <i className="ri-edit-line mr-2"></i>
              Edit Hero
            </button>
          </div>
          <div className="space-y-4">
            <div className="relative h-60 w-full rounded overflow-hidden bg-gradient-to-r from-[#7AB730] to-[#4A90A4]">
              {hero?.backgroundImage ? (
                <img
                  src={getImageUrl(hero.backgroundImage)}
                  alt="Hero Background"
                  className="w-full h-full object-cover"
                />
              ) : null}
              <div className={`absolute inset-0 flex items-center justify-center ${hero?.backgroundImage ? 'bg-black/50' : ''}`}>
                <div className="text-center text-white px-4">
                  <h4 className="text-2xl md:text-4xl font-bold mb-2">
                    {hero?.title || 'FPD C-ARM'}
                  </h4>
                  {hero?.subtitle && (
                    <p className="text-lg md:text-xl mb-2">{hero.subtitle}</p>
                  )}
                  {hero?.description && (
                    <p className="text-sm md:text-base opacity-90">{hero.description}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'content' && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Content Section</h3>
            <button
              onClick={handleContentEdit}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              <i className="ri-edit-line mr-2"></i>
              Edit Content
            </button>
          </div>
          <div className="space-y-4">
            {content?.overview && (
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Overview</h4>
                <p className="text-gray-700">{content.overview}</p>
              </div>
            )}
            {content?.features && (
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Features</h4>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  {(() => {
                    let featuresList: string[] = [];
                    try {
                      const parsed = JSON.parse(content.features);
                      featuresList = Array.isArray(parsed) ? parsed : [content.features];
                    } catch {
                      featuresList = content.features.split('\n').filter((f: string) => f.trim());
                    }
                    return featuresList.map((feature: string, idx: number) => (
                      <li key={idx}>{feature}</li>
                    ));
                  })()}
                </ul>
              </div>
            )}
            {content?.benefits && (
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Benefits</h4>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  {(() => {
                    let benefitsList: string[] = [];
                    try {
                      const parsed = JSON.parse(content.benefits);
                      benefitsList = Array.isArray(parsed) ? parsed : [content.benefits];
                    } catch {
                      benefitsList = content.benefits.split('\n').filter((b: string) => b.trim());
                    }
                    return benefitsList.map((benefit: string, idx: number) => (
                      <li key={idx}>{benefit}</li>
                    ));
                  })()}
                </ul>
              </div>
            )}
            {content?.productImage && (
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Product Image</h4>
                <img
                  src={getImageUrl(content.productImage)}
                  alt="Product"
                  className="w-64 h-64 object-cover rounded-lg"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function FPDCArmHeroForm({ formData, handleInputChange, uploadImage, uploadingImage }: any) {
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
        <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
        <input
          type="text"
          value={formData.subtitle || ''}
          onChange={(e) => handleInputChange('subtitle', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          value={formData.description || ''}
          onChange={(e) => handleInputChange('description', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={3}
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
          <img src={getImageUrl(formData.backgroundImage)} alt="Preview" className="mt-2 w-full max-h-60 object-cover rounded" />
        )}
        {uploadingImage && <p className="text-xs text-blue-600 mt-1">Uploading...</p>}
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          id="fpdCarmHeroIsActive"
          checked={formData.isActive !== false}
          onChange={(e) => handleInputChange('isActive', e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="fpdCarmHeroIsActive" className="text-sm font-medium text-gray-700">Active</label>
      </div>
    </>
  );
}

export function FPDCArmContentForm({ formData, handleInputChange, uploadImage, uploadingImage }: any) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Overview</label>
        <textarea
          value={formData.overview || ''}
          onChange={(e) => handleInputChange('overview', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={4}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Features (one per line)</label>
        <textarea
          value={formData.features || ''}
          onChange={(e) => handleInputChange('features', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={6}
          placeholder="CsI Flat Panel Detector&#10;Large Field of View&#10;ADONIS TIALIC low-dose technology"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Benefits (one per line)</label>
        <textarea
          value={formData.benefits || ''}
          onChange={(e) => handleInputChange('benefits', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={6}
          placeholder="Clear, detailed images&#10;Reduced radiation exposure&#10;Faster, smoother workflow"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
        <input
          type="text"
          value={formData.productImage || ''}
          onChange={(e) => handleInputChange('productImage', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <input
          type="file"
          accept="image/*"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (file) {
              const url = await uploadImage(file);
              if (url) handleInputChange('productImage', url);
            }
          }}
          className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {formData.productImage && (
          <img src={getImageUrl(formData.productImage)} alt="Preview" className="mt-2 w-64 h-64 object-cover rounded" />
        )}
        {uploadingImage && <p className="text-xs text-blue-600 mt-1">Uploading...</p>}
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          id="fpdCarmContentIsActive"
          checked={formData.isActive !== false}
          onChange={(e) => handleInputChange('isActive', e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="fpdCarmContentIsActive" className="text-sm font-medium text-gray-700">Active</label>
      </div>
    </>
  );
}

