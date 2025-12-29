/**
 * Category Form Modal
 * Modal for creating/editing categories
 */

import { Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Save, Loader2 } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { categorySchema, type CategoryFormData } from '../../schemas/categorySchema';
import { categoryService } from '../../services/admin';
import { toast } from 'sonner';
import type { ProductCategory } from '../../types/admin';

import FormInput from '../forms/FormInput';
import FormTextarea from '../forms/FormTextarea';
import FormImageUpload from '../forms/FormImageUpload';

interface CategoryFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    category?: ProductCategory | null;
    onSuccess: () => void;
}

export default function CategoryFormModal({
    isOpen,
    onClose,
    category,
    onSuccess,
}: CategoryFormModalProps) {
    const isEdit = !!category;

    const {
        register,
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        watch,
        setValue,
    } = useForm<CategoryFormData>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: '',
            description: '',
            icon_url: '',
            order: 0,
            is_active: true,
        },
    });

    const categoryName = watch('name');

    // Auto-generate slug from name
    useEffect(() => {
        if (categoryName && !isEdit) {
            const slug = categoryName
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
            // Slug is auto-generated on backend, but we could show preview here
        }
    }, [categoryName, isEdit]);

    // Load category data when editing
    useEffect(() => {
        if (isOpen) {
            if (category) {
                reset({
                    name: category.name,
                    description: category.description || '',
                    icon_url: category.icon_url || '',
                    order: category.order || 0,
                    is_active: category.is_active,
                });
            } else {
                reset({
                    name: '',
                    description: '',
                    icon_url: '',
                    order: 0,
                    is_active: true,
                });
            }
        }
    }, [isOpen, category, reset]);

    const onSubmit = async (data: CategoryFormData) => {
        try {
            if (isEdit && category) {
                await categoryService.update(category.id, data);
                toast.success('Category updated successfully');
            } else {
                await categoryService.create(data);
                toast.success('Category created successfully');
            }
            onSuccess();
            onClose();
            reset();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to save category');
        }
    };

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
                            <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
                                {/* Header */}
                                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                                    <Dialog.Title className="text-2xl font-bold text-gray-900">
                                        {isEdit ? 'Edit Category' : 'Create New Category'}
                                    </Dialog.Title>
                                    <button
                                        onClick={onClose}
                                        className="text-gray-400 hover:text-gray-600 transition"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                {/* Form */}
                                <form onSubmit={handleSubmit(onSubmit)} className="p-6">
                                    <div className="space-y-6">
                                        {/* Name */}
                                        <FormInput
                                            label="Category Name"
                                            {...register('name')}
                                            error={errors.name?.message}
                                            placeholder="Enter category name"
                                            required
                                        />

                                        {/* Description */}
                                        <FormTextarea
                                            label="Description"
                                            {...register('description')}
                                            error={errors.description?.message}
                                            placeholder="Brief description of the category"
                                            rows={3}
                                            showCharCount
                                            maxLength={500}
                                        />

                                        {/* Icon Upload */}
                                        <Controller
                                            name="icon_url"
                                            control={control}
                                            render={({ field }) => (
                                                <FormImageUpload
                                                    label="Category Icon (Optional)"
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    error={errors.icon_url?.message}
                                                    helperText="Upload an icon for this category"
                                                />
                                            )}
                                        />

                                        {/* Order */}
                                        <FormInput
                                            label="Display Order"
                                            type="number"
                                            {...register('order', { valueAsNumber: true })}
                                            error={errors.order?.message}
                                            placeholder="0"
                                            helperText="Lower numbers appear first"
                                        />

                                        {/* Active Toggle */}
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
                                    </div>

                                    {/* Footer Buttons */}
                                    <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 flex items-center gap-2"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="w-4 h-4" />
                                                    {isEdit ? 'Update' : 'Create'} Category
                                                </>
                                            )}
                                        </button>
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
