'use client';

import { useState, useEffect } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface Service {
  _id: string;
  name: string;
  description?: string;
  imageURL?: string;
}

interface CategoriesPageProps {
  onCategorySelect: (category: Service) => void;
}

const CategoriesPage = ({ onCategorySelect }: CategoriesPageProps) => {
  const [services, setServices] = useState<Service[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/services');
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error('Failed to fetch services:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Category icons/emojis mapping
  const categoryIcons: Record<string, string> = {
    'Digital Marketing': '📱',
    'Social Media': '💬',
    'Branding': '🎨',
    'Public Relations': '🎤',
    'Creative & Design': '✨',
    'Web Development': '💻',
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Find Your Next Advertising Partner
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Discover and book the perfect agency for your next campaign.
        </p>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search for agencies or services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-6 rounded-2xl border-2 border-gray-200 focus:border-emerald-500 text-base shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Explore by Category</h2>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <div
                key={service._id}
                onClick={() => onCategorySelect(service)}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border-2 border-transparent hover:border-emerald-200"
              >
                {service.imageURL ? (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={service.imageURL}
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                    <span className="text-7xl">{categoryIcons[service.name] || '📋'}</span>
                  </div>
                )}
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {service.description || 'Drive traffic and generate leads online.'}
                  </p>
                  <div className="flex items-center text-emerald-600 font-medium group-hover:gap-3 gap-2 transition-all">
                    <span>View Agencies</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredServices.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl">
            <p className="text-gray-600 text-lg">No categories found matching your search.</p>
          </div>
        )}
      </div>

      {/* Info Footer */}
      <div className="mt-16 text-center text-gray-500 text-sm">
        <p>© 2024 AgencyFinder. All rights reserved.</p>
      </div>
    </div>
  );
};

export default CategoriesPage;