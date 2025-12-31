'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Search,
  MapPin,
  Star,
  ArrowLeft,
  Building2,
  DollarSign,
  Loader2,
  Filter,
  ChevronDown,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface AgencyDetail {
  agencyName: string;
  location?: string;
  email?: string;
}

interface Post {
  _id: string;
  title: string;
  description: string;
  imageURL?: string;
  priceRange: string;
  location?: string;
  agency: AgencyDetail;
}

interface CategoriesPageProps {
  _id: string;
  name: string;
}

interface PostsPageProps {
  category: CategoriesPageProps;
  onPostSelect: (post: Post, action: 'book' | 'profile') => void;
  onBack: () => void;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
const API_BASE_URL = `${BACKEND_URL.replace(/\/$/, '')}/api`;

const PostsPage = ({ category, onPostSelect, onBack }: PostsPageProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('relevance');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    handleSearch();
  }, [category?._id, sortBy]);

  const handleSearch = async () => {
    if (!category?._id) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({
        category: category._id,
        ...(searchQuery.trim() && { q: searchQuery.trim() }),
      });
      const res = await fetch(`${API_BASE_URL}/posts?${params}`);
      const data = await res.json();
      setPosts(data.posts || []);
    } catch (err) {
      console.error('Fetch failed:', err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = useMemo(() => {
    // Add client-side sorting if backend doesn’t support it yet
    return [...posts].sort((a, b) => {
      if (sortBy === 'price') {
        const extractNum = (range: string) => {
          const nums = range.match(/\d+/g)?.map(Number) || [0];
          return Math.min(...nums);
        };
        return extractNum(a.priceRange) - extractNum(b.priceRange);
      }
      if (sortBy === 'rating') {
        return 0; // Placeholder — would need rating field
      }
      return 0; // relevance (default order)
    });
  }, [posts, sortBy]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 p-4 md:p-6">
      {/* Back & Header */}
      <div className="max-w-7xl mx-auto">
        <button
          onClick={onBack}
          className="mb-4 flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
          aria-label="Back to categories"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Channels</span>
        </button>

        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-white">{category?.name || 'Placements'}</h1>
          <p className="text-gray-400 mt-2">
            Browse high-impact ad spaces from trusted Algerian agencies.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="bg-slate-900/60 backdrop-blur rounded-2xl border border-slate-800 p-5 shadow-xl mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search by title, location, or agency..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-12 pr-4 py-3 bg-slate-800/60 border-slate-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500"
              />
            </div>
            <Button
              onClick={handleSearch}
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-xl shadow-md hover:shadow-cyan-500/20"
            >
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>

          {/* Sort & Count */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-5 pt-5 border-t border-slate-800">
            <p className="text-sm text-gray-400">
              Showing <span className="font-medium text-white">{filteredPosts.length}</span>{' '}
              {filteredPosts.length === 1 ? 'placement' : 'placements'}
            </p>

            <div className="flex items-center gap-3 mt-3 sm:mt-0">
              <span className="text-sm text-gray-400 hidden sm:inline">Sort by:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-slate-800/60 border border-slate-700 text-gray-200 py-2 pl-4 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                >
                  <option value="relevance">Most Relevant</option>
                  <option value="price">Price: Low to High</option>
                  <option value="rating">Top Rated</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <Loader2 className="w-10 h-10 animate-spin text-cyan-500 mx-auto mb-4" />
              <p className="text-gray-400">Loading placements...</p>
            </div>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="max-w-2xl mx-auto bg-slate-900 rounded-2xl p-10 text-center shadow-xl border border-slate-800">
            <div className="mx-auto w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-5">
              <Building2 className="w-8 h-8 text-cyan-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No placements found</h3>
            <p className="text-gray-400 mb-6">
              Try a different search term or check back later — new agencies join daily.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setSortBy('relevance');
                handleSearch();
              }}
              className="border-cyan-700 text-cyan-400 hover:bg-cyan-900/20"
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <div
                key={post._id}
                className="group bg-slate-900/70 backdrop-blur border border-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Image */}
                <div className="h-48 overflow-hidden bg-slate-800 relative">
                  {post.imageURL ? (
                    <img
                      src={post.imageURL}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600">
                      <Building2 className="w-16 h-16" />
                    </div>
                  )}

                  {/* Agency Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-black/70 text-white text-xs rounded-full backdrop-blur-sm border border-slate-700">
                      {post.agency?.agencyName || 'Agency'}
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="absolute top-4 right-4 bg-black/70 px-3 py-1.5 rounded-full backdrop-blur-sm border border-yellow-700/50 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-bold text-white">4.8</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-cyan-400 transition-colors">
                    {post.title}
                  </h3>

                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    {post.description || 'No description provided.'}
                  </p>

                  {post.location && (
                    <div className="flex items-center gap-1.5 text-sm text-gray-400 mb-3">
                      <MapPin className="w-4 h-4" />
                      <span>{post.location}</span>
                    </div>
                  )}

                  {/* Price (Algerian Dinar) */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm font-medium text-gray-500">Price:</span>
                    <span className="text-lg font-bold text-cyan-400 flex items-center">
                      <span className="text-gray-400 mr-1">د.ج</span>
                      {post.priceRange?.replace(/[\$€]/g, '') || 'N/A'}
                    </span>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2 mt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 bg-slate-800/50 hover:bg-slate-800 border-slate-700 text-gray-300 hover:text-white"
                      onClick={() => onPostSelect(post, 'profile')}
                    >
                      View Agency
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white shadow-md"
                      onClick={() => onPostSelect(post, 'book')}
                    >
                      Book Now
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostsPage;