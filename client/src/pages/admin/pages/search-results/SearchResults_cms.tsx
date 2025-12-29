import { useState, useEffect } from 'react';
import { DataTable } from '../../shared/DataTable';
import { authHeaders, getApiUrl } from '../../shared/utils';
import { CMSComponentProps } from '../../shared/types';

interface SearchResultsProps extends Partial<CMSComponentProps> {
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
}

export default function SearchResults_cms({
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
  handleDelete
}: SearchResultsProps) {
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const fetchSearchResults = async () => {
    try {
      const res = await fetch(getApiUrl('/api/cms/search-results'));
      if (res.ok) {
        const json = await res.json();
        const results = Array.isArray(json?.data) ? json.data : json;
        setSearchResults(results.filter((r: any) => !r.isDeleted).sort((a: any, b: any) => {
          if (a.pageNumber !== b.pageNumber) {
            return a.pageNumber - b.pageNumber;
          }
          return (a.displayOrder || 0) - (b.displayOrder || 0);
        }));
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  useEffect(() => {
    fetchSearchResults();
  }, []);

  const handleAddClick = () => {
    setModalType('add');
    setEditingItem({ type: 'search-result' });
    setFormData({
      title: '',
      date: '',
      url: '',
      pageNumber: 1,
      displayOrder: 0,
      isActive: true
    });
    setShowModal(true);
  };

  const handleEditClick = (item: any) => {
    setModalType('edit');
    setEditingItem({ type: 'search-result', id: item.id });
    setFormData({
      title: item.title || '',
      date: item.date || '',
      url: item.url || '',
      pageNumber: item.pageNumber || 1,
      displayOrder: item.displayOrder || 0,
      isActive: item.isActive ?? true
    });
    setShowModal(true);
  };

  const handleDeleteClick = (item: any) => {
    handleDelete(item);
    setTimeout(() => fetchSearchResults(), 500);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Search Results Management</h2>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Search Results</h3>
          <button
            onClick={handleAddClick}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            <i className="ri-add-line mr-2"></i>
            Add Search Result
          </button>
        </div>

        <DataTable
          data={searchResults}
          columns={[
            {
              key: 'title',
              header: 'Title',
              render: (value: string) => <span className="font-medium">{value}</span>
            },
            {
              key: 'date',
              header: 'Date',
              render: (value: string) => <span className="text-gray-600">{value}</span>
            },
            {
              key: 'url',
              header: 'URL',
              render: (value: string) => (
                <span className="text-blue-600 text-sm truncate max-w-xs block">{value}</span>
              )
            },
            {
              key: 'pageNumber',
              header: 'Page',
              render: (value: number) => (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                  Page {value}
                </span>
              )
            },
            {
              key: 'displayOrder',
              header: 'Order',
              render: (value: number) => <span className="text-gray-600">{value}</span>
            },
            {
              key: 'isActive',
              header: 'Status',
              render: (value: boolean) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {value ? 'Active' : 'Inactive'}
                </span>
              )
            }
          ]}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
      </div>
    </div>
  );
}

// Export form component for modal
export function SearchResultsForm({
  formData,
  handleInputChange
}: {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
}) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
        <input
          type="text"
          value={formData.title || ''}
          onChange={(e) => handleInputChange('title', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g., FPD C-ARM"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
        <input
          type="text"
          value={formData.date || ''}
          onChange={(e) => handleInputChange('date', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g., November 25, 2025"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">URL</label>
        <input
          type="text"
          value={formData.url || ''}
          onChange={(e) => handleInputChange('url', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g., /fpd-c-arm"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Page Number</label>
          <select
            value={formData.pageNumber || 1}
            onChange={(e) => handleInputChange('pageNumber', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={1}>Page 1</option>
            <option value={2}>Page 2</option>
            <option value={3}>Page 3</option>
            <option value={4}>Page 4</option>
            <option value={5}>Page 5</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Display Order</label>
          <input
            type="number"
            value={formData.displayOrder || 0}
            onChange={(e) => handleInputChange('displayOrder', parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="0"
            placeholder="0"
          />
          <p className="text-xs text-gray-500 mt-1">Order within the page (0-9)</p>
        </div>
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          id="searchResultIsActive"
          checked={formData.isActive ?? true}
          onChange={(e) => handleInputChange('isActive', e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="searchResultIsActive" className="ml-2 block text-sm text-gray-700">
          Active
        </label>
      </div>
    </>
  );
}

