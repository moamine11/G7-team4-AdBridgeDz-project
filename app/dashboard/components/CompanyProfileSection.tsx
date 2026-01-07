'use client';

import { Mail, Phone, Globe, MapPin, Building2, Calendar, Users, Briefcase, Edit2, Facebook, Linkedin, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

interface CompanyProfileSectionProps {
  companyProfile: any;
  onEditClick: () => void;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://backend-se-7rkj.onrender.com';
const API_BASE_URL = `${BACKEND_URL.replace(/\/$/, '')}/api`;


const ProfileDetailCard = ({ Icon, label, value }: { Icon: any, label: string, value: string | number | undefined }) => (
  <div className="group relative bg-[#0f1a2e] p-5 rounded-xl border border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-cyan-500/0 group-hover:from-cyan-500/5 group-hover:to-transparent transition-all duration-300"></div>
    <div className="relative flex items-center gap-4">
      <div className="p-3 bg-cyan-500/10 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
        <Icon className="w-5 h-5 text-cyan-400" />
      </div>
      <div className="flex-1">
        <p className="text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">{label}</p>
        <p className="text-base font-semibold text-white">{value || 'N/A'}</p>
      </div>
    </div>
  </div>
);

// Contact Detail List Item
const ProfileContactInfo = ({ Icon, label, value, isLink, linkPrefix }: any) => {
  const displayValue = value || 'N/A';
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-[#0f1a2e] transition-colors">
      <div className="p-2 bg-cyan-500/10 rounded-lg flex-shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-cyan-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide">{label}</p>
        {isLink && displayValue !== 'N/A' ? (
          <a 
            href={linkPrefix === '' ? (displayValue.startsWith('http') ? displayValue : `https://${displayValue}`) : `${linkPrefix}${displayValue}`}
            className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors break-all"
            target="_blank"
            rel="noopener noreferrer"
          >
            {displayValue}
          </a>
        ) : (
          <p className="text-sm text-gray-300 break-words">{displayValue}</p>
        )}
      </div>
    </div>
  );
};

// Social Link Button
const SocialLink = ({ Icon, url, label, color }: any) => {
  if (!url) return null;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${color}`}
    >
      <Icon className="w-4 h-4" />
      <span className="text-sm font-medium">{label}</span>
    </a>
  );
};

const CompanyProfileSection = ({ companyProfile, onEditClick }: CompanyProfileSectionProps) => {
  const logoUrl = companyProfile?.imageURL ? companyProfile.imageURL : '/default-company-logo.png';
  const companyName = companyProfile?.name || 'Your Company';
  const industrySector = companyProfile?.industrySector || 'Unknown';

  // Map of 58 Algerian Wilayas with coordinates
  const wilayaCoordinates: { [key: string]: { lat: number; lng: number } } = {
    'adrar': { lat: 27.8742, lng: -0.2841 },
    'chlef': { lat: 36.1647, lng: 1.3347 },
    'laghouat': { lat: 33.8069, lng: 2.8636 },
    'oum el bouaghi': { lat: 35.8753, lng: 7.1136 },
    'batna': { lat: 35.5559, lng: 6.1740 },
    'bejaia': { lat: 36.7525, lng: 5.0556 },
    'biskra': { lat: 34.8492, lng: 5.7245 },
    'bechar': { lat: 31.6233, lng: -2.2161 },
    'blida': { lat: 36.4804, lng: 2.8277 },
    'bouira': { lat: 36.3689, lng: 3.9014 },
    'tamanrasset': { lat: 22.7850, lng: 5.5228 },
    'tebessa': { lat: 35.4048, lng: 8.1244 },
    'tlemcen': { lat: 34.8786, lng: -1.3150 },
    'tiaret': { lat: 35.3708, lng: 1.3228 },
    'tizi ouzou': { lat: 36.7117, lng: 4.0492 },
    'algiers': { lat: 36.7538, lng: 3.0588 },
    'djelfa': { lat: 34.6702, lng: 3.2501 },
    'jijel': { lat: 36.8202, lng: 5.7667 },
    'setif': { lat: 36.1905, lng: 5.4122 },
    'saida': { lat: 34.8417, lng: 0.1460 },
    'skikda': { lat: 36.8769, lng: 6.9093 },
    'sidi bel abbes': { lat: 35.2111, lng: -0.6404 },
    'annaba': { lat: 36.9000, lng: 7.7667 },
    'guelma': { lat: 36.4626, lng: 7.4331 },
    'constantine': { lat: 36.3650, lng: 6.6147 },
    'medea': { lat: 36.2676, lng: 2.7532 },
    'mostaganem': { lat: 35.9380, lng: 0.0890 },
    "m'sila": { lat: 35.7059, lng: 4.5425 },
    'mascara': { lat: 35.3969, lng: 0.1402 },
    'ouargla': { lat: 31.9491, lng: 5.3249 },
    'oran': { lat: 35.6976, lng: -0.6337 },
    'el bayadh': { lat: 33.6806, lng: 1.0167 },
    'illizi': { lat: 26.5083, lng: 8.4833 },
    'bordj bou arreridj': { lat: 36.0686, lng: 4.7686 },
    'boumerdes': { lat: 36.7564, lng: 3.4739 },
    'el tarf': { lat: 36.7672, lng: 8.3139 },
    'tindouf': { lat: 27.6750, lng: -8.1478 },
    'tissemsilt': { lat: 35.6075, lng: 1.8108 },
    'el oued': { lat: 33.3714, lng: 6.8519 },
    'khenchela': { lat: 35.4358, lng: 7.1433 },
    'souk ahras': { lat: 36.2863, lng: 7.9511 },
    'tipaza': { lat: 36.5894, lng: 2.4475 },
    'mila': { lat: 36.4503, lng: 6.2644 },
    'ain defla': { lat: 36.2639, lng: 1.9681 },
    'naama': { lat: 33.2672, lng: -0.3172 },
    'ain temouchent': { lat: 35.2994, lng: -1.1394 },
    'ghardaia': { lat: 32.4911, lng: 3.6708 },
    'relizane': { lat: 35.7372, lng: 0.5561 },
    'timimoun': { lat: 29.2631, lng: 0.2411 },
    'bordj badji mokhtar': { lat: 21.3306, lng: 0.9239 },
    'ouled djellal': { lat: 34.4142, lng: 4.9694 },
    'beni abbes': { lat: 30.1317, lng: -2.1667 },
    'in salah': { lat: 27.1936, lng: 2.4603 },
    'in guezzam': { lat: 19.5667, lng: 5.7667 },
    'touggourt': { lat: 33.1078, lng: 6.0581 },
    'djanet': { lat: 24.5542, lng: 9.4844 },
    'el m\'ghair': { lat: 33.9542, lng: 5.9242 },
    'el menia': { lat: 30.5833, lng: 2.8833 }
  };

  // Initialize map when component mounts
  useEffect(() => {
    let mapInstance: any = null;

    const loadLeaflet = () => {
      // Load CSS
      if (!document.querySelector('link[href*="leaflet.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      // Load JS
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
      if (!L) return;

      const mapElement = document.getElementById('map');
      if (mapInstance) {
        mapInstance.remove();
        mapInstance = null;
      }

      if (!mapElement) return;

      const hasCoords =
        typeof companyProfile?.locationLat === 'number' &&
        typeof companyProfile?.locationLng === 'number' &&
        Number.isFinite(companyProfile.locationLat) &&
        Number.isFinite(companyProfile.locationLng);

      const location = companyProfile?.location?.toLowerCase().trim() || '';
      const coords = hasCoords
        ? { lat: companyProfile.locationLat, lng: companyProfile.locationLng }
        : wilayaCoordinates[location] || { lat: 36.7538, lng: 3.0588 };

      mapInstance = L.map('map', {
        zoomControl: true,
        attributionControl: false
      }).setView([coords.lat, coords.lng], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        subdomains: 'abc'
      }).addTo(mapInstance);

      const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="background: #06b6d4; width: 30px; height: 30px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 4px 12px rgba(6, 182, 212, 0.5);"></div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 30],
      });

      L.marker([coords.lat, coords.lng], { icon: customIcon }).addTo(mapInstance);
    };

    loadLeaflet();

    return () => {
      if (mapInstance) {
        mapInstance.remove();
      }
    };
  }, [companyProfile?.location]);

  return (
    <div className="min-h-screen bg-[#0a1628] p-6">
      {/* Main Profile Container */}
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Company Profile</h1>
        </div>

        {/* Profile Card Header - Enhanced */}
        <div className="relative overflow-hidden rounded-2xl bg-[#0f1a2e] border border-cyan-500/20 p-8 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
          
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col md:flex-row items-center gap-6 w-full md:w-auto">
              {/* Logo */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <img
                  src={logoUrl}
                  alt={companyName}
                  className="relative w-28 h-28 rounded-2xl object-cover border-4 border-cyan-500/50 shadow-2xl bg-[#0a1628] group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/default-company-logo.png';
                  }}
                />
              </div>
              
              {/* Company Info */}
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent mb-2">
                  {companyName}
                </h2>
                <p className="text-cyan-400 text-xl font-semibold mb-3 flex items-center gap-2 justify-center md:justify-start">
                  <Briefcase className="w-5 h-5" />
                  {industrySector}
                </p>
                <div className="flex items-center gap-4 flex-wrap justify-center md:justify-start">
                  <div className="flex items-center gap-2 bg-yellow-500/10 px-4 py-2 rounded-full border border-yellow-500/20">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-white text-lg">4.9</span>
                    <span className="text-gray-400 text-sm">(87)</span>
                  </div>
                  <div className="flex items-center gap-2 bg-cyan-500/10 px-4 py-2 rounded-full border border-cyan-500/20">
                    <Users className="w-4 h-4 text-cyan-400" />
                    <span className="text-white text-sm font-medium">Verified Company</span>
                  </div>
                </div>
              </div>
            </div>
            
            <Button
              onClick={onEditClick}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-8 py-4 rounded-xl shadow-2xl shadow-cyan-500/30 transition-all hover:scale-105 hover:shadow-cyan-500/50 font-semibold"
            >
              <Edit2 className="w-5 h-5 mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Location & Map - Full Width */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-[#0f1a2e] rounded-2xl border border-cyan-500/20 p-6 shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/5 rounded-full blur-2xl"></div>
              <h3 className="relative text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="p-2 bg-cyan-500/10 rounded-lg">
                  <MapPin className="w-6 h-6 text-cyan-400" />
                </div>
                Location
              </h3>
              
              {/* Interactive Map */}
              <div className="relative group mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                <div
                  id="map"
                  className="relative w-full h-96 rounded-xl overflow-hidden border-2 border-cyan-500/20 shadow-xl"
                ></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#0a1628] rounded-xl p-4 border border-cyan-500/10">
                  <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide">Location</p>
                  <p className="text-gray-200 font-semibold text-lg">
                    {companyProfile?.location || 'N/A'}
                  </p>
                </div>
                <div className="bg-[#0a1628] rounded-xl p-4 border border-cyan-500/10">
                  <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide">Country</p>
                  <p className="text-gray-200 font-semibold text-lg">Algeria</p>
                </div>
                <div className="bg-[#0a1628] rounded-xl p-4 border border-cyan-500/10">
                  <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide">Region</p>
                  <p className="text-gray-200 font-semibold text-lg">
                    {companyProfile?.location || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Company Details & Contact */}
          <div className="lg:col-span-3 space-y-6">
            {/* Company Details Block */}
            <div className="bg-[#0f1a2e] rounded-2xl border border-cyan-500/20 p-8 shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/5 rounded-full blur-2xl"></div>
              <h3 className="relative text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="p-2 bg-cyan-500/10 rounded-lg">
                  <Building2 className="w-6 h-6 text-cyan-400" />
                </div>
                Company Details
              </h3>
              <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <ProfileDetailCard Icon={Calendar} label="Founded" value={companyProfile?.yearEstablished} />
                <ProfileDetailCard Icon={Users} label="Team Size" value={companyProfile?.companySize} />
                <ProfileDetailCard Icon={Briefcase} label="Industry" value={companyProfile?.industrySector} />
                <ProfileDetailCard Icon={Globe} label="Type" value={companyProfile?.companyType} />
              </div>
            </div>

            {/* Contact Information Block */}
            <div className="bg-[#0f1a2e] rounded-2xl border border-cyan-500/20 p-8 shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 left-0 w-40 h-40 bg-cyan-500/5 rounded-full blur-2xl"></div>
              <h3 className="relative text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="p-2 bg-cyan-500/10 rounded-lg">
                  <Mail className="w-6 h-6 text-cyan-400" />
                </div>
                Contact Information
              </h3>
              <div className="relative grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#0a1628] rounded-xl p-4 border border-cyan-500/10">
                  <ProfileContactInfo
                    Icon={Mail}
                    label="Email"
                    value={companyProfile?.email}
                    isLink={true}
                    linkPrefix="mailto:"
                  />
                </div>
                <div className="bg-[#0a1628] rounded-xl p-4 border border-cyan-500/10">
                  <ProfileContactInfo
                    Icon={Phone}
                    label="Phone"
                    value={companyProfile?.phonenumber}
                    isLink={true}
                    linkPrefix="tel:"
                  />
                </div>
                <div className="bg-[#0a1628] rounded-xl p-4 border border-cyan-500/10">
                  <ProfileContactInfo
                    Icon={Globe}
                    label="Website"
                    value={companyProfile?.websiteURL}
                    isLink={true}
                    linkPrefix=""
                  />
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            {companyProfile?.socialMedia && (
              <div className="bg-[#0f1a2e] rounded-2xl border border-cyan-500/20 p-8 shadow-2xl overflow-hidden relative">
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/5 rounded-full blur-2xl"></div>
                <h3 className="relative text-2xl font-bold text-white mb-6">Social Media</h3>
                <div className="relative flex flex-wrap gap-3">
                  <SocialLink
                    Icon={Facebook}
                    url={companyProfile.socialMedia.facebook}
                    label="Facebook"
                    color="bg-blue-500/10 border-blue-500/50 text-blue-400 hover:bg-blue-500/20"
                  />
                  <SocialLink
                    Icon={Linkedin}
                    url={companyProfile.socialMedia.linkedin}
                    label="LinkedIn"
                    color="bg-blue-600/10 border-blue-600/50 text-blue-400 hover:bg-blue-600/20"
                  />
                  {companyProfile.socialMedia.twitter && (
                    <SocialLink
                      Icon={Globe}
                      url={companyProfile.socialMedia.twitter}
                      label="Twitter"
                      color="bg-sky-500/10 border-sky-500/50 text-sky-400 hover:bg-sky-500/20"
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfileSection;