'use client';

import { useState, useRef } from 'react';
import { X, Tag, DollarSign, Image as ImageIcon, Loader2, Upload, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface PostData {
    _id: string;
    title: string;
    description: string;
    priceRange: string;
    category: { _id: string; name: string } | string;
    imageURL: string;
}

interface EditPostModalProps {
    post: PostData;
    services: any[];
    onPostUpdated: () => void;
    onClose: () => void;
}

const API_BASE_URL = 'https://backend-se-7rkj.onrender.com/api';

// Helper to get the absolute URL for preview (handles Cloudinary vs. old local)
const getPreviewUrl = (imageURL: string) => {
    return imageURL && imageURL.startsWith('http') ? imageURL : `${API_BASE_URL}${imageURL}`;
};


export function EditPostModal({ post, services, onPostUpdated, onClose }: EditPostModalProps) {
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    
    // FIX: Use the URL helper for the initial preview state (Cloudinary ready)
    const [imagePreview, setImagePreview] = useState<string | null>(post.imageURL ? getPreviewUrl(post.imageURL) : null);
    
    const imageInputRef = useRef<HTMLInputElement>(null);

    const initialCategoryId = typeof post.category === 'object' ? post.category._id : post.category;

    const [formData, setFormData] = useState({
        title: post.title,
        description: post.description,
        priceRange: post.priceRange,
        category: initialCategoryId,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result as string);
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formDataToSend = new FormData();
            
            formDataToSend.append('title', formData.title);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('priceRange', formData.priceRange);
            formDataToSend.append('category', formData.category);
            
            if (imageFile) {
                // Sends file to the PUT endpoint for Cloudinary upload
                formDataToSend.append('image', imageFile); 
            }

            const token = localStorage.getItem('token');
            
            const response = await fetch(`${API_BASE_URL}/agencies/posts/${post._id}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formDataToSend,
            });

            if (response.ok) {
                alert('Post updated successfully!');
                onPostUpdated();
                onClose();
            } else {
                const data = await response.json();
                throw new Error(data.error || 'Failed to update post.');
            }
        } catch (error: any) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-950 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-cyan-800">
                <div className="sticky top-0 bg-slate-950 border-b border-slate-700 p-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-teal-400">Edit Ad Placement: {post.title}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-gray-400">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    
                    {/* Image Upload Area (shows existing image or preview) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Ad Placement Image (Upload new to replace)</label>
                        <div
                            className="border-2 border-dashed border-slate-700 rounded-xl p-6 text-center cursor-pointer hover:border-cyan-400 transition-colors bg-slate-900"
                            onClick={() => imageInputRef.current?.click()}
                        >
                            {imagePreview ? (
                                <div className="flex flex-col items-center">
                                    <img src={imagePreview} alt="Image Preview" className="max-w-full max-h-24 object-contain mb-2 rounded" />
                                    <p className="text-sm text-white">Click to upload new image</p>
                                </div>
                            ) : (
                                <>
                                    <Upload className="w-8 h-8 text-cyan-400 mx-auto" />
                                    <p className="mt-2 text-sm text-gray-400">Click to upload image</p>
                                </>
                            )}
                            <input type="file" ref={imageInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                        </div>
                    </div>

                    {/* Form Fields (Title, Description, Category, Price) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Title</label>
                        <Input name="title" value={formData.title} onChange={handleChange} required className="rounded-xl border-slate-700 bg-slate-800 text-white" />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                        <Textarea name="description" value={formData.description} onChange={handleChange} required className="rounded-xl min-h-32 border-slate-700 bg-slate-800 text-white" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
                            <div className="relative">
                                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                                <select name="category" value={formData.category} onChange={handleChange} required className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-700 bg-slate-800 text-white focus:border-cyan-400 focus:outline-none appearance-none">
                                    {services.map(service => (
                                        <option key={service._id} value={service._id} className="bg-slate-800 text-white">{service.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Price Range</label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                                <Input name="priceRange" value={formData.priceRange} onChange={handleChange} required className="pl-10 rounded-xl border-slate-700 bg-slate-800 text-white" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex gap-4 pt-4 border-t border-slate-800">
                        <Button type="button" onClick={onClose} variant="outline" className="flex-1 rounded-xl bg-slate-800 text-gray-400 hover:bg-slate-700 border-slate-700">
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-xl"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            ) : (
                                <Save className="w-5 h-5 mr-2" />
                            )}
                            {loading ? 'Saving Changes...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}