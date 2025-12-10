'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, User, LogOut, Calendar, Home, Search as SearchIcon, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CategoriesPage from './components/CategoriesPage';
import PostsPage from './components/PostsPage';
import BookingPage from './components/BookingPage';
import ProfilePage from './components/ProfilePage';        // Used for viewing AGENCY profile
import MyBookingsPage from './components/MyBookingsPage';
import CompanyProfileSection from './components/CompanyProfileSection'; // NEW: For viewing own Company profile
import { CompanyEditProfileModal } from './components/CompanyEditProfileModal'; // NEW: For editing own Company profile

const API_BASE_URL = 'http://localhost:5000/api';

const CompanyDashboard = () => {
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState('categories');
    const [companyProfile, setCompanyProfile] = useState<any>(null);
    const [selectedCategory, setSelectedCategory] = useState<any>(null);
    const [selectedPost, setSelectedPost] = useState<any>(null);
    const [selectedAgency, setSelectedAgency] = useState<any>(null);
    const [showEditModal, setShowEditModal] = useState(false); // NEW: State for Edit Modal
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

            // GET /api/companies/profile
            const response = await fetch(`${API_BASE_URL}/companies/profile`, {
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
            // Assuming agency details are populated inside post.agency
            setSelectedAgency(post.agency);
            setCurrentPage('profile'); // Route to Agency Profile Page (ProfilePage.tsx)
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
            <div className="min-h-screen flex items-center justify-center bg-slate-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
                    <p className="mt-4 text-gray-400">Loading Company Profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 text-white">
            {/* Header - Styled to match the screenshot header */}
           <header className="bg-[#0a1628] shadow-2xl sticky top-0 z-40 border-b border-cyan-500/20">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex items-center justify-between h-16">
      
      {/* Logo Section — AdBridgeDZ with decorated "A" */}
      <div className="flex items-center">
        <div className="relative group cursor-pointer">
          
          
          {/* Logo Container */}
          <div className="relative flex items-center space-x-2 bg-[#0f1a2e] px-4 py-2.5 rounded-xl border border-cyan-500/30">
            {/* Icon */}
           
            {/* Text Logo: AdBridgeDZ with decorated "A" */}
            <div className="flex items-baseline space-x-1">
              {/* Decorated 'A' */}
              <span className="relative text-xl font-bold">
                <span className="absolute -rotate-6 -translate-y-0.5 text-cyan-400 opacity-90 scale-110 z-10">
                  A
                </span>
                <span className="text-transparent">A</span>
              </span>
              
              {/* 'dBridgeDZ' */}
              <span className="text-xl font-bold tracking-tight">
                <span className="text-gray-300">d</span>
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent">
                  BridgeDZ
                </span>
              </span>
            </div>

            {/* Decorative Pulse Dot */}
            <div className="w-2 h-2 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Navigation & Logout */}
      <nav className="flex items-center space-x-3">
        {['categories', 'mybookings', 'myprofile'].map((page) => {
          const labels: Record<string, string> = {
            categories: 'Explore',
            mybookings: 'Bookings',
            myprofile: 'Profile',
          };

          return (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                currentPage === page
                  ? 'text-white bg-cyan-500/20 shadow-lg shadow-cyan-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-cyan-500/10'
              }`}
            >
              {currentPage === page && (
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500"></span>
              )}
              {labels[page]}
            </button>
          );
        })}

        {/* Logout Button — Styled to match the theme */}
        <Button
          onClick={handleLogout}
          className="flex items-center bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 px-4 py-2 rounded-lg border border-red-500/30 transition-all hover:border-red-500/50"
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

                {/* Routing to Agency Profile (ProfilePage.tsx) */}
                {currentPage === 'profile' && selectedAgency && (
                    <ProfilePage
                        agency={selectedAgency}
                        onBack={handleBackToPosts}
                    />
                )}

                {currentPage === 'mybookings' && (
                    <MyBookingsPage />
                )}

                {/* --- Routing to Company's OWN Profile (CompanyProfileSection.tsx) --- */}
                {currentPage === 'myprofile' && companyProfile && (
                    <CompanyProfileSection
                        companyProfile={companyProfile}
                        // Pass a handler that opens the modal
                        onEditClick={() => setShowEditModal(true)}
                    />
                )}
            </main>

            {/* --- Global Edit Profile Modal --- */}
            {showEditModal && companyProfile && (
                <CompanyEditProfileModal
                    companyData={companyProfile}
                    onClose={() => setShowEditModal(false)}
                    // After successful update, close modal AND re-fetch the profile data
                    onUpdateSuccess={() => {
                        setShowEditModal(false);
                        fetchProfile();
                    }}
                />
            )}
        </div>
    );
};


export default CompanyDashboard;