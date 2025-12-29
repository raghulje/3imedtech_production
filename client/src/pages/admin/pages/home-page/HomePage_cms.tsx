import { useState, useEffect } from 'react';
import { DataTable } from '../../shared/DataTable';
import { authHeaders } from '../../shared/utils';
import { CMSComponentProps } from '../../shared/types';
import { showToast } from '@/components/admin/Toast';
import { useAdminAuthStore } from '../../../../store/adminAuthStore';

interface HomePageProps extends Partial<CMSComponentProps> {
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
  handleDelete: (item: any) => void;
  uploadImage: (file: File) => Promise<string | null>;
  uploadingImage: boolean;
  setUploadingImage: (uploading: boolean) => void;
}

export default function HomePage_cms({
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
}: HomePageProps) {
  const [activeHomeSection, setActiveHomeSection] = useState('hero');
  const [homeHero, setHomeHero] = useState<any>(null);
  const [homeAboutSection, setHomeAboutSection] = useState<any>(null);
  const [homeImageBoxes, setHomeImageBoxes] = useState<any[]>([]);
  const [homeCommitment, setHomeCommitment] = useState<any>(null);
  const [commitmentCards, setCommitmentCards] = useState<any[]>([]);
  const [deletedItems, setDeletedItems] = useState<any[]>([]);
  const [showDeletedItems, setShowDeletedItems] = useState(false);
  const user = useAdminAuthStore((state) => state.user);
  const isAdmin = user?.role === 'admin';

  const fetchHomeHero = async () => {
    try {
      const res = await fetch('/api/cms/home-page/hero');
      if (res.ok) {
        const json = await res.json();
        setHomeHero(json?.data || json || null);
      }
    } catch { }
  };

  const fetchHomeAboutSection = async () => {
    try {
      const res = await fetch('/api/cms/home-page/about-section');
      if (res.ok) {
        const json = await res.json();
        setHomeAboutSection(json?.data || json || null);
      }
    } catch { }
  };

  const fetchHomeImageBoxes = async () => {
    try {
      const res = await fetch('/api/cms/home-page/image-boxes');
      if (res.ok) {
        const json = await res.json();
        const boxes = Array.isArray(json?.data) ? json.data : json;
        setHomeImageBoxes((boxes || []).slice().sort((a: any, b: any) => (a.order || 0) - (b.order || 0)));
      }
    } catch { }
  };

  const fetchHomeCommitment = async () => {
    try {
      const res = await fetch('/api/cms/home-page/commitment');
      if (res.ok) {
        const json = await res.json();
        const commitment = json?.data || json || null;
        setHomeCommitment(commitment);
        if (commitment?.cards) {
          const cards = typeof commitment.cards === 'string'
            ? JSON.parse(commitment.cards)
            : commitment.cards;
          setCommitmentCards(Array.isArray(cards) ? cards : []);
        } else {
          setCommitmentCards([]);
        }
      }
    } catch { }
  };

  const fetchDeletedItems = async () => {
    try {
      const res = await fetch('/api/cms/home-page/image-boxes?includeDeleted=true', {
        headers: { ...authHeaders(token) }
      });
      if (res.ok) {
        const json = await res.json();
        const allBoxes = Array.isArray(json?.data) ? json.data : [];
        const deleted = allBoxes.filter((box: any) => box.isDeleted === true);
        setDeletedItems(deleted);
      }
    } catch (error) {
      console.error('Error fetching deleted items:', error);
    }
  };

  useEffect(() => {
    fetchHomeHero();
    fetchHomeAboutSection();
    fetchHomeImageBoxes();
    fetchHomeCommitment();
    fetchDeletedItems();
  }, []);

  // Listen for updates to refetch data
  useEffect(() => {
    const handleHomeHeroChange = () => fetchHomeHero();
    const handleHomeAboutSectionChange = () => fetchHomeAboutSection();
    const handleHomeImageBoxesChange = () => {
      fetchHomeImageBoxes();
      fetchDeletedItems();
    };
    const handleHomeCommitmentChange = () => fetchHomeCommitment();

    window.addEventListener('homeHeroChanged', handleHomeHeroChange);
    window.addEventListener('homeAboutSectionChanged', handleHomeAboutSectionChange);
    window.addEventListener('homeImageBoxesChanged', handleHomeImageBoxesChange);
    window.addEventListener('homeCommitmentChanged', handleHomeCommitmentChange);

    return () => {
      window.removeEventListener('homeHeroChanged', handleHomeHeroChange);
      window.removeEventListener('homeAboutSectionChanged', handleHomeAboutSectionChange);
      window.removeEventListener('homeImageBoxesChanged', handleHomeImageBoxesChange);
      window.removeEventListener('homeCommitmentChanged', handleHomeCommitmentChange);
    };
  }, []);

  const handleImageBoxEdit = (item: any) => {
    setModalType('edit');
    setEditingItem({ type: 'home-image-box', id: item.id });
    setFormData({
      label: item.label || '',
      title: item.title || '',
      description: item.description || '',
      image: item.image || '',
      link: item.link || '',
      linkText: item.linkText || 'Discover Now',
      order: item.order || 0,
      isActive: item.isActive !== undefined ? item.isActive : true
    });
    setShowModal(true);
  };

  const handleImageBoxDelete = async (item: any) => {
    try {
      await fetch(`/api/cms/home-page/image-boxes/${item.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', ...authHeaders(token) }
      });
      await fetchHomeImageBoxes();
      await fetchDeletedItems();
      showToast.success('Image box deleted successfully. You can restore it from the Deleted Items section.');
    } catch (error) {
      console.error('Error deleting image box:', error);
      showToast.error('Failed to delete image box. Please try again.');
    }
  };

  const handleCommitmentCardEdit = (item: any, index: number) => {
    setModalType('edit');
    setEditingItem({ type: 'home-commitment-card', cardIndex: index });
    setFormData({
      title: item.title || '',
      icon: item.icon || '',
      description: item.description || '',
      link: item.link || '',
      linkText: item.linkText || 'Learn More',
      order: item.order || 0,
      isActive: item.isActive !== false
    });
    setShowModal(true);
  };

  const handleCommitmentCardDelete = async (item: any, index: number) => {
    if (window.confirm(`Are you sure you want to delete "${item.title}"?`)) {
      try {
        const sortedCards = [...commitmentCards].sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
        const updatedCards = sortedCards.filter((_, i) => i !== index);
        const response = await fetch('/api/cms/home-page/commitment', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...authHeaders(token)
          },
          body: JSON.stringify({
            ...homeCommitment,
            cards: JSON.stringify(updatedCards)
          })
        });
        if (response.ok) {
          await fetchHomeCommitment();
          showToast.success('Commitment card deleted successfully!');
        } else {
          const errorData = await response.json();
          showToast.error(`Failed to delete commitment card: ${errorData.message || 'Please try again.'}`);
        }
      } catch (error) {
        console.error('Error deleting commitment card:', error);
        showToast.error('Failed to delete commitment card. Please try again.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Home Page Management</h2>
      </div>

      {/* Home Page Sections Navigation */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex space-x-4 overflow-x-auto">
          {[
            { id: 'hero', label: 'Hero', icon: 'ri-image-line' },
            { id: 'about-section', label: 'About Section', icon: 'ri-information-line' },
            { id: 'image-boxes', label: 'Image Boxes', icon: 'ri-layout-grid-line', count: homeImageBoxes.length },
            { id: 'commitment', label: 'Commitment', icon: 'ri-heart-line' }
          ].map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveHomeSection(section.id)}
              className={`flex items-center px-4 py-3 rounded-lg transition-colors whitespace-nowrap ${activeHomeSection === section.id
                ? 'bg-blue-100 text-blue-700 border-2 border-blue-200'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-2 border-transparent'
                }`}
            >
              <i className={`${section.icon} mr-2`}></i>
              <span className="font-medium">{section.label}</span>
              {section.count !== undefined && (
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${activeHomeSection === section.id
                  ? 'bg-blue-200 text-blue-800'
                  : 'bg-gray-200 text-gray-600'
                  }`}>
                  {section.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Hero Section */}
      {activeHomeSection === 'hero' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-800">Home Hero Section</h3>
            <button
              onClick={() => {
                setModalType('edit');
                setEditingItem('home-hero');
                setFormData({
                  title: homeHero?.title || 'Affordable Diagnostic Imaging Solutions',
                  backgroundImage: homeHero?.backgroundImage || '',
                  badgeImage: homeHero?.badgeImage || '',
                  badgeLink: homeHero?.badgeLink || '',
                  badgeAltText: homeHero?.badgeAltText || '',
                  isActive: homeHero?.isActive ?? true
                });
                setShowModal(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
            >
              <i className="ri-edit-line mr-2"></i>
              Edit Hero
            </button>
          </div>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="relative h-64 lg:h-96 bg-gradient-to-r from-blue-900 to-green-700 overflow-hidden">
              {homeHero?.backgroundImage && (
                <img
                  src={homeHero.backgroundImage}
                  alt="Hero Background"
                  className="absolute inset-0 w-full h-full object-cover opacity-50"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-[#0066A1]/80 to-[#7AB730]/60"></div>
              <div className="relative h-full flex items-center px-6 lg:px-12">
                <div className="max-w-2xl">
                  <h1 className="text-white text-4xl lg:text-5xl font-medium leading-tight mb-6">
                    {homeHero?.title || 'Affordable Diagnostic Imaging Solutions'}
                  </h1>
                  {homeHero?.badgeImage && (
                    <img
                      src={homeHero.badgeImage}
                      alt="New Product Badge"
                      className="w-64 h-auto object-contain"
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Title</p>
                <p className="text-gray-900 font-semibold text-lg">{homeHero?.title || 'Affordable Diagnostic Imaging Solutions'}</p>
                <p className="text-sm text-gray-500 mt-4 mb-1">Badge Link</p>
                <p className="text-gray-900 text-sm break-all">{homeHero?.badgeLink || 'https://anamaya.3imedtech.com/'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Badge Image</p>
                {homeHero?.badgeImage && (
                  <img src={homeHero.badgeImage} alt="Badge" className="w-full max-w-xs h-auto object-contain rounded border border-gray-200 p-4 bg-gray-50" />
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* About Section */}
      {activeHomeSection === 'about-section' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-800">About Section</h3>
            <button
              onClick={() => {
                setModalType('edit');
                setEditingItem('home-about-section');
                setFormData({
                  label: homeAboutSection?.label || 'About Us',
                  title: homeAboutSection?.title || 'Your Partner for Clinically Relevant and Viable Imaging Technologies',
                  description: homeAboutSection?.description || '',
                  backgroundColor: homeAboutSection?.backgroundColor || '#1E4C84',
                  isActive: homeAboutSection?.isActive ?? true
                });
                setShowModal(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
            >
              <i className="ri-edit-line mr-2"></i>
              Edit About Section
            </button>
          </div>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-12" style={{ backgroundColor: homeAboutSection?.backgroundColor || '#1E4C84' }}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h6 className="uppercase tracking-wider mb-4" style={{ fontSize: '23px', color: '#7DC244', fontFamily: 'Montserrat, sans-serif', fontWeight: 400 }}>
                    {homeAboutSection?.label || 'About Us'}
                  </h6>
                  <h3 className="text-4xl lg:text-5xl font-medium text-white mb-6 leading-tight">
                    {homeAboutSection?.title || 'Your Partner for Clinically Relevant and Viable Imaging Technologies'}
                  </h3>
                </div>
                <div>
                  <p className="text-white text-lg leading-relaxed">
                    {homeAboutSection?.description || 'Description will appear here...'}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 mb-1">Label</p>
                  <p className="text-gray-900 font-semibold">{homeAboutSection?.label || 'About Us'}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Background Color</p>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded border border-gray-300"
                      style={{ backgroundColor: homeAboutSection?.backgroundColor || '#1E4C84' }}
                    ></div>
                    <span className="text-gray-700">{homeAboutSection?.backgroundColor || '#1E4C84'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Boxes Section */}
      {activeHomeSection === 'image-boxes' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-800">Image Boxes Management ({homeImageBoxes.length} boxes)</h3>
            <div className="flex gap-2">
              <button
                onClick={async () => {
                  await fetchDeletedItems();
                  setShowDeletedItems(true);
                }}
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium"
              >
                <i className="ri-delete-bin-2-line mr-2"></i>
                Deleted Items ({deletedItems.length})
              </button>
              <button
                onClick={() => {
                  setModalType('add');
                  setEditingItem('home-image-box');
                  setFormData({
                    label: '',
                    title: '',
                    description: '',
                    image: '',
                    link: '',
                    linkText: 'Discover Now',
                    order: homeImageBoxes.length + 1,
                    isActive: true
                  });
                  setShowModal(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
              >
                <i className="ri-add-line mr-2"></i>
                Add Image Box
              </button>
            </div>
          </div>
          {homeImageBoxes.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Visual Preview</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {homeImageBoxes
                    .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
                    .filter((box: any) => box.isActive !== false)
                    .map((box: any, idx: number) => (
                      <div key={box.id || idx} className="group relative overflow-hidden rounded-lg bg-[#E8F4F8] transition-all duration-500 hover:shadow-2xl">
                        <div className="relative h-64 overflow-hidden">
                          {box.image && (
                            <img
                              src={box.image}
                              alt={box.title || `Box ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          )}
                          <div className="absolute inset-0 bg-white/95 transition-all duration-500 group-hover:bg-transparent"></div>
                          <div className="absolute inset-0 flex flex-col justify-center p-6">
                            <div className="transform transition-all duration-500">
                              <h6 className="text-sm font-semibold uppercase tracking-wider mb-3 text-[#7AB730]">
                                {box.label || 'Label'}
                              </h6>
                              <h2 className="text-xl font-bold text-[#1E4C84] mb-4 leading-tight">
                                {box.title || 'Title'}
                              </h2>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
          <DataTable
            title="Image Boxes List"
            data={homeImageBoxes}
            columns={[
              { key: 'label', header: 'Label' },
              { key: 'title', header: 'Title' },
              {
                key: 'image',
                header: 'Preview',
                render: (value: string) => (
                  value ? <img src={value} alt="Box" className="w-20 h-20 object-cover rounded border border-gray-200" /> : <span className="text-gray-400">No image</span>
                )
              },
              { key: 'link', header: 'Link' },
              { key: 'order', header: 'Order' },
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
            onEdit={handleImageBoxEdit}
            onDelete={handleImageBoxDelete}
          />
        </div>
      )}

      {/* Commitment Section */}
      {activeHomeSection === 'commitment' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-800">Commitment Section</h3>
            <button
              onClick={() => {
                setModalType('edit');
                setEditingItem('home-commitment-section');
                setFormData({
                  label: homeCommitment?.label || 'Our Commitment',
                  title: homeCommitment?.title || 'Redefining Healthcare Through Innovation',
                  backgroundColor: homeCommitment?.backgroundColor || '#F9FAFB',
                  footerText: homeCommitment?.footerText || '',
                  footerLink: homeCommitment?.footerLink || '',
                  footerLinkText: homeCommitment?.footerLinkText || '',
                  isActive: homeCommitment?.isActive ?? true
                });
                setShowModal(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
            >
              <i className="ri-settings-line mr-2"></i>
              Edit Section
            </button>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-lg font-semibold text-gray-800">Commitment Cards ({commitmentCards.length} cards)</h4>
              <button
                onClick={() => {
                  setModalType('add');
                  setEditingItem('home-commitment-card');
                  setFormData({
                    title: '',
                    icon: '',
                    description: '',
                    link: '',
                    linkText: 'Learn More',
                    order: commitmentCards.length + 1,
                    isActive: true
                  });
                  setShowModal(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
              >
                <i className="ri-add-line mr-2"></i>
                Add Card
              </button>
            </div>
            {commitmentCards.length > 0 && (
              <DataTable
                title="Commitment Cards List"
                data={commitmentCards.sort((a: any, b: any) => (a.order || 0) - (b.order || 0)).map((card: any, index: number) => ({ ...card, _originalIndex: index }))}
                columns={[
                  { key: 'title', header: 'Title' },
                  {
                    key: 'icon',
                    header: 'Icon',
                    render: (value: string) => (
                      value ? <img src={value} alt="Icon" className="w-16 h-16 object-contain rounded border border-gray-200" /> : <span className="text-gray-400">No icon</span>
                    )
                  },
                  {
                    key: 'description',
                    header: 'Description',
                    render: (value: string) => (
                      <span className="max-w-xs truncate block" title={value}>
                        {value || '-'}
                      </span>
                    )
                  },
                  { key: 'link', header: 'Link' },
                  { key: 'linkText', header: 'Link Text' },
                  { key: 'order', header: 'Order' },
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
                  // Use the _originalIndex that was set when mapping the data
                  const index = item._originalIndex !== undefined ? item._originalIndex : 0;
                  handleCommitmentCardEdit(item, index);
                }}
                onDelete={(item: any) => {
                  // Use the _originalIndex that was set when mapping the data
                  const index = item._originalIndex !== undefined ? item._originalIndex : 0;
                  handleCommitmentCardDelete(item, index);
                }}
              />
            )}
          </div>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-12" style={{ backgroundColor: homeCommitment?.backgroundColor || '#F9FAFB' }}>
              <div className="text-center mb-12">
                <h6 className="text-[#7AB730] text-sm font-semibold uppercase tracking-wider mb-4">
                  {homeCommitment?.label || 'Our Commitment'}
                </h6>
                <h3 className="text-4xl lg:text-5xl font-medium text-[#027C8E]">
                  {homeCommitment?.title || 'Redefining Healthcare Through Innovation'}
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(() => {
                  const cards = homeCommitment?.cards ? (typeof homeCommitment.cards === 'string' ? JSON.parse(homeCommitment.cards) : homeCommitment.cards) : [];
                  return cards.filter((c: any) => c.isActive !== false).map((card: any, idx: number) => (
                    <div key={idx} className="bg-white rounded-lg p-6 shadow-lg hover:shadow-2xl transition-all duration-500">
                      <div className="flex flex-col items-center text-center">
                        <h4 className="text-2xl font-bold text-[#027C8E] mb-4">{card.title || `Card ${idx + 1}`}</h4>
                        {card.icon && (
                          <div className="w-16 h-16 mb-4 flex items-center justify-center">
                            <img src={card.icon} alt={card.title} className="w-full h-full object-contain" />
                          </div>
                        )}
                        <p className="text-gray-600 mb-4 leading-relaxed">
                          {card.description || 'Description will appear here...'}
                        </p>
                        {card.link && (
                          <a
                            href={card.link}
                            className="inline-flex items-center text-[#027C8E] hover:text-white hover:bg-[#E6662F] px-4 py-2 rounded font-medium transition-all duration-300"
                          >
                            {card.linkText || 'Learn More'} <i className="ri-arrow-right-line ml-2"></i>
                          </a>
                        )}
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </div>
            <div className="p-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 mb-1">Label</p>
                  <p className="text-gray-900 font-semibold">{homeCommitment?.label || 'Our Commitment'}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Background Color</p>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded border border-gray-300"
                      style={{ backgroundColor: homeCommitment?.backgroundColor || '#F9FAFB' }}
                    ></div>
                    <span className="text-gray-700">{homeCommitment?.backgroundColor || '#F9FAFB'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Deleted Items Modal */}
      {showDeletedItems && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Deleted Image Boxes</h3>
                <button
                  onClick={() => setShowDeletedItems(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="ri-close-line text-2xl"></i>
                </button>
              </div>
              <DataTable
                data={deletedItems}
                columns={[
                  { key: 'label', header: 'Label' },
                  { key: 'title', header: 'Title' },
                  {
                    key: 'image',
                    header: 'Preview',
                    render: (value: string) => (
                      value ? <img src={value} alt="Box" className="w-20 h-20 object-cover rounded border border-gray-200" /> : <span className="text-gray-400">No image</span>
                    )
                  },
                  {
                    key: 'deletedAt',
                    header: 'Deleted At',
                    render: (value: string) => (
                      value ? new Date(value).toLocaleDateString() : '-'
                    )
                  }
                ]}
                onEdit={async (item: any) => {
                  try {
                    await fetch(`/api/cms/home-page/image-boxes/${item.id}/restore`, {
                      method: 'POST',
                      headers: { ...authHeaders(token) }
                    });
                    await fetchHomeImageBoxes();
                    await fetchDeletedItems();
                    showToast.success('Item restored successfully!');
                  } catch (error) {
                    console.error('Error restoring item:', error);
                    showToast.error('Failed to restore item. Please try again.');
                  }
                }}
                onDelete={isAdmin ? async (item: any) => {
                  if (!window.confirm('Are you sure you want to permanently delete this image box? This action cannot be undone.')) {
                    return;
                  }
                  try {
                    await fetch(`/api/cms/home-page/image-boxes/${item.id}/permanent`, {
                      method: 'DELETE',
                      headers: { ...authHeaders(token) }
                    });
                    await fetchDeletedItems();
                    showToast.success('Image box permanently deleted');
                  } catch (error) {
                    console.error('Error permanently deleting item:', error);
                    showToast.error('Failed to permanently delete item. Please try again.');
                  }
                } : undefined}
                editLabel="Restore"
                deleteLabel={isAdmin ? "Permanent Delete" : undefined}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Export form components for modal
export function HomeHeroForm({ formData, handleInputChange, uploadImage, uploadingImage }: any) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
        <input
          type="text"
          value={formData.title || ''}
          onChange={(e) => handleInputChange('title', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Affordable Diagnostic Imaging Solutions"
          required
        />
        <p className="text-xs text-gray-500 mt-1">Use &lt;br /&gt; for line breaks</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Background Image URL</label>
        <input
          type="text"
          value={formData.backgroundImage || ''}
          onChange={(e) => handleInputChange('backgroundImage', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="/images/hero-background.jpg"
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
          <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-500 mb-2 font-medium">Background Image Preview:</p>
            <img
              src={formData.backgroundImage}
              alt="Background Preview"
              className="w-full max-h-60 object-cover rounded border border-gray-300 shadow-sm"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="200"%3E%3Crect fill="%23f3f4f6" width="400" height="200"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" fill="%239ca3af" font-family="Arial" font-size="14"%3EImage not found%3C/text%3E%3C/svg%3E';
              }}
            />
          </div>
        )}
        {uploadingImage && <p className="text-xs text-blue-600 mt-1">Uploading...</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Badge Image URL</label>
        <input
          type="text"
          value={formData.badgeImage || ''}
          onChange={(e) => handleInputChange('badgeImage', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="/images/new-product-badge.png"
        />
        <input
          type="file"
          accept="image/*"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (file) {
              const url = await uploadImage(file);
              if (url) handleInputChange('badgeImage', url);
            }
          }}
          className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {formData.badgeImage && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-500 mb-2 font-medium">Badge Image Preview:</p>
            <img
              src={formData.badgeImage}
              alt="Badge Preview"
              className="w-full max-w-xs max-h-40 object-contain rounded border border-gray-300 shadow-sm bg-white p-2"
            />
          </div>
        )}
        {uploadingImage && <p className="text-xs text-blue-600 mt-1">Uploading...</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Badge Link</label>
        <input
          type="url"
          value={formData.badgeLink || ''}
          onChange={(e) => handleInputChange('badgeLink', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="https://anamaya.3imedtech.com/"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Badge Alt Text</label>
        <input
          type="text"
          value={formData.badgeAltText || ''}
          onChange={(e) => handleInputChange('badgeAltText', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="New Product"
        />
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          id="heroIsActive"
          checked={formData.isActive !== false}
          onChange={(e) => handleInputChange('isActive', e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="heroIsActive" className="text-sm font-medium text-gray-700">Active</label>
      </div>
    </>
  );
}

export function HomeAboutSectionForm({ formData, handleInputChange }: any) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Label</label>
        <input
          type="text"
          value={formData.label || ''}
          onChange={(e) => handleInputChange('label', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="About Us"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
        <input
          type="text"
          value={formData.title || ''}
          onChange={(e) => handleInputChange('title', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Your Partner for Clinically Relevant and Viable Imaging Technologies"
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
          placeholder="As a dedicated healthcare technology provider..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
        <div className="flex items-center gap-4">
          <input
            type="color"
            value={formData.backgroundColor || '#1E4C84'}
            onChange={(e) => handleInputChange('backgroundColor', e.target.value)}
            className="w-20 h-10 border border-gray-300 rounded-lg cursor-pointer"
          />
          <input
            type="text"
            value={formData.backgroundColor || '#1E4C84'}
            onChange={(e) => handleInputChange('backgroundColor', e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="#1E4C84"
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">Default: #1E4C84 (Blue background with white text)</p>
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          id="aboutSectionIsActive"
          checked={formData.isActive !== false}
          onChange={(e) => handleInputChange('isActive', e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="aboutSectionIsActive" className="text-sm font-medium text-gray-700">Active</label>
      </div>
    </>
  );
}

export function HomeImageBoxForm({ formData, handleInputChange, uploadImage, uploadingImage }: any) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Label</label>
        <input
          type="text"
          value={formData.label || ''}
          onChange={(e) => handleInputChange('label', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Label"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
        <input
          type="text"
          value={formData.title || ''}
          onChange={(e) => handleInputChange('title', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Title"
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
          placeholder="Description"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
        <input
          type="text"
          value={formData.image || ''}
          onChange={(e) => handleInputChange('image', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Image URL"
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
          className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {formData.image && (
          <img src={formData.image} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded border border-gray-200" />
        )}
        {uploadingImage && <p className="text-xs text-blue-600 mt-1">Uploading...</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Link</label>
        <input
          type="text"
          value={formData.link || ''}
          onChange={(e) => handleInputChange('link', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="/page-url"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Link Text</label>
        <input
          type="text"
          value={formData.linkText || 'Discover Now'}
          onChange={(e) => handleInputChange('linkText', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Discover Now"
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
          id="imageBoxIsActive"
          checked={formData.isActive !== false}
          onChange={(e) => handleInputChange('isActive', e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="imageBoxIsActive" className="text-sm font-medium text-gray-700">Active</label>
      </div>
    </>
  );
}

export function HomeCommitmentSectionForm({ formData, handleInputChange }: any) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Label</label>
        <input
          type="text"
          value={formData.label || ''}
          onChange={(e) => handleInputChange('label', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Our Commitment"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
        <input
          type="text"
          value={formData.title || ''}
          onChange={(e) => handleInputChange('title', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Redefining Healthcare Through Innovation"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
        <div className="flex items-center gap-4">
          <input
            type="color"
            value={formData.backgroundColor || '#F9FAFB'}
            onChange={(e) => handleInputChange('backgroundColor', e.target.value)}
            className="w-20 h-10 border border-gray-300 rounded-lg cursor-pointer"
          />
          <input
            type="text"
            value={formData.backgroundColor || '#F9FAFB'}
            onChange={(e) => handleInputChange('backgroundColor', e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="#F9FAFB"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Footer Text</label>
        <input
          type="text"
          value={formData.footerText || ''}
          onChange={(e) => handleInputChange('footerText', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Footer Link</label>
        <input
          type="text"
          value={formData.footerLink || ''}
          onChange={(e) => handleInputChange('footerLink', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Footer Link Text</label>
        <input
          type="text"
          value={formData.footerLinkText || ''}
          onChange={(e) => handleInputChange('footerLinkText', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          id="commitmentSectionIsActive"
          checked={formData.isActive !== false}
          onChange={(e) => handleInputChange('isActive', e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="commitmentSectionIsActive" className="text-sm font-medium text-gray-700">Active</label>
      </div>
    </>
  );
}

export function HomeCommitmentCardForm({ formData, handleInputChange, uploadImage, uploadingImage }: any) {
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
        <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
        <input
          type="text"
          value={formData.icon || ''}
          onChange={(e) => handleInputChange('icon', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Icon URL"
        />
        <input
          type="file"
          accept="image/*"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (file) {
              const url = await uploadImage(file);
              if (url) handleInputChange('icon', url);
            }
          }}
          className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {formData.icon && (
          <img src={formData.icon} alt="Icon Preview" className="mt-2 w-16 h-16 object-contain rounded border border-gray-200" />
        )}
        {uploadingImage && <p className="text-xs text-blue-600 mt-1">Uploading...</p>}
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
        <label className="block text-sm font-medium text-gray-700 mb-2">Link</label>
        <input
          type="text"
          value={formData.link || ''}
          onChange={(e) => handleInputChange('link', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Link Text</label>
        <input
          type="text"
          value={formData.linkText || 'Learn More'}
          onChange={(e) => handleInputChange('linkText', e.target.value)}
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
          id="commitmentCardIsActive"
          checked={formData.isActive !== false}
          onChange={(e) => handleInputChange('isActive', e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="commitmentCardIsActive" className="text-sm font-medium text-gray-700">Active</label>
      </div>
    </>
  );
}

