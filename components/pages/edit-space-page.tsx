'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Sidebar, SidebarProvider } from '@/components/ui/sidebar'
import Navbar from '@/components/ui/navbar'
import { Upload, X } from 'lucide-react'

export default function EditSpacePage() {
  const [selectedImages, setSelectedImages] = useState<string[]>([
    '/billboard1.jpg',
    '/billboard2.jpg',
    '/billboard3.jpg'
  ])
  const [formData, setFormData] = useState({
    title: 'Downtown Digital Billboard',
    type: 'Billboard',
    city: 'Metropolis',
    address: '123 Main Street',
    availability: '2024-08-01 to 2024-09-30',
    latitude: '40.7128',
    longitude: '-74.0060',
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
    console.log('Form updated:', formData)
  }

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this space?')) {
      console.log('Space deleted')
    }
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        
        <div className="flex-1 flex flex-col">
          <Navbar />
          
          <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <nav className="text-sm text-gray-500 mb-2">
              <Link href="/dashboard" className="hover:text-gray-700">Dashboard</Link>
              <span className="mx-2">/</span>
              <Link href="/manage-spaces" className="hover:text-gray-700">Manage Spaces</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900 font-medium">Edit Space</span>
            </nav>

            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Advertising Space</h1>
              <p className="text-gray-600">Update the details for your advertising space below.</p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* General Information */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">General Information</h2>
                
                <div className="space-y-4">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* City */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                      />
                    </div>

                    {/* Address */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Space Specifications */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Space Specifications</h2>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                    >
                      <option>Billboard</option>
                      <option>Digital Screen</option>
                      <option>Bus Shelter</option>
                      <option>Transit Ad</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Size</label>
                    <input
                      type="text"
                      placeholder="e.g., 14x48"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Price (per week)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="text"
                        placeholder="1,500"
                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Availability</label>
                  <input
                    type="text"
                    value={formData.availability}
                    onChange={(e) => setFormData({...formData, availability: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                  />
                </div>
              </div>

              {/* Visuals & Location */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Visuals & Location</h2>
                
                {/* Image Gallery */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Image Gallery</label>
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    {selectedImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Space ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23e5e7eb" width="200" height="200"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="14" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EImage%3C/text%3E%3C/svg%3E'
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 p-1.5 bg-white hover:bg-red-500 text-gray-700 hover:text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    
                    {/* Add Image Button */}
                    <label htmlFor="add-image" className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-teal-500 hover:bg-teal-50 transition-colors">
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">Add Image</span>
                      <input
                        type="file"
                        id="add-image"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Map Coordinates */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Map Coordinates (Latitude)</label>
                    <input
                      type="text"
                      value={formData.latitude}
                      onChange={(e) => setFormData({...formData, latitude: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Map Coordinates (Longitude)</label>
                    <input
                      type="text"
                      value={formData.longitude}
                      onChange={(e) => setFormData({...formData, longitude: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-6 py-3 text-red-600 font-semibold hover:bg-red-50 rounded-lg transition-colors"
                >
                  Delete Space
                </button>
                
                <div className="flex items-center gap-4">
                  <Link
                    href="/manage-spaces"
                    className="px-6 py-3 text-gray-700 font-semibold hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-lg shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/30 transition-all duration-200"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}