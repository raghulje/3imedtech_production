/**
 * Form Array Input Component
 * Dynamic array input for features, benefits, etc.
 */

import { Plus, X } from 'lucide-react';

interface FormArrayInputProps {
    label: string;
    value: string[];
    onChange: (value: string[]) => void;
    placeholder?: string;
    error?: string;
}

export default function FormArrayInput({
    label,
    value = [],
    onChange,
    placeholder = 'Add item',
    error,
}: FormArrayInputProps) {
    const handleAdd = () => {
        onChange([...value, '']);
    };

    const handleRemove = (index: number) => {
        onChange(value.filter((_, i) => i !== index));
    };

    const handleChange = (index: number, newValue: string) => {
        const updated = [...value];
        updated[index] = newValue;
        onChange(updated);
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">{label}</label>

            <div className="space-y-2">
                {value.map((item, index) => (
                    <div key={index} className="flex gap-2">
                        <input
                            type="text"
                            value={item}
                            onChange={(e) => handleChange(index, e.target.value)}
                            placeholder={`${placeholder} ${index + 1}`}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        />
                        <button
                            type="button"
                            onClick={() => handleRemove(index)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                ))}
            </div>

            <button
                type="button"
                onClick={handleAdd}
                className="flex items-center gap-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
            >
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">Add {label}</span>
            </button>

            {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
    );
}
