'use client'

import { useState } from 'react'
import Link from 'next/link'
import Sidebar from '@/components/layout/sidebar'
import Navbar from '@/components/ui/navbar'
import { Upload, X } from 'lucide-react'

export default function AddSpacePage() {
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [formData, setFormData] = useState({
    title: '',
    type: 'Billboard',
    width: '',
    height: '',
    price: '',
    availability: 'Available',
    city: 'New York',
    address: '',
  })

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file))
      setSelectedImages([...selectedImages, ...newImages])
    }
  }

  const removeImage = (index: number) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Navbar />
        
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <nav className="text-sm text-slate-400 mb-2">
              <Link href="/dashboard" className="hover:text-blue-400 transition-colors">Dashboard</Link>
              <span className="mx-2">/</span>
              <Link href="/manage-spaces" className="hover:text-blue-400 transition-colors">Manage Spaces</Link>
              <span className="mx-2">/</span>
              <span className="text-white font-medium">Add New Space</span>
            </nav>

            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Add New Advertising Space</h1>
              <p className="text-slate-400">Fill in the details below to list a new advertising location.</p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Space Details */}
              <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-6 hover:border-white/20 transition-all">
                <h2 className="text-xl font-bold text-white mb-6">Space Details</h2>
                
                <div className="space-y-4">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Title</label>
                    <input
                      type="text"
                      placeholder="e.g., Downtown Main Street Billboard"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Type */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-2">Type</label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({...formData, type: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      >
                        <option>Billboard</option>
                        <option>Digital Screen</option>
                        <option>Bus Shelter</option>
                        <option>Transit Ad</option>
                      </select>
                    </div>

                    {/* Size */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">Size (in feet)</label>
                        <input
                          type="text"
                          placeholder="Width"
                          value={formData.width}
                          onChange={(e) => setFormData({...formData, width: e.target.value})}
                          className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2 opacity-0">Height</label>
                        <input
                          type="text"
                          placeholder="Height"
                          value={formData.height}
                          onChange={(e) => setFormData({...formData, height: e.target.value})}
                          className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Price */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-2">Price (per day)</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                        <input
                          type="text"
                          placeholder="250.00"
                          value={formData.price}
                          onChange={(e) => setFormData({...formData, price: e.target.value})}
                          className="w-full pl-8 pr-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                      </div>
                    </div>

                    {/* Availability */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-2">Availability</label>
                      <div className="flex items-center gap-6 pt-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="availability"
                            value="Available"
                            checked={formData.availability === 'Available'}
                            onChange={(e) => setFormData({...formData, availability: e.target.value})}
                            className="w-4 h-4 text-blue-500 focus:ring-blue-500"
                          />
                          <span className="text-sm text-slate-300">Available</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="availability"
                            value="Booked"
                            checked={formData.availability === 'Booked'}
                            onChange={(e) => setFormData({...formData, availability: e.target.value})}
                            className="w-4 h-4 text-blue-500 focus:ring-blue-500"
                          />
                          <span className="text-sm text-slate-300">Booked</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="availability"
                            value="Under Maintenance"
                            checked={formData.availability === 'Under Maintenance'}
                            onChange={(e) => setFormData({...formData, availability: e.target.value})}
                            className="w-4 h-4 text-blue-500 focus:ring-blue-500"
                          />
                          <span className="text-sm text-slate-300">Under Maintenance</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-6 hover:border-white/20 transition-all">
                <h2 className="text-xl font-bold text-white mb-6">Location</h2>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {/* City */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">City</label>
                    <select
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option>New York</option>
                      <option>Los Angeles</option>
                      <option>Chicago</option>
                      <option>Houston</option>
                    </select>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Address</label>
                    <input
                      type="text"
                      placeholder="e.g., 123 Main Street"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Map Placeholder */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Pin Location</label>
                  <div className="w-full h-64 bg-slate-800/30 rounded-lg border border-white/10 flex items-center justify-center">
                    <p className="text-slate-500">Map integration placeholder</p>
                  </div>
                </div>
              </div>

              {/* Media */}
              <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-6 hover:border-white/20 transition-all">
                <h2 className="text-xl font-bold text-white mb-6">Media</h2>
                
                {/* Upload Area */}
                <div className="border-2 border-dashed border-white/10 rounded-lg p-8 text-center mb-4 bg-slate-800/30 hover:border-white/20 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                    <p className="text-slate-400 mb-2">Drag & drop files here</p>
                    <p className="text-sm text-slate-500 mb-4">or</p>
                    <span className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">Browse files</span>
                  </label>
                </div>

                {/* Image Preview */}
                {selectedImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-4">
                    {selectedImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-white/10"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-4">
                <Link
                  href="/manage-spaces"
                  className="px-6 py-3 text-slate-300 font-semibold hover:bg-white/5 rounded-lg transition-colors"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white font-semibold rounded-lg shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-200"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}