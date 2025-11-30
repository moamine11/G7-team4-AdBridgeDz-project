'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { Sidebar, SidebarProvider } from '@/components/ui/sidebar'
import Navbar from '@/components/ui/navbar'
import { Upload, X } from 'lucide-react'
import { postsService } from '@/lib/services/posts-service'
import { useToast } from '@/components/ui/use-toast'

export default function EditSpacePage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const id = params.id as string

  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'Billboard',
    width: '',
    height: '',
    price: '',
    availability: 'Available',
    city: '',
    address: '',
    latitude: '',
    longitude: '',
  })

  useEffect(() => {
    const fetchSpace = async () => {
      try {
        const post = await postsService.getPostById(id)
        const [width, height] = post.dimensions ? post.dimensions.split('x') : ['', '']
        const [address, city] = post.location ? post.location.split(', ') : ['', '']

        setFormData({
          title: post.title || '',
          description: post.description || '',
          type: post.category || 'Billboard',
          width: width || '',
          height: height || '',
          price: post.price || '',
          availability: 'Available', // Assuming default or from data
          city: city || '',
          address: address || '',
          latitude: '', // Assuming not in basic post object yet
          longitude: '',
        })
        
        if (post.images) {
          setSelectedImages(post.images)
        }
      } catch (error) {
        console.error('Failed to fetch space:', error)
        toast({
          title: "Error",
          description: "Failed to load advertising space details.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchSpace()
    }
  }, [id, toast])

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
    setIsSaving(true)

    try {
      const postData = new FormData()
      postData.append('title', formData.title)
      postData.append('description', formData.description)
      postData.append('category', formData.type)
      postData.append('price', formData.price)
      postData.append('location', `${formData.address}, ${formData.city}`)
      postData.append('dimensions', `${formData.width}x${formData.height}`)

      imageFiles.forEach((file) => {
        postData.append('images', file)
      })

      await postsService.updatePost(id, postData)
      
      toast({
        title: "Success",
        description: "Advertising space updated successfully.",
      })
      
      router.push('/manage-spaces')
    } catch (error) {
      console.error('Failed to update space:', error)
      toast({
        title: "Error",
        description: "Failed to update advertising space.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this space?')) return

    try {
      await postsService.deletePost(id)
      toast({
        title: "Success",
        description: "Advertising space deleted successfully.",
      })
      router.push('/manage-spaces')
    } catch (error) {
      console.error('Failed to delete space:', error)
      toast({
        title: "Error",
        description: "Failed to delete advertising space.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen bg-slate-950">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <Navbar />
            <main className="flex-1 p-8 flex justify-center items-center">
              <span className="loading loading-spinner loading-lg text-blue-500"></span>
            </main>
          </div>
        </div>
      </SidebarProvider>
    )
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-slate-950 text-slate-50">
        <Sidebar />
        
        <div className="flex-1 flex flex-col">
          <Navbar />
          
          <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <nav className="text-sm text-slate-400 mb-2">
              <Link href="/dashboard" className="hover:text-white">Dashboard</Link>
              <span className="mx-2">/</span>
              <Link href="/manage-spaces" className="hover:text-white">Manage Spaces</Link>
              <span className="mx-2">/</span>
              <span className="text-white font-medium">Edit Space</span>
            </nav>

            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Edit Advertising Space</h1>
              <p className="text-slate-400">Update the details for your advertising space below.</p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* General Information */}
              <div className="bg-white/5 rounded-xl border border-white/10 p-6 mb-6">
                <h2 className="text-xl font-bold text-white mb-6">General Information</h2>
                
                <div className="space-y-4">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors placeholder:text-slate-500"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors h-32 placeholder:text-slate-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* City */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-2">City</label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors placeholder:text-slate-500"
                      />
                    </div>

                    {/* Address */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-2">Address</label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors placeholder:text-slate-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Space Specifications */}
              <div className="bg-white/5 rounded-xl border border-white/10 p-6 mb-6">
                <h2 className="text-xl font-bold text-white mb-6">Space Specifications</h2>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
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

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Width (ft)</label>
                    <input
                      type="text"
                      value={formData.width}
                      onChange={(e) => setFormData({...formData, width: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors placeholder:text-slate-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Height (ft)</label>
                    <input
                      type="text"
                      value={formData.height}
                      onChange={(e) => setFormData({...formData, height: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors placeholder:text-slate-500"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Price (DZD per day)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">DZD</span>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="w-full pl-14 pr-4 py-3 bg-slate-900/50 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors placeholder:text-slate-500"
                    />
                  </div>
                </div>
              </div>

              {/* Visuals & Location */}
              <div className="bg-white/5 rounded-xl border border-white/10 p-6 mb-6">
                <h2 className="text-xl font-bold text-white mb-6">Visuals & Location</h2>
                
                {/* Image Gallery */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-300 mb-3">Image Gallery</label>
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    {selectedImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Space ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-white/10"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%231e293b" width="200" height="200"/%3E%3Ctext fill="%2394a3b8" font-family="sans-serif" font-size="14" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EImage%3C/text%3E%3C/svg%3E'
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 p-1.5 bg-slate-900/80 hover:bg-red-500 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    
                    {/* Add Image Button */}
                    <label htmlFor="add-image" className="w-full h-32 border-2 border-dashed border-white/10 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500/50 hover:bg-white/5 transition-colors">
                      <Upload className="w-8 h-8 text-slate-500 mb-2" />
                      <span className="text-sm text-slate-400">Add Image</span>
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
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Map Coordinates (Latitude)</label>
                    <input
                      type="text"
                      value={formData.latitude}
                      onChange={(e) => setFormData({...formData, latitude: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors placeholder:text-slate-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Map Coordinates (Longitude)</label>
                    <input
                      type="text"
                      value={formData.longitude}
                      onChange={(e) => setFormData({...formData, longitude: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors placeholder:text-slate-500"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-6 py-3 text-red-400 font-semibold hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  Delete Space
                </button>
                
                <div className="flex items-center gap-4">
                  <Link
                    href="/manage-spaces"
                    className="px-6 py-3 text-slate-300 font-semibold hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white font-semibold rounded-lg shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-200"
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