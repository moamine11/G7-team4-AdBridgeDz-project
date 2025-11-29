'use client';

import { useState } from 'react';
import { ArrowLeft, Check, MapPin, DollarSign, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface BookingPageProps {
  post: any;
  onBack: () => void;
  onSuccess: () => void;
}

const BookingPage = ({ post, onBack, onSuccess }: BookingPageProps) => {
  const [bookingDescription, setBookingDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!bookingDescription.trim()) {
      alert('Please provide a description of your requirements');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/posts/${post._id}/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ requestDescription: bookingDescription }),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          onSuccess();
        }, 2000);
      } else {
        const error = await response.json();
        alert(error.error || 'Booking failed');
      }
    } catch (error) {
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl p-12 shadow-sm text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Booking Request Sent!</h2>
          <p className="text-gray-600 mb-8">
            Your booking request has been successfully submitted. The agency will review your request and get back to you soon.
          </p>
          <Button
            onClick={onSuccess}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl"
          >
            View My Bookings
          </Button>
        </div>
      </div>
    );
  }

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
        {/* Post Preview */}
        <div className="relative h-64 bg-gradient-to-br from-emerald-100 to-teal-100">
          {post.imageURL ? (
            <img src={post.imageURL} alt={post.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Building2 className="w-32 h-32 text-emerald-300" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
            <div className="p-8 text-white">
              <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  <span>{post.agency?.agencyName || 'Agency'}</span>
                </div>
                {post.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{post.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div className="p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Book This Service</h2>
            <p className="text-gray-600 mb-6">{post.description}</p>
            
            {/* Price */}
            <div className="bg-emerald-50 rounded-xl p-6 border-2 border-emerald-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Service Price</p>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-6 h-6 text-emerald-600" />
                    <span className="text-3xl font-bold text-emerald-600">
                      {post.priceRange || '$2,500'}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-1">Agency Contact</p>
                  <p className="text-gray-900 font-medium">{post.agency?.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Description */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Describe Your Requirements <span className="text-red-500">*</span>
            </label>
            <Textarea
              value={bookingDescription}
              onChange={(e) => setBookingDescription(e.target.value)}
              placeholder="Tell us about your project, goals, timeline, and any specific requirements you have..."
              rows={8}
              className="rounded-xl border-gray-200 focus:border-emerald-500 resize-none"
            />
            <p className="text-sm text-gray-500 mt-2">
              Provide as much detail as possible to help the agency understand your needs.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              onClick={onBack}
              variant="outline"
              className="flex-1 py-3 rounded-xl border-gray-200 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading || !bookingDescription.trim()}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl disabled:bg-gray-300"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Submitting...</span>
                </div>
              ) : (
                'Submit Booking Request'
              )}
            </Button>
          </div>

          {/* Info Box */}
          <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-200">
            <p className="text-sm text-blue-900">
              <strong>Note:</strong> Your booking request will be sent to the agency for review. 
              They will contact you via email to discuss the details and confirm the booking.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;