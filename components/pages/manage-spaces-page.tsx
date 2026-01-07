'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Sidebar, SidebarProvider } from '@/components/ui/sidebar'
import Navbar from '@/components/ui/navbar'
import { Plus, MoreVertical } from 'lucide-react'
import { postsService } from '@/lib/services/posts-service'
import { useAuth } from '@/contexts/auth-context'
import { useToast } from '@/components/ui/use-toast'

export default function ManageSpacesPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [showMenu, setShowMenu] = useState<number | null>(null)
  const [adSpaces, setAdSpaces] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchSpaces = async () => {
      if (!user) return

      try {
        const postsResponse = await postsService.getAllPosts({ agencyId: user.id })
        const agencyPosts = postsResponse.posts || []
        
        const formattedSpaces = agencyPosts.map((post: any) => ({
          id: post._id,
          image: post.images && post.images.length > 0 ? post.images[0] : '',
          title: post.title,
          description: post.description,
          status: 'Available', // Assuming default, or check if booked
          statusColor: 'bg-green-100 text-green-700', // Logic for status color
          price: `$${post.price}`,
          period: '/ mo' // Assuming monthly or from data
        }))
        setAdSpaces(formattedSpaces)
      } catch (error) {
        console.error('Failed to fetch spaces:', error)
        toast({
          title: "Error",
          description: "Failed to load advertising spaces.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (user && user.role === 'agency') {
      fetchSpaces()
    }
  }, [user, toast])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this space?')) return

    try {
      await postsService.deletePost(id)
      setAdSpaces(adSpaces.filter(space => space.id !== id))
      toast({
        title: "Success",
        description: "Advertising space deleted successfully.",
      })
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
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <nav className="text-sm text-slate-400 mb-2">
                  <Link href="/dashboard" className="hover:text-white">Dashboard</Link>
                  <span className="mx-2">/</span>
                  <span className="text-white font-medium">Manage Ad Spaces</span>
                </nav>
                <h1 className="text-3xl font-bold text-white">Manage Your Ad Spaces</h1>
              </div>
              <Link
                href="/add-space"
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-200"
              >
                <Plus className="w-5 h-5" />
                Add New Space
              </Link>
            </div>

            {/* Ad Spaces Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {adSpaces.length === 0 ? (
                <div className="col-span-full text-center py-12 text-slate-500">
                  No advertising spaces found. Click "Add New Space" to create one.
                </div>
              ) : (
                adSpaces.map((space) => (
                  <div key={space.id} className="bg-white/5 rounded-xl border border-white/10 overflow-hidden hover:border-blue-500/50 transition-colors group">
                    {/* Image */}
                    <div className="relative h-48 bg-slate-900">
                      <img
                        src={space.image || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%231e293b" width="400" height="300"/%3E%3Ctext fill="%2394a3b8" font-family="sans-serif" font-size="18" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3ENo Image%3C/text%3E%3C/svg%3E'}
                        alt={space.title}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%231e293b" width="400" height="300"/%3E%3Ctext fill="%2394a3b8" font-family="sans-serif" font-size="18" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EAd Space%3C/text%3E%3C/svg%3E'
                        }}
                      />
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-white mb-2">{space.title}</h3>
                      <p className="text-sm text-slate-400 mb-4 line-clamp-2">{space.description}</p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20`}>
                          {space.status}
                        </span>
                        <div className="text-right">
                          <span className="text-2xl font-bold text-white">{space.price}</span>
                          <span className="text-sm text-slate-500"> {space.period}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 pt-4 border-t border-white/10">
                        <Link
                          href={`/edit-space/${space.id}`}
                          className="flex-1 text-center px-4 py-2 text-sm font-medium text-blue-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(space.id)}
                          className="flex-1 text-center px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}