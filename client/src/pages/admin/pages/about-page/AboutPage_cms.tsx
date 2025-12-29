import { useState, useEffect } from 'react';
import { authHeaders } from '../../shared/utils';
import { CMSComponentProps } from '../../shared/types';
import { DynamicParagraphsField } from './DynamicParagraphsField';

interface AboutPageProps extends Partial<CMSComponentProps> {
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
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  uploadImage: (file: File) => Promise<string | null>;
}

export default function AboutPage_cms({
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
  uploadImage
}: AboutPageProps) {
  const [activeAboutSection, setActiveAboutSection] = useState('about-hero');
  const [aboutHero, setAboutHero] = useState<any>(null);
  const [aboutRedefiningHealthcare, setAboutRedefiningHealthcare] = useState<any>(null);
  const [aboutRefexGroup, setAboutRefexGroup] = useState<any>(null);

  const fetchAboutHero = async () => {
    try {
      const res = await fetch('/api/cms/about-page/hero');
      if (res.ok) {
        const json = await res.json();
        setAboutHero(json?.data || json || null);
      }
    } catch { }
  };

  const fetchAboutRedefiningHealthcare = async () => {
    try {
      const res = await fetch('/api/cms/about-page/redefining-healthcare');
      if (res.ok) {
        const json = await res.json();
        setAboutRedefiningHealthcare(json?.data || json || null);
      }
    } catch { }
  };

  const fetchAboutRefexGroup = async () => {
    try {
      const res = await fetch('/api/cms/about-page/refex-group');
      if (res.ok) {
        const json = await res.json();
        setAboutRefexGroup(json?.data || json || null);
      }
    } catch { }
  };

  useEffect(() => {
    fetchAboutHero();
    fetchAboutRedefiningHealthcare();
    fetchAboutRefexGroup();
  }, []);

  // Listen for updates to refetch data
  useEffect(() => {
    const handleRedefiningHealthcareChange = () => {
      fetchAboutRedefiningHealthcare();
    };
    const handleRefexGroupChange = () => {
      fetchAboutRefexGroup();
    };
    const handleAboutHeroChange = () => {
      fetchAboutHero();
    };

    window.addEventListener('aboutRedefiningHealthcareChanged', handleRedefiningHealthcareChange);
    window.addEventListener('aboutRefexGroupChanged', handleRefexGroupChange);
    window.addEventListener('aboutHeroChanged', handleAboutHeroChange);

    return () => {
      window.removeEventListener('aboutRedefiningHealthcareChanged', handleRedefiningHealthcareChange);
      window.removeEventListener('aboutRefexGroupChanged', handleRefexGroupChange);
      window.removeEventListener('aboutHeroChanged', handleAboutHeroChange);
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">About Page Management</h2>
      </div>

      {/* About Page Sections Navigation */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex space-x-4 overflow-x-auto">
          {[
            { id: 'about-hero', label: 'Hero Section', icon: 'ri-layout-top-line', count: aboutHero ? 1 : 0 },
            { id: 'redefining-healthcare', label: 'Redefining Healthcare', icon: 'ri-heart-pulse-line', count: aboutRedefiningHealthcare ? 1 : 0 },
            { id: 'refex-group', label: 'Explore Refex Group', icon: 'ri-building-line', count: aboutRefexGroup ? 1 : 0 },
          ].map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveAboutSection(section.id)}
              className={`flex items-center px-4 py-3 rounded-lg transition-colors whitespace-nowrap ${activeAboutSection === section.id
                ? 'bg-blue-100 text-blue-700 border-2 border-blue-200'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-2 border-transparent'
                }`}
            >
              <i className={`${section.icon} mr-2`}></i>
              <span className="font-medium">{section.label}</span>
              <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeAboutSection === section.id
                ? 'bg-blue-200 text-blue-800'
                : 'bg-gray-200 text-gray-600'
                }`}>
                {section.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Hero Section Content */}
      {activeAboutSection === 'about-hero' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-800">Hero Section</h3>
            <button
              onClick={() => {
                setModalType('edit');
                setEditingItem('about-hero');
                setFormData({
                  backgroundImage: aboutHero?.backgroundImage || '',
                  title: aboutHero?.title || 'About 3i Medical Technologies',
                  description: aboutHero?.description || '',
                  isActive: aboutHero?.isActive ?? true
                });
                setShowModal(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <i className="ri-edit-line mr-2"></i>
              Edit Hero
            </button>
          </div>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Title</p>
                <p className="text-gray-900 font-semibold">{aboutHero?.title || 'About 3i Medical Technologies'}</p>
                <p className="text-sm text-gray-500 mt-4 mb-1">Description</p>
                <p className="text-gray-900">{aboutHero?.description || '3i Med Tech is an esteemed player in the medical devices industry...'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Background Preview</p>
                {aboutHero?.backgroundImage ? (
                  <img src={aboutHero.backgroundImage} alt="About Hero" className="w-full h-40 object-cover rounded" />
                ) : (
                  <div className="w-full h-40 bg-gray-100 rounded flex items-center justify-center text-gray-400">No background image</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Redefining Healthcare Section Content */}
      {activeAboutSection === 'redefining-healthcare' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-800">Redefining Healthcare Section</h3>
            <button
              onClick={() => {
                setModalType('edit');
                setEditingItem('redefining-healthcare');
                // Parse description - could be string or JSON array
                let descriptionParagraphs: string[] = [];
                if (aboutRedefiningHealthcare?.description) {
                  const trimmed = aboutRedefiningHealthcare.description.trim();
                  if (trimmed.startsWith('[')) {
                    try {
                      const parsed = JSON.parse(aboutRedefiningHealthcare.description);
                      descriptionParagraphs = Array.isArray(parsed) ? parsed : [aboutRedefiningHealthcare.description];
                    } catch {
                      descriptionParagraphs = [aboutRedefiningHealthcare.description];
                    }
                  } else {
                    descriptionParagraphs = [aboutRedefiningHealthcare.description];
                  }
                }
                if (descriptionParagraphs.length === 0) {
                  descriptionParagraphs = [''];
                }
                setFormData({
                  title: aboutRedefiningHealthcare?.title || 'Redefining Healthcare Through Innovation',
                  descriptionParagraphs: descriptionParagraphs,
                  buttonText: aboutRedefiningHealthcare?.buttonText || 'Download Our Brochure',
                  buttonLink: aboutRedefiningHealthcare?.buttonLink || '',
                  buttonIcon: aboutRedefiningHealthcare?.buttonIcon || 'fa fa-cloud-download',
                  isActive: aboutRedefiningHealthcare?.isActive ?? true
                });
                setShowModal(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <i className="ri-edit-line mr-2"></i>
              Edit Section
            </button>
          </div>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <p className="text-sm text-gray-500 mb-1">Title</p>
              <p className="text-gray-900 font-semibold text-xl mb-4">{aboutRedefiningHealthcare?.title || 'Redefining Healthcare Through Innovation'}</p>
              <p className="text-sm text-gray-500 mb-1">Description</p>
              <p className="text-gray-900 mb-4">{aboutRedefiningHealthcare?.description || ''}</p>
              <div className="flex items-center gap-4">
                <p className="text-sm text-gray-500">Button:</p>
                <span className="inline-flex items-center gap-2 bg-[#027C8E] text-white px-4 py-2 rounded-full">
                  {aboutRedefiningHealthcare?.buttonIcon && <i className={aboutRedefiningHealthcare.buttonIcon}></i>}
                  <span>{aboutRedefiningHealthcare?.buttonText || 'Download Our Brochure'}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Explore Refex Group Section Content */}
      {activeAboutSection === 'refex-group' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-800">Explore Refex Group Section</h3>
            <button
              onClick={() => {
                setModalType('edit');
                setEditingItem('refex-group');
                // Parse paragraphs - could be individual fields or JSON array
                let descriptionParagraphs: string[] = [];
                
                if (aboutRefexGroup?.descriptionParagraph1) {
                  const trimmed = aboutRefexGroup.descriptionParagraph1.trim();
                  if (trimmed.startsWith('[')) {
                    try {
                      const parsed = JSON.parse(aboutRefexGroup.descriptionParagraph1);
                      if (Array.isArray(parsed)) {
                        descriptionParagraphs = parsed; // Preserve all paragraphs including empty ones
                      } else {
                        descriptionParagraphs = [aboutRefexGroup.descriptionParagraph1];
                      }
                    } catch {
                      descriptionParagraphs = [aboutRefexGroup.descriptionParagraph1];
                    }
                  } else {
                    // Legacy format - single paragraph
                    descriptionParagraphs = [aboutRefexGroup.descriptionParagraph1];
                    if (aboutRefexGroup.descriptionParagraph2) {
                      descriptionParagraphs.push(aboutRefexGroup.descriptionParagraph2);
                    }
                  }
                } else if (aboutRefexGroup?.descriptionParagraph2) {
                  descriptionParagraphs = [aboutRefexGroup.descriptionParagraph2];
                }
                
                if (descriptionParagraphs.length === 0) {
                  descriptionParagraphs = [''];
                }
                
                setFormData({
                  title: aboutRefexGroup?.title || 'Explore Refex Group',
                  descriptionParagraphs: descriptionParagraphs,
                  buttonText: aboutRefexGroup?.buttonText || 'Explore Refex Group',
                  buttonLink: aboutRefexGroup?.buttonLink || 'https://www.refex.group/',
                  isActive: aboutRefexGroup?.isActive ?? true
                });
                setShowModal(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <i className="ri-edit-line mr-2"></i>
              Edit Section
            </button>
          </div>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <p className="text-sm text-gray-500 mb-1">Title</p>
              <p className="text-gray-900 font-semibold text-xl mb-4">{aboutRefexGroup?.title || 'Explore Refex Group'}</p>
              <p className="text-sm text-gray-500 mb-1">Description Paragraphs</p>
              {(() => {
                let paragraphs: string[] = [];
                
                if (aboutRefexGroup?.descriptionParagraph1) {
                  const trimmed = aboutRefexGroup.descriptionParagraph1.trim();
                  if (trimmed.startsWith('[')) {
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
                    paragraphs = [aboutRefexGroup.descriptionParagraph1];
                    if (aboutRefexGroup.descriptionParagraph2) {
                      paragraphs.push(aboutRefexGroup.descriptionParagraph2);
                    }
                  }
                } else if (aboutRefexGroup?.descriptionParagraph2) {
                  paragraphs = [aboutRefexGroup.descriptionParagraph2];
                }
                
                return paragraphs.length > 0 ? (
                  paragraphs.map((para, idx) => (
                    <div key={idx} className="mb-4">
                      <p className="text-xs text-gray-500 mb-1">Paragraph {idx + 1}</p>
                      <p className="text-gray-900 whitespace-pre-wrap">{para || '\u00A0'}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 italic">No paragraphs added</p>
                );
              })()}
              <div className="flex items-center gap-4">
                <p className="text-sm text-gray-500">Button:</p>
                <span className="inline-flex items-center gap-2 bg-[#027C8E] text-white px-4 py-2 rounded-full">
                  <span>{aboutRefexGroup?.buttonText || 'Explore Refex Group'}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Export form components for modal
export function AboutHeroForm({ formData, handleInputChange, uploadImage, uploadingImage }: any) {
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
      <div className="flex items-center">
        <input
          type="checkbox"
          id="aboutHeroIsActive"
          checked={formData.isActive !== false}
          onChange={(e) => handleInputChange('isActive', e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="aboutHeroIsActive" className="text-sm font-medium text-gray-700">Active</label>
      </div>
    </>
  );
}

export function RedefiningHealthcareForm({ formData, handleInputChange }: any) {
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
      <DynamicParagraphsField
        paragraphs={formData.descriptionParagraphs || ['']}
        onChange={(paragraphs) => handleInputChange('descriptionParagraphs', paragraphs)}
        label="Description Paragraphs"
      />
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
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Button Icon (CSS class)</label>
        <input
          type="text"
          value={formData.buttonIcon || ''}
          onChange={(e) => handleInputChange('buttonIcon', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="fa fa-cloud-download"
        />
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          id="redefiningHealthcareIsActive"
          checked={formData.isActive !== false}
          onChange={(e) => handleInputChange('isActive', e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="redefiningHealthcareIsActive" className="text-sm font-medium text-gray-700">Active</label>
      </div>
    </>
  );
}

export function RefexGroupForm({ formData, handleInputChange }: any) {
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
      <DynamicParagraphsField
        paragraphs={formData.descriptionParagraphs || ['']}
        onChange={(paragraphs) => handleInputChange('descriptionParagraphs', paragraphs)}
        label="Description Paragraphs"
      />
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
          id="refexGroupIsActive"
          checked={formData.isActive !== false}
          onChange={(e) => handleInputChange('isActive', e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="refexGroupIsActive" className="text-sm font-medium text-gray-700">Active</label>
      </div>
    </>
  );
}

