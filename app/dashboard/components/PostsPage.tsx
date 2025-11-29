'use client';

import { useState, useEffect } from 'react';
import { Search, MapPin, Star, ArrowLeft, Building2, DollarSign } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Post {
  _id: string;
  title: string;
  description: string;
  imageURL?: string;
  priceRange: string;
  location?: string;
  agency: {
    agencyName: string;
    location: string;
    email: string;
  };
}

interface PostsPageProps {
  category: any;
  onPostSelect: (post: Post, action: 'book' | 'profile') => void;
  onBack: () => void;
}

const PostsPage = ({ category, onPostSelect, onBack }: PostsPageProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('relevance');

  useEffect(() => {
    fetchPosts();
  }, [category]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/posts?category=${category._id}`);
      const data = await response.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchPosts();
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/posts?category=${category._id}&q=${searchQuery}`
      );
      const data = await response.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center text-emerald-600 hover:text-emerald-700 mb-4 font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Categories
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{category.name} Agencies</h1>
        <p className="text-gray-600">Find and book the perfect agency for your next campaign.</p>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search by agency name, service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-12 pr-4 py-3 rounded-xl border-gray-200"
            />
          </div>
          <Button
            onClick={handleSearch}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 rounded-xl"
          >
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-600">
            Showing {filteredPosts.length} {filteredPosts.length === 1 ? 'agency' : 'agencies'} for '{category.name}'
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-200 text-sm focus:border-emerald-500 focus:outline-none"
            >
              <option value="relevance">Relevance</option>
              <option value="rating">Rating</option>
              <option value="price">Price</option>
            </select>
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
          <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-12 h-12 text-emerald-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No agencies found</h3>
          <p className="text-gray-600">Try adjusting your search or filters to find what you're looking for.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <div
              key={post._id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border-2 border-transparent hover:border-emerald-200"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden bg-gradient-to-br from-emerald-100 to-teal-100">
                {post.imageURL ? (
                  <img
                    src={post.imageURL}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Building2 className="w-20 h-20 text-emerald-300" />
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full shadow-lg">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-bold">4.8</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="mb-3">
                  <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors">
                    {post.title}
                  </h3>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Building2 className="w-3 h-3" />
                    <span>{post.agency?.agencyName || 'Agency'}</span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {post.description}
                </p>

                {post.location && (
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <MapPin className="w-4 h-4" />
                    <span>{post.location}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100">
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                  <span className="text-lg font-bold text-emerald-600">
                    {post.priceRange || '$2,500/week'}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={() => onPostSelect(post, 'profile')}
                    variant="outline"
                    className="flex-1 rounded-xl border-gray-200 hover:bg-gray-50"
                  >
                    View Profile
                  </Button>
                  <Button
                    onClick={() => onPostSelect(post, 'book')}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl"
                  >
                    Book Service
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostsPage;