/**
 * Product Form Modal
 * Multi-step form for creating/editing products
 */

import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Save, Loader2 } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema, type ProductFormData } from '../../schemas/productSchema';
import { productService, categoryService } from '../../services/admin';
import { toast } from 'sonner';
import type { Product, ProductCategory } from '../../types/admin';

import FormInput from '../forms/FormInput';
import FormTextarea from '../forms/FormTextarea';
import FormSelect from '../forms/FormSelect';
import FormImageUpload from '../forms/FormImageUpload';
import FormArrayInput from '../forms/FormArrayInput';
import FormRichText from '../forms/FormRichText';

interface ProductFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    product?: Product | null;
    onSuccess: () => void;
}

export default function ProductFormModal({
    isOpen,
    onClose,
    product,
    onSuccess,
}: ProductFormModalProps) {
    const [categories, setCategories] = useState<ProductCategory[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    const isEdit = !!product;

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        setValue,
    } = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            category_id: '',
            name: '',
            short_description: '',
            full_description: '',
            features: [],
            benefits: [],
            specifications: {},
            image_url: '',
            gallery_images: [],
            order: 0,
            is_active: true,
            meta_title: '',
            meta_description: '',
        },
    });

    const productName = watch('name');

    // Auto-generate slug from name
    useEffect(() => {
        if (productName && !isEdit) {
            const slug = productName
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
            setValue('meta_title', productName);
        }
    }, [productName, isEdit, setValue]);

    // Load categories
    useEffect(() => {
        if (isOpen) {
            loadCategories();
            if (product) {
                reset({
                    category_id: product.category_id,
                    name: product.name,
                    short_description: product.short_description || '',
                    full_description: product.full_description || '',
                    features: product.features || [],
                    benefits: product.benefits || [],
                    specifications: product.specifications || {},
                    image_url: product.image_url || '',
                    gallery_images: product.gallery_images || [],
                    order: product.order || 0,
                    is_active: product.is_active,
                    meta_title: product.meta_title || '',
                    meta_description: product.meta_description || '',
                });
            } else {
                reset();
            }
        }
    }, [isOpen, product, reset]);

    const loadCategories = async () => {
        try {
            const response = await categoryService.getAll();
            setCategories(response.data || []);
        } catch (error) {
            toast.error('Failed to load categories');
        }
    };

    const onSubmit = async (data: ProductFormData) => {
        setLoading(true);
        try {
            if (isEdit && product) {
                await productService.update(product.id, data);
                toast.success('Product updated successfully');
            } else {
                await productService.create(data);
                toast.success('Product created successfully');
            }
            onSuccess();
            onClose();
            reset();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to save product');
        } finally {
            setLoading(false);
        }
    };

    const steps = [
        { title: 'Basic Info', fields: ['name', 'category_id', 'short_description'] },
        { title: 'Details', fields: ['full_description', 'features', 'benefits'] },
        { title: 'Media', fields: ['image_url'] },
        { title: 'SEO', fields: ['meta_title', 'meta_description'] },
    ];

    const categoryOptions = categories.map((cat) => ({
        value: cat.id,
        label: cat.name,
    }));

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
                                {/* Header */}
                                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                                    <Dialog.Title className="text-2xl font-bold text-gray-900">
                                        {isEdit ? 'Edit Product' : 'Create New Product'}
                                    </Dialog.Title>
                                    <button
                                        onClick={onClose}
                                        className="text-gray-400 hover:text-gray-600 transition"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                {/* Step Indicator */}
                                <div className="px-6 pt-6">
                                    <div className="flex items-center justify-between mb-8">
                                        {steps.map((step, index) => (
                                            <div key={index} className="flex items-center flex-1">
                                                <div className="flex flex-col items-center flex-1">
                                                    <div
                                                        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${index <= currentStep
                                                                ? 'bg-indigo-600 text-white'
                                                                : 'bg-gray-200 text-gray-600'
                                                            }`}
                                                    >
                                                        {index + 1}
                                                    </div>
                                                    <span className="text-xs mt-2 text-gray-600">{step.title}</span>
                                                </div>
                                                {index < steps.length - 1 && (
                                                    <div
                                                        className={`h-1 flex-1 mx-2 ${index < currentStep ? 'bg-indigo-600' : 'bg-gray-200'
                                                            }`}
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Form */}
                                <form onSubmit={handleSubmit(onSubmit)} className="px-6 pb-6">
                                    <div className="space-y-6">
                                        {/* Step 0: Basic Info */}
                                        {currentStep === 0 && (
                                            <>
                                                <FormInput
                                                    label="Product Name"
                                                    {...register('name')}
                                                    error={errors.name?.message}
                                                    placeholder="Enter product name"
                                                    required
                                                />

                                                <FormSelect
                                                    label="Category"
                                                    {...register('category_id')}
                                                    options={categoryOptions}
                                                    error={errors.category_id?.message}
                                                    required
                                                />

                                                <FormTextarea
                                                    label="Short Description"
                                                    {...register('short_description')}
                                                    error={errors.short_description?.message}
                                                    placeholder="Brief overview of the product"
                                                    rows={3}
                                                    showCharCount
                                                    maxLength={200}
                                                />
                                            </>
                                        )}

                                        {/* Step 1: Details */}
                                        {currentStep === 1 && (
                                            <>
                                                <Controller
                                                    name="full_description"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <FormRichText
                                                            label="Full Description"
                                                            value={field.value || ''}
                                                            onChange={field.onChange}
                                                            error={errors.full_description?.message}
                                                            placeholder="Detailed product description..."
                                                        />
                                                    )}
                                                />

                                                <Controller
                                                    name="features"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <FormArrayInput
                                                            label="Features"
                                                            value={field.value || []}
                                                            onChange={field.onChange}
                                                            placeholder="Feature"
                                                        />
                                                    )}
                                                />

                                                <Controller
                                                    name="benefits"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <FormArrayInput
                                                            label="Benefits"
                                                            value={field.value || []}
                                                            onChange={field.onChange}
                                                            placeholder="Benefit"
                                                        />
                                                    )}
                                                />
                                            </>
                                        )}

                                        {/* Step 2: Media */}
                                        {currentStep === 2 && (
                                            <>
                                                <Controller
                                                    name="image_url"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <FormImageUpload
                                                            label="Product Image"
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                            error={errors.image_url?.message}
                                                            helperText="Upload main product image"
                                                        />
                                                    )}
                                                />
                                            </>
                                        )}

                                        {/* Step 3: SEO */}
                                        {currentStep === 3 && (
                                            <>
                                                <FormInput
                                                    label="Meta Title"
                                                    {...register('meta_title')}
                                                    error={errors.meta_title?.message}
                                                    placeholder="SEO title for search engines"
                                                    maxLength={200}
                                                />

                                                <FormTextarea
                                                    label="Meta Description"
                                                    {...register('meta_description')}
                                                    error={errors.meta_description?.message}
                                                    placeholder="SEO description for search engines"
                                                    rows={3}
                                                    showCharCount
                                                    maxLength={500}
                                                />

                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        id="is_active"
                                                        {...register('is_active')}
                                                        className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                                                    />
                                                    <label htmlFor="is_active" className="text-sm text-gray-700">
                                                        Active (visible on website)
                                                    </label>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {/* Navigation Buttons */}
                                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                                        <button
                                            type="button"
                                            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                                            disabled={currentStep === 0}
                                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Previous
                                        </button>

                                        <div className="flex gap-2">
                                            {currentStep < steps.length - 1 ? (
                                                <button
                                                    type="button"
                                                    onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                                                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                                                >
                                                    Next
                                                </button>
                                            ) : (
                                                <button
                                                    type="submit"
                                                    disabled={loading}
                                                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 flex items-center gap-2"
                                                >
                                                    {loading ? (
                                                        <>
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                            Saving...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Save className="w-4 h-4" />
                                                            {isEdit ? 'Update' : 'Create'} Product
                                                        </>
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
