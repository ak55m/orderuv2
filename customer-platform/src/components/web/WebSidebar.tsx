import React, { useState } from 'react';
import { 
  Filter, Star, DollarSign, Clock, MapPin, ChevronDown, ChevronUp 
} from 'lucide-react';

interface FilterSection {
  id: string;
  title: string;
  isOpen: boolean;
}

const WebSidebar: React.FC = () => {
  // Filter sections state
  const [sections, setSections] = useState<FilterSection[]>([
    { id: 'cuisine', title: 'Cuisine Type', isOpen: true },
    { id: 'price', title: 'Price Range', isOpen: true },
    { id: 'rating', title: 'Rating', isOpen: true },
    { id: 'delivery', title: 'Delivery Time', isOpen: true },
    { id: 'distance', title: 'Distance', isOpen: false },
    { id: 'dietary', title: 'Dietary Preferences', isOpen: false },
  ]);
  
  // Cuisine filter state
  const [cuisines, setCuisines] = useState({
    italian: false,
    chinese: false,
    indian: false,
    mexican: false,
    japanese: false,
    american: false,
    thai: false,
  });
  
  // Price range filter state
  const [priceRange, setPriceRange] = useState({
    budget: false,
    moderate: false,
    expensive: false,
    luxury: false,
  });
  
  // Rating filter state
  const [minRating, setMinRating] = useState<number | null>(null);
  
  // Delivery time filter state
  const [maxDeliveryTime, setMaxDeliveryTime] = useState<number | null>(null);
  
  // Dietary preferences filter state
  const [dietary, setDietary] = useState({
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    halal: false,
    kosher: false,
  });
  
  // Toggle section open/close
  const toggleSection = (id: string) => {
    setSections(sections.map(section => 
      section.id === id ? { ...section, isOpen: !section.isOpen } : section
    ));
  };
  
  // Handle cuisine checkbox change
  const handleCuisineChange = (cuisine: keyof typeof cuisines) => {
    setCuisines({ ...cuisines, [cuisine]: !cuisines[cuisine] });
  };
  
  // Handle price range checkbox change
  const handlePriceRangeChange = (price: keyof typeof priceRange) => {
    setPriceRange({ ...priceRange, [price]: !priceRange[price] });
  };
  
  // Handle rating selection
  const handleRatingClick = (rating: number) => {
    setMinRating(minRating === rating ? null : rating);
  };
  
  // Handle delivery time selection
  const handleDeliveryTimeClick = (time: number) => {
    setMaxDeliveryTime(maxDeliveryTime === time ? null : time);
  };
  
  // Handle dietary preference change
  const handleDietaryChange = (preference: keyof typeof dietary) => {
    setDietary({ ...dietary, [preference]: !dietary[preference] });
  };
  
  // Clear all filters
  const clearFilters = () => {
    setCuisines(Object.keys(cuisines).reduce((acc, key) => ({ ...acc, [key]: false }), {} as typeof cuisines));
    setPriceRange(Object.keys(priceRange).reduce((acc, key) => ({ ...acc, [key]: false }), {} as typeof priceRange));
    setMinRating(null);
    setMaxDeliveryTime(null);
    setDietary(Object.keys(dietary).reduce((acc, key) => ({ ...acc, [key]: false }), {} as typeof dietary));
  };

  return (
    <div className="web-sidebar-content h-full overflow-y-auto py-6 px-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold flex items-center text-text-dark">
          <Filter size={18} className="mr-2" />
          Filters
        </h2>
        <button 
          onClick={clearFilters}
          className="text-sm text-primary hover:text-primary"
        >
          Clear All
        </button>
      </div>
      
      {/* Cuisine Type Section */}
      <div className="mb-6">
        <button 
          className="flex items-center justify-between w-full text-left font-medium mb-3 text-text-dark"
          onClick={() => toggleSection('cuisine')}
        >
          <span>Cuisine Type</span>
          {sections.find(s => s.id === 'cuisine')?.isOpen ? 
            <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        
        {sections.find(s => s.id === 'cuisine')?.isOpen && (
          <div className="space-y-2 pl-1">
            {Object.entries(cuisines).map(([key, value]) => (
              <label key={key} className="flex items-center space-x-2 text-text-gray">
                <input 
                  type="checkbox" 
                  checked={value} 
                  onChange={() => handleCuisineChange(key as keyof typeof cuisines)}
                  className="rounded text-primary focus:ring-primary"
                />
                <span className="capitalize">{key}</span>
              </label>
            ))}
          </div>
        )}
      </div>
      
      {/* Price Range Section */}
      <div className="mb-6">
        <button 
          className="flex items-center justify-between w-full text-left font-medium mb-3 text-text-dark"
          onClick={() => toggleSection('price')}
        >
          <span>Price Range</span>
          {sections.find(s => s.id === 'price')?.isOpen ? 
            <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        
        {sections.find(s => s.id === 'price')?.isOpen && (
          <div className="space-y-2 pl-1">
            <label className="flex items-center space-x-2 text-text-gray">
              <input 
                type="checkbox" 
                checked={priceRange.budget} 
                onChange={() => handlePriceRangeChange('budget')}
                className="rounded text-primary focus:ring-primary"
              />
              <span className="flex items-center"><DollarSign size={16} /></span>
            </label>
            <label className="flex items-center space-x-2 text-text-gray">
              <input 
                type="checkbox" 
                checked={priceRange.moderate} 
                onChange={() => handlePriceRangeChange('moderate')}
                className="rounded text-primary focus:ring-primary"
              />
              <span className="flex items-center"><DollarSign size={16} /><DollarSign size={16} /></span>
            </label>
            <label className="flex items-center space-x-2 text-text-gray">
              <input 
                type="checkbox" 
                checked={priceRange.expensive} 
                onChange={() => handlePriceRangeChange('expensive')}
                className="rounded text-primary focus:ring-primary"
              />
              <span className="flex items-center"><DollarSign size={16} /><DollarSign size={16} /><DollarSign size={16} /></span>
            </label>
            <label className="flex items-center space-x-2 text-text-gray">
              <input 
                type="checkbox" 
                checked={priceRange.luxury} 
                onChange={() => handlePriceRangeChange('luxury')}
                className="rounded text-primary focus:ring-primary"
              />
              <span className="flex items-center"><DollarSign size={16} /><DollarSign size={16} /><DollarSign size={16} /><DollarSign size={16} /></span>
            </label>
          </div>
        )}
      </div>
      
      {/* Rating Section */}
      <div className="mb-6">
        <button 
          className="flex items-center justify-between w-full text-left font-medium mb-3 text-text-dark"
          onClick={() => toggleSection('rating')}
        >
          <span>Rating</span>
          {sections.find(s => s.id === 'rating')?.isOpen ? 
            <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        
        {sections.find(s => s.id === 'rating')?.isOpen && (
          <div className="space-y-2 pl-1">
            {[5, 4, 3, 2, 1].map(rating => (
              <button 
                key={rating}
                onClick={() => handleRatingClick(rating)}
                className={`flex items-center space-x-1 ${minRating === rating ? 'text-text-dark font-medium' : 'text-text-gray'}`}
              >
                <span className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      size={16} 
                      fill={i < rating ? 'currentColor' : 'none'} 
                      className={i < rating ? 'text-primary' : 'text-primary-light'} 
                    />
                  ))}
                </span>
                <span className="text-sm">{rating === 1 ? '& up' : `${rating}+ stars`}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Delivery Time Section */}
      <div className="mb-6">
        <button 
          className="flex items-center justify-between w-full text-left font-medium mb-3 text-text-dark"
          onClick={() => toggleSection('delivery')}
        >
          <span>Delivery Time</span>
          {sections.find(s => s.id === 'delivery')?.isOpen ? 
            <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        
        {sections.find(s => s.id === 'delivery')?.isOpen && (
          <div className="space-y-2 pl-1">
            {[15, 30, 45, 60].map(time => (
              <button 
                key={time}
                onClick={() => handleDeliveryTimeClick(time)}
                className={`flex items-center space-x-2 ${maxDeliveryTime === time ? 'text-text-dark font-medium' : 'text-text-gray'}`}
              >
                <Clock size={16} className={maxDeliveryTime === time ? 'text-primary' : 'text-primary-light'} />
                <span className="text-sm">{time} min or less</span>
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Dietary Preferences Section */}
      <div className="mb-6">
        <button 
          className="flex items-center justify-between w-full text-left font-medium mb-3 text-text-dark"
          onClick={() => toggleSection('dietary')}
        >
          <span>Dietary Preferences</span>
          {sections.find(s => s.id === 'dietary')?.isOpen ? 
            <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        
        {sections.find(s => s.id === 'dietary')?.isOpen && (
          <div className="space-y-2 pl-1">
            {Object.entries(dietary).map(([key, value]) => (
              <label key={key} className="flex items-center space-x-2 text-text-gray">
                <input 
                  type="checkbox" 
                  checked={value} 
                  onChange={() => handleDietaryChange(key as keyof typeof dietary)}
                  className="rounded text-primary focus:ring-primary"
                />
                <span className="capitalize">{key === 'glutenFree' ? 'Gluten-Free' : key}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WebSidebar; 