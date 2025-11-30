import api from '../api';

const MOCK_SERVICES = [
  'Billboard Advertising',
  'Digital Billboards',
  'Transit Advertising',
  'Street Furniture',
  'Airport Advertising',
  'Stadium Advertising'
];

export const servicesService = {
  getAllServices: async () => {
    try {
      const response = await api.get('/services');
      return response.data;
    } catch (error) {
      console.warn('API failed, returning mock services:', error);
      return MOCK_SERVICES;
    }
  },
};
