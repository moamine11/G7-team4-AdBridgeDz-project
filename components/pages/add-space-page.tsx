'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Sidebar, SidebarProvider } from '@/components/ui/sidebar'
import Navbar from '@/components/ui/navbar'
import { Upload, X } from 'lucide-react'

export default function AddSpacePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'Billboard',
    width: '',
    height: '',
    price: '',
    availability: 'Available',
    city: 'Algiers',
    address: '',
  })

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newFiles = Array.from(files)
      setImageFiles([...imageFiles, ...newFiles])
      const newImages = newFiles.map(file => URL.createObjectURL(file))
      setSelectedImages([...selectedImages, ...newImages])
    }
  }

  const removeImage = (index: number) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index))
    setImageFiles(imageFiles.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const postData = new FormData()
      postData.append('title', formData.title)
      postData.append('description', formData.description)
      postData.append('category', formData.type)
      postData.append('price', formData.price)
      postData.append('location', `${formData.address}, ${formData.city}`)
      postData.append('dimensions', `${formData.width}x${formData.height}`)
      // postData.append('availability', formData.availability) // If backend supports it

      imageFiles.forEach((file) => {
        postData.append('images', file)
      })

      await postsService.createPost(postData)
      
      toast({
        title: "Success",
        description: "Advertising space created successfully.",
      })
      
      router.push('/manage-spaces')
    } catch (error) {
      console.error('Failed to create space:', error)
      toast({
        title: "Error",
        description: "Failed to create advertising space.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
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
              <span className="text-gray-900 font-medium">Add New Space</span>
            </nav>

            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Advertising Space</h1>
              <p className="text-gray-600">Fill in the details below to list a new advertising location.</p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Space Details */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Space Details</h2>
                
                <div className="space-y-4">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                    <input
                      type="text"
                      placeholder="e.g., Downtown Main Street Billboard"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                    <textarea
                      placeholder="Describe the location, visibility, and audience..."
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors h-32"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Type */}
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
                        <option>Street Furniture</option>
                        <option>Airport</option>
                        <option>Stadium</option>
                      </select>
                    </div>

                    {/* Size */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Width (ft)</label>
                        <input
                          type="text"
                          placeholder="Width"
                          value={formData.width}
                          onChange={(e) => setFormData({...formData, width: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Height (ft)</label>
                        <input
                          type="text"
                          placeholder="Height"
                          value={formData.height}
                          onChange={(e) => setFormData({...formData, height: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Price */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Price (DZD per day)</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">DZD</span>
                        <input
                          type="number"
                          placeholder="25000"
                          value={formData.price}
                          onChange={(e) => setFormData({...formData, price: e.target.value})}
                          className="w-full pl-14 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                          required
                        />
                      </div>
                    </div>

                    {/* Availability */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Availability</label>
                      <div className="flex items-center gap-6 pt-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="availability"
                            value="Available"
                            checked={formData.availability === 'Available'}
                            onChange={(e) => setFormData({...formData, availability: e.target.value})}
                            className="w-4 h-4 text-teal-600 focus:ring-teal-500"
                          />
                          <span className="text-sm text-gray-700">Available</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="availability"
                            value="Booked"
                            checked={formData.availability === 'Booked'}
                            onChange={(e) => setFormData({...formData, availability: e.target.value})}
                            className="w-4 h-4 text-teal-600 focus:ring-teal-500"
                          />
                          <span className="text-sm text-gray-700">Booked</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Location</h2>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {/* City */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                    <select
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                    >
                      <option>Algiers</option>
                      <option>Oran</option>
                      <option>Constantine</option>
                      <option>Annaba</option>
                      <option>Blida</option>
                      <option>Setif</option>
                    </select>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                    <input
                      type="text"
                      placeholder="e.g., 123 Main Street"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                      required
                    />
                  </div>
                </div>

                {/* Map Placeholder */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Pin Location</label>
                  <div className="w-full h-64 bg-gradient-to-br from-blue-50 to-teal-50 rounded-lg border border-gray-300 flex items-center justify-center">
                    <p className="text-gray-400">Map integration placeholder</p>
                  </div>
                </div>
              </div>

              {/* Media */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Media</h2>
                
                {/* Upload Area */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Drag & drop files here</p>
                    <p className="text-sm text-gray-400 mb-4">or</p>
                    <span className="text-teal-600 hover:text-teal-700 font-semibold">Browse files</span>
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
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
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
                  className="px-6 py-3 text-gray-700 font-semibold hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-lg shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/30 transition-all duration-200 disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}