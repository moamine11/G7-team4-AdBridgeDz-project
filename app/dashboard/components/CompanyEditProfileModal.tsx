'use client';

import { useState, useRef, useEffect } from 'react';
import {
  X,
  Save,
  Building2,
  Phone,
  MapPin,
  Globe,
  Calendar,
  Users,
  Briefcase,
  Upload,
  Loader2,
  Facebook,
  Linkedin,
  Twitter,
  Mail,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LocationPicker } from '@/components/ui/location-picker';

interface CompanyEditProfileModalProps {
  companyData: any;
  onClose: () => void;
  onUpdateSuccess: () => void;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://backend-se-7rkj.onrender.com';
const API_BASE_URL = `${BACKEND_URL.replace(/\/$/, '')}/api`;

export function CompanyEditProfileModal({
  companyData,
  onClose,
  onUpdateSuccess,
}: CompanyEditProfileModalProps) {
  const [loading, setLoading] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const initialLogoPreview = companyData?.imageURL
    ? companyData.imageURL.startsWith('http')
      ? companyData.imageURL
      : `${API_BASE_URL}${companyData.imageURL}`
    : null;

  const [logoPreview, setLogoPreview] = useState<string | null>(initialLogoPreview);

  const [formData, setFormData] = useState({
    name: companyData?.name || '',
    phonenumber: companyData?.phonenumber || '',
    location: companyData?.location || '',
    locationLat:
      companyData?.locationLat !== undefined && companyData?.locationLat !== null
        ? String(companyData.locationLat)
        : '',
    locationLng:
      companyData?.locationLng !== undefined && companyData?.locationLng !== null
        ? String(companyData.locationLng)
        : '',
    websiteURL: companyData?.websiteURL || '',
    industrySector: companyData?.industrySector || '',
    companySize: companyData?.companySize || '',
    yearEstablished: companyData?.yearEstablished || '',
    socialMedia: {
      facebook: companyData?.socialMedia?.facebook || '',
      linkedin: companyData?.socialMedia?.linkedin || '',
      twitter: companyData?.socialMedia?.twitter || '',
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setError(null);

    if (name.startsWith('socialMedia.')) {
      const field = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        socialMedia: { ...prev.socialMedia, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image (JPG, PNG, WEBP).');
      return;
    }

    setLogoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phonenumber) {
      setError('Company name and phone number are required.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const submissionData = new FormData();
      submissionData.append('name', formData.name);
      submissionData.append('phonenumber', formData.phonenumber);
      if (formData.location) submissionData.append('location', formData.location);
      if (formData.locationLat) submissionData.append('locationLat', formData.locationLat);
      if (formData.locationLng) submissionData.append('locationLng', formData.locationLng);
      if (formData.websiteURL) submissionData.append('websiteURL', formData.websiteURL);
      if (formData.industrySector) submissionData.append('industrySector', formData.industrySector);
      if (formData.companySize) submissionData.append('companySize', formData.companySize);
      if (formData.yearEstablished) submissionData.append('yearEstablished', String(formData.yearEstablished));
      submissionData.append('socialMedia', JSON.stringify(formData.socialMedia));

      if (logoFile) {
        submissionData.append('logo', logoFile);
      }

      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/companies/profile`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: submissionData,
      });

      if (response.ok) {
        onUpdateSuccess();
        onClose();
      } else {
        const data = await response.json();
        setError(data.error || 'Profile update failed. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const CompanySizeOptions = [
    '1-10',
    '11-50',
    '51-200',
    '201-500',
    '500+',
  ];

  return (
    <div
      className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[9999] p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#0f1a2e] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-cyan-500/20 shadow-2xl relative z-[10000]">
        {/* Header */}
        <div className="sticky top-0 bg-[#0a1628]/95 backdrop-blur border-b border-cyan-500/20 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/10 rounded-lg">
              <Building2 className="w-6 h-6 text-cyan-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Edit Company Profile</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-400 hover:text-white hover:bg-cyan-500/10 rounded-lg"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="px-6 py-4 bg-red-900/30 border-l-4 border-red-500 text-red-300 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-120px)] p-6 space-y-8">
          {/* Logo Section */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Upload className="w-5 h-5 text-cyan-400" />
              Company Logo
            </h3>
            <div className="flex flex-col items-center">
              <div
                className="relative w-40 h-40 rounded-2xl border-2 border-dashed border-cyan-500/30 flex items-center justify-center cursor-pointer hover:border-cyan-500/60 transition-all overflow-hidden group bg-[#0a1628]"
                onClick={() => logoInputRef.current?.click()}
              >
                {logoPreview ? (
                  <>
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <div className="text-center">
                        <Upload className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                        <p className="text-xs text-cyan-400 font-medium">Change Logo</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center px-4">
                    <Upload className="w-10 h-10 text-cyan-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-300 font-medium">Upload Logo</p>
                    <p className="text-xs text-gray-500 mt-1">Click to browse</p>
                  </div>
                )}
                <input
                  type="file"
                  ref={logoInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
              <p className="text-xs text-gray-400 mt-3 text-center">
                Recommended: PNG or SVG • Transparent background • Max 2MB
              </p>
            </div>
          </section>

          {/* General Info */}
          <section className="space-y-5">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-cyan-400" />
              General Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputWithIcon
                Icon={Building2}
                label="Company Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Acme Corporation"
              />
              <InputWithIcon
                Icon={Phone}
                label="Phone Number"
                name="phonenumber"
                value={formData.phonenumber}
                onChange={handleChange}
                required
                placeholder="+213 555 123 456"
              />
              <InputWithIcon
                Icon={MapPin}
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Algiers, Algeria"
              />
              <div className="md:col-span-2">
                <LocationPicker
                  value={{
                    label: formData.location || '',
                    lat: formData.locationLat ? Number(formData.locationLat) : null,
                    lng: formData.locationLng ? Number(formData.locationLng) : null,
                  }}
                  onChange={(next) => {
                    setFormData((prev) => ({
                      ...prev,
                      location: next.label || prev.location,
                      locationLat: next.lat !== null ? String(next.lat) : prev.locationLat,
                      locationLng: next.lng !== null ? String(next.lng) : prev.locationLng,
                    }));
                  }}
                />
              </div>
              <InputWithIcon
                Icon={Globe}
                label="Website"
                name="websiteURL"
                value={formData.websiteURL}
                onChange={handleChange}
                type="url"
                placeholder="https://example.com"
              />
            </div>
          </section>

          {/* Company Details */}
          <section className="space-y-5">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-cyan-400" />
              Company Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <InputWithIcon
                Icon={Briefcase}
                label="Industry Sector"
                name="industrySector"
                value={formData.industrySector}
                onChange={handleChange}
                placeholder="e.g., Advertising, Media"
              />
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Company Size
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 pointer-events-none" />
                  <select
                    name="companySize"
                    value={formData.companySize}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-cyan-500/20 bg-[#0a1628] text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/50 transition-all appearance-none"
                  >
                    <option value="" className="bg-[#0a1628]">Select size</option>
                    {CompanySizeOptions.map((size) => (
                      <option key={size} value={size} className="bg-[#0a1628]">
                        {size} employees
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                    ▼
                  </div>
                </div>
              </div>
              <InputWithIcon
                Icon={Calendar}
                label="Year Established"
                name="yearEstablished"
                value={formData.yearEstablished}
                onChange={handleChange}
                type="number"
                placeholder="2010"
              />
            </div>
          </section>

          {/* Social Media */}
          <section className="space-y-5">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-cyan-400" />
              Social Media Links
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <InputWithIcon
                Icon={Facebook}
                label="Facebook"
                name="socialMedia.facebook"
                value={formData.socialMedia.facebook}
                onChange={handleChange}
                type="url"
                placeholder="https://facebook.com/..."
              />
              <InputWithIcon
                Icon={Linkedin}
                label="LinkedIn"
                name="socialMedia.linkedin"
                value={formData.socialMedia.linkedin}
                onChange={handleChange}
                type="url"
                placeholder="https://linkedin.com/company/..."
              />
              <InputWithIcon
                Icon={Twitter}
                label="Twitter / X"
                name="socialMedia.twitter"
                value={formData.socialMedia.twitter}
                onChange={handleChange}
                type="url"
                placeholder="https://x.com/..."
              />
            </div>
          </section>

          {/* Footer Actions */}
          <div className="pt-6 border-t border-cyan-500/20 flex flex-col sm:flex-row gap-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 bg-[#0a1628] hover:bg-[#162841] border-cyan-500/20 text-gray-300 hover:text-white py-3 rounded-xl transition-all"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white py-3 rounded-xl shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Saving Changes...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Enhanced Input Component
const InputWithIcon = ({
  Icon,
  label,
  name,
  value,
  onChange,
  required = false,
  type = 'text',
  placeholder,
}: {
  Icon: any;
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  type?: string;
  placeholder?: string;
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-2">
      {label}
      {required && <span className="text-red-400 ml-1">*</span>}
    </label>
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 pointer-events-none" />
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder || label}
        className="w-full pl-11 pr-4 py-3 rounded-xl border border-cyan-500/20 bg-[#0a1628] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/50 transition-all"
      />
    </div>
  </div>
);

export default CompanyEditProfileModal;