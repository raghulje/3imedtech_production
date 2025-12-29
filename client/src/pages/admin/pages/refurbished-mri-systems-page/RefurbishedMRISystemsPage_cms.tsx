import ProductPageBase from '../shared/ProductPageBase';

interface RefurbishedMRISystemsPageProps {
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
  handleDelete: (item: any) => void;
  uploadImage: (file: File) => Promise<string | null>;
}

export default function RefurbishedMRISystemsPage_cms(props: RefurbishedMRISystemsPageProps) {
  return (
    <ProductPageBase
      pageName="refurbished-mri"
      pageTitle="Refurbished MRI Systems"
      heroEndpoint="/api/cms/refurbished-mri/hero"
      productsEndpoint="/api/cms/refurbished-mri/products"
      {...props}
    />
  );
}

export function RefurbishedMRISystemsHeroForm({ formData, handleInputChange, uploadImage, uploadingImage }: any) {
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
          id="refurbishedMRISystemsHeroIsActive"
          checked={formData.isActive !== false}
          onChange={(e) => handleInputChange('isActive', e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="refurbishedMRISystemsHeroIsActive" className="text-sm font-medium text-gray-700">Active</label>
      </div>
    </>
  );
}

export function RefurbishedMRISystemsProductForm({ formData, handleInputChange, uploadImage, uploadingImage }: any) {
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
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Benefits</label>
        <textarea
          value={formData.benefits || ''}
          onChange={(e) => handleInputChange('benefits', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={4}
          placeholder="Enter the benefits of this product..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
        <input
          type="text"
          value={formData.image || ''}
          onChange={(e) => handleInputChange('image', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          <img src={formData.image} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded" />
        )}
        {uploadingImage && <p className="text-xs text-blue-600 mt-1">Uploading...</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Section ID</label>
        <input
          type="text"
          value={formData.sectionId || ''}
          onChange={(e) => handleInputChange('sectionId', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Image Position</label>
        <select
          value={formData.imagePosition || 'left'}
          onChange={(e) => handleInputChange('imagePosition', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="left">Left</option>
          <option value="right">Right</option>
        </select>
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
          id="refurbishedMRISystemsProductIsActive"
          checked={formData.isActive !== false}
          onChange={(e) => handleInputChange('isActive', e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="refurbishedMRISystemsProductIsActive" className="text-sm font-medium text-gray-700">Active</label>
      </div>
    </>
  );
}

