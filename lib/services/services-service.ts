import api from '../api';

export const servicesService = {
  getAllServices: async () => {
    const response = await api.get('/services');
    return response.data;
  },
};
