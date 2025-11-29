'use client';

import { useState, useEffect } from 'react';
import { Save, User, Mail, Phone, MapPin, Building, Globe, Calendar, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ProfileSettingsProps {
  agencyData: any;
  onUpdate: () => void;
}

const ProfileSettings = ({ agencyData, onUpdate }: ProfileSettingsProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    agencyName: '',
    email: '',
    phoneNumber: '',
    country: '',
    city: '',
    streetAddress: '',
    postalCode: '',
    businessRegistrationNumber: '',
    industry: '',
    companySize: '',
    yearEstablished: '',
    fullName: '',
    jobTitle: '',
    websiteUrl: '',
    facebookUrl: '',
    linkedinUrl: '',
  });

  useEffect(() => {
    if (agencyData) {
      setFormData({
        agencyName: agencyData.agencyName || '',
        email: agencyData.email || '',
        phoneNumber: agencyData.phoneNumber || '',
        country: agencyData.country || '',
        city: agencyData.city || '',
        streetAddress: agencyData.streetAddress || '',
        postalCode: agencyData.postalCode || '',
        businessRegistrationNumber: agencyData.businessRegistrationNumber || '',
        industry: agencyData.industry || '',
        companySize: agencyData.companySize || '',
        yearEstablished: agencyData.yearEstablished || '',
        fullName: agencyData.fullName || '',
        jobTitle: agencyData.jobTitle || '',
        websiteUrl: agencyData.websiteUrl || '',
        facebookUrl: agencyData.facebookUrl || '',
        linkedinUrl: agencyData.linkedinUrl || '',
      });
    }
  }, [agencyData]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/agencies/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsEditing(false);
        onUpdate();
        alert('Profile updated successfully!');
      } else {
        alert('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('An error occurred');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const sections = [
    {
      title: 'Company Information',
      icon: Building,
      fields: [
        { name: 'agencyName', label: 'Agency Name', icon: Building, placeholder: 'Your Agency Name' },
        { name: 'email', label: 'Email', icon: Mail, placeholder: 'agency@example.com', type: 'email' },
        { name: 'phoneNumber', label: 'Phone Number', icon: Phone, placeholder: '+1 234 567 8900' },
        { name: 'websiteUrl', label: 'Website URL', icon: Globe, placeholder: 'https://yourwebsite.com' },
        { name: 'industry', label: 'Industry', icon: Building, placeholder: 'e.g., Advertising' },
        { name: 'companySize', label: 'Company Size', icon: Users, placeholder: 'e.g., 50-100' },
        { name: 'yearEstablished', label: 'Year Established', icon: Calendar, placeholder: 'e.g., 2020' },
        { name: 'businessRegistrationNumber', label: 'Registration Number', icon: Building, placeholder: 'REG123456' },
      ],
    },
    {
      title: 'Location Details',
      icon: MapPin,
      fields: [
        { name: 'country', label: 'Country', icon: MapPin, placeholder: 'Algeria' },
        { name: 'city', label: 'City', icon: MapPin, placeholder: 'Algiers' },
        { name: 'streetAddress', label: 'Street Address', icon: MapPin, placeholder: '123 Main Street' },
        { name: 'postalCode', label: 'Postal Code', icon: MapPin, placeholder: '16000' },
      ],
    },
    {
      title: 'Contact Person',
      icon: User,
      fields: [
        { name: 'fullName', label: 'Full Name', icon: User, placeholder: 'John Doe' },
        { name: 'jobTitle', label: 'Job Title', icon: User, placeholder: 'CEO' },
      ],
    },
    {
      title: 'Social Media',
      icon: Globe,
      fields: [
        { name: 'facebookUrl', label: 'Facebook URL', icon: Globe, placeholder: 'https://facebook.com/yourpage' },
        { name: 'linkedinUrl', label: 'LinkedIn URL', icon: Globe, placeholder: 'https://linkedin.com/company/yourcompany' },
      ],
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-2">Manage your agency profile and account settings.</p>
        </div>
        {!isEditing ? (
          <Button
            onClick={() => setIsEditing(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-medium"
          >
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-3">
            <Button
              onClick={() => setIsEditing(false)}
              variant="outline"
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-medium"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        )}
      </div>

      {/* Profile Sections */}
      <div className="space-y-6">
        {sections.map((section, sectionIndex) => {
          const SectionIcon = section.icon;
          return (
            <div key={sectionIndex} className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <SectionIcon className="w-5 h-5 text-emerald-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">{section.title}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {section.fields.map((field, fieldIndex) => {
                  const FieldIcon = field.icon;
                  return (
                    <div key={fieldIndex}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {field.label}
                      </label>
                      <div className="relative">
                        <FieldIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                          type={field.type || 'text'}
                          name={field.name}
                          value={formData[field.name as keyof typeof formData]}
                          onChange={handleChange}
                          placeholder={field.placeholder}
                          disabled={!isEditing}
                          className="pl-10 rounded-xl border-gray-200 disabled:bg-gray-50 disabled:text-gray-600"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Account Status */}
      <div className="bg-emerald-50 rounded-2xl p-6 mt-6 border-2 border-emerald-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">✓</span>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-1">Account Verified</h3>
            <p className="text-sm text-gray-600">
              Your account is verified and active. You can now manage your ad spaces and receive bookings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;