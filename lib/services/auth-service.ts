import api from '../api';

const MOCK_AGENCY = {
  _id: 'mock-agency-id',
  name: 'Mock Agency',
  email: 'agency@example.com',
  role: 'agency',
  token: 'mock-jwt-token-agency',
  phone: '+213 555 000 000',
  website: 'https://mockagency.com',
  address: '123 Mock St, Algiers, Algeria',
  industry: 'Marketing',
  companySize: '11-50',
  yearEstablished: '2020',
  contactPerson: {
    name: 'Mock Manager',
    title: 'Manager'
  },
  businessRegistrationNumber: '123456789',
  socialMedia: {
    facebook: 'https://facebook.com/mockagency',
    linkedin: 'https://linkedin.com/company/mockagency'
  },
  services: ['Billboard Advertising', 'Digital Billboards']
};

const MOCK_COMPANY = {
  _id: 'mock-company-id',
  name: 'Mock Company',
  email: 'company@example.com',
  role: 'company',
  token: 'mock-jwt-token-company'
};

export const authService = {
  registerCompany: async (data: any) => {
    try {
      const response = await api.post('/companies/register', data);
      return response.data;
    } catch (error) {
      console.warn('API failed, returning mock company registration:', error);
      return {
        token: MOCK_COMPANY.token,
        company: MOCK_COMPANY
      };
    }
  },

  loginCompany: async (data: any) => {
    try {
      const response = await api.post('/companies/login', data);
      return response.data;
    } catch (error) {
      console.warn('API failed, returning mock company login:', error);
      // Simulate simple validation
      if (data.email && data.password) {
        return {
          token: MOCK_COMPANY.token,
          company: MOCK_COMPANY
        };
      }
      throw error;
    }
  },

  registerAgency: async (formData: FormData) => {
    try {
      const response = await api.post('/agencies/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.warn('API failed, returning mock agency registration:', error);
      return {
        token: MOCK_AGENCY.token,
        agency: MOCK_AGENCY
      };
    }
  },

  loginAgency: async (data: any) => {
    try {
      const response = await api.post('/agencies/login', data);
      return response.data;
    } catch (error) {
      console.warn('API failed, returning mock agency login:', error);
      if (data.email && data.password) {
        return {
          token: MOCK_AGENCY.token,
          agency: MOCK_AGENCY
        };
      }
      throw error;
    }
  },

  getCompanyProfile: async () => {
    try {
      const response = await api.get('/companies/profile');
      return response.data;
    } catch (error) {
      console.warn('API failed, returning mock company profile:', error);
      return MOCK_COMPANY;
    }
  },

  getAgencyProfile: async () => {
    try {
      const response = await api.get('/agencies/profile');
      return response.data;
    } catch (error) {
      console.warn('API failed, returning mock agency profile:', error);
      return MOCK_AGENCY;
    }
  },
};
