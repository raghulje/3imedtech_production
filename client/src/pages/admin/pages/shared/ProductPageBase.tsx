import { useState, useEffect } from 'react';
import { DataTable } from '../../shared/DataTable';
import { authHeaders, getApiUrl, getImageUrl } from '../../shared/utils';
import { useAdminAuthStore } from '../../../../store/adminAuthStore';
import { showToast } from '@/components/admin/Toast';

interface ProductPageBaseProps {
  pageName: string;
  pageTitle: string;
  heroEndpoint: string;
  productsEndpoint: string;
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

export default function ProductPageBase({
  pageName,
  pageTitle,
  heroEndpoint,
  productsEndpoint,
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
  handleDelete,
  uploadImage
}: ProductPageBaseProps) {
  const [activeSection, setActiveSection] = useState('hero');
  const [hero, setHero] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [deletedItems, setDeletedItems] = useState<any[]>([]);
  const [showDeletedItems, setShowDeletedItems] = useState(false);
  const user = useAdminAuthStore((state) => state.user);
  const isAdmin = user?.role === 'admin';

  const fetchHero = async () => {
    try {
      const res = await fetch(getApiUrl(heroEndpoint));
      if (res.ok) {
        const json = await res.json();
        setHero(json?.data || json || null);
      }
    } catch { }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch(getApiUrl(productsEndpoint));
      if (res.ok) {
        const json = await res.json();
        const prods = Array.isArray(json?.data) ? json.data : json;
        const filteredProducts = (prods || []).filter((p: any) => !p.isDeleted).slice().sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
        console.log(`📥 Fetched ${filteredProducts.length} products for ${pageName}:`, filteredProducts.map((p: any) => ({ id: p.id, title: p.title, hasImage: !!p.image, image: p.image })));
        setProducts(filteredProducts);
      }
    } catch (error) {
      console.error(`Error fetching products for ${pageName}:`, error);
    }
  };

  const fetchDeletedItems = async () => {
    try {
      const res = await fetch(getApiUrl(`${productsEndpoint}?includeDeleted=true`), {
        headers: { ...authHeaders(token) }
      });
      if (res.ok) {
        const json = await res.json();
        const allProds = Array.isArray(json?.data) ? json.data : json;
        const deleted = (allProds || []).filter((p: any) => p.isDeleted === true);
        setDeletedItems(deleted);
      }
    } catch (error) {
      console.error('Error fetching deleted items:', error);
    }
  };

  const handleRestoreProduct = async (item: any) => {
    try {
      const res = await fetch(getApiUrl(`${productsEndpoint}/${item.id}/restore`), {
        method: 'POST',
        headers: { ...authHeaders(token) }
      });
      if (res.ok) {
        await fetchProducts();
        await fetchDeletedItems();
        showToast.success('Product restored successfully!');
      } else {
        showToast.error('Failed to restore product');
      }
    } catch (error) {
      console.error('Error restoring product:', error);
      showToast.error('Failed to restore product. Please try again.');
    }
  };

  const handlePermanentDelete = async (item: any) => {
    if (!window.confirm('Are you sure you want to permanently delete this product? This action cannot be undone.')) {
      return;
    }
    
    try {
      const res = await fetch(getApiUrl(`${productsEndpoint}/${item.id}/permanent`), {
        method: 'DELETE',
        headers: { ...authHeaders(token) }
      });
      if (res.ok) {
        await fetchDeletedItems();
        showToast.success('Product permanently deleted');
      } else {
        showToast.error('Failed to permanently delete product');
      }
    } catch (error) {
      console.error('Error permanently deleting product:', error);
      showToast.error('Failed to permanently delete product. Please try again.');
    }
  };

  useEffect(() => {
    fetchHero();
    fetchProducts();
    fetchDeletedItems();
  }, []);

  // Listen for product and hero changes from Dashboard
  useEffect(() => {
    // Map pageName to Dashboard event names
    const productEventMap: Record<string, string> = {
      'radiography-systems': 'radiographyProductsChanged',
      'flat-panel': 'flatPanelProductsChanged',
      'mammography-systems': 'mammographyProductsChanged',
      'refurbished-mri': 'refurbishedMRIProductsChanged',
      'imaging-accessories': 'imagingAccessoriesProductsChanged',
      'portable-xray': 'portableXRayProductsChanged'
    };
    
    const heroEventMap: Record<string, string> = {
      'radiography-systems': 'radiographyHeroChanged',
      'flat-panel': 'flatPanelHeroChanged',
      'mammography-systems': 'mammographyHeroChanged',
      'refurbished-mri': 'refurbishedMRIHeroChanged',
      'imaging-accessories': 'imagingAccessoriesHeroChanged',
      'portable-xray': 'portableXRayHeroChanged'
    };
    
    const productEventName = productEventMap[pageName] || `${pageName}ProductsChanged`;
    const heroEventName = heroEventMap[pageName] || `${pageName}HeroChanged`;
    
    const handleProductChange = () => {
      console.log(`🔄 Refreshing products for ${pageName}...`);
      fetchProducts();
      fetchDeletedItems();
    };
    
    const handleHeroChange = () => {
      fetchHero();
    };
    
    window.addEventListener(productEventName, handleProductChange);
    window.addEventListener(heroEventName, handleHeroChange);
    
    return () => {
      window.removeEventListener(productEventName, handleProductChange);
      window.removeEventListener(heroEventName, handleHeroChange);
    };
  }, [pageName]);
  
  // Also refresh when modal closes (in case event doesn't fire)
  useEffect(() => {
    if (!showModal && activeSection === 'products') {
      // Small delay to ensure backend has processed the update
      const timeout = setTimeout(() => {
        console.log(`🔄 Modal closed, refreshing products for ${pageName}...`);
        fetchProducts();
        fetchDeletedItems();
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [showModal, activeSection, pageName]);

  // Refetch deleted items when products change (after delete/restore)
  useEffect(() => {
    if (activeSection === 'products') {
      fetchDeletedItems();
    }
  }, [products]);

  const handleHeroEdit = () => {
    setModalType('edit');
    setEditingItem(`${pageName}-hero`);
    setFormData({
      title: hero?.title || pageTitle,
      subtitle: hero?.subtitle || '',
      description: hero?.description || '',
      backgroundImage: hero?.backgroundImage || '',
      isActive: hero?.isActive ?? true
    });
    setShowModal(true);
  };

  const handleProductAdd = () => {
    setModalType('add');
    setEditingItem({ type: `${pageName}-product` });
    setFormData({
      title: '',
      overview: '',
      features: '',
      benefits: '',
      image: '',
      sectionId: '',
      imagePosition: 'left',
      backgroundColor: 'from-gray-50 to-white',
      order: products.length || 0,
      isActive: true
    });
    setShowModal(true);
  };

  const handleProductEdit = (item: any) => {
    setModalType('edit');
    setEditingItem({ type: `${pageName}-product`, id: item.id });
    let featuresText = '';
    if (item.features) {
      try {
        const featuresArray = typeof item.features === 'string'
          ? JSON.parse(item.features)
          : item.features;
        if (Array.isArray(featuresArray)) {
          featuresText = featuresArray.join('\n');
        } else if (typeof featuresArray === 'string') {
          featuresText = featuresArray;
        }
      } catch {
        featuresText = item.features;
      }
    }
    setFormData({
      title: item.title || '',
      overview: item.overview || '',
      features: featuresText,
      benefits: item.benefits || '',
      image: item.image || '',
      sectionId: item.sectionId || '',
      imagePosition: item.imagePosition || 'left',
      backgroundColor: item.backgroundColor || 'from-gray-50 to-white',
      order: item.order || 0,
      isActive: item.isActive ?? true
    });
    setShowModal(true);
  };

  const handleProductDelete = async (item: any) => {
    if (!window.confirm('Are you sure you want to delete this item? (This is a soft delete and can be restored)')) {
      return;
    }

    if (!item?.id) {
      showToast.error('Invalid product ID');
      return;
    }

    try {
      const res = await fetch(getApiUrl(`${productsEndpoint}/${item.id}`), {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', ...authHeaders(token) }
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete product');
      }

      // Refresh products list
      await fetchProducts();
      await fetchDeletedItems();
      
      // Dispatch event for other components
      const productEventMap: Record<string, string> = {
        'radiography-systems': 'radiographyProductsChanged',
        'flat-panel': 'flatPanelProductsChanged',
        'mammography-systems': 'mammographyProductsChanged',
        'refurbished-mri': 'refurbishedMRIProductsChanged',
        'imaging-accessories': 'imagingAccessoriesProductsChanged',
        'portable-xray': 'portableXRayProductsChanged'
      };
      const productEventName = productEventMap[pageName] || `${pageName}ProductsChanged`;
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(productEventName));
      }

      showToast.success('Product deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting product:', error);
      showToast.error(`Failed to delete product: ${error.message || 'Please try again.'}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">{pageTitle} Management</h2>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex space-x-4 overflow-x-auto">
          {[
            { id: 'hero', label: 'Hero Section', icon: 'ri-layout-top-line' },
            { id: 'products', label: 'Products', icon: 'ri-product-hunt-line' }
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
                    {hero?.title || pageTitle}
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

      {activeSection === 'products' && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Products</h3>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  fetchDeletedItems();
                  setShowDeletedItems(true);
                }}
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center"
              >
                <i className="ri-delete-bin-line mr-2"></i>
                Deleted Items {deletedItems.length > 0 && `(${deletedItems.length})`}
              </button>
              <button
                onClick={handleProductAdd}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                <i className="ri-add-line mr-2"></i>
                Add Product
              </button>
            </div>
          </div>
          <DataTable
            title="Products"
            data={products}
            columns={[
              { key: 'title', header: 'Title' },
              {
                key: 'image',
                header: 'Image',
                render: (value: string) => {
                  if (!value) {
                    return <span className="text-gray-400 text-xs">No image</span>;
                  }
                  const imageUrl = getImageUrl(value);
                  return (
                    <img 
                      src={imageUrl} 
                      alt="Product" 
                      className="w-16 h-16 object-cover rounded border border-gray-200"
                      onError={(e) => {
                        console.error('Image failed to load:', imageUrl);
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64"%3E%3Crect fill="%23f3f4f6" width="64" height="64"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle" fill="%239ca3af" font-family="Arial" font-size="10"%3ENo image%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  );
                }
              },
              {
                key: 'imagePosition',
                header: 'Image Position',
                render: (value: string) => (
                  <span className="capitalize">{value || 'left'}</span>
                )
              },
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
            onEdit={handleProductEdit}
            onDelete={handleProductDelete}
          />
        </div>
      )}

      {/* Deleted Items Modal */}
      {showDeletedItems && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Deleted Products</h3>
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
                  { key: 'title', header: 'Title' },
                  {
                    key: 'image',
                    header: 'Preview',
                    render: (value: string) => (
                      value ? <img src={getImageUrl(value)} alt="Product" className="w-20 h-20 object-cover rounded border border-gray-200" /> : <span className="text-gray-400">No image</span>
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
                onEdit={handleRestoreProduct}
                onDelete={isAdmin ? handlePermanentDelete : undefined}
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

