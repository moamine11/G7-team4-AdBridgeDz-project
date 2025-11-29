import api from '../api';

export const authService = {
  registerCompany: async (data: any) => {
    const response = await api.post('/companies/register', data);
    return response.data;
  },

  loginCompany: async (data: any) => {
    const response = await api.post('/companies/login', data);
    return response.data;
  },

  registerAgency: async (formData: FormData) => {
    const response = await api.post('/agencies/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  loginAgency: async (data: any) => {
    const response = await api.post('/agencies/login', data);
    return response.data;
  },

  getCompanyProfile: async () => {
    const response = await api.get('/companies/profile');
    return response.data;
  },

  getAgencyProfile: async () => {
    const response = await api.get('/agencies/profile');
    return response.data;
  },
};
