import ProductPageBase from '../shared/ProductPageBase';

interface PortableXRayPageProps {
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

export default function PortableXRayPage_cms(props: PortableXRayPageProps) {
  return (
    <ProductPageBase
      pageName="portable-xray"
      pageTitle="Portable X-Ray Solutions"
      heroEndpoint="/api/cms/portable-xray/hero"
      productsEndpoint="/api/cms/portable-xray/products"
      {...props}
    />
  );
}

export function PortableXRayHeroForm({ formData, handleInputChange, uploadImage, uploadingImage }: any) {
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
          id="portableXRayHeroIsActive"
          checked={formData.isActive !== false}
          onChange={(e) => handleInputChange('isActive', e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="portableXRayHeroIsActive" className="text-sm font-medium text-gray-700">Active</label>
      </div>
    </>
  );
}

export function PortableXRayProductForm({ formData, handleInputChange, uploadImage, uploadingImage }: any) {
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
          placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
        />
        <p className="text-xs text-gray-500 mt-1">Enter each feature on a new line</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Benefits</label>
        <textarea
          value={formData.benefits || ''}
          onChange={(e) => handleInputChange('benefits', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={4}
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
        <label className="block text-sm font-medium text-gray-700 mb-2">Section ID (for anchor links)</label>
        <input
          type="text"
          value={formData.sectionId || ''}
          onChange={(e) => handleInputChange('sectionId', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="product-name"
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
        <label className="block text-sm font-medium text-gray-700 mb-2">Background Color (Tailwind gradient)</label>
        <input
          type="text"
          value={formData.backgroundColor || 'from-gray-50 to-white'}
          onChange={(e) => handleInputChange('backgroundColor', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="from-gray-50 to-white"
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
          id="portableXRayProductIsActive"
          checked={formData.isActive !== false}
          onChange={(e) => handleInputChange('isActive', e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="portableXRayProductIsActive" className="text-sm font-medium text-gray-700">Active</label>
      </div>
    </>
  );
}

