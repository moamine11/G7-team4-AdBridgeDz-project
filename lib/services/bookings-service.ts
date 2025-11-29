import api from '../api';

export const bookingsService = {
  createBooking: async (data: any) => {
    const response = await api.post('/bookings', data);
    return response.data;
  },

  getCompanyBookings: async () => {
    const response = await api.get('/bookings/company');
    return response.data;
  },

  getAgencyBookings: async () => {
    const response = await api.get('/bookings/agency');
    return response.data;
  },

  updateBookingStatus: async (id: string, status: string) => {
    const response = await api.put(`/bookings/${id}/status`, { status });
    return response.data;
  },
};
