import { useState, useEffect } from 'react';
import { authHeaders, getImageUrl } from '../../shared/utils';
import { CMSComponentProps } from '../../shared/types';
import { NavigationLinksManager } from './NavigationLinksManager';

interface HeaderFooterProps extends Partial<CMSComponentProps> {
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
  setPreviewMode: (mode: boolean) => void;
  setPreviewSection: (section: string) => void;
  setPreviewData: (data: any) => void;
}

export default function HeaderFooter_cms({
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
  uploadImage,
  setPreviewMode,
  setPreviewSection,
  setPreviewData
}: HeaderFooterProps) {
  const [headerData, setHeaderData] = useState<any>(null);
  const [footerData, setFooterData] = useState<any>(null);

  const fetchHeader = async () => {
    try {
      const res = await fetch('/api/cms/header-footer/header');
      if (res.ok) {
        const json = await res.json();
        setHeaderData(json?.data || json || null);
      }
    } catch { }
  };

  const fetchFooter = async () => {
    try {
      const res = await fetch('/api/cms/header-footer/footer');
      if (res.ok) {
        const json = await res.json();
        setFooterData(json?.data || json || null);
      }
    } catch { }
  };

  useEffect(() => {
    fetchHeader();
    fetchFooter();
  }, []);

  // Listen for updates to refetch data
  useEffect(() => {
    const handleHeaderChange = () => fetchHeader();
    const handleFooterChange = () => fetchFooter();

    window.addEventListener('headerDataChanged', handleHeaderChange);
    window.addEventListener('footerDataChanged', handleFooterChange);

    return () => {
      window.removeEventListener('headerDataChanged', handleHeaderChange);
      window.removeEventListener('footerDataChanged', handleFooterChange);
    };
  }, []);

  const handleHeaderEdit = () => {
    setModalType('edit');
    setEditingItem('header');
    const navLinks = headerData?.navigationLinks
      ? (typeof headerData.navigationLinks === 'string'
        ? JSON.parse(headerData.navigationLinks)
        : headerData.navigationLinks)
      : [];
    setFormData({
      logo: headerData?.logo || '/assets/images/logos/logo.png',
      phone: headerData?.phone || '+91 94440 26307',
      phoneIcon: headerData?.phoneIcon || '/assets/images/icons/phone-icon.png',
      email: headerData?.email || '',
      navigationLinks: navLinks,
      isActive: headerData?.isActive ?? true
    });
    setShowModal(true);
  };

  const handleFooterEdit = () => {
    setModalType('edit');
    setEditingItem('footer');
    const socialLinks = footerData?.socialLinks
      ? (typeof footerData.socialLinks === 'string'
        ? JSON.parse(footerData.socialLinks)
        : footerData.socialLinks)
      : [];
    let navColumns = footerData?.navigationColumns
      ? (typeof footerData.navigationColumns === 'string'
        ? JSON.parse(footerData.navigationColumns)
        : footerData.navigationColumns)
      : [];

    if (!Array.isArray(navColumns) || navColumns.length === 0) {
      navColumns = [
        {
          title: 'About 3i MedTech',
          links: [
            { label: 'About', link: '/about', order: 1, external: false },
            { label: 'Mission & Vision', link: '/mission-vision-and-values', order: 2, external: false },
            { label: 'Why Choose Us', link: '/why-choose-us', order: 3, external: false },
          ],
          order: 1
        },
        {
          title: 'Know More',
          links: [
            { label: 'Radiography Systems', link: '/radiography-systems', order: 1, external: false },
            { label: 'Portable X-Ray Solutions', link: '/portable-x-ray-solutions', order: 2, external: false },
            { label: 'Mammography Systems', link: '/mammography-systems', order: 3, external: false },
            { label: 'Flat Panel Detectors', link: '/flat-panel-detectors', order: 4, external: false },
            { label: 'Imaging Accessories', link: '/imaging-accessories', order: 5, external: false },
            { label: 'Refurbished MRI Systems', link: '/refurbished-mri-systems', order: 6, external: false },
            { label: 'Anamaya', link: 'https://anamaya.3imedtech.com/', order: 7, external: true },
          ],
          order: 2
        }
      ];
    }

    setFormData({
      logo: footerData?.logo || '/assets/images/logos/logo-footer.png',
      registeredOffice: footerData?.registeredOffice || 'Second Floor, Refex Towers, Sterling Road Signal, 313, Valluvar Kottam High Road, Nungambakkam, Chennai – 600034, Tamil Nadu',
      corporateOffice: footerData?.corporateOffice || 'Refex Building, 67, Bazullah Road, Parthasarathy Puram, T Nagar, Chennai – 600017',
      phone: footerData?.phone || '+91 94440 26307',
      email: footerData?.email || 'info@3imedtech.com',
      socialLinks: socialLinks.length > 0 ? socialLinks : [
        { platform: 'LinkedIn', url: 'https://www.linkedin.com/company/refex-group/', icon: 'fa-linkedin', order: 1 },
        { platform: 'Facebook', url: 'https://www.facebook.com/refexindustrieslimited/', icon: 'fa-facebook', order: 2 },
        { platform: 'Twitter', url: 'https://x.com/GroupRefex', icon: 'fa-twitter', order: 3 },
        { platform: 'YouTube', url: 'https://www.youtube.com/@refexgroup', icon: 'fa-youtube', order: 4 },
        { platform: 'Instagram', url: 'https://www.instagram.com/refexgroup/', icon: 'fa-instagram', order: 5 },
      ],
      copyright: footerData?.copyright || 'Copyright © 2024 3i Medical Technologies',
      navigationColumns: navColumns,
      isActive: footerData?.isActive ?? true
    });
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Header & Footer Management</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-800">Header</h3>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setPreviewMode(true);
                  setPreviewSection('header');
                  setPreviewData(headerData);
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium"
              >
                <i className="ri-eye-line mr-1"></i>
                Preview
              </button>
              <button
                onClick={handleHeaderEdit}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium"
              >
                <i className="ri-edit-line mr-1"></i>
                Edit
              </button>
            </div>
          </div>
          <div className="p-6">
            {headerData?.logo && (
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-2">Logo</p>
                <img 
                  src={getImageUrl(headerData.logo)} 
                  alt="Header Logo" 
                  className="h-12 w-auto"
                  onError={(e) => {
                    // Fallback if image fails to load
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="text-gray-900 font-medium">{headerData?.phone || '+91 94440 26307'}</p>
              </div>
              {headerData?.email && (
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-900">{headerData.email}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-800">Footer</h3>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setPreviewMode(true);
                  setPreviewSection('footer');
                  setPreviewData(footerData);
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium"
              >
                <i className="ri-eye-line mr-1"></i>
                Preview
              </button>
              <button
                onClick={handleFooterEdit}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium"
              >
                <i className="ri-edit-line mr-1"></i>
                Edit
              </button>
            </div>
          </div>
          <div className="p-6">
            {footerData?.logo && (
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-2">Logo</p>
                <img 
                  src={getImageUrl(footerData.logo)} 
                  alt="Footer Logo" 
                  className="h-16 w-auto"
                  onError={(e) => {
                    // Fallback if image fails to load
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
            <div className="space-y-3 text-sm">
              {footerData?.registeredOffice && (
                <div>
                  <p className="text-gray-500">Registered Office</p>
                  <p className="text-gray-700">{footerData.registeredOffice}</p>
                </div>
              )}
              {footerData?.corporateOffice && (
                <div>
                  <p className="text-gray-500">Corporate Office</p>
                  <p className="text-gray-700">{footerData.corporateOffice}</p>
                </div>
              )}
              <div>
                <p className="text-gray-500">Contact</p>
                <p className="text-gray-700">{footerData?.phone || '+91 94440 26307'}</p>
                {footerData?.email && <p className="text-gray-700">{footerData.email}</p>}
              </div>
              <div>
                <p className="text-gray-500">Copyright</p>
                <p className="text-gray-700">{footerData?.copyright || 'Copyright © 2024 3i Medical Technologies'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Export form components for modal
export function HeaderForm({ formData, handleInputChange, uploadImage }: any) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
        <input
          type="text"
          value={formData.logo || ''}
          onChange={(e) => handleInputChange('logo', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="/assets/images/logos/logo.png"
        />
        <input
          type="file"
          accept="image/*"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (file) {
              const url = await uploadImage(file);
              if (url) handleInputChange('logo', url);
            }
          }}
          className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {formData.logo && (
          <img src={getImageUrl(formData.logo)} alt="Logo Preview" className="mt-2 h-12 w-auto" />
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
        <input
          type="text"
          value={formData.phone || ''}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="+91 94440 26307"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
        <input
          type="email"
          value={formData.email || ''}
          onChange={(e) => handleInputChange('email', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="info@3imedtech.com"
        />
      </div>
      <NavigationLinksManager
        navigationLinks={Array.isArray(formData.navigationLinks) 
          ? formData.navigationLinks 
          : (formData.navigationLinks 
            ? (typeof formData.navigationLinks === 'string' 
              ? JSON.parse(formData.navigationLinks) 
              : formData.navigationLinks) 
            : [])}
        onUpdate={(links) => handleInputChange('navigationLinks', links)}
      />
      <div className="flex items-center">
        <input
          type="checkbox"
          id="headerIsActive"
          checked={formData.isActive !== false}
          onChange={(e) => handleInputChange('isActive', e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="headerIsActive" className="text-sm font-medium text-gray-700">Active</label>
      </div>
    </>
  );
}

export function FooterForm({ formData, handleInputChange, uploadImage }: any) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
        <input
          type="text"
          value={formData.logo || ''}
          onChange={(e) => handleInputChange('logo', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <input
          type="file"
          accept="image/*"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (file) {
              const url = await uploadImage(file);
              if (url) handleInputChange('logo', url);
            }
          }}
          className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {formData.logo && (
          <img src={getImageUrl(formData.logo)} alt="Logo Preview" className="mt-2 h-16 w-auto" />
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Registered Office</label>
        <textarea
          value={formData.registeredOffice || ''}
          onChange={(e) => handleInputChange('registeredOffice', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={2}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Corporate Office</label>
        <textarea
          value={formData.corporateOffice || ''}
          onChange={(e) => handleInputChange('corporateOffice', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={2}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
        <input
          type="text"
          value={formData.phone || ''}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
        <input
          type="email"
          value={formData.email || ''}
          onChange={(e) => handleInputChange('email', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Copyright</label>
        <input
          type="text"
          value={formData.copyright || ''}
          onChange={(e) => handleInputChange('copyright', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Social Links (JSON)</label>
        <textarea
          value={typeof formData.socialLinks === 'string' ? formData.socialLinks : JSON.stringify(formData.socialLinks || [], null, 2)}
          onChange={(e) => {
            try {
              const parsed = JSON.parse(e.target.value);
              handleInputChange('socialLinks', parsed);
            } catch {
              handleInputChange('socialLinks', e.target.value);
            }
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-xs"
          rows={8}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Navigation Columns (JSON)</label>
        <textarea
          value={typeof formData.navigationColumns === 'string' ? formData.navigationColumns : JSON.stringify(formData.navigationColumns || [], null, 2)}
          onChange={(e) => {
            try {
              const parsed = JSON.parse(e.target.value);
              handleInputChange('navigationColumns', parsed);
            } catch {
              handleInputChange('navigationColumns', e.target.value);
            }
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-xs"
          rows={12}
        />
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          id="footerIsActive"
          checked={formData.isActive !== false}
          onChange={(e) => handleInputChange('isActive', e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="footerIsActive" className="text-sm font-medium text-gray-700">Active</label>
      </div>
    </>
  );
}

