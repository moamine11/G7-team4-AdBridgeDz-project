// Simple localStorage-based data management for frontend-only functionality

const STORAGE_KEYS = {
  AGENCIES: 'adbridge_agencies',
  COMPANIES: 'adbridge_companies',
  BOOKINGS: 'adbridge_bookings',
  SAVED_AGENCIES: 'adbridge_saved_agencies',
  REVIEWS: 'adbridge_reviews',
  SERVICES: 'adbridge_services',
  PROJECTS: 'adbridge_projects',
  CURRENT_USER: 'adbridge_current_user',
}

// Initialize with mock data if storage is empty
export const initializeMockData = () => {
  if (typeof window === 'undefined') return

  // Initialize agencies
  if (!localStorage.getItem(STORAGE_KEYS.AGENCIES)) {
    const mockAgencies = [
      {
        id: '1',
        name: 'Alpha Communications',
        location: 'Algiers, Algeria',
        rating: 4.8,
        reviewCount: 24,
        verified: true,
        email: 'contact@alphacomm.dz',
        phone: '+213 555 123 456',
        website: 'https://www.alphacomm.dz',
        description: 'Alpha Communications is a leading advertising agency in Algeria, specializing in outdoor advertising and digital billboards.',
        services: ['Billboard Advertising', 'Digital Billboards', 'Transit Advertising', 'Street Furniture Advertising'],
        industry: 'Outdoor Advertising',
        companySize: '21-50 employees',
        yearEstablished: '2014',
        socialMedia: {
          facebook: 'https://facebook.com/alphacomm',
          linkedin: 'https://linkedin.com/company/alphacomm',
        },
        logo: null,
      },
      {
        id: '2',
        name: 'Media Pro Solutions',
        location: 'Oran, Algeria',
        rating: 4.5,
        reviewCount: 18,
        verified: true,
        email: 'contact@mediapro.dz',
        phone: '+213 555 987 654',
        website: 'https://www.mediapro.dz',
        description: 'Professional media solutions provider with extensive experience in outdoor advertising.',
        services: ['Street Furniture', 'Airport Advertising'],
        industry: 'Outdoor Advertising',
        companySize: '6-20 employees',
        yearEstablished: '2018',
        socialMedia: {
          facebook: 'https://facebook.com/mediapro',
          linkedin: 'https://linkedin.com/company/mediapro',
        },
        logo: null,
      },
      {
        id: '3',
        name: 'Creative Ad Agency',
        location: 'Constantine, Algeria',
        rating: 4.2,
        reviewCount: 12,
        verified: false,
        email: 'contact@creativead.dz',
        phone: '+213 555 456 789',
        website: '',
        description: 'Creative advertising solutions for modern businesses.',
        services: ['Billboard Advertising', 'Stadium Advertising'],
        industry: 'Creative Services',
        companySize: '2-5 employees',
        yearEstablished: '2020',
        socialMedia: {},
        logo: null,
      },
      {
        id: '4',
        name: 'Digital Billboard Co.',
        location: 'Algiers, Algeria',
        rating: 4.9,
        reviewCount: 31,
        verified: true,
        email: 'contact@digitalbillboard.dz',
        phone: '+213 555 321 654',
        website: 'https://www.digitalbillboard.dz',
        description: 'Leading provider of digital billboard advertising solutions.',
        services: ['Digital Billboards', 'Transit Advertising'],
        industry: 'Digital Marketing Agency',
        companySize: '21-50 employees',
        yearEstablished: '2015',
        socialMedia: {
          facebook: 'https://facebook.com/digitalbillboard',
          linkedin: 'https://linkedin.com/company/digitalbillboard',
        },
        logo: null,
      },
    ]
    localStorage.setItem(STORAGE_KEYS.AGENCIES, JSON.stringify(mockAgencies))
  }

  // Initialize reviews
  if (!localStorage.getItem(STORAGE_KEYS.REVIEWS)) {
    const mockReviews = [
      {
        id: '1',
        agencyId: '1',
        companyName: 'Tech Solutions Inc.',
        rating: 5,
        comment: 'Excellent service and great results! Highly recommended.',
        date: '2024-03-10',
        helpful: 12,
      },
      {
        id: '2',
        agencyId: '1',
        companyName: 'Retail Group',
        rating: 4,
        comment: 'Professional team and good communication throughout the project.',
        date: '2024-03-05',
        helpful: 8,
      },
    ]
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(mockReviews))
  }
}

// Generic storage helpers
export const getStorage = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch {
    return defaultValue
  }
}

export const setStorage = <T>(key: string, value: T): void => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error('Error saving to localStorage:', error)
  }
}

// Specific helpers
export const getAgencies = () => getStorage(STORAGE_KEYS.AGENCIES, [])
export const setAgencies = (agencies: any[]) => setStorage(STORAGE_KEYS.AGENCIES, agencies)

export const getCompanies = () => getStorage(STORAGE_KEYS.COMPANIES, [])
export const setCompanies = (companies: any[]) => setStorage(STORAGE_KEYS.COMPANIES, companies)

export const getBookings = () => getStorage(STORAGE_KEYS.BOOKINGS, [])
export const setBookings = (bookings: any[]) => setStorage(STORAGE_KEYS.BOOKINGS, bookings)

export const getSavedAgencies = (userId?: string) => {
  const saved = getStorage(STORAGE_KEYS.SAVED_AGENCIES, [])
  return userId ? saved.filter((s: any) => s.userId === userId) : saved
}
export const setSavedAgencies = (saved: any[]) => setStorage(STORAGE_KEYS.SAVED_AGENCIES, saved)

export const getReviews = (agencyId?: string) => {
  const reviews = getStorage(STORAGE_KEYS.REVIEWS, [])
  return agencyId ? reviews.filter((r: any) => r.agencyId === agencyId) : reviews
}
export const setReviews = (reviews: any[]) => setStorage(STORAGE_KEYS.REVIEWS, reviews)

export const getServices = (agencyId?: string) => {
  const services = getStorage(STORAGE_KEYS.SERVICES, [])
  return agencyId ? services.filter((s: any) => s.agencyId === agencyId) : services
}
export const setServices = (services: any[]) => setStorage(STORAGE_KEYS.SERVICES, services)

export const getProjects = (agencyId?: string) => {
  const projects = getStorage(STORAGE_KEYS.PROJECTS, [])
  return agencyId ? projects.filter((p: any) => p.agencyId === agencyId) : projects
}
export const setProjects = (projects: any[]) => setStorage(STORAGE_KEYS.PROJECTS, projects)

export const getCurrentUser = () => getStorage(STORAGE_KEYS.CURRENT_USER, null)
export const setCurrentUser = (user: any) => setStorage(STORAGE_KEYS.CURRENT_USER, user)

// Clear all data (for testing)
export const clearAllData = () => {
  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key)
  })
  initializeMockData()
}

