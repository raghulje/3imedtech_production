import { useState, useEffect } from 'react';
import { authHeaders, getApiUrl } from '../../shared/utils';

interface MissionVisionPageProps {
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

export default function MissionVisionPage_cms({
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
}: MissionVisionPageProps) {
  const [activeMissionVisionSection, setActiveMissionVisionSection] = useState('hero');
  const [missionVisionHero, setMissionVisionHero] = useState<any>(null);
  const [missionVisionMission, setMissionVisionMission] = useState<any>(null);
  const [missionVisionVision, setMissionVisionVision] = useState<any>(null);

  const fetchMissionVisionHero = async () => {
    try {
      const res = await fetch(getApiUrl('/api/cms/mission-vision/hero'));
      if (res.ok) {
        const json = await res.json();
        setMissionVisionHero(json?.data || json || null);
      }
    } catch { }
  };

  const fetchMissionVisionMission = async () => {
    try {
      const res = await fetch(getApiUrl('/api/cms/mission-vision/content/mission'));
      if (res.ok) {
        const json = await res.json();
        setMissionVisionMission(json?.data || json || null);
      }
    } catch { }
  };

  const fetchMissionVisionVision = async () => {
    try {
      const res = await fetch(getApiUrl('/api/cms/mission-vision/content/vision'));
      if (res.ok) {
        const json = await res.json();
        setMissionVisionVision(json?.data || json || null);
      }
    } catch { }
  };

  useEffect(() => {
    fetchMissionVisionHero();
    fetchMissionVisionMission();
    fetchMissionVisionVision();
  }, []);

  // Listen for updates to refetch data
  useEffect(() => {
    const handleMissionVisionHeroChange = () => {
      fetchMissionVisionHero();
    };
    const handleMissionVisionMissionChange = () => {
      fetchMissionVisionMission();
    };
    const handleMissionVisionVisionChange = () => {
      fetchMissionVisionVision();
    };

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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Mission & Vision Page Management</h2>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex space-x-4 overflow-x-auto">
          {[
            { id: 'hero', label: 'Hero Section', icon: 'ri-layout-top-line', count: missionVisionHero ? 1 : 0 },
            { id: 'mission', label: 'Mission', icon: 'ri-target-line', count: missionVisionMission ? 1 : 0 },
            { id: 'vision', label: 'Vision', icon: 'ri-eye-line', count: missionVisionVision ? 1 : 0 }
          ].map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveMissionVisionSection(section.id)}
              className={`flex items-center px-4 py-3 rounded-lg transition-colors whitespace-nowrap ${activeMissionVisionSection === section.id
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

      {activeMissionVisionSection === 'hero' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-800">Hero Section</h3>
            <button
              onClick={() => {
                setModalType('edit');
                setEditingItem('mission-vision-hero');
                setFormData({
                  backgroundImage: missionVisionHero?.backgroundImage || '',
                  title: missionVisionHero?.title || 'Mission & Vision',
                  description: missionVisionHero?.description || '',
                  isActive: missionVisionHero?.isActive ?? true
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
                <p className="text-gray-900 font-semibold">{missionVisionHero?.title || 'Mission & Vision'}</p>
                <p className="text-sm text-gray-500 mt-4 mb-1">Description</p>
                <p className="text-gray-900">{missionVisionHero?.description || ''}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Background Preview</p>
                {missionVisionHero?.backgroundImage ? (
                  <img src={missionVisionHero.backgroundImage} alt="Hero Background" className="w-full h-40 object-cover rounded" />
                ) : (
                  <div className="w-full h-40 bg-gray-100 rounded flex items-center justify-center text-gray-400">No background image</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeMissionVisionSection === 'mission' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-800">Mission Section</h3>
            <button
              onClick={() => {
                setModalType('edit');
                setEditingItem('mission-vision-mission');
                setFormData({
                  icon: missionVisionMission?.icon || '',
                  title: missionVisionMission?.title || 'Our Mission',
                  description: missionVisionMission?.description || '',
                  isActive: missionVisionMission?.isActive ?? true
                });
                setShowModal(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              <i className="ri-edit-line mr-2"></i>
              Edit Mission
            </button>
          </div>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <p className="text-sm text-gray-500 mb-1">Title</p>
              <p className="text-gray-900 font-semibold text-xl mb-4">{missionVisionMission?.title || 'Our Mission'}</p>
              <p className="text-sm text-gray-500 mb-1">Description</p>
              <p className="text-gray-900">{missionVisionMission?.description || ''}</p>
            </div>
          </div>
        </div>
      )}

      {activeMissionVisionSection === 'vision' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-800">Vision Section</h3>
            <button
              onClick={() => {
                setModalType('edit');
                setEditingItem('mission-vision-vision');
                setFormData({
                  icon: missionVisionVision?.icon || '',
                  title: missionVisionVision?.title || 'Our Vision',
                  description: missionVisionVision?.description || '',
                  isActive: missionVisionVision?.isActive ?? true
                });
                setShowModal(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              <i className="ri-edit-line mr-2"></i>
              Edit Vision
            </button>
          </div>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <p className="text-sm text-gray-500 mb-1">Title</p>
              <p className="text-gray-900 font-semibold text-xl mb-4">{missionVisionVision?.title || 'Our Vision'}</p>
              <p className="text-sm text-gray-500 mb-1">Description</p>
              <p className="text-gray-900">{missionVisionVision?.description || ''}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function MissionVisionHeroForm({ formData, handleInputChange, uploadImage, uploadingImage }: any) {
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
          rows={4}
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
          id="missionVisionHeroIsActive"
          checked={formData.isActive !== false}
          onChange={(e) => handleInputChange('isActive', e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="missionVisionHeroIsActive" className="text-sm font-medium text-gray-700">Active</label>
      </div>
    </>
  );
}

export function MissionForm({ formData, handleInputChange, uploadImage, uploadingImage }: any) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Icon (CSS class or image URL)</label>
        <input
          type="text"
          value={formData.icon || ''}
          onChange={(e) => handleInputChange('icon', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
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
          required
        />
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          id="missionIsActive"
          checked={formData.isActive !== false}
          onChange={(e) => handleInputChange('isActive', e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="missionIsActive" className="text-sm font-medium text-gray-700">Active</label>
      </div>
    </>
  );
}

export function VisionForm({ formData, handleInputChange, uploadImage, uploadingImage }: any) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Icon (CSS class or image URL)</label>
        <input
          type="text"
          value={formData.icon || ''}
          onChange={(e) => handleInputChange('icon', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
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
          required
        />
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          id="visionIsActive"
          checked={formData.isActive !== false}
          onChange={(e) => handleInputChange('isActive', e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="visionIsActive" className="text-sm font-medium text-gray-700">Active</label>
      </div>
    </>
  );
}

