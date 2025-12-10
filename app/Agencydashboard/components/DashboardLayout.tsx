'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, LayoutGrid, FileText, Calendar, Settings, LogOut, Plus, Loader2, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PostFormModal } from './PostFormModal'; 
import OverviewSection from './OverviewSection';
import InventorySection from './InventorySection';
import BookingSection from './BookingSection';
import ProfileSection from './ProfileSection';
// Assuming you have an AgencyEditProfileModal component (now defined above)
import { AgencyEditProfileModal } from './AgencyEditProfileModal'; 

const API_BASE_URL = 'http://localhost:5000/api';

const AgencyDashboardLayout = () => {
    const router = useRouter();
    const [activeView, setActiveView] = useState('dashboard');
    const [agencyData, setAgencyData] = useState<any>(null);
    const [services, setServices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showPostModal, setShowPostModal] = useState(false);
    
    
    const [showEditProfileModal, setShowEditProfileModal] = useState(false); 

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        try {
            // Fetch Profile (GET /api/agencies/profile)
            const profileRes = await fetch(`${API_BASE_URL}/agencies/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const profileData = await profileRes.json();
            setAgencyData(profileData);

            // Fetch Services (GET /api/services)
            const servicesRes = await fetch(`${API_BASE_URL}/services`);
            const servicesData = await servicesRes.json();
            setServices(servicesData);

        } catch (error) {
            console.error('Error fetching data:', error);
            router.push('/login');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        router.push('/login');
    };
    
    const handleOpenEditProfileModal = () => {
        setShowEditProfileModal(true);
    };
    
   
    const handleProfileUpdateSuccess = () => {
        setShowEditProfileModal(false); // 1. Close modal
        fetchAllData(); // 2. Re-fetch data to update the UI
    };


    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
        { id: 'inventory', label: 'Inventory', icon: FileText },
        { id: 'bookings', label: 'Bookings', icon: Calendar },
        { id: 'profile', label: 'Profile', icon: Settings },
        { id: 'analytics', label: 'Analytics', icon: BarChart3, disabled: true },
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900">
                <Loader2 className="w-12 h-12 animate-spin text-cyan-400" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 text-white">
            {/* --- Top Navigation Header (Replaces Sidebar) --- */}
          <header className="bg-[#0a1628] shadow-2xl sticky top-0 z-40 border-b border-cyan-500/20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
           {/* Logo Section */}
<div className="flex items-center">
  <div className="relative group cursor-pointer">
    
    {/* Logo Container */}
    <div className="relative flex items-center space-x-2 bg-[#0f1a2e] px-4 py-2.5 rounded-xl border border-cyan-500/30">
      
      
      {/* Text Logo — Enhanced */}
      <div className="flex items-baseline space-x-1">
        {/* Decorated 'A' */}
        <span className="relative text-2xl font-bold">
          <span className="absolute -rotate-6 -translate-y-0.5 text-cyan-400 opacity-90 scale-110 z-10">
            A
          </span>
          <span className="text-transparent">A</span> {/* Invisible placeholder for spacing */}
        </span>

        {/* 'dBridge' — clean & modern */}
        <span className="text-2xl font-bold tracking-tight">
          <span className="text-gray-300">d</span>
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent">
            Bridge
          </span>
        </span>
      </div>
      
      {/* Decorative Dot */}
      <div className="w-2 h-2 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full animate-pulse"></div>
    </div>
  </div>
</div>

            {/* Navigation Items */}
            <nav className="flex items-center space-x-2">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveView(item.id)}
                        disabled={item.disabled}
                        className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            activeView === item.id
                                ? 'text-white bg-cyan-500/20 shadow-lg shadow-cyan-500/20'
                                : 'text-gray-400 hover:text-white hover:bg-cyan-500/10'
                        } ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {activeView === item.id && (
                            <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500"></span>
                        )}
                        {item.label}
                    </button>
                ))}
            </nav>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
                <Button
                    onClick={() => setShowPostModal(true)}
                    className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-5 py-2 rounded-lg shadow-lg shadow-cyan-500/30 transition-all hover:scale-105 hover:shadow-cyan-500/50 font-medium"
                >
                    <Plus className="w-4 h-4 mr-2" /> New Post
                </Button>
                
                <Button
                    onClick={handleLogout}
                    className="bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 px-4 py-2 rounded-lg border border-red-500/30 transition-all hover:border-red-500/50"
                >
                    <LogOut className="w-4 h-4" />
                </Button>
            </div>
        </div>
    </div>
</header>

            {/* Main Content Area */}
            <main className="max-w-7xl mx-auto p-8">
                {agencyData && (
                    <>
                        {activeView === 'dashboard' && <OverviewSection agencyData={agencyData} />}
                        {activeView === 'inventory' && <InventorySection agencyData={agencyData} services={services} onPostCreated={fetchAllData} />}
                        {activeView === 'bookings' && <BookingSection agencyData={agencyData} />}
                        
                        {/* PROFILE VIEW FIX: Passes the function to open the modal */}
                        {activeView === 'profile' && 
                            <ProfileSection 
                                agencyData={agencyData} 
                                onUpdate={handleProfileUpdateSuccess} // Success callback
                                onOpenEditModal={handleOpenEditProfileModal} // CRITICAL: Prop to open the modal
                            />
                        }
                        
                        {activeView === 'analytics' && (
                            <div className="bg-slate-950 rounded-2xl p-8 shadow-xl border border-slate-700">
                                <h2 className="text-2xl font-bold text-white mb-4">Analytics</h2>
                                <p className="text-gray-400">Analytics dashboard coming soon...</p>
                            </div>
                        )}
                    </>
                )}
            </main>

            {/* Post Creation Modal (Quick Action Target) */}
            {showPostModal && agencyData && (
                <PostFormModal 
                    agencyId={agencyData._id} 
                    services={services} 
                    onPostCreated={() => { fetchAllData(); setActiveView('inventory'); }} 
                    onClose={() => setShowPostModal(false)}
                />
            )}
            
            {/* --- Agency Profile Edit Modal (Conditional Render) --- */}
            {showEditProfileModal && agencyData && (
                <AgencyEditProfileModal
                    agencyData={agencyData}
                    onClose={() => setShowEditProfileModal(false)}
                    onUpdateSuccess={handleProfileUpdateSuccess}
                />
            )}
        </div>
    );
};

export default AgencyDashboardLayout;