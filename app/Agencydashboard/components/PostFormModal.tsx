'use client';

import { useState, useRef } from 'react';
import {
  Plus,
  X,
  Tag,
  Upload as UploadIcon,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface PostFormModalProps {
  agencyId: string;
  services: any[];
  onPostCreated: () => void;
  onClose: () => void;
}

const API_BASE_URL = 'http://localhost:5000/api';

export function PostFormModal({
  agencyId,
  services,
  onPostCreated,
  onClose,
}: PostFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priceRange: '',
    category: services[0]?._id || '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null); // Clear error on new input
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (JPG, PNG, WEBP).');
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!imageFile) {
      setError('Please upload an image for the ad post.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('priceRange', formData.priceRange);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('image', imageFile);

      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/agencies/posts`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (response.ok) {
        onPostCreated();
        onClose();
      } else {
        const contentType = response.headers.get('content-type');
        if (contentType?.includes('application/json')) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to create post.');
        } else {
          throw new Error(`Server error (${response.status}).`);
        }
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999] p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-slate-950 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-cyan-800 shadow-2xl">
        <div className="sticky top-0 bg-slate-950 border-b border-slate-700 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-cyan-400">Create New Ad Placement</h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-900/50 text-red-300 rounded-lg text-sm border border-red-700">
              {error}
            </div>
          )}

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Ad Placement Image <span className="text-red-500">*</span>
            </label>
            <div
              className="border-2 border-dashed border-slate-700 rounded-xl p-6 text-center cursor-pointer hover:border-cyan-500 transition-colors bg-slate-900"
              onClick={() => imageInputRef.current?.click()}
            >
              {imagePreview ? (
                <div className="flex flex-col items-center">
                  <img
                    src={imagePreview}
                    alt="Image preview"
                    className="max-w-full max-h-32 object-contain rounded mb-2"
                  />
                  <p className="text-sm text-cyan-300 truncate max-w-xs">{imageFile?.name}</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <UploadIcon className="w-10 h-10 text-cyan-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">
                    Click to upload (JPG, PNG, WEBP)
                  </p>
                </div>
              )}
              <input
                type="file"
                ref={imageInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
                aria-label="Upload ad image"
              />
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="title">
              Title
            </label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Grand Boulevard Digital Screen"
              required
              className="rounded-xl border-slate-700 bg-slate-800 text-white"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="description">
              Description
            </label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Detailed description of the placement size, traffic, and specs."
              required
              className="rounded-xl min-h-32 border-slate-700 bg-slate-800 text-white"
            />
          </div>

          {/* Category & Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="category">
                Category
              </label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-800 text-white focus:border-cyan-400 focus:outline-none appearance-none"
                >
                  {services.map((service) => (
                    <option
                      key={service._id}
                      value={service._id}
                      className="bg-slate-800 text-white"
                    >
                      {service.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2" htmlFor="priceRange">
                Price Range (د.ج / month)
              </label>
              <div className="relative">
                <span
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg font-medium"
                  aria-hidden="true"
                >
                  د.ج
                </span>
                <Input
                  id="priceRange"
                  name="priceRange"
                  value={formData.priceRange}
                  onChange={handleChange}
                  placeholder="10 000 - 50 000"
                  required
                  className="pl-10 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-800 text-white"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Montants en dinars algériens (e.g., <code className="bg-slate-800 px-1 rounded">20 000 - 100 000</code>)
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-800">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1 rounded-xl bg-slate-800 text-gray-400 hover:bg-slate-700 border-slate-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white rounded-xl flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5 mr-2" />
                  Publish Placement
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}