/**
 * Form Textarea Component
 * Reusable textarea with character count and validation
 */

import { forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
    error?: string;
    helperText?: string;
    showCharCount?: boolean;
}

const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
    ({ label, error, helperText, showCharCount, maxLength, value, className = '', ...props }, ref) => {
        const charCount = value ? String(value).length : 0;

        return (
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-700">
                        {label}
                        {props.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    {showCharCount && maxLength && (
                        <span className="text-xs text-gray-500">
                            {charCount}/{maxLength}
                        </span>
                    )}
                </div>
                <textarea
                    ref={ref}
                    value={value}
                    maxLength={maxLength}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition resize-none ${error ? 'border-red-500' : 'border-gray-300'
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

FormTextarea.displayName = 'FormTextarea';

export default FormTextarea;
