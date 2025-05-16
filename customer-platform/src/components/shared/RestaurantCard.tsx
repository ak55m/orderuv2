import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, DollarSign } from 'lucide-react';

interface RestaurantCardProps {
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

const RestaurantCard: React.FC<RestaurantCardProps> = ({
  id,
  name,
  image,
  logo,
  rating,
  reviewCount,
  cuisineType,
  deliveryTime,
  deliveryFee,
  minOrder,
  distance,
  promoted = false
}) => {
  return (
    <Link to={`/restaurants/${id}`} className="block">
      <div className="restaurant-card bg-white rounded-xl overflow-hidden">
        {/* Restaurant Cover Image */}
        <div className="relative h-36 w-full overflow-hidden">
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover"
          />
          
          {/* Delivery Time Tag */}
          <div className="absolute bottom-2 left-2 bg-white text-text-dark text-xs px-2 py-1 rounded-full font-medium">
            {deliveryTime} min
          </div>
          
          {/* Discount Tag - optional */}
          {promoted && (
            <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded-full font-medium">
              $10 off
            </div>
          )}
        </div>
        
        {/* Restaurant Info */}
        <div className="p-3">
          <h3 className="text-base font-bold text-text-dark mb-1">{name}</h3>
          
          {/* Restaurant Info */}
          <div className="flex items-center mb-1">
            <div className="flex items-center text-primary mr-2">
              <Star size={14} fill="currentColor" />
              <span className="ml-1 text-xs font-medium">{rating.toFixed(1)}</span>
            </div>
            <span className="text-text-gray text-xs">({reviewCount})</span>
            <span className="mx-1 text-text-gray">•</span>
            <span className="text-text-gray text-xs">{cuisineType}</span>
          </div>
          
          {/* Delivery Info */}
          <div className="flex items-center text-xs text-text-gray">
            <span className="mr-2">{distance.toFixed(1)} km</span>
            <span className="mr-2">•</span>
            <span>{deliveryFee === 0 ? 'Free delivery' : `$${deliveryFee.toFixed(2)} delivery`}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard; 