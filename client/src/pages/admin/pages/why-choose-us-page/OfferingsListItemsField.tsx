import { useState, useEffect } from 'react';

interface ListItem {
  boldText: string;
  description: string;
}

interface OfferingsListItemsFieldProps {
  items: ListItem[];
  onChange: (items: ListItem[]) => void;
  label?: string;
}

export function OfferingsListItemsField({ items, onChange, label = 'List Items' }: OfferingsListItemsFieldProps) {
  const [localItems, setLocalItems] = useState<ListItem[]>(items || []);

  useEffect(() => {
    setLocalItems(items || []);
  }, [items]);

  const handleItemChange = (index: number, field: 'boldText' | 'description', value: string) => {
    const updated = [...localItems];
    updated[index] = { ...updated[index], [field]: value };
    setLocalItems(updated);
    onChange(updated);
  };

  const handleAddItem = () => {
    const updated = [...localItems, { boldText: '', description: '' }];
    setLocalItems(updated);
    onChange(updated);
  };

  const handleRemoveItem = (index: number) => {
    if (localItems.length > 1) {
      const updated = localItems.filter((_, i) => i !== index);
      setLocalItems(updated);
      onChange(updated);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <button
          type="button"
          onClick={handleAddItem}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
        >
          <i className="ri-add-line mr-1"></i>
          Add Item
        </button>
      </div>
      {localItems.map((item, index) => (
        <div key={index} className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <div className="flex items-start gap-2">
            <div className="flex-1 space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Subtitle (Bold Text) {index + 1}
                </label>
                <input
                  type="text"
                  value={item.boldText || ''}
                  onChange={(e) => handleItemChange(index, 'boldText', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="e.g., Comprehensive Product Portfolio"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Description {index + 1}
                </label>
                <textarea
                  value={item.description || ''}
                  onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  rows={3}
                  placeholder="e.g., Our product range encompasses X-ray systems..."
                />
              </div>
            </div>
            {localItems.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveItem(index)}
                className="mt-8 text-red-600 hover:text-red-800 p-2"
                title="Remove item"
              >
                <i className="ri-delete-bin-line"></i>
              </button>
            )}
          </div>
        </div>
      ))}
      {localItems.length === 0 && (
        <button
          type="button"
          onClick={handleAddItem}
          className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-600 transition-colors"
        >
          <i className="ri-add-line mr-2"></i>
          Add First Item
        </button>
      )}
    </div>
  );
}

