import React, { useState, useEffect } from 'react';
import { ChevronDown, Filter, MapPin, Search } from 'lucide-react';

// Import components
import WebLayout from '../layouts/WebLayout';
import MobileLayout from '../layouts/MobileLayout';
import RestaurantCard from '../components/shared/RestaurantCard';
import { useIsMobile } from '../hooks/useIsMobile';

// Types
interface Restaurant {
  id: string;
  name: string;
  image: string;
  logo: string;
  rating: number;
  reviewCount: number;
  cuisineType: string;
  deliveryTime: number;
  deliveryFee: number;
  minOrder: number;
  distance: number;
  promoted?: boolean;
}

const RestaurantsPage: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState('recommended');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const isMobile = useIsMobile();
  
  // Fetch restaurants data
  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      // Mock data
      const mockData: Restaurant[] = [
        {
          id: '1',
          name: 'Burger Haven',
          image: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
          logo: 'https://images.unsplash.com/photo-1586816001966-79b736744398',
          rating: 4.7,
          reviewCount: 342,
          cuisineType: 'American',
          deliveryTime: 25,
          deliveryFee: 2.99,
          minOrder: 15,
          distance: 1.5,
          promoted: true
        },
        {
          id: '2',
          name: 'Pizza Paradise',
          image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591',
          logo: 'https://images.unsplash.com/photo-1544982503-9f984c14501a',
          rating: 4.5,
          reviewCount: 213,
          cuisineType: 'Italian',
          deliveryTime: 30,
          deliveryFee: 1.99,
          minOrder: 20,
          distance: 2.1
        },
        {
          id: '3',
          name: 'Sushi House',
          image: 'https://images.unsplash.com/photo-1553621042-f6e147245754',
          logo: 'https://images.unsplash.com/photo-1578039039984-869a6d485450',
          rating: 4.8,
          reviewCount: 178,
          cuisineType: 'Japanese',
          deliveryTime: 35,
          deliveryFee: 3.99,
          minOrder: 25,
          distance: 3.0
        },
        {
          id: '4',
          name: 'Taco Time',
          image: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85',
          logo: 'https://images.unsplash.com/photo-1471523835123-1172efe5eaa1',
          rating: 4.3,
          reviewCount: 156,
          cuisineType: 'Mexican',
          deliveryTime: 20,
          deliveryFee: 1.49,
          minOrder: 12,
          distance: 0.8
        },
        {
          id: '5',
          name: 'Curry Corner',
          image: 'https://images.unsplash.com/photo-1505253758473-96b7015fcd40',
          logo: 'https://images.unsplash.com/photo-1534083264897-aeabecf131e8',
          rating: 4.6,
          reviewCount: 201,
          cuisineType: 'Indian',
          deliveryTime: 40,
          deliveryFee: 2.49,
          minOrder: 18,
          distance: 2.8,
          promoted: true
        },
        {
          id: '6',
          name: 'Noodle House',
          image: 'https://images.unsplash.com/photo-1555126634-323283e090fa',
          logo: 'https://images.unsplash.com/photo-1539735258950-8597109c1519',
          rating: 4.4,
          reviewCount: 145,
          cuisineType: 'Chinese',
          deliveryTime: 30,
          deliveryFee: 1.99,
          minOrder: 15,
          distance: 1.9
        },
        {
          id: '7',
          name: 'Breakfast Club',
          image: 'https://images.unsplash.com/photo-1608039790184-c1c7c245e564',
          logo: 'https://images.unsplash.com/photo-1534080564583-6be75777b70a',
          rating: 4.9,
          reviewCount: 289,
          cuisineType: 'Breakfast',
          deliveryTime: 25,
          deliveryFee: 2.99,
          minOrder: 10,
          distance: 1.2
        },
        {
          id: '8',
          name: 'Healthy Greens',
          image: 'https://images.unsplash.com/photo-1533622597524-a1215e26c0a2',
          logo: 'https://images.unsplash.com/photo-1529599568231-1a52b01aa22e',
          rating: 4.5,
          reviewCount: 176,
          cuisineType: 'Vegetarian',
          deliveryTime: 20,
          deliveryFee: 3.49,
          minOrder: 15,
          distance: 1.7
        }
      ];
      
      setRestaurants(mockData);
      setLoading(false);
    }, 1000);
  }, []);
  
  // Sort restaurants based on selected option
  const sortedRestaurants = [...restaurants].sort((a, b) => {
    switch (sortOption) {
      case 'rating':
        return b.rating - a.rating;
      case 'deliveryTime':
        return a.deliveryTime - b.deliveryTime;
      case 'deliveryFee':
        return a.deliveryFee - b.deliveryFee;
      case 'minOrder':
        return a.minOrder - b.minOrder;
      case 'distance':
        return a.distance - b.distance;
      default:
        // Recommended - promoted first, then by rating
        if (a.promoted && !b.promoted) return -1;
        if (!a.promoted && b.promoted) return 1;
        return b.rating - a.rating;
    }
  });
  
  const MobileContent = () => (
    <div className="min-h-screen bg-white">
      {/* Mobile Header - Removed location text */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold text-gray-900">Restaurants</h1>
          <button 
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="text-primary flex items-center text-sm font-medium"
          >
            <Filter size={18} className="mr-1" />
            Filters
          </button>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search restaurants..."
            className="w-full bg-gray-100 rounded-full py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Sort Options */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center space-x-3 overflow-x-auto scrollbar-hide">
        {['Recommended', 'Rating', 'Delivery Time', 'Delivery Fee', 'Min Order', 'Distance'].map((option) => (
          <button
            key={option}
            onClick={() => setSortOption(option.toLowerCase().replace(' ', ''))}
            className={`flex-none px-4 py-1.5 rounded-full text-sm font-medium ${
              sortOption === option.toLowerCase().replace(' ', '') 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {/* Restaurant Grid */}
      <div className="p-4">
        {loading ? (
          <div className="grid gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4">
            {sortedRestaurants.map((restaurant) => (
              <div key={restaurant.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <RestaurantCard {...restaurant} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const WebContent = () => (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Existing web content */}
      <div className="restaurants-page">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Restaurants</h1>
          <p className="text-gray-600 flex items-center">
            <MapPin size={16} className="mr-1" />
            Delivering to: 123 Main St, New York, NY
          </p>
        </div>
        
        {/* Mobile Filters Toggle */}
        {isMobile && (
          <div className="mb-4">
            <button 
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="w-full flex items-center justify-between p-3 bg-white border rounded-lg shadow-sm"
            >
              <span className="flex items-center">
                <Filter size={18} className="mr-2" />
                Filters
              </span>
              <ChevronDown size={18} className={`transform transition-transform ${showMobileFilters ? 'rotate-180' : ''}`} />
            </button>
            
            {showMobileFilters && (
              <div className="mt-2 p-4 bg-white border rounded-lg shadow-sm">
                {/* Mobile Filters Content - simplified version of the sidebar */}
                <div className="space-y-4">
                  {/* Sort options for mobile */}
                  <div>
                    <h3 className="font-medium mb-2">Sort By</h3>
                    <select 
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                      className="w-full p-2 border rounded"
                    >
                      <option value="recommended">Recommended</option>
                      <option value="rating">Rating</option>
                      <option value="deliveryTime">Delivery Time</option>
                      <option value="deliveryFee">Delivery Fee</option>
                      <option value="minOrder">Minimum Order</option>
                      <option value="distance">Distance</option>
                    </select>
                  </div>
                  
                  {/* Other simplified filters for mobile */}
                  {/* Cuisine Type */}
                  <div>
                    <h3 className="font-medium mb-2">Cuisine Type</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {['Italian', 'Chinese', 'Indian', 'Mexican', 'Japanese', 'American'].map(cuisine => (
                        <label key={cuisine} className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          <span>{cuisine}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  {/* Price Range */}
                  <div>
                    <h3 className="font-medium mb-2">Price Range</h3>
                    <div className="flex space-x-3">
                      {['$', '$$', '$$$', '$$$$'].map((price, index) => (
                        <label key={index} className="flex items-center">
                          <input type="checkbox" className="mr-1" />
                          <span>{price}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Sort Options - Desktop */}
        <div className="mb-6 hidden md:flex items-center justify-between">
          <p className="text-gray-600">
            <span className="font-medium">{restaurants.length}</span> restaurants available
          </p>
          
          <div className="flex items-center">
            <span className="mr-2 text-gray-700">Sort by:</span>
            <select 
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="p-2 border rounded bg-white"
            >
              <option value="recommended">Recommended</option>
              <option value="rating">Rating</option>
              <option value="deliveryTime">Delivery Time</option>
              <option value="deliveryFee">Delivery Fee</option>
              <option value="minOrder">Minimum Order</option>
              <option value="distance">Distance</option>
            </select>
          </div>
        </div>
        
        {/* Restaurants Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="bg-gray-100 animate-pulse h-64 rounded-lg"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedRestaurants.map((restaurant) => (
              <RestaurantCard 
                key={restaurant.id}
                id={restaurant.id}
                name={restaurant.name}
                image={restaurant.image}
                logo={restaurant.logo}
                rating={restaurant.rating}
                reviewCount={restaurant.reviewCount}
                cuisineType={restaurant.cuisineType}
                deliveryTime={restaurant.deliveryTime}
                deliveryFee={restaurant.deliveryFee}
                minOrder={restaurant.minOrder}
                distance={restaurant.distance}
                promoted={restaurant.promoted}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return isMobile ? (
    <MobileLayout>
      <MobileContent />
    </MobileLayout>
  ) : (
    <WebLayout>
      <WebContent />
    </WebLayout>
  );
};

export default RestaurantsPage; 