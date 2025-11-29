'use client';

import { ArrowLeft, Mail, MapPin, Globe, Phone, Building2, Calendar, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProfilePageProps {
  agency: any;
  onBack: () => void;
}

const ProfilePage = ({ agency, onBack }: ProfilePageProps) => {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <button
        onClick={onBack}
        className="flex items-center text-emerald-600 hover:text-emerald-700 mb-6 font-medium"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Agencies
      </button>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {/* Hero Section */}
        <div className="relative h-48 bg-gradient-to-br from-emerald-500 to-teal-500">
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        </div>

        {/* Profile Content */}
        <div className="p-8">
          {/* Agency Header */}
          <div className="flex items-start gap-6 mb-8 -mt-24 relative">
            <div className="w-32 h-32 rounded-2xl bg-white shadow-xl flex items-center justify-center border-4 border-white">
              {agency.logo ? (
                <img
                  src={agency.logo}
                  alt={agency.agencyName || agency.name}
                  className="w-full h-full rounded-xl object-cover"
                />
              ) : (
                <Building2 className="w-16 h-16 text-emerald-600" />
              )}
            </div>
            <div className="flex-1 pt-16">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {agency.agencyName || agency.name}
              </h1>
              <p className="text-gray-600 mb-4">
                {agency.industry || 'Advertising Agency'}
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-yellow-500">
                  <span className="text-2xl">⭐</span>
                  <span className="font-bold text-gray-900">4.8</span>
                  <span className="text-gray-500 text-sm">(124 reviews)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Company Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                Contact Information
              </h3>
              
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email Address</p>
                  <p className="text-gray-900 font-medium">{agency.email}</p>
                </div>
              </div>

              {agency.phoneNumber && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="text-gray-900 font-medium">{agency.phoneNumber}</p>
                  </div>
                </div>
              )}

              {agency.location && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-cyan-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="text-gray-900 font-medium">{agency.location}</p>
                  </div>
                </div>
              )}

              {agency.websiteUrl && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Globe className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Website</p>
                    <a
                      href={agency.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 hover:text-emerald-700 font-medium hover:underline"
                    >
                      Visit Website
                    </a>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                Company Details
              </h3>

              {agency.companySize && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Company Size</p>
                    <p className="text-gray-900 font-medium">{agency.companySize}</p>
                  </div>
                </div>
              )}

              {agency.yearEstablished && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-pink-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Year Established</p>
                    <p className="text-gray-900 font-medium">{agency.yearEstablished}</p>
                  </div>
                </div>
              )}

              {agency.industry && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Industry</p>
                    <p className="text-gray-900 font-medium">{agency.industry}</p>
                  </div>
                </div>
              )}

              {agency.businessRegistrationNumber && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">📋</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Registration Number</p>
                    <p className="text-gray-900 font-medium">{agency.businessRegistrationNumber}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* About Section */}
          {agency.profileDescription && (
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                About Us
              </h3>
              <p className="text-gray-600 leading-relaxed">{agency.profileDescription}</p>
            </div>
          )}

          {/* Services Offered */}
          {agency.servicesOffered && agency.servicesOffered.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                Services Offered
              </h3>
              <div className="flex flex-wrap gap-2">
                {agency.servicesOffered.map((service: string, index: number) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-medium"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Social Media */}
          {(agency.facebookUrl || agency.linkedinUrl) && (
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                Connect With Us
              </h3>
              <div className="flex gap-4">
                {agency.facebookUrl && (
                  <a
                    href={agency.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Facebook
                  </a>
                )}
                {agency.linkedinUrl && (
                  <a
                    href={agency.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors font-medium"
                  >
                    LinkedIn
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="flex gap-4">
            <Button
              onClick={onBack}
              variant="outline"
              className="flex-1 py-3 rounded-xl border-gray-200 hover:bg-gray-50"
            >
              Back to Agencies
            </Button>
            <Button
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl"
            >
              Contact Agency
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;