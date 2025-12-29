import { useState, useEffect } from 'react';

interface DynamicParagraphsFieldProps {
  paragraphs: string[];
  onChange: (paragraphs: string[]) => void;
  label?: string;
}

export function DynamicParagraphsField({ paragraphs, onChange, label = 'Description Paragraphs' }: DynamicParagraphsFieldProps) {
  const [localParagraphs, setLocalParagraphs] = useState<string[]>(paragraphs || []);

  useEffect(() => {
    setLocalParagraphs(paragraphs || []);
  }, [paragraphs]);

  const handleParagraphChange = (index: number, value: string) => {
    const updated = [...localParagraphs];
    updated[index] = value;
    setLocalParagraphs(updated);
    onChange(updated);
  };

  const handleAddParagraph = () => {
    const updated = [...localParagraphs, ''];
    setLocalParagraphs(updated);
    onChange(updated);
  };

  const handleRemoveParagraph = (index: number) => {
    if (localParagraphs.length > 1) {
      const updated = localParagraphs.filter((_, i) => i !== index);
      setLocalParagraphs(updated);
      onChange(updated);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <button
          type="button"
          onClick={handleAddParagraph}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
        >
          <i className="ri-add-line mr-1"></i>
          Add Paragraph
        </button>
      </div>
      {localParagraphs.map((paragraph, index) => (
        <div key={index} className="mb-3">
          <div className="flex items-start gap-2">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Paragraph {index + 1}
              </label>
              <textarea
                value={paragraph}
                onChange={(e) => handleParagraphChange(index, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                rows={4}
                placeholder={`Enter paragraph ${index + 1}...`}
              />
            </div>
            {localParagraphs.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveParagraph(index)}
                className="mt-6 text-red-600 hover:text-red-800 p-2"
                title="Remove paragraph"
              >
                <i className="ri-delete-bin-line"></i>
              </button>
            )}
          </div>
        </div>
      ))}
      {localParagraphs.length === 0 && (
        <button
          type="button"
          onClick={handleAddParagraph}
          className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-600 transition-colors"
        >
          <i className="ri-add-line mr-2"></i>
          Add First Paragraph
        </button>
      )}
    </div>
  );
}

