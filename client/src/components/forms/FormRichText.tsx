/**
 * Form Rich Text Editor Component
 * Rich text editor using React Quill
 */

import { forwardRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { AlertCircle } from 'lucide-react';

interface FormRichTextProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    helperText?: string;
    placeholder?: string;
}

const modules = {
    toolbar: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ align: [] }],
        ['link'],
        ['clean'],
    ],
};

const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'bullet',
    'align',
    'link',
];

const FormRichText = forwardRef<ReactQuill, FormRichTextProps>(
    ({ label, value, onChange, error, helperText, placeholder }, ref) => {
        return (
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">{label}</label>
                <div className={`border rounded-lg ${error ? 'border-red-500' : 'border-gray-300'}`}>
                    <ReactQuill
                        ref={ref}
                        theme="snow"
                        value={value}
                        onChange={onChange}
                        modules={modules}
                        formats={formats}
                        placeholder={placeholder}
                        className="bg-white"
                    />
                </div>
                {error && (
                    <div className="flex items-center gap-1 text-sm text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        <span>{error}</span>
                    </div>
                )}
                {helperText && !error && <p className="text-sm text-gray-500">{helperText}</p>}
            </div>
        );
    }
);

FormRichText.displayName = 'FormRichText';

export default FormRichText;
