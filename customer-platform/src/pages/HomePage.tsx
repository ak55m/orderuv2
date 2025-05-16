import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, User } from 'lucide-react';

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

interface BrandRestaurant {
  id: string;
  name: string;
  logo: string;
}

interface Banner {
  id: string;
  title: string;
  subtitle: string;
  label?: string;
  image: string;
  color: string;
}

const HomePage: React.FC = () => {
  const [popularRestaurants, setPopularRestaurants] = useState<Restaurant[]>([]);
  const [brandRestaurants, setBrandRestaurants] = useState<BrandRestaurant[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [leftBannerIndex, setLeftBannerIndex] = useState(0);
  const [rightBannerIndex, setRightBannerIndex] = useState(1);
  const [brandCurrentPage, setBrandCurrentPage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchMove, setTouchMove] = useState<number | null>(null);
  
  // Swipe threshold (in pixels)
  const swipeThreshold = 40;
  const touchRef = useRef<HTMLDivElement>(null);
  
  // Refs for carousel scrolling
  const brandContainerRef = useRef<HTMLDivElement>(null);

  // Calculate items per page for brand restaurants
  const brandItemsPerPage = 6;
  const totalBrandPages = brandRestaurants.length ? Math.ceil(brandRestaurants.length / brandItemsPerPage) : 0;

  // Mock data loading
  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      // IMPORTANT: This is all dummy data for development purposes only.
      // In a production environment, this would be replaced with actual API calls
      // to fetch real restaurant data from the backend.

      // Mock banner data
      const bannersData: Banner[] = [
        {
          id: 'banner1',
          title: 'The Burgery Jyväskylä',
          subtitle: 'Grilled To Perfection - Powered By Better Food',
          label: 'RESTAURANT',
          image: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
          color: 'bg-gray-900'
        },
        {
          id: 'banner2',
          title: 'Wolt Market',
          subtitle: 'Fazer-ice creams $5.99. Flavors you already love.',
          label: 'OrderU Market',
          image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb',
          color: 'bg-orange-500'
        },
        {
          id: 'banner3',
          title: 'Fresh Sushi Delivered',
          subtitle: 'Authentic Japanese cuisine at your doorstep',
          label: 'TRENDING NOW',
          image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c',
          color: 'bg-blue-900'
        },
        {
          id: 'banner4',
          title: 'Pizza Festival',
          subtitle: 'Buy one, get one free on all large pizzas',
          label: 'LIMITED TIME',
          image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591',
          color: 'bg-red-700'
        },
        {
          id: 'banner5',
          title: 'Healthy Choices',
          subtitle: 'Fresh salads and bowls with free delivery',
          label: 'HEALTHY',
          image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
          color: 'bg-green-700'
        },
        {
          id: 'banner6',
          title: 'Coffee & Desserts',
          subtitle: '20% off your first dessert order',
          label: 'SWEET TREATS',
          image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e',
          color: 'bg-amber-800'
        }
      ];

      // Mock restaurant data
      const restaurantsData: Restaurant[] = [
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
        }
      ];
      
      // Mock brand restaurant data (popular restaurant chains) - just dummy data for development
      const brandsData: BrandRestaurant[] = [
        {
          id: '101',
          name: 'McDonald\'s',
          logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/McDonald%27s_Golden_Arches.svg/1200px-McDonald%27s_Golden_Arches.svg.png'
        },
        {
          id: '102',
          name: 'Subway',
          logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Subway_2016_logo.svg/2560px-Subway_2016_logo.svg.png'
        },
        {
          id: '103',
          name: 'Burger King',
          logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Burger_King_2020.svg/1200px-Burger_King_2020.svg.png'
        },
        {
          id: '104',
          name: 'KFC',
          logo: 'https://upload.wikimedia.org/wikipedia/sco/thumb/b/bf/KFC_logo.svg/1200px-KFC_logo.svg.png'
        },
        {
          id: '105',
          name: 'Taco Bell',
          logo: 'https://1000logos.net/wp-content/uploads/2017/06/Taco-Bell-Logo.png'
        },
        {
          id: '106',
          name: 'Rainbow Teashop',
          logo: 'https://img.freepik.com/premium-vector/bubble-tea-shop-logo-design-template_441059-119.jpg'
        },
        {
          id: '107',
          name: 'Dave\'s Hot Chicken',
          logo: 'https://pbs.twimg.com/profile_images/994717759089250304/GVpLEo1X_400x400.jpg'
        },
        {
          id: '108',
          name: 'Pizza Hut',
          logo: 'https://www.pizzahut.com/assets/w/images/Logo_PH_Retro.png'
        },
        {
          id: '109',
          name: 'Wendy\'s',
          logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/3/32/Wendy%27s_full_logo_2012.svg/1200px-Wendy%27s_full_logo_2012.svg.png'
        }
      ];
      
      // Sort by rating for popular restaurants
      setPopularRestaurants([...restaurantsData].sort((a, b) => b.rating - a.rating));
      setBrandRestaurants(brandsData);
      setBanners(bannersData);
      
      setLoading(false);
    }, 1000);
  }, []);

  // Initialize right banner index when banners are loaded
  useEffect(() => {
    if (banners.length > 1) {
      setRightBannerIndex(1);
    }
  }, [banners.length]);

  // Banner navigation functions
  const nextBanner = () => {
    if (isAnimating || banners.length < 3) return;
    
    setIsAnimating(true);
    setSlideDirection('right');
    
    setTimeout(() => {
      // Shift to the next banner in the list
      const nextIndex = (leftBannerIndex + 1) % banners.length;
      setLeftBannerIndex(nextIndex);
      setRightBannerIndex((nextIndex + 1) % banners.length);
      
      setIsAnimating(false);
    }, 950);
  };

  const prevBanner = () => {
    if (isAnimating || banners.length < 3) return;
    
    setIsAnimating(true);
    setSlideDirection('left');
    
    setTimeout(() => {
      // Shift to the previous banner in the list
      const prevIndex = (leftBannerIndex - 1 + banners.length) % banners.length;
      setLeftBannerIndex(prevIndex);
      setRightBannerIndex((prevIndex + 1) % banners.length);
      
      setIsAnimating(false);
    }, 950);
  };

  // Brand restaurants navigation
  const nextBrandPage = () => {
    if (brandCurrentPage < totalBrandPages - 1) {
      setBrandCurrentPage(brandCurrentPage + 1);
      scrollBrandContainer('next');
    }
  };

  const prevBrandPage = () => {
    if (brandCurrentPage > 0) {
      setBrandCurrentPage(brandCurrentPage - 1);
      scrollBrandContainer('prev');
    }
  };

  const scrollBrandContainer = (direction: 'next' | 'prev') => {
    if (brandContainerRef.current) {
      const container = brandContainerRef.current;
      const scrollAmount = container.clientWidth;
      container.scrollTo({
        left: direction === 'next' 
          ? container.scrollLeft + scrollAmount 
          : container.scrollLeft - scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const isMobile = useIsMobile();

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchMove(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    e.preventDefault(); // Prevent scrolling while swiping
    setTouchMove(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchMove) return;
    
    const distance = touchStart - touchMove;
    const isLeftSwipe = distance > swipeThreshold;
    const isRightSwipe = distance < -swipeThreshold;
    
    if (isLeftSwipe && !isAnimating) {
      nextBanner();
    }
    if (isRightSwipe && !isAnimating) {
      prevBanner();
    }
    
    // Reset touch coordinates
    setTouchMove(null);
    setTouchStart(null);
  };

  const content = (
    <div className="home-page">
      {/* Banner Ads Section */}
      <div className="relative mb-8 pt-12 md:pt-0">
        {/* Left Arrow */}
        {!loading && (
        <button 
          onClick={prevBanner}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2 z-10 bg-white hover:bg-gray-100 rounded-full p-2 shadow-md w-10 h-10 flex items-center justify-center"
          aria-label="Previous banner"
          disabled={isAnimating}
        >
          <ChevronLeft size={20} className="text-gray-700" />
        </button>
        )}
        
        {/* Right Arrow */}
        {!loading && (
        <button 
          onClick={nextBanner}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 z-10 bg-white hover:bg-gray-100 rounded-full p-2 shadow-md w-10 h-10 flex items-center justify-center"
          aria-label="Next banner"
          disabled={isAnimating}
        >
          <ChevronRight size={20} className="text-gray-700" />
        </button>
        )}
        
        {loading ? (
          <div>
            {/* Main Banners */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="rounded-lg overflow-hidden relative h-48 md:h-80 bg-gray-200 animate-pulse">
                {/* Skeleton content structure to match banner layout */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <div className="space-y-2">
                    <div className="h-4 w-20 bg-gray-300 rounded animate-pulse" /> {/* Label */}
                    <div className="h-6 w-3/4 bg-gray-300 rounded animate-pulse" /> {/* Title */}
                    <div className="h-4 w-2/3 bg-gray-300 rounded animate-pulse" /> {/* Subtitle */}
                  </div>
                </div>
              </div>
              <div className="hidden md:block rounded-lg overflow-hidden relative h-80 bg-gray-200 animate-pulse">
                {/* Skeleton content structure for desktop second banner */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <div className="space-y-2">
                    <div className="h-4 w-20 bg-gray-300 rounded animate-pulse" />
                    <div className="h-6 w-3/4 bg-gray-300 rounded animate-pulse" />
                    <div className="h-4 w-2/3 bg-gray-300 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Full Width Feature Banner Skeleton */}
            <div className="rounded-lg overflow-hidden relative h-40 bg-gray-200 animate-pulse">
              <div className="absolute inset-0 p-6 flex flex-col justify-center items-center">
                <div className="space-y-3 text-center w-full">
                  <div className="h-5 w-24 bg-gray-300 rounded-full mx-auto" /> {/* FEATURED label */}
                  <div className="h-8 w-3/4 bg-gray-300 rounded mx-auto" /> {/* Title */}
                  <div className="h-6 w-2/3 bg-gray-300 rounded mx-auto" /> {/* Subtitle */}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-hidden relative">
            {/* Show one banner on mobile, two on desktop */}
            <div 
              ref={touchRef}
              className="relative h-48 md:h-80 touch-pan-x select-none cursor-grab active:cursor-grabbing"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              onTouchCancel={onTouchEnd}
            >
              {/* Current Banner */}
              <div className={`absolute inset-0 rounded-lg overflow-hidden transform transition-transform duration-500 ${
                isAnimating ? (slideDirection === 'right' ? 'animate-slideOutLeft' : 'animate-slideOutRight') : ''
              }`}>
              <div className={`h-full w-full ${banners[leftBannerIndex]?.color || 'bg-gray-900'}`}>
                <img 
                  src={banners[leftBannerIndex]?.image} 
                  alt={banners[leftBannerIndex]?.title}
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <div className="text-white">
                    {banners[leftBannerIndex]?.label && (
                        <div className="text-xs md:text-sm uppercase tracking-wide font-medium mb-1">
                        {banners[leftBannerIndex]?.label}
                      </div>
                    )}
                      <h2 className="text-xl md:text-3xl font-bold mb-1">
                      {banners[leftBannerIndex]?.title}
                    </h2>
                      <p className="text-xs md:text-sm opacity-90">
                      {banners[leftBannerIndex]?.subtitle}
                    </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Incoming Banner */}
              {isAnimating && (
                <div className={`absolute inset-0 rounded-lg overflow-hidden transform transition-transform duration-500 ${
                  slideDirection === 'right' ? 'animate-slideInFromRight' : 'animate-slideInFromLeft'
                }`}>
                  <div className={`h-full w-full ${banners[(slideDirection === 'right' ? 
                    (leftBannerIndex + 1) : (leftBannerIndex - 1 + banners.length)) % banners.length]?.color || 'bg-gray-900'}`}>
                    <img 
                      src={banners[(slideDirection === 'right' ? 
                        (leftBannerIndex + 1) : (leftBannerIndex - 1 + banners.length)) % banners.length]?.image} 
                      alt="Next banner"
                      className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 p-6 flex flex-col justify-end">
                      <div className="text-white">
                        {banners[(slideDirection === 'right' ? 
                          (leftBannerIndex + 1) : (leftBannerIndex - 1 + banners.length)) % banners.length]?.label && (
                          <div className="text-xs md:text-sm uppercase tracking-wide font-medium mb-1">
                            {banners[(slideDirection === 'right' ? 
                              (leftBannerIndex + 1) : (leftBannerIndex - 1 + banners.length)) % banners.length]?.label}
                          </div>
                        )}
                        <h2 className="text-xl md:text-3xl font-bold mb-1">
                          {banners[(slideDirection === 'right' ? 
                            (leftBannerIndex + 1) : (leftBannerIndex - 1 + banners.length)) % banners.length]?.title}
                        </h2>
                        <p className="text-xs md:text-sm opacity-90">
                          {banners[(slideDirection === 'right' ? 
                            (leftBannerIndex + 1) : (leftBannerIndex - 1 + banners.length)) % banners.length]?.subtitle}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="hidden md:block rounded-lg overflow-hidden h-80">
              <div className={`h-full w-full ${banners[rightBannerIndex]?.color || 'bg-orange-500'}`}>
                <img 
                  src={banners[rightBannerIndex]?.image} 
                  alt={banners[rightBannerIndex]?.title}
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <div className="text-white">
                    {banners[rightBannerIndex]?.label && (
                      <div className="text-xs md:text-sm uppercase tracking-wide font-medium mb-1">
                        {banners[rightBannerIndex]?.label}
                      </div>
                    )}
                    <h2 className="text-2xl font-bold mb-1">
                      {banners[rightBannerIndex]?.title}
                    </h2>
                    <p className="text-xs md:text-sm opacity-90">
                      {banners[rightBannerIndex]?.subtitle}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* CSS Animation Classes */}
      <style>
        {`
          @keyframes slideOutLeft {
            0% { transform: translateX(0); opacity: 1; }
            100% { transform: translateX(-105%); opacity: 1; }
          }
          
          @keyframes slideOutRight {
            0% { transform: translateX(0); opacity: 1; }
            100% { transform: translateX(105%); opacity: 1; }
          }
          
          @keyframes slideInFromRight {
            0% { transform: translateX(105%); opacity: 1; }
            100% { transform: translateX(0); opacity: 1; }
          }
          
          @keyframes slideInFromLeft {
            0% { transform: translateX(-105%); opacity: 1; }
            100% { transform: translateX(0); opacity: 1; }
          }

          .animate-slideOutLeft {
            animation: slideOutLeft 0.9s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          }

          .animate-slideOutRight {
            animation: slideOutRight 0.9s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          }

          .animate-slideInFromRight {
            animation: slideInFromRight 0.9s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          }

          .animate-slideInFromLeft {
            animation: slideInFromLeft 0.9s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          }
        `}
      </style>
      
      {/* Additional Banner Row - Full Width Feature Banner */}
      {!loading && banners.length > 0 && (
        <div className="mb-8">
          <div className={`rounded-lg overflow-hidden relative h-40 ${
            banners[(leftBannerIndex + 2) % banners.length]?.color || 'bg-blue-600'
          }`}>
            <img 
              src={banners[(leftBannerIndex + 2) % banners.length]?.image}
              alt={banners[(leftBannerIndex + 2) % banners.length]?.title}
              className="w-full h-full object-cover opacity-70"
            />
            <div className="absolute inset-0 p-6 flex flex-col justify-center items-center">
              <div className="text-white text-center">
                <div className="inline-block bg-white text-primary px-3 py-1 rounded-full text-sm font-bold mb-2">
                  FEATURED
                </div>
                <h2 className="text-3xl font-bold mb-2">
                  {banners[(leftBannerIndex + 2) % banners.length]?.title}
                </h2>
                <p className="text-lg max-w-2xl">
                  {banners[(leftBannerIndex + 2) % banners.length]?.subtitle}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Popular Restaurants Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg md:text-2xl font-bold text-text-dark">Popular restaurants</h2>
          <div className="flex items-center">
            <Link to="/restaurants" className="text-primary hover:text-primary font-medium text-sm mr-4">
              See all
            </Link>
          </div>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="bg-gray-100 animate-pulse h-36 rounded-lg"></div>
            ))}
          </div>
        ) : (
          <div 
            ref={brandContainerRef}
            className="flex overflow-x-auto pb-4 scrollbar-hide snap-x space-x-4 scroll-smooth"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {brandRestaurants.map((brand) => (
              <div 
                key={brand.id}
                className="flex-none w-[150px] sm:w-[180px] snap-start"
              >
                <Link 
                  to={`/restaurants/${brand.id}`}
                  className="bg-white border border-gray-100 rounded-lg p-3 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-shadow h-36 w-full"
                >
                  <div className="w-full h-24 flex items-center justify-center p-2 overflow-hidden">
                    <img 
                      src={brand.logo} 
                      alt={brand.name} 
                      className="max-w-full max-h-full object-contain"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        // Try various fallback options
                        if (target.src === brand.logo) {
                          // First fallback - try 1000logos.net if not already using it
                          if (!brand.logo.includes('1000logos.net')) {
                            target.src = `https://1000logos.net/wp-content/uploads/2023/04/${brand.name.replace(/['\s]/g, '-').toLowerCase()}-logo.png`;
                          } else {
                            // Second fallback - generated placeholder with name
                            target.src = `https://placehold.co/300x200/e6e6e6/333333?text=${encodeURIComponent(brand.name)}`;
                          }
                        }
                      }}
                    />
                  </div>
                  <p className="mt-2 text-sm text-center font-medium text-gray-700 truncate w-full">
                    {brand.name}
                  </p>
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
      
      {/* Dinner Near You Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg md:text-2xl font-bold text-text-dark">Dinner near you</h2>
          <div className="flex items-center">
            <Link to="/restaurants" className="text-primary hover:text-primary font-medium text-sm mr-4">
              See all
            </Link>
          </div>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="bg-primary-light animate-pulse h-64 rounded-lg"></div>
            ))}
          </div>
        ) : (
          <div className="flex overflow-x-auto pb-4 scrollbar-hide snap-x space-x-4 scroll-smooth">
            {popularRestaurants.slice(0, 4).map((restaurant) => (
              <div 
                key={restaurant.id} 
                className="flex-none w-[280px] snap-start rounded-lg transition-shadow duration-200"
              >
                <div className="h-full bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-md">
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
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );

  return isMobile ? (
    <MobileLayout>{content}</MobileLayout>
  ) : (
    <WebLayout>{content}</WebLayout>
  );
};

export default HomePage; 