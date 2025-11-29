'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Building2, CheckCircle, XCircle, AlertCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Booking {
  _id: string;
  post: {
    title: string;
    description: string;
    priceRange: string;
    imageURL?: string;
    location?: string;
  };
  agency: {
    agencyName: string;
    email: string;
    location: string;
  };
  requestDescription: string;
  status: string;
  createdAt: string;
}

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/companies/bookings', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/companies/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        alert('Booking cancelled successfully');
        fetchBookings();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to cancel booking');
      }
    } catch (error) {
      alert('Something went wrong');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string; text: string; icon: any }> = {
      Pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: AlertCircle },
      Accepted: { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: CheckCircle },
      Confirmed: { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: CheckCircle },
      Rejected: { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle },
      Cancelled: { bg: 'bg-gray-100', text: 'text-gray-700', icon: XCircle },
    };

    const config = statusConfig[status] || statusConfig.Pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon className="w-3 h-3" />
        {status}
      </span>
    );
  };

  const filteredBookings = bookings.filter(
    (booking) => filterStatus === 'All' || booking.status === filterStatus
  );

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
        <p className="text-gray-600 mt-2">Track and manage your service booking requests.</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
        <div className="flex gap-2 flex-wrap">
          {['All', 'Pending', 'Accepted', 'Confirmed', 'Rejected', 'Cancelled'].map((status) => (
            <Button
              key={status}
              onClick={() => setFilterStatus(status)}
              variant={filterStatus === status ? 'default' : 'outline'}
              className={`rounded-xl ${
                filterStatus === status
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              {status}
            </Button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 shadow-sm text-center">
          <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar className="w-12 h-12 text-emerald-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No bookings yet</h3>
          <p className="text-gray-600 mb-6">
            {filterStatus === 'All'
              ? "You haven't made any booking requests yet. Browse agencies and book your first service!"
              : `No bookings with status "${filterStatus}".`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div key={booking._id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="flex flex-col md:flex-row">
                {/* Image */}
                <div className="w-full md:w-48 h-48 bg-gradient-to-br from-emerald-100 to-teal-100 flex-shrink-0">
                  {booking.post?.imageURL ? (
                    <img
                      src={booking.post.imageURL}
                      alt={booking.post?.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Building2 className="w-16 h-16 text-emerald-300" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">
                          {booking.post?.title || 'Service'}
                        </h3>
                        {getStatusBadge(booking.status)}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {booking.post?.description || 'No description'}
                      </p>
                      <p className="text-emerald-600 font-bold">
                        {booking.post?.priceRange || 'Price not specified'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Agency</p>
                        <p className="font-medium text-gray-900">{booking.agency?.agencyName || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-teal-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Requested</p>
                        <p className="font-medium text-gray-900">
                          {new Date(booking.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-cyan-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Location</p>
                        <p className="font-medium text-gray-900">{booking.post?.location || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Request Description */}
                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500 mb-2">Your Request:</p>
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {booking.requestDescription || 'No description provided'}
                    </p>
                  </div>

                  {/* Actions */}
                  {booking.status === 'Pending' && (
                    <div className="mt-4 flex gap-3">
                      <Button
                        onClick={() => handleCancelBooking(booking._id)}
                        variant="outline"
                        className="rounded-xl border-red-200 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Cancel Booking
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;