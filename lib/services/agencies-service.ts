import api from '../api';

export const agenciesService = {
  getAllAgencies: async (params?: any) => {
    const response = await api.get('/agencies', { params });
    return response.data;
  },

  getAgencyById: async (id: string) => {
    const response = await api.get(`/agencies/${id}`);
    return response.data;
  },
};
