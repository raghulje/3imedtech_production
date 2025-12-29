/**
 * Form Input Component
 * Reusable input field with validation and error display
 */

import { forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    helperText?: string;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
    ({ label, error, helperText, className = '', ...props }, ref) => {
        return (
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                    {label}
                    {props.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                <input
                    ref={ref}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition ${error ? 'border-red-500' : 'border-gray-300'
                        } ${className}`}
                    {...props}
                />
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

FormInput.displayName = 'FormInput';

export default FormInput;
