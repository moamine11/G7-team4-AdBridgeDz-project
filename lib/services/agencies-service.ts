import api from '../api';

const MOCK_AGENCIES = [
  {
    _id: 'test-agency-1',
    name: 'Test Agency',
    location: 'Algiers, Algeria',
    rating: 4.8,
    reviewCount: 124,
    verified: true,
    email: 'contact@testagency.com',
    phone: '+213 555 123 456',
    website: 'https://testagency.com',
    profileDescription: 'Premier outdoor advertising solutions in Algiers. We specialize in high-impact billboards and digital displays.',
    services: ['Billboard', 'Digital', 'Transit'],
    industry: 'Advertising',
    companySize: '11-50',
    yearEstablished: '2015',
    logo: null,
    serviceImage: null
  }
];

export const agenciesService = {
  getAllAgencies: async (params?: any) => {
    try {
      const response = await api.get('/agencies', { params });
      return response.data;
    } catch (error) {
      console.warn('API failed, returning mock agencies:', error);
      return MOCK_AGENCIES;
    }
  },

  getAgencyById: async (id: string) => {
    try {
      const response = await api.get(`/agencies/${id}`);
      return response.data;
    } catch (error) {
      console.warn('API failed, returning mock agency:', error);
      return MOCK_AGENCIES.find(a => a._id === id) || MOCK_AGENCIES[0];
    }
  },
};
