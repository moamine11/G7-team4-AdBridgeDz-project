'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Tag, Loader2, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PostFormModal } from './PostFormModal';
import { EditPostModal } from './EditPostModal';

interface PostData {
    _id: string;
    title: string;
    description: string;
    priceRange: string;
    category: { _id: string; name: string } | string;
    imageURL: string;
    isActive: boolean;
    location?: string;
}

interface InventorySectionProps {
    agencyData: any;
    services: any[];
    onPostCreated: () => void;
}

const API_BASE_URL = 'https://backend-se-7rkj.onrender.com/api';

const InventorySection = ({ agencyData, services, onPostCreated }: InventorySectionProps) => {
    const [posts, setPosts] = useState<PostData[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingPost, setEditingPost] = useState<PostData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPosts();
    }, [agencyData, onPostCreated]);

    const fetchPosts = async () => {
        if (!agencyData?._id) return;
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/agencies/posts/agency/${agencyData._id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.status === 404) {
                 setPosts([]);
            } else if (!response.ok) {
                 const errorData = await response.json();
                 throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            } else {
                 const data = await response.json();
                 setPosts(data.posts || []);
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
            alert('Failed to load posts. Check server connection.');
            setPosts([]);
        } finally {
            setLoading(false);
        }
    };
    
    const handleToggleActive = async (post: PostData) => {
        const newStatus = !post.isActive;
        const action = newStatus ? 'Reactivate' : 'Inactivate';
        if (!confirm(`Are you sure you want to ${action} this placement?`)) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/agencies/posts/${post._id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ isActive: newStatus }),
            });

            if (response.ok) {
                alert(`Post status updated to ${newStatus ? 'Available' : 'Inactive'}.`);
                fetchPosts();
            } else {
                const data = await response.json();
                throw new Error(data.error || 'Failed to update post status.');
            }

        } catch (error: any) {
            alert(error.message);
        }
    };

    const getCategoryName = (post: PostData) => {
        if (post.category && typeof post.category === 'object' && 'name' in post.category) {
            return post.category.name;
        }
        const service = services.find(s => s._id === post.category);
        return service ? service.name : 'Uncategorized';
    };

    const filteredPosts = posts.filter((post) => {
        const matchesSearch = post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'All' ||
            (statusFilter === 'Available' && post.isActive) ||
            (statusFilter === 'Inactive' && !post.isActive);
        return matchesSearch && matchesStatus;
    });

    // Helper to determine the final image source (Cloudinary URL is absolute)
    const getPostImageUrl = (imageURL: string) => {
        return imageURL && imageURL.startsWith('http') ? imageURL : `${API_BASE_URL}${imageURL}`;
    };


    return (
        <div>
            {/* Header (unchanged) */}
            <div className="flex items-center justify-between mb-8">
               
            </div>

            {/* Filters (unchanged) */}
            <div className="bg-slate-950 rounded-xl p-6 shadow-xl border border-slate-700 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                            type="text"
                            placeholder="Search by title or description..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 py-3 rounded-xl border-slate-700 bg-slate-900 text-white placeholder-gray-500"
                        />
                    </div>
                    <div className="flex gap-2">
                        {['All', 'Available', 'Inactive'].map((status) => (
                            <Button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`rounded-xl border-slate-700 ${
                                    statusFilter === status
                                        ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
                                        : 'bg-slate-800 hover:bg-slate-700 text-gray-300'
                                }`}
                            >
                                {status}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Posts Grid - Displaying your listings */}
            {loading ? (
                <div className="text-center py-12"><Loader2 className="w-12 h-12 animate-spin mx-auto text-cyan-400" /></div>
            ) : filteredPosts.length === 0 ? (
                <div className="bg-slate-950 rounded-xl p-12 shadow-xl border border-slate-700 text-center text-gray-400">
                    No ad placements found matching your filter.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPosts.map((post) => (
                        <div key={post._id} className="bg-slate-950 rounded-xl shadow-xl overflow-hidden border border-slate-700 hover:border-teal-500 transition-shadow">
                            <div className="relative h-48">
                                {/* FIX: Uses the unified URL helper */}
                                <img src={getPostImageUrl(post.imageURL)} alt={post.title} className="w-full h-full object-cover" />
                                <div className="absolute top-4 right-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                                        post.isActive ? 'bg-teal-900/70 text-teal-400 border-teal-700' : 'bg-red-900/70 text-red-400 border-red-700'
                                    }`}>
                                        {post.isActive ? 'Available' : 'Inactive'}
                                    </span>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="mb-2">
                                    <span className="text-xs font-medium text-cyan-400 uppercase flex items-center">
                                        <Tag className="w-3 h-3 mr-1" /> {getCategoryName(post)}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">{post.title}</h3>
                                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{post.description}</p>

                                <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                                    <div>
                                        <p className="text-2xl font-bold text-teal-400 flex items-center">
                                            <span className="inline-flex items-center gap-1 text-cyan-400">
  <span>د.ج</span>
  <span>{post.priceRange || 'N/A'}</span>
</span>
                                        </p>
                                        <p className="text-xs text-gray-500 flex items-center">
                                            <MapPin className="w-3 h-3 mr-1" /> {post.location || agencyData.city}
                                        </p>
                                    </div>
                                    {/* Action Buttons: Edit and Delete/Inactivate */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setEditingPost(post)} // Open Edit Modal
                                            className="p-2 rounded-lg bg-slate-800 text-cyan-400 hover:bg-slate-700 transition-colors"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleToggleActive(post)} // Toggle Status
                                            className={`p-2 rounded-lg ${post.isActive ? 'bg-red-900/50 text-red-400 hover:bg-red-900/70' : 'bg-teal-900/50 text-teal-400 hover:bg-teal-900/70'} transition-colors`}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal for Post Creation */}
            {showCreateModal && services.length > 0 && (
                <PostFormModal
                    agencyId={agencyData._id}
                    services={services}
                    onPostCreated={fetchPosts}
                    onClose={() => setShowCreateModal(false)}
                />
            )}

            {/* Modal for Post Editing (uses the new PUT endpoint) */}
            {editingPost && (
                <EditPostModal
                    post={editingPost}
                    services={services}
                    onPostUpdated={fetchPosts}
                    onClose={() => setEditingPost(null)}
                />
            )}
        </div>
    );
};

export default InventorySection;