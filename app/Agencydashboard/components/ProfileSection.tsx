'use client';

import { Mail, Phone, Globe, MapPin, Building2, Calendar, Users, Briefcase, Edit2, Facebook, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

interface ProfileSectionProps {
    agencyData: any;
    onUpdate: () => void;
    onOpenEditModal: () => void;
}

const API_BASE_URL = 'http://localhost:5000/api';

// --- Helper Components for Stability and Clean UI ---

// Detail Card - Consolidated background and clean layout
const ProfileDetailCard = ({ Icon, label, value }: { Icon: any, label: string, value: string | number | undefined }) => (
    <div className="bg-slate-900 p-4 rounded-lg border border-slate-700 hover:border-teal-500 transition-all">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-500/10 rounded-lg">
                <Icon className="w-5 h-5 text-teal-400" />
            </div>
            <div className="flex-1">
                <p className="text-xs text-slate-400 mb-1">{label}</p>
                <p className="text-sm font-medium text-white">{value || 'N/A'}</p>
            </div>
        </div>
    </div>
);

// Contact Detail List Item - Cleaned up spacing
const ProfileContactInfo = ({ Icon, label, value, isLink, linkPrefix }: any) => {
    const displayValue = value || 'N/A';
    return (
        <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-800 transition-colors">
            <div className="p-2 bg-teal-500/10 rounded-lg flex-shrink-0 mt-0.5">
                <Icon className="w-4 h-4 text-teal-400" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-400 mb-1">{label}</p>
                {isLink && displayValue !== 'N/A' ? (
                    <a 
                        href={`${linkPrefix}${displayValue}`} 
                        className="text-sm text-teal-400 hover:text-teal-300 transition-colors break-all"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {displayValue}
                    </a>
                ) : (
                    <p className="text-sm text-slate-200 break-words">{displayValue}</p>
                )}
            </div>
        </div>
    );
};

// Social Link Button - Fixed styling consistency
const SocialLink = ({ Icon, url, label, color }: any) => {
    if (!url) return null;
    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-white transition-all ${color}`}
        >
            <Icon className="w-4 h-4" />
            <span className="text-sm font-medium">{label}</span>
        </a>
    );
};

// --- Main Component ---
const ProfileSection = ({ agencyData, onUpdate, onOpenEditModal }: ProfileSectionProps) => {
    
    // Cloudinary URL Check: If agency.logo starts with http, use it directly
    const logoUrl = agencyData?.logo && agencyData.logo.startsWith('http') 
        ? agencyData.logo 
        : '/default-agency-logo.png';

    // Map of 58 Algerian Wilayas with coordinates (unchanged)
    const wilayaCoordinates: { [key: string]: { lat: number; lng: number } } = {
        'adrar': { lat: 27.8742, lng: -0.2841 }, 'chlef': { lat: 36.1647, lng: 1.3347 },
        'laghouat': { lat: 33.8069, lng: 2.8636 }, 'oum el bouaghi': { lat: 35.8753, lng: 7.1136 },
        'batna': { lat: 35.5559, lng: 6.1740 }, 'bejaia': { lat: 36.7525, lng: 5.0556 },
        'biskra': { lat: 34.8492, lng: 5.7245 }, 'bechar': { lat: 31.6233, lng: -2.2161 },
        'blida': { lat: 36.4804, lng: 2.8277 }, 'bouira': { lat: 36.3689, lng: 3.9014 },
        'tamanrasset': { lat: 22.7850, lng: 5.5228 }, 'tebessa': { lat: 35.4048, lng: 8.1244 },
        'tlemcen': { lat: 34.8786, lng: -1.3150 }, 'tiaret': { lat: 35.3708, lng: 1.3228 },
        'tizi ouzou': { lat: 36.7117, lng: 4.0492 }, 'algiers': { lat: 36.7538, lng: 3.0588 },
        'djelfa': { lat: 34.6702, lng: 3.2501 }, 'jijel': { lat: 36.8202, lng: 5.7667 },
        'setif': { lat: 36.1905, lng: 5.4122 }, 'saida': { lat: 34.8417, lng: 0.1460 },
        'skikda': { lat: 36.8769, lng: 6.9093 }, 'sidi bel abbes': { lat: 35.2111, lng: -0.6404 },
        'annaba': { lat: 36.9000, lng: 7.7667 }, 'guelma': { lat: 36.4626, lng: 7.4331 },
        'constantine': { lat: 36.3650, lng: 6.6147 }, 'medea': { lat: 36.2676, lng: 2.7532 },
        'mostaganem': { lat: 35.9380, lng: 0.0890 }, "m'sila": { lat: 35.7059, lng: 4.5425 },
        'mascara': { lat: 35.3969, lng: 0.1402 }, 'ouargla': { lat: 31.9491, lng: 5.3249 },
        'oran': { lat: 35.6976, lng: -0.6337 }, 'el bayadh': { lat: 33.6806, lng: 1.0167 },
        'illizi': { lat: 26.5083, lng: 8.4833 }, 'bordj bou arreridj': { lat: 36.0686, lng: 4.7686 },
        'boumerdes': { lat: 36.7564, lng: 3.4739 }, 'el tarf': { lat: 36.7672, lng: 8.3139 },
        'tindouf': { lat: 27.6750, lng: -8.1478 }, 'tissemsilt': { lat: 35.6075, lng: 1.8108 },
        'el oued': { lat: 33.3714, lng: 6.8519 }, 'khenchela': { lat: 35.4358, lng: 7.1433 },
        'souk ahras': { lat: 36.2863, lng: 7.9511 }, 'tipaza': { lat: 36.5894, lng: 2.4475 },
        'mila': { lat: 36.4503, lng: 6.2644 }, 'ain defla': { lat: 36.2639, lng: 1.9681 },
        'naama': { lat: 33.2672, lng: -0.3172 }, 'ain temouchent': { lat: 35.2994, lng: -1.1394 },
        'ghardaia': { lat: 32.4911, lng: 3.6708 }, 'relizane': { lat: 35.7372, lng: 0.5561 },
        'timimoun': { lat: 29.2631, lng: 0.2411 }, 'bordj badji mokhtar': { lat: 21.3306, lng: 0.9239 },
        'ouled djellal': { lat: 34.4142, lng: 4.9694 }, 'beni abbes': { lat: 30.1317, lng: -2.1667 },
        'in salah': { lat: 27.1936, lng: 2.4603 }, 'in guezzam': { lat: 19.5667, lng: 5.7667 },
        'touggourt': { lat: 33.1078, lng: 6.0581 }, 'djanet': { lat: 24.5542, lng: 9.4844 },
        "el m'ghair": { lat: 33.9542, lng: 5.9242 }, 'el menia': { lat: 30.5833, lng: 2.8833 }
    };

    // Initialize map when component mounts
    useEffect(() => {
        let mapInstance: any = null;

        const loadLeaflet = () => {
            if (!document.querySelector('link[href*="leaflet.css"]')) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
                document.head.appendChild(link);
            }
            if (!(window as any).L) {
                const script = document.createElement('script');
                script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
                script.onload = initializeMap;
                document.head.appendChild(script);
            } else {
                initializeMap();
            }
        };
        
        const initializeMap = () => {
            const L = (window as any).L;
            
            const mapElement = document.getElementById('agency-map');
            if (!L || !mapElement || mapElement.querySelector('.leaflet-container')) return;

            const city = agencyData?.city?.toLowerCase().trim() || '';
            const coords = wilayaCoordinates[city] || { lat: 36.7538, lng: 3.0588 };
            
            mapInstance = L.map('agency-map', {
                zoomControl: true, // Enable zoom controls
                attributionControl: false
            }).setView([coords.lat, coords.lng], 13);

            // Using dark tile layer
            L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                maxZoom: 19,
                subdomains: 'abcd'
            }).addTo(mapInstance);

            const customIcon = L.divIcon({
                className: 'custom-marker',
                html: `<div style="background: #14b8a6; width: 30px; height: 30px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 4px 12px rgba(20, 184, 166, 0.5);"></div>`,
                iconSize: [30, 30],
                iconAnchor: [15, 30],
            });

            L.marker([coords.lat, coords.lng], { icon: customIcon }).addTo(mapInstance)
             .bindPopup(`<b>${agencyData?.agencyName || 'Location'}</b><br>${agencyData?.city || 'Algeria'}`)
             .openPopup();
        };
        
        loadLeaflet();
        
        return () => {
            if (mapInstance) mapInstance.remove();
        };
    }, [agencyData?.city]);


    return (
        <div className="max-w-7xl mx-auto p-0 text-white">
            <div className="bg-slate-900 rounded-2xl shadow-xl border border-slate-700">
                <h1 className="text-3xl font-bold text-cyan-400 p-8 pb-0">Agency Profile</h1>
                
                {/* --- 1. Profile Card (Visual Header) --- */}
                <div className="p-8 pb-6 border-b border-slate-800">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <img 
                                src={logoUrl} 
                                alt={agencyData?.agencyName || 'Agency Logo'} 
                                className="w-24 h-24 rounded-2xl object-cover border-4 border-teal-400 shadow-lg bg-slate-950" 
                            />
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-1">{agencyData?.agencyName || 'Your Agency'}</h2>
                                <p className="text-teal-400 text-lg">{agencyData?.industry || 'Industry Not Set'}</p>
                                <p className="text-gray-400 text-sm">{agencyData?.email}</p>
                            </div>
                        </div>
                        
                        {/* Edit Button FIX */}
                        <Button 
                            onClick={onOpenEditModal} 
                            className="bg-teal-600 hover:bg-teal-700 px-6 py-3 rounded-xl transition-all"
                        >
                            <Edit2 className="w-4 h-4 mr-2" /> Edit Details
                        </Button>
                    </div>
                </div>
                
                {/* --- 2. Main Content Grid --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-8 pt-6">
                    
                    {/* Column 1: Map (Takes up full vertical space) */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-slate-900 rounded-xl p-4 border border-slate-700 h-full">
                            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-teal-400" />
                                Live Location
                            </h3>
                            {/* Map Container */}
                            <div 
                                id="agency-map" 
                                className="w-full h-80 rounded-lg shadow-inner shadow-black/50 border border-slate-600"
                            ></div>
                            <p className="text-sm text-gray-400 mt-3">{agencyData?.streetAddress || 'Address Not Set'}</p>
                        </div>
                    </div>
                    
                    {/* Column 2 & 3: Details and Socials */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* Company Details Block */}
                        <div className="bg-slate-900 rounded-xl p-6 border border-slate-700">
                            <h3 className="text-xl font-semibold text-white mb-4">Agency Details</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <ProfileDetailCard label="Industry" value={agencyData?.industry} Icon={Briefcase} />
                                <ProfileDetailCard label="Size" value={agencyData?.companySize} Icon={Users} />
                                <ProfileDetailCard label="Established" value={agencyData?.yearEstablished} Icon={Calendar} />
                                <ProfileDetailCard label="Registration No." value={agencyData?.businessRegistrationNumber} Icon={Building2} />
                            </div>
                        </div>

                        {/* Contact Information Block */}
                        <div className="bg-slate-900 rounded-xl p-6 border border-slate-700">
                            <h3 className="text-xl font-semibold text-white mb-4">Contact Info</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4">
                                <ProfileContactInfo Icon={Mail} label="Email" value={agencyData?.email} isLink={true} linkPrefix="mailto:" />
                                <ProfileContactInfo Icon={Phone} label="Phone" value={agencyData?.phoneNumber} isLink={true} linkPrefix="tel:" />
                                <ProfileContactInfo Icon={Globe} label="Website" value={agencyData?.websiteUrl} isLink={true} linkPrefix="http://" />
                            </div>
                        </div>

                        {/* Social Media Links */}
                        {(agencyData?.facebookUrl || agencyData?.linkedinUrl) && (
                            <div className="bg-slate-900 rounded-xl p-6 border border-slate-700">
                                <h3 className="text-xl font-semibold text-white mb-4">Social Media</h3>
                                <div className="flex flex-wrap gap-3">
                                    <SocialLink Icon={Facebook} url={agencyData?.facebookUrl} label="Facebook" color="bg-blue-600/10 border-blue-600/50 text-blue-400 hover:bg-blue-600/20" />
                                    <SocialLink Icon={Linkedin} url={agencyData?.linkedinUrl} label="LinkedIn" color="bg-blue-700/10 border-blue-700/50 text-blue-400 hover:bg-blue-700/20" />
                                </div>
                            </div>
                        )}
                        
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSection;