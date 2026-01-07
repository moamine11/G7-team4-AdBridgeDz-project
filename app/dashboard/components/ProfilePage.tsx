'use client';

import {
  ArrowLeft,
  Mail,
  Phone,
  Globe,
  MapPin,
  Building2,
  Calendar,
  Users,
  Briefcase,
  Facebook,
  Linkedin,
  Star,
  Edit2,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

interface ProfilePageProps {
  agency: any; // This is the *shallow* agency object from post.agency (or post itself)
  onBack: () => void;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
const API_BASE_URL = `${BACKEND_URL.replace(/\/$/, '')}/api`;

// --- Helper Components (Enhanced Design) ---
const ProfileDetailCard = ({
  Icon,
  label,
  value,
}: {
  Icon: any;
  label: string;
  value: string | number | undefined;
}) => (
  <div className="group relative bg-gradient-to-br from-slate-800 to-slate-900 p-5 rounded-xl border border-slate-700/50 hover:border-teal-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/10 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-teal-500/0 to-teal-500/0 group-hover:from-teal-500/5 group-hover:to-transparent transition-all duration-300"></div>
    <div className="relative flex items-center gap-4">
      <div className="p-3 bg-gradient-to-br from-teal-500/20 to-cyan-500/10 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
        <Icon className="w-5 h-5 text-teal-400" />
      </div>
      <div className="flex-1">
        <p className="text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wide">{label}</p>
        <p className="text-base font-semibold text-white">{value || 'N/A'}</p>
      </div>
    </div>
  </div>
);

const ProfileContactInfo = ({
  Icon,
  label,
  value,
  isLink,
  linkPrefix,
}: any) => {
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
            href={
              linkPrefix === 'https://'
                ? displayValue.startsWith('http')
                  ? displayValue
                  : `https://${displayValue}`
                : `${linkPrefix}${displayValue}`
            }
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

// --- Main Component ---
const ProfilePage = ({ agency: shallowAgency, onBack }: ProfilePageProps) => {
  const [fullAgency, setFullAgency] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Extract agency ID safely: could be agency._id (from post) or agency.agency._id
  const agencyId =
    shallowAgency?._id ||
    shallowAgency?.agency?._id ||
    (shallowAgency?.post?.agency?._id as string) ||
    '';

  useEffect(() => {
    if (!agencyId) {
      // Fallback: use shallow data immediately (not ideal, but safe)
      setFullAgency(shallowAgency);
      setLoading(false);
      return;
    }

    const fetchFullAgency = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE_URL}/agencies/new/${agencyId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (res.ok) {
          const data = await res.json();
          setFullAgency(data);
        } else {
          // Fallback to shallow data if full fetch fails
          setFullAgency(shallowAgency);
        }
      } catch (err) {
        console.error('Failed to fetch full agency:', err);
        setFullAgency(shallowAgency);
      } finally {
        setLoading(false);
      }
    };

    fetchFullAgency();
  }, [agencyId, shallowAgency]);

  // Use fullAgency if available, else fallback
  const agency = fullAgency || shallowAgency;

  // Logo handling
  const logoUrl =
    agency?.logo && agency.logo.startsWith('http')
      ? agency.logo
      : agency?.agency?.logo && agency.agency.logo.startsWith('http')
      ? agency.agency.logo
      : '/default-agency-logo.png';

  const agencyName = agency?.agencyName || agency?.agency?.agencyName || 'Your Agency';
  const industry = agency?.industry || agency?.agency?.industry || 'Unknown';

  const servicesOffered = Array.isArray(agency?.servicesOffered)
    ? agency.servicesOffered.map((s: any) => s.name || s)
    : Array.isArray(agency?.agency?.servicesOffered)
    ? agency.agency.servicesOffered.map((s: any) => s.name || s)
    : [];

  // Map Coordinates
  const wilayaCoordinates: { [key: string]: { lat: number; lng: number } } = {
    adrar: { lat: 27.8742, lng: -0.2841 },
    chlef: { lat: 36.1647, lng: 1.3347 },
    algiers: { lat: 36.7538, lng: 3.0588 },
    // ... add more if needed (or keep fallback to Algiers)
  };

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

      const rawLat = agency?.locationLat ?? agency?.agency?.locationLat;
      const rawLng = agency?.locationLng ?? agency?.agency?.locationLng;
      const hasCoords =
        typeof rawLat === 'number' &&
        typeof rawLng === 'number' &&
        Number.isFinite(rawLat) &&
        Number.isFinite(rawLng);

      const city = (agency?.city || agency?.agency?.city || 'algiers')
        .toLowerCase()
        .trim();

      const coords = hasCoords
        ? { lat: rawLat, lng: rawLng }
        : wilayaCoordinates[city] || { lat: 36.7538, lng: 3.0588 };

      mapInstance = L.map('map', {
        zoomControl: true,
        attributionControl: false,
      }).setView([coords.lat, coords.lng], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        subdomains: 'abc'
      }).addTo(mapInstance);

      const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="background: #14b8a6; width: 30px; height: 30px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 4px 12px rgba(20, 184, 166, 0.5);"></div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 30],
      });

      L.marker([coords.lat, coords.lng], { icon: customIcon }).addTo(mapInstance);
    };

    if (!loading) {
      loadLeaflet();
    }

    return () => {
      if (mapInstance) {
        mapInstance.remove();
      }
    };
  }, [agency?.city, agency?.agency?.city, loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-teal-400 mx-auto mb-4" />
          <p className="text-white">Loading agency profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center text-teal-400 hover:text-teal-300 mb-6 font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Listings
      </button>

      {/* Main Profile Container */}
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Profile Card (Header) - Enhanced */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-teal-500/20 p-8 shadow-2xl backdrop-blur-sm">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"></div>
          
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col md:flex-row items-center gap-6 w-full md:w-auto">
              {/* Logo Display - Enhanced */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <img
                  src={logoUrl}
                  alt={agencyName}
                  className="relative w-28 h-28 rounded-2xl object-cover border-4 border-teal-500/50 shadow-2xl bg-slate-800 group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/default-agency-logo.png';
                  }}
                />
              </div>
              
              {/* Agency Info - Enhanced */}
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-white via-teal-100 to-white bg-clip-text text-transparent mb-2">
                  {agencyName}
                </h2>
                <p className="text-teal-400 text-xl font-semibold mb-3 flex items-center gap-2 justify-center md:justify-start">
                  <Briefcase className="w-5 h-5" />
                  {industry}
                </p>
                <div className="flex items-center gap-4 flex-wrap justify-center md:justify-start">
                  <div className="flex items-center gap-2 bg-yellow-500/10 px-4 py-2 rounded-full border border-yellow-500/20">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-white text-lg">4.8</span>
                    <span className="text-gray-400 text-sm">(124)</span>
                  </div>
                  <div className="flex items-center gap-2 bg-teal-500/10 px-4 py-2 rounded-full border border-teal-500/20">
                    <Users className="w-4 h-4 text-teal-400" />
                    <span className="text-white text-sm font-medium">Verified Agency</span>
                  </div>
                </div>
              </div>
            </div>
            
            <Button className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white px-8 py-4 rounded-xl shadow-2xl shadow-teal-500/30 transition-all hover:scale-105 hover:shadow-teal-500/50 font-semibold">
              <Edit2 className="w-5 h-5 mr-2" /> View Dashboard
            </Button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Column 1: Location & Map - Enhanced */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl border border-teal-500/20 p-6 shadow-2xl backdrop-blur-sm overflow-hidden relative">
              <div className="absolute top-0 right-0 w-40 h-40 bg-teal-500/5 rounded-full blur-2xl"></div>
              <h3 className="relative text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-teal-500/20 to-cyan-500/10 rounded-lg">
                  <MapPin className="w-6 h-6 text-teal-400" />
                </div>
                Location
              </h3>
              <div className="relative bg-slate-800/50 rounded-xl p-4 mb-6 border border-slate-700/50">
                <p className="text-gray-200 font-semibold text-lg mb-1">
                  {agency?.city || agency?.agency?.city || 'City Not Set'}
                </p>
                <p className="text-gray-400 text-sm">
                  {agency?.country || agency?.agency?.country || 'Algeria'}
                </p>
              </div>
              
              {/* Interactive Map with border glow */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                <div
                  id="map"
                  className="relative w-full h-72 rounded-xl overflow-hidden border-2 border-slate-700/50 shadow-xl"
                ></div>
              </div>
              
              {(agency?.streetAddress || agency?.agency?.streetAddress) && (
                <div className="mt-4 p-3 bg-slate-800/30 rounded-lg border border-slate-700/30">
                  <p className="text-sm text-gray-300 flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                    {agency.streetAddress || agency.agency.streetAddress}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Column 2 & 3: Details and Contact */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section - Enhanced */}
            {(agency?.profileDescription || agency?.agency?.profileDescription) && (
              <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl border border-teal-500/20 p-8 shadow-2xl backdrop-blur-sm overflow-hidden">
                <div className="absolute top-0 left-0 w-40 h-40 bg-purple-500/5 rounded-full blur-2xl"></div>
                <h3 className="relative text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-teal-500/20 to-cyan-500/10 rounded-lg">
                    <Building2 className="w-6 h-6 text-teal-400" />
                  </div>
                  Agency Overview
                </h3>
                <div className="relative bg-slate-800/30 rounded-xl p-6 border border-slate-700/30">
                  <p className="text-gray-200 leading-relaxed text-base">
                    {agency.profileDescription || agency.agency.profileDescription}
                  </p>
                </div>
              </div>
            )}

            {/* Company Details Block */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl border border-teal-500/20 p-8 shadow-2xl backdrop-blur-sm overflow-hidden relative">
              <div className="absolute top-0 right-0 w-40 h-40 bg-teal-500/5 rounded-full blur-2xl"></div>
              <h3 className="relative text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-teal-500/20 to-cyan-500/10 rounded-lg">
                  <Building2 className="w-6 h-6 text-teal-400" />
                </div>
                Agency Details
              </h3>
              <div className="relative grid grid-cols-1 md:grid-cols-2 gap-4">
                <ProfileDetailCard
                  Icon={Calendar}
                  label="Year Established"
                  value={agency?.yearEstablished || agency?.agency?.yearEstablished}
                />
                <ProfileDetailCard
                  Icon={Users}
                  label="Company Size"
                  value={agency?.companySize || agency?.agency?.companySize}
                />
                <ProfileDetailCard Icon={Briefcase} label="Industry" value={industry} />
                <ProfileDetailCard
                  Icon={Globe}
                  label="Reg. Number"
                  value={
                    agency?.businessRegistrationNumber || agency?.agency?.businessRegistrationNumber || 'N/A'
                  }
                />
              </div>
            </div>

            {/* Services Offered - Enhanced */}
            {servicesOffered.length > 0 && (
              <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl border border-teal-500/20 p-8 shadow-2xl backdrop-blur-sm overflow-hidden">
                <div className="absolute bottom-0 right-0 w-40 h-40 bg-cyan-500/5 rounded-full blur-2xl"></div>
                <h3 className="relative text-2xl font-bold text-white mb-6">Specialties</h3>
                <div className="relative flex flex-wrap gap-3">
                  {servicesOffered.map((service: string, index: number) => (
                    <span
                      key={index}
                      className="group px-5 py-3 bg-gradient-to-br from-teal-900/40 to-teal-900/20 text-teal-300 rounded-xl text-sm font-semibold border border-teal-600/30 hover:border-teal-500/60 hover:from-teal-900/60 hover:to-teal-900/40 transition-all duration-300 shadow-lg hover:shadow-teal-500/20 hover:scale-105 cursor-default"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Information Block */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl border border-teal-500/20 p-8 shadow-2xl backdrop-blur-sm overflow-hidden relative">
              <div className="absolute top-0 left-0 w-40 h-40 bg-purple-500/5 rounded-full blur-2xl"></div>
              <h3 className="relative text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-teal-500/20 to-cyan-500/10 rounded-lg">
                  <Mail className="w-6 h-6 text-teal-400" />
                </div>
                Contact Information
              </h3>
              <div className="relative space-y-2">
                <ProfileContactInfo
                  Icon={Mail}
                  label="Email"
                  value={agency?.email || agency?.agency?.email}
                  isLink={true}
                  linkPrefix="mailto:"
                />
                <ProfileContactInfo
                  Icon={Phone}
                  label="Phone"
                  value={agency?.phoneNumber || agency?.agency?.phoneNumber}
                  isLink={true}
                  linkPrefix="tel:"
                />
                <ProfileContactInfo
                  Icon={Globe}
                  label="Website"
                  value={agency?.websiteUrl || agency?.agency?.websiteUrl}
                  isLink={true}
                  linkPrefix="https://"
                />
              </div>
            </div>

            {/* Social Media Links */}
            {(agency?.facebookUrl ||
              agency?.agency?.facebookUrl ||
              agency?.linkedinUrl ||
              agency?.agency?.linkedinUrl) && (
              <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl border border-teal-500/20 p-8 shadow-2xl backdrop-blur-sm overflow-hidden relative">
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/5 rounded-full blur-2xl"></div>
                <h3 className="relative text-2xl font-bold text-white mb-6">Social Media</h3>
                <div className="relative flex flex-wrap gap-3">
                  <SocialLink
                    Icon={Facebook}
                    url={agency?.facebookUrl || agency?.agency?.facebookUrl}
                    label="Facebook"
                    color="bg-blue-500/10 border-blue-500/50 text-blue-400 hover:bg-blue-500/20"
                  />
                  <SocialLink
                    Icon={Linkedin}
                    url={agency?.linkedinUrl || agency?.agency?.linkedinUrl}
                    label="LinkedIn"
                    color="bg-blue-600/10 border-blue-600/50 text-blue-400 hover:bg-blue-600/20"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Footer */}
        <div className="flex gap-4 pt-6 border-t border-slate-700">
          <Button
            onClick={onBack}
            className="flex-1 bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-xl border border-gray-700 transition-all"
          >
            Back to Listings
          </Button>
          <Button className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white px-6 py-3 rounded-xl shadow-2xl shadow-teal-500/30 transition-all hover:scale-[1.02] hover:shadow-teal-500/50 font-semibold">
            Send Booking Request
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;