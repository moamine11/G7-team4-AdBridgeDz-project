'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, User, LogOut, Calendar, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CategoriesPage from './components/CategoriesPage';
import PostsPage from './components/PostsPage';
import BookingPage from './components/BookingPage';
import ProfilePage from './components/ProfilePage';
import MyBookingsPage from './components/MyBookingsPage';

const CompanyDashboard = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState('categories');
  const [companyProfile, setCompanyProfile] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [selectedAgency, setSelectedAgency] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch('http://localhost:5000/api/companies/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      setCompanyProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const handleCategorySelect = (category: any) => {
    setSelectedCategory(category);
    setCurrentPage('posts');
  };

  const handlePostSelect = (post: any, action: 'book' | 'profile') => {
    setSelectedPost(post);
    if (action === 'book') {
      setCurrentPage('booking');
    } else {
      setSelectedAgency(post.agency);
      setCurrentPage('profile');
    }
  };

  const handleBackToCategories = () => {
    setCurrentPage('categories');
    setSelectedCategory(null);
  };

  const handleBackToPosts = () => {
    setCurrentPage('posts');
    setSelectedPost(null);
    setSelectedAgency(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">AgencyFinder</h1>
                <p className="text-xs text-gray-500">Find Your Next Advertising Partner</p>
              </div>
            </div>

            <nav className="flex items-center space-x-6">
              <button
                onClick={() => setCurrentPage('categories')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  currentPage === 'categories'
                    ? 'text-emerald-700 bg-emerald-50 font-medium'
                    : 'text-gray-600 hover:text-emerald-600'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </button>
              <button
                onClick={() => setCurrentPage('mybookings')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  currentPage === 'mybookings'
                    ? 'text-emerald-700 bg-emerald-50 font-medium'
                    : 'text-gray-600 hover:text-emerald-600'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>My Bookings</span>
              </button>
              <button
                onClick={() => setCurrentPage('myprofile')}
                className="flex items-center space-x-2 text-gray-700 hover:text-emerald-600 px-4 py-2 rounded-lg transition-colors"
              >
                <User className="w-4 h-4" />
                <span className="font-medium">{companyProfile?.name || 'Profile'}</span>
              </button>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="flex items-center border-emerald-200 text-emerald-700 hover:bg-emerald-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentPage === 'categories' && (
          <CategoriesPage onCategorySelect={handleCategorySelect} />
        )}
        
        {currentPage === 'posts' && selectedCategory && (
          <PostsPage
            category={selectedCategory}
            onPostSelect={handlePostSelect}
            onBack={handleBackToCategories}
          />
        )}
        
        {currentPage === 'booking' && selectedPost && (
          <BookingPage
            post={selectedPost}
            onBack={handleBackToPosts}
            onSuccess={() => setCurrentPage('mybookings')}
          />
        )}
        
        {currentPage === 'profile' && selectedAgency && (
          <ProfilePage
            agency={selectedAgency}
            onBack={handleBackToPosts}
          />
        )}
        
        {currentPage === 'mybookings' && (
          <MyBookingsPage />
        )}
        
        {currentPage === 'myprofile' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">My Profile</h2>
              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  {companyProfile?.imageURL ? (
                    <img
                      src={companyProfile.imageURL}
                      alt={companyProfile.name}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center">
                      <Building2 className="w-12 h-12 text-emerald-600" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{companyProfile?.name}</h3>
                    <p className="text-gray-600">{companyProfile?.industrySector}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-gray-900 mt-1">{companyProfile?.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone</label>
                    <p className="text-gray-900 mt-1">{companyProfile?.phonenumber || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Location</label>
                    <p className="text-gray-900 mt-1">{companyProfile?.location || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Company Size</label>
                    <p className="text-gray-900 mt-1">{companyProfile?.companySize || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Website</label>
                    <p className="text-gray-900 mt-1">
                      {companyProfile?.websiteURL ? (
                        <a href={companyProfile.websiteURL} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
                          {companyProfile.websiteURL}
                        </a>
                      ) : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Year Established</label>
                    <p className="text-gray-900 mt-1">{companyProfile?.yearEstablished || 'N/A'}</p>
                  </div>
                </div>

                {companyProfile?.socialMedia && (
                  <div className="pt-6 border-t border-gray-100">
                    <label className="text-sm font-medium text-gray-500 block mb-3">Social Media</label>
                    <div className="flex gap-4">
                      {companyProfile.socialMedia.facebook && (
                        <a
                          href={companyProfile.socialMedia.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-600 hover:text-emerald-700"
                        >
                          Facebook
                        </a>
                      )}
                      {companyProfile.socialMedia.linkedin && (
                        <a
                          href={companyProfile.socialMedia.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-600 hover:text-emerald-700"
                        >
                          LinkedIn
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CompanyDashboard;