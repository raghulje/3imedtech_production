/**
 * Form Select Component
 * Reusable select dropdown with validation
 */

import { forwardRef } from 'react';
import { AlertCircle, ChevronDown } from 'lucide-react';

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    error?: string;
    helperText?: string;
    options: Array<{ value: string; label: string }>;
}

const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
    ({ label, error, helperText, options, className = '', ...props }, ref) => {
        return (
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                    {label}
                    {props.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                <div className="relative">
                    <select
                        ref={ref}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition appearance-none pr-10 ${error ? 'border-red-500' : 'border-gray-300'
                            } ${className}`}
                        {...props}
                    >
                        <option value="">Select {label}</option>
                        {options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
                {error && (
                    <div className="flex items-center gap-1 text-sm text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        <span>{error}</span>
                    </div>
                )}
                {helperText && !error && (
                    <p className="text-sm text-gray-500">{helperText}</p>
                )}
            </div>
        );
    }
);

FormSelect.displayName = 'FormSelect';

export default FormSelect;
