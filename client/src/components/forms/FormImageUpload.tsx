/**
 * Form Image Upload Component
 * Drag-and-drop image upload with preview
 */

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { mediaService } from '../../services/admin';
import { toast } from 'sonner';

interface FormImageUploadProps {
    label: string;
    value?: string;
    onChange: (url: string) => void;
    error?: string;
    helperText?: string;
}

export default function FormImageUpload({
    label,
    value,
    onChange,
    error,
    helperText,
}: FormImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(value || '');

    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
            if (acceptedFiles.length === 0) return;

            const file = acceptedFiles[0];
            setUploading(true);

            try {
                const response = await mediaService.upload(file, '', 'product_image');
                if (response.data) {
                    const imageUrl = `http://localhost:5000${response.data.url}`;
                    setPreview(imageUrl);
                    onChange(imageUrl);
                    toast.success('Image uploaded successfully');
                }
            } catch (error) {
                toast.error('Failed to upload image');
            } finally {
                setUploading(false);
            }
        },
        [onChange]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
        maxFiles: 1,
        disabled: uploading,
    });

    const handleRemove = () => {
        setPreview('');
        onChange('');
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">{label}</label>

            {preview ? (
                <div className="relative inline-block">
                    <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
                    />
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ) : (
                <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${isDragActive
                            ? 'border-indigo-500 bg-indigo-50'
                            : error
                                ? 'border-red-500'
                                : 'border-gray-300 hover:border-indigo-400'
                        }`}
                >
                    <input {...getInputProps()} />
                    {uploading ? (
                        <div className="flex flex-col items-center gap-2">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                            <p className="text-sm text-gray-600">Uploading...</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-2">
                            {isDragActive ? (
                                <Upload className="w-12 h-12 text-indigo-500" />
                            ) : (
                                <ImageIcon className="w-12 h-12 text-gray-400" />
                            )}
                            <p className="text-sm text-gray-600">
                                {isDragActive ? 'Drop image here' : 'Drag & drop or click to upload'}
                            </p>
                            <p className="text-xs text-gray-500">PNG, JPG, JPEG, WEBP (max 10MB)</p>
                        </div>
                    )}
                </div>
            )}

            {error && <p className="text-sm text-red-600">{error}</p>}
            {helperText && !error && <p className="text-sm text-gray-500">{helperText}</p>}
        </div>
    );
}
