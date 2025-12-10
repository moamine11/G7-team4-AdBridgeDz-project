'use client';

import { useState, useEffect } from 'react';
import { Search, ArrowRight, Loader2 } from 'lucide-react';
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

const API_BASE_URL = 'http://localhost:5000/api';

const CategoriesPage = ({ onCategorySelect }: CategoriesPageProps) => {
  const [services, setServices] = useState<Service[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      // GET /api/services
      const response = await fetch(`${API_BASE_URL}/services`);
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

  const categoryIcons: Record<string, string> = {
    'Billboard & Roadside Advertising': '🛣️',
    'Digital Outdoor Screens (DOOH)': '📺',
    'Transit Advertising': '🚊',
    'Social Media Marketing': '📱',
    'Creative & Design': '🎨',
  };

  return (
    <div className="text-white">
      {/* Header and Search */}
      <div className="mb-12">
        {/* Search Bar */}
        <div className="max-w-2xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search by category name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-3 rounded-xl border-slate-700 bg-slate-800 text-white placeholder-gray-500"
            />
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="mb-8">
        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-12 h-12 animate-spin mx-auto text-cyan-400" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <div
                key={service._id}
                onClick={() => onCategorySelect(service)}
                className="group bg-slate-950 rounded-2xl shadow-xl hover:shadow-cyan-500/30 transition-all duration-300 cursor-pointer overflow-hidden border border-slate-700 hover:border-cyan-500"
              >
                {/* Image or Placeholder */}
                <div className="relative h-48 overflow-hidden bg-slate-800">
                  {service.imageURL ? (
                    <img
                      src={service.imageURL}
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 opacity-80"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-7xl">{categoryIcons[service.name] || '📋'}</span>
                    </div>
                  )}
                  {/* Status Tag - Placeholder to mimic the design */}
                  <span className="absolute top-4 left-4 text-xs font-semibold px-3 py-1 bg-cyan-900/80 text-cyan-400 rounded-full border border-cyan-800">
                      {service.name.split(' ')[0].toLowerCase()}
                  </span>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {service.description || 'Find agencies offering comprehensive advertising solutions.'}
                  </p>
                  <div className="flex items-center text-cyan-400 font-medium group-hover:gap-3 gap-2 transition-all">
                    <span className="flex items-center text-sm text-teal-400">
                        * Featured placements available
                    </span>
                    <span className="flex items-center">
                        Explore <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredServices.length === 0 && (
          <div className="text-center py-12 bg-slate-950 rounded-2xl border border-slate-700">
            <p className="text-gray-400 text-lg">No categories found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;