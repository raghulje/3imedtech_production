import { useState, useEffect } from 'react';

interface NavigationLink {
  label: string;
  link: string;
  order: number;
  external?: boolean;
}

interface NavigationLinksManagerProps {
  navigationLinks: NavigationLink[];
  onUpdate: (links: NavigationLink[]) => void;
}

// Internal pages list for dropdown
const INTERNAL_PAGES = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Mission & Vision', path: '/mission-vision-and-values' },
  { label: 'Why Choose Us', path: '/why-choose-us' },
  { label: 'Contact', path: '/contact' },
  { label: 'Radiography Systems', path: '/radiography-systems' },
  { label: 'Portable X-Ray Solutions', path: '/portable-x-ray-solutions' },
  { label: 'Mammography Systems', path: '/mammography-systems' },
  { label: 'Flat Panel Detectors', path: '/flat-panel-detectors' },
  { label: 'Refurbished MRI Systems', path: '/refurbished-mri-systems' },
  { label: 'Imaging Accessories', path: '/imaging-accessories' },
  { label: 'FPD C-ARM', path: '/fpd-c-arm' },
  { label: 'Search', path: '/search' },
];

export function NavigationLinksManager({ navigationLinks, onUpdate }: NavigationLinksManagerProps) {
  const [links, setLinks] = useState<NavigationLink[]>(navigationLinks || []);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<NavigationLink>({
    label: '',
    link: '',
    order: links.length + 1,
    external: false
  });

  // Update parent when links change
  useEffect(() => {
    onUpdate(links);
  }, [links, onUpdate]);

  const handleAdd = () => {
    if (formData.label && formData.link) {
      const newLinks = [...links, { ...formData, order: formData.order || links.length + 1 }];
      setLinks(newLinks.sort((a, b) => (a.order || 0) - (b.order || 0)));
      setFormData({ label: '', link: '', order: newLinks.length + 1, external: false });
      setShowAddForm(false);
    }
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setFormData(links[index]);
    setShowAddForm(false);
  };

  const handleUpdate = () => {
    if (editingIndex !== null && formData.label && formData.link) {
      const newLinks = [...links];
      newLinks[editingIndex] = formData;
      setLinks(newLinks.sort((a, b) => (a.order || 0) - (b.order || 0)));
      setEditingIndex(null);
      setFormData({ label: '', link: '', order: links.length + 1, external: false });
    }
  };

  const handleDelete = (index: number) => {
    if (window.confirm(`Are you sure you want to delete "${links[index].label}"?`)) {
      const newLinks = links.filter((_, i) => i !== index);
      setLinks(newLinks);
    }
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setShowAddForm(false);
    setFormData({ label: '', link: '', order: links.length + 1, external: false });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <label className="block text-sm font-medium text-gray-700">Navigation Links</label>
        {!showAddForm && editingIndex === null && (
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium"
          >
            <i className="ri-add-line mr-1"></i>
            Add Link
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {(showAddForm || editingIndex !== null) && (
        <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            {editingIndex !== null ? 'Edit Navigation Link' : 'Add New Navigation Link'}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Label</label>
              <input
                type="text"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="Home"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Link URL</label>
              {!formData.external ? (
                <>
                  <select
                    value={formData.link}
                    onChange={(e) => {
                      const selectedPath = e.target.value;
                      setFormData({ 
                        ...formData, 
                        link: selectedPath,
                        // Auto-fill label if empty and a page is selected
                        label: formData.label || INTERNAL_PAGES.find(p => p.path === selectedPath)?.label || ''
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm mb-2"
                  >
                    <option value="">Select an internal page...</option>
                    {INTERNAL_PAGES.map((page) => (
                      <option key={page.path} value={page.path}>
                        {page.label} ({page.path})
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="Or enter custom path (e.g., /custom-page)"
                  />
                  <p className="text-xs text-gray-500 mt-1">Select from dropdown or enter custom path</p>
                </>
              ) : (
                <input
                  type="text"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="https://example.com"
                />
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Order</label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                min="0"
              />
            </div>
            <div className="flex items-center pt-6">
              <input
                type="checkbox"
                id="externalLink"
                checked={formData.external || false}
                onChange={(e) => setFormData({ ...formData, external: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="externalLink" className="text-xs font-medium text-gray-600">External Link</label>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={editingIndex !== null ? handleUpdate : handleAdd}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
            >
              {editingIndex !== null ? 'Update' : 'Add'}
            </button>
          </div>
        </div>
      )}

      {/* Links List */}
      {links.length > 0 ? (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Order</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Label</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Link</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {links.map((link, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{link.order || index + 1}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{link.label}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    <a href={link.link} target={link.external ? "_blank" : "_self"} rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {link.link}
                    </a>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${link.external ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}`}>
                      {link.external ? 'External' : 'Internal'}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(index)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <i className="ri-edit-line"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(index)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <i className="ri-delete-bin-line"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 text-sm border border-gray-200 rounded-lg">
          No navigation links added yet. Click "Add Link" to get started.
        </div>
      )}
    </div>
  );
}

