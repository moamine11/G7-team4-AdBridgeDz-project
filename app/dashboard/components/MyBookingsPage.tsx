'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Building2, CheckCircle, XCircle, AlertCircle, Trash2, Loader2, DollarSign } from 'lucide-react';
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

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://backend-se-7rkj.onrender.com';
const API_BASE_URL = `${BACKEND_URL.replace(/\/$/, '')}/api`;

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
      // GET /api/companies/bookings
      const response = await fetch(`${API_BASE_URL}/companies/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const data = await response.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) return;

    try {
      const token = localStorage.getItem('token');
     
      const response = await fetch(`${API_BASE_URL}/companies/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        alert('Booking cancelled successfully');
        fetchBookings();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to cancel booking. Only Pending bookings can be cancelled.');
      }
    } catch (error) {
      alert('Something went wrong');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string; text: string; icon: any; border: string }> = {
        Pending: { bg: 'bg-yellow-900/30', text: 'text-yellow-400', icon: Clock, border: 'border-yellow-700' },
        Accepted: { bg: 'bg-teal-900/30', text: 'text-teal-400', icon: CheckCircle, border: 'border-teal-700' },
        Confirmed: { bg: 'bg-teal-900/30', text: 'text-teal-400', icon: CheckCircle, border: 'border-teal-700' },
        Rejected: { bg: 'bg-red-900/30', text: 'text-red-400', icon: XCircle, border: 'border-red-700' },
        Cancelled: { bg: 'bg-gray-700/50', text: 'text-gray-400', icon: XCircle, border: 'border-gray-600' },
        Completed: { bg: 'bg-cyan-900/30', text: 'text-cyan-400', icon: CheckCircle, border: 'border-cyan-700' },
    };

    const config = statusConfig[status] || statusConfig.Pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text} border ${config.border}`}>
        <Icon className="w-3 h-3" />
        {status}
      </span>
    );
  };

  const filteredBookings = bookings.filter(
    (booking) => filterStatus === 'All' || booking.status === filterStatus
  );

  return (
    <div className="text-white">
      {/* Header */}
      <div className="mb-8">

      </div>

      {/* Filters */}
      <div className="bg-slate-950 rounded-2xl p-6 shadow-xl border border-slate-700 mb-6">
        <div className="flex gap-2 flex-wrap">
          {['All', 'Pending', 'Accepted', 'Rejected', 'Completed', 'Cancelled'].map((status) => (
            <Button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`rounded-xl border-slate-700 ${
                filterStatus === status
                  ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-gray-300'
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
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-cyan-400" />
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="bg-slate-950 rounded-2xl p-12 shadow-xl border border-slate-700 text-center">
          <Calendar className="w-12 h-12 text-cyan-400 mx-auto mb-6" />
          <h3 className="text-xl font-bold text-white mb-2">No bookings yet</h3>
          <p className="text-gray-400 mb-6">
            {filterStatus === 'All'
              ? "You haven't made any booking requests yet."
              : `No bookings with status "${filterStatus}".`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div key={booking._id} className="bg-slate-950 rounded-2xl shadow-xl hover:shadow-md transition-shadow overflow-hidden border border-slate-700">
              <div className="flex flex-col md:flex-row">
                {/* Image */}
                <div className="w-full md:w-48 h-48 bg-slate-800 flex-shrink-0">
                  {booking.post?.imageURL ? (
                    <img
                      src={booking.post.imageURL} // NOTE: API_BASE_URL might be needed here if images are local
                      alt={booking.post?.title}
                      className="w-full h-full object-cover opacity-80"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Building2 className="w-16 h-16 text-gray-700" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-white">
                          {booking.post?.title || 'Service'}
                        </h3>
                        {getStatusBadge(booking.status)}
                      </div>
                      <p className="text-sm text-cyan-400 font-bold">
                        {booking.post?.priceRange || 'Price not specified'}
                      </p>
                      <p className="text-gray-500 text-xs mt-1">Agency: {booking.agency?.agencyName || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 border-t border-slate-800">
                    <BookingInfo Icon={Calendar} label="Requested" value={new Date(booking.createdAt).toLocaleDateString()} color="teal" />
                    <BookingInfo Icon={MapPin} label="Placement Location" value={booking.post?.location || 'N/A'} color="cyan" />
                    <BookingInfo Icon={DollarSign} label="Price Range" value={booking.post?.priceRange || 'N/A'} color="teal" />
                  </div>

                  {/* Request Description */}
                  <div className="pt-4 border-t border-slate-800">
                    <p className="text-xs text-gray-500 mb-2">Your Request:</p>
                    <p className="text-sm text-gray-400 line-clamp-2">
                      {booking.requestDescription || 'No description provided'}
                    </p>
                  </div>

                  {/* Actions */}
                  {booking.status === 'Pending' && (
                    <div className="mt-4 flex gap-3">
                      <Button
                        onClick={() => handleCancelBooking(booking._id)}
                        className="rounded-xl bg-red-900/50 text-red-400 hover:bg-red-900/70 border-red-900/50"
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

// Helper component for cleaner UI
const BookingInfo = ({ Icon, label, value, color }: { Icon: any, label: string, value: string, color: 'teal' | 'cyan' }) => {
    const colorMap = {
        teal: { bg: 'bg-teal-900/30', text: 'text-teal-400' },
        cyan: { bg: 'bg-cyan-900/30', text: 'text-cyan-400' },
    };
    const style = colorMap[color];
    
    return (
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 ${style.bg} rounded-lg flex items-center justify-center border border-slate-700 flex-shrink-0`}>
            <Icon className={`w-5 h-5 ${style.text}`} />
          </div>
          <div>
            <p className="text-xs text-gray-500">{label}</p>
            <p className="font-medium text-white truncate">{value}</p>
          </div>
        </div>
    );
};

export default MyBookingsPage;