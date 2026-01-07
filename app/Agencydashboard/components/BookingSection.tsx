'use client';

import { useState, useEffect } from 'react';
import { Calendar, User, CheckCircle, XCircle, AlertCircle, Loader2, DollarSign, Tag, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

const API_BASE_URL = 'https://backend-se-7rkj.onrender.com/api';

const BookingSection = ({ agencyData }: { agencyData: any }) => {
    // FIX: Explicitly type the state as an array of any type or use the detailed interface if available
 const [bookings, setBookings] = useState<any[]>([]); 
 const [loading, setLoading] = useState(true);
 const [filterStatus, setFilterStatus] = useState('All');

 useEffect(() => {
 fetchBookings();
 }, [agencyData]);

 const fetchBookings = async () => {
 if (!agencyData?._id) return;

    try {
      const token = localStorage.getItem('token'); 
      if (!token) return;

      // GET /api/agencies/bookings
      const response = await fetch(`${API_BASE_URL}/agencies/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        // FIX: If the response is not OK, throw an error to be caught below
        const errorBody = await response.json();
 throw new Error(errorBody.error || 'Failed to fetch bookings. Server responded with error.');
 }

      const data = await response.json();
      setBookings(Array.isArray(data) ? data : []); 
    } catch (error: any) {
      console.error('Error fetching bookings:', error);
      alert(error.message || 'Failed to fetch bookings.');
      setBookings([]); // Set to empty array on failure
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, status: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      // PUT /api/agencies/booking/:id/status
      const response = await fetch(`${API_BASE_URL}/agencies/booking/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update booking status');
      }

      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status } : b))
      );
      alert(`Booking status updated to ${status}.`);
    } catch (error: any) {
      alert(error.message);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string; text: string; icon: any; border: string }> = {
      Pending: { bg: 'bg-yellow-900/50', text: 'text-yellow-400', icon: AlertCircle, border: 'border-yellow-700' },
      Accepted: { bg: 'bg-teal-900/50', text: 'text-teal-400', icon: CheckCircle, border: 'border-teal-700' },
      Rejected: { bg: 'bg-red-900/50', text: 'text-red-400', icon: XCircle, border: 'border-red-700' },
      Completed: { bg: 'bg-cyan-900/50', text: 'text-cyan-400', icon: CheckCircle, border: 'border-cyan-700' },
    };

    const config = statusConfig[status] || statusConfig.Pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}>
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
        <h1 className="text-3xl font-bold text-white">Booking Requests</h1>
      </div>

      {/* Filters */}
      <div className="bg-slate-950 rounded-xl p-6 shadow-xl border border-slate-700 mb-6">
        <div className="flex gap-2 flex-wrap">
          {['All', 'Pending', 'Accepted', 'Rejected', 'Completed'].map((status) => (
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
        <div className="bg-slate-950 rounded-xl p-12 shadow-xl border border-slate-700 text-center text-gray-400">
          <Calendar className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No bookings yet</h3>
          <p>Bookings will appear here once companies request your services.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div key={booking._id} className="bg-slate-950 rounded-xl p-6 shadow-xl border border-slate-700 hover:border-cyan-700 transition-shadow">
              
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-white">
                      {booking.post?.title || 'Untitled Ad Placement'}
                    </h3>
                    {getStatusBadge(booking.status)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 py-4 border-y border-slate-800">
                <InfoBlock Icon={User} label="Requester" value={booking.company?.name || 'Unknown Company'} color="teal" />
                <InfoBlock Icon={Calendar} label="Requested On" value={new Date(booking.createdAt).toLocaleDateString()} color="cyan" />
                <InfoBlock Icon={DollarSign} label="Price Range" value={booking.post?.priceRange || 'N/A'} color="teal" />
                <InfoBlock Icon={Tag} label="Service Category" value={booking.post?.category?.name || 'N/A'} color="cyan" />
              </div>
              
              <div className="pt-4">
                 <p className="text-sm font-medium text-gray-300 mb-2 flex items-center">
                    <MessageSquare className="w-4 h-4 mr-1 text-cyan-400" /> Request Details:
                 </p>
                 <div className="p-3 bg-slate-800 rounded-lg border border-slate-700 text-white italic text-sm">
                    {booking.requestDescription || 'No specific details provided.'}
                 </div>
              </div>

              {booking.status === 'Pending' && (
                <div className="flex gap-3 pt-6 border-t border-slate-800 mt-4">
                  <Button
                    className="flex-1 bg-teal-600 hover:bg-teal-700 text-white rounded-xl"
                    onClick={() => updateBookingStatus(booking._id, 'Accepted')}
                  >
                    <CheckCircle className="w-5 h-5 mr-2" /> Accept Request
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 rounded-xl bg-red-900/50 text-red-400 hover:bg-red-900/70 border-red-900/50"
                    onClick={() => updateBookingStatus(booking._id, 'Rejected')}
                  >
                    <XCircle className="w-5 h-5 mr-2" /> Decline
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Helper component for cleaner UI
const InfoBlock = ({ Icon, label, value, color }: { Icon: any, label: string, value: string, color: 'teal' | 'cyan' | 'green' }) => {
    const colorMap = {
        teal: { bg: 'bg-teal-900/30', text: 'text-teal-400' },
        cyan: { bg: 'bg-cyan-900/30', text: 'text-cyan-400' },
        green: { bg: 'bg-green-900/30', text: 'text-green-400' },
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


export default BookingSection;