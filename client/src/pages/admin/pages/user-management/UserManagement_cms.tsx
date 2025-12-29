import { useState, useEffect } from 'react';
import { DataTable } from '../../shared/DataTable';
import { authHeaders } from '../../shared/utils';
import { CMSComponentProps } from '../../shared/types';
import { showToast } from '@/components/admin/Toast';

interface UserManagementProps extends Partial<CMSComponentProps> {
  user: any;
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
}

export default function UserManagement_cms({
  user,
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
  handleDelete
}: UserManagementProps) {
  const [users, setUsers] = useState<any[]>([]);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/cms/users', {
        headers: { ...authHeaders(token) }
      });
      if (res.ok) {
        const json = await res.json();
        const usersList = Array.isArray(json?.data) ? json.data : json;
        setUsers(usersList || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleActive = async (item: any, currentValue: boolean) => {
    try {
      const response = await fetch(`/api/cms/users/${item.id}/toggle-active`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...authHeaders(token) }
      });
      if (response.ok) {
        await fetchUsers();
        showToast.success(`User ${!currentValue ? 'activated' : 'deactivated'} successfully!`);
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to toggle user status');
      }
    } catch (error: any) {
      showToast.error(`Failed to toggle user status: ${error.message || 'Please try again.'}`);
    }
  };

  const handleAddClick = () => {
    setModalType('add');
    setEditingItem({ type: 'user' });
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      user_type: 'Regular User',
      mobile_number: '',
      is_active: true,
      allowed_cms_pages: []
    });
    setShowModal(true);
  };

  const handleEditClick = (item: any) => {
    setModalType('edit');
    setEditingItem({ type: 'user', id: item.id });
    setFormData({
      first_name: item.first_name || '',
      last_name: item.last_name || '',
      email: item.email || '',
      password: '',
      user_type: item.user_type || 'Regular User',
      mobile_number: item.mobile_number || '',
      is_active: item.is_active !== undefined ? item.is_active : true,
      allowed_cms_pages: item.allowed_cms_pages ? (typeof item.allowed_cms_pages === 'string' ? JSON.parse(item.allowed_cms_pages) : item.allowed_cms_pages) : []
    });
    setShowModal(true);
  };

  const handleDeleteClick = (item: any) => {
    if (item.id === user?.id) {
      showToast.error('You cannot delete your own account!');
      return;
    }
    if (confirm(`Are you sure you want to delete user ${item.first_name} ${item.last_name}?`)) {
      handleDelete(item);
      // Refresh users after delete
      setTimeout(() => fetchUsers(), 500);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Users</h3>
          <button
            onClick={handleAddClick}
            className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg transition-all duration-300"
          >
            <i className="ri-user-add-line mr-2"></i>
            Add New User
          </button>
        </div>

        <DataTable
          data={users}
          columns={[
            {
              key: 'first_name',
              header: 'Name',
              render: (value: string, item: any) => (
                <span className="font-medium">{item.first_name} {item.last_name}</span>
              )
            },
            {
              key: 'email',
              header: 'Email',
              render: (value: string) => (
                <span className="text-gray-700">{value}</span>
              )
            },
            {
              key: 'mobile_number',
              header: 'Mobile',
              render: (value: string) => (
                <span className="text-gray-600">{value || '-'}</span>
              )
            },
            {
              key: 'user_type',
              header: 'Role',
              render: (value: string) => {
                const roleColors: any = {
                  'Admin': 'bg-purple-100 text-purple-800',
                  'Regular User': 'bg-green-100 text-green-800'
                };
                return (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleColors[value] || 'bg-gray-100 text-gray-800'}`}>
                    {value}
                  </span>
                );
              }
            },
            {
              key: 'allowed_cms_pages',
              header: 'CMS Pages',
              render: (value: string, item: any) => {
                const pages = item.allowed_cms_pages ? (typeof item.allowed_cms_pages === 'string' ? JSON.parse(item.allowed_cms_pages) : item.allowed_cms_pages) : [];
                return (
                  <span className="text-gray-600 text-xs">
                    {pages.length > 0 ? `${pages.length} page(s)` : 'No access'}
                  </span>
                );
              }
            },
            {
              key: 'is_active',
              header: 'Status',
              render: (value: boolean, item: any) => (
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {value ? 'Active' : 'Inactive'}
                  </span>
                  {item.id !== user?.id && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleActive(item, value);
                      }}
                      className={`text-xs px-2 py-1 rounded transition-colors ${
                        value 
                          ? 'bg-orange-100 text-orange-700 hover:bg-orange-200' 
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                      title={value ? 'Deactivate' : 'Activate'}
                    >
                      <i className={value ? 'ri-toggle-line' : 'ri-toggle-fill'}></i>
                    </button>
                  )}
                </div>
              )
            },
            {
              key: 'created_at',
              header: 'Created',
              render: (value: string) => (
                <span className="text-gray-500 text-sm">
                  {value ? new Date(value).toLocaleDateString() : '-'}
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
export function UserManagementForm({
  formData,
  handleInputChange,
  modalType
}: {
  formData: any;
  handleInputChange: (key: string, value: any) => void;
  modalType: 'add' | 'edit';
}) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
          <input
            type="text"
            value={formData.first_name || ''}
            onChange={(e) => handleInputChange('first_name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="John"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
          <input
            type="text"
            value={formData.last_name || ''}
            onChange={(e) => handleInputChange('last_name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Doe"
            required
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
        <input
          type="email"
          value={formData.email || ''}
          onChange={(e) => handleInputChange('email', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="john.doe@example.com"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Password {modalType === 'add' ? '*' : '(leave blank to keep current)'}
        </label>
        <input
          type="password"
          value={formData.password || ''}
          onChange={(e) => handleInputChange('password', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder={modalType === 'add' ? 'Enter password' : 'Enter new password (optional)'}
          required={modalType === 'add'}
        />
        {modalType === 'add' && (
          <p className="text-xs text-gray-500 mt-1">Default password will be used if left blank</p>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
          <input
            type="text"
            value={formData.mobile_number || ''}
            onChange={(e) => handleInputChange('mobile_number', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="+1234567890"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
          <select
            value={formData.user_type || 'Regular User'}
            onChange={(e) => handleInputChange('user_type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Admin">Admin</option>
            <option value="Regular User">Regular User</option>
          </select>
        </div>
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          id="userIsActive"
          checked={formData.is_active !== undefined ? formData.is_active : true}
          onChange={(e) => handleInputChange('is_active', e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="userIsActive" className="ml-2 block text-sm text-gray-700">
          Active User
        </label>
      </div>
      
      {/* CMS Pages Checklist */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">CMS Page Access *</label>
        <p className="text-xs text-gray-500 mb-3">Select which CMS pages this user can manage:</p>
        <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-4">
          {[
            { id: 'home-page', label: 'Home Page' },
            { id: 'header-footer', label: 'Header & Footer' },
            { id: 'about-page', label: 'About Page' },
            { id: 'mission-vision-page', label: 'Mission & Vision' },
            { id: 'why-choose-us-page', label: 'Why Choose Us' },
            { id: 'contact-page', label: 'Contact Page' },
            { id: 'portable-xray-page', label: 'Portable X-Ray' },
            { id: 'radiography-page', label: 'Radiography Systems' },
            { id: 'flat-panel-page', label: 'Flat Panel Detectors' },
            { id: 'mammography-page', label: 'Mammography Systems' },
            { id: 'mri-page', label: 'Refurbished MRI' },
            { id: 'imaging-accessories-page', label: 'Imaging Accessories' },
            { id: 'fpd-carm-page', label: 'FPD C-ARM' },
          ].map((page) => {
            const allowedPages = formData.allowed_cms_pages || [];
            const isChecked = Array.isArray(allowedPages) && allowedPages.includes(page.id);
            return (
              <label
                key={page.id}
                className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={(e) => {
                    const currentPages = formData.allowed_cms_pages || [];
                    const newPages = e.target.checked
                      ? [...currentPages, page.id]
                      : currentPages.filter((p: string) => p !== page.id);
                    handleInputChange('allowed_cms_pages', newPages);
                  }}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">{page.label}</span>
              </label>
            );
          })}
        </div>
      </div>
    </>
  );
}

