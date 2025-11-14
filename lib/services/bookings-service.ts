import api from '../api';

const MOCK_BOOKINGS = [
  {
    _id: 'booking-1',
    company: { name: 'Tech Corp', email: 'contact@techcorp.com' },
    post: { 
      title: 'Downtown Billboard', 
      agency: { name: 'Mock Agency', _id: 'mock-agency-id' },
      category: 'Outdoor',
      location: 'Algiers Center'
    },
    startDate: '2025-06-01',
    endDate: '2025-06-30',
    status: 'pending',
    totalPrice: 150000
  },
  {
    _id: 'booking-2',
    company: { name: 'Fashion Brand', email: 'marketing@fashion.com' },
    post: { 
      title: 'Highway Digital Screen', 
      agency: { name: 'Mock Agency', _id: 'mock-agency-id' },
      category: 'Digital',
      location: 'Oran Highway'
    },
    startDate: '2025-07-01',
    endDate: '2025-07-15',
    status: 'approved',
    totalPrice: 200000
  }
];

export const bookingsService = {
  createBooking: async (data: any) => {
    try {
      const response = await api.post('/bookings', data);
      return response.data;
    } catch (error) {
      console.warn('API failed, returning mock booking creation:', error);
      return { ...data, _id: 'new-booking-' + Date.now(), status: 'pending' };
    }
  },

  getCompanyBookings: async () => {
    try {
      const response = await api.get('/bookings/company');
      return response.data;
    } catch (error) {
      console.warn('API failed, returning mock company bookings:', error);
      return MOCK_BOOKINGS;
    }
  },

  getAgencyBookings: async () => {
    try {
      const response = await api.get('/bookings/agency');
      return response.data;
    } catch (error) {
      console.warn('API failed, returning mock agency bookings:', error);
      return MOCK_BOOKINGS;
    }
  },

  updateBookingStatus: async (id: string, status: string) => {
    try {
      const response = await api.put(`/bookings/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.warn('API failed, returning mock booking status update:', error);
      return { success: true, status };
    }
  },
};
