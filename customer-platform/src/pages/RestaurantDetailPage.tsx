import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Star, 
  Clock, 
  Truck, 
  DollarSign, 
  MapPin, 
  Phone, 
  Info, 
  Heart, 
  Share,
  ShoppingBag,
  Plus,
  Minus,
  ArrowLeft,
  Search,
  ThumbsUp,
  User,
  X
} from 'lucide-react';

// Import components
import WebLayout from '../layouts/WebLayout';
import MobileLayout from '../layouts/MobileLayout';
import AuthDialog from '../components/auth/AuthDialog';
import MenuItemDialog, { MenuItemProps, MenuItemModifier } from '../components/restaurant/MenuItemDialog';
import { useIsMobile } from '../hooks/useIsMobile';

// Types
interface Restaurant {
  id: string;
  name: string;
  image: string;
  logo: string;
  description: string;
  rating: number;
  reviewCount: number;
  cuisineType: string;
  deliveryTime: number;
  deliveryFee: number;
  minOrder: number;
  distance: number;
  address: string;
  phone: string;
  isOpen: boolean;
  openingHours: string;
  slogan?: string;
}

interface MenuItem extends MenuItemProps {
  modifiers?: MenuItemModifier[][];
}

interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}

const RestaurantDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [cartItemCounts, setCartItemCounts] = useState<Record<string, number>>({});
  const [cartVisible, setCartVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isNavSticky, setIsNavSticky] = useState(false);
  const categoriesRef = useRef<HTMLDivElement>(null);
  
  // Auth dialog state
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [authDialogMode, setAuthDialogMode] = useState<'login' | 'signup'>('login');
  
  // Add state for the menu item dialog
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [menuItemDialogOpen, setMenuItemDialogOpen] = useState(false);
  
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  
  const openLoginDialog = () => {
    setAuthDialogMode('login');
    setAuthDialogOpen(true);
  };
  
  const openSignupDialog = () => {
    setAuthDialogMode('signup');
    setAuthDialogOpen(true);
  };
  
  const closeAuthDialog = () => {
    setAuthDialogOpen(false);
  };
  
  const openMenuItemDialog = (item: MenuItem) => {
    setSelectedItem(item);
    setMenuItemDialogOpen(true);
  };
  
  const closeMenuItemDialog = () => {
    setMenuItemDialogOpen(false);
    setSelectedItem(null);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = document.getElementById('profile-dropdown');
      const profileButton = document.getElementById('profile-button');
      if (dropdown && profileButton && 
          !dropdown.contains(event.target as Node) && 
          !profileButton.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Add scroll event listener with throttling for smoother performance
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 0);
      
      // Get search bar position
      const searchBarSection = document.getElementById('search-bar-section');
      if (searchBarSection) {
        const searchBarRect = searchBarSection.getBoundingClientRect();
        const headerHeight = 96; // Height of the header (both rows)
        
        if (searchBarRect.top <= headerHeight) {
          // Calculate how much of the header should be pushed up
          const pushUpAmount = headerHeight - searchBarRect.top;
          const headerElement = document.getElementById('mobile-header');
          if (headerElement) {
            headerElement.style.transform = `translateY(-${Math.min(pushUpAmount, headerHeight)}px)`;
          }
          
          // Make search bar fixed only when it's fully pushed the header up
          setIsNavSticky(pushUpAmount >= headerHeight);
        } else {
          const headerElement = document.getElementById('mobile-header');
          if (headerElement) {
            headerElement.style.transform = 'translateY(0)';
          }
          setIsNavSticky(false);
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch restaurant and menu data
  useEffect(() => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Mock restaurant data
      const restaurantData: Restaurant = {
        id: '1',
        name: 'Burger Haven',
        image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=2070',
        logo: 'https://images.unsplash.com/photo-1586816001966-79b736744398?q=80&w=1470',
        description: 'Serving the juiciest, most delicious burgers in town with fresh ingredients and homemade sauces.',
        rating: 4.7,
        reviewCount: 342,
        cuisineType: 'American',
        deliveryTime: 25,
        deliveryFee: 2.99,
        minOrder: 15,
        distance: 1.5,
        address: '123 Burger St, New York, NY 10001',
        phone: '(555) 123-4567',
        isOpen: true,
        openingHours: 'Mon-Sun: 10:00 AM - 10:00 PM'
      };
      
      // Mock menu data with added modifiers
      const menuData: MenuCategory[] = [
        {
          id: 'burgers',
          name: 'Burgers',
          items: [
            {
              id: 'classic-burger',
              name: 'Classic Burger',
              description: 'Beef patty, lettuce, tomato, onions, pickles, and our special sauce',
              price: 8.99,
              image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1899',
              popular: true,
              vegetarian: false,
              modifiers: [
                [
                  { id: 'remove-patty', name: 'Remove patty' },
                  { id: 'remove-lettuce', name: 'Remove lettuce' },
                  { id: 'remove-tomato', name: 'Remove tomato' },
                  { id: 'remove-onions', name: 'Remove onions' },
                  { id: 'remove-pickles', name: 'Remove pickles' },
                  { id: 'remove-sauce', name: 'Remove special sauce' }
                ]
              ]
            },
            {
              id: 'cheese-burger',
              name: 'Cheeseburger',
              description: 'Beef patty, American cheese, lettuce, tomato, onions, pickles, and our special sauce',
              price: 9.99,
              image: 'https://images.unsplash.com/photo-1550317138-10000687a72b?q=80&w=1920',
              popular: true,
              vegetarian: false,
              modifiers: [
                [
                  { id: 'remove-patty-cb', name: 'Remove patty' },
                  { id: 'remove-cheese-cb', name: 'Remove cheese' },
                  { id: 'remove-lettuce-cb', name: 'Remove lettuce' },
                  { id: 'remove-tomato-cb', name: 'Remove tomato' },
                  { id: 'remove-onions-cb', name: 'Remove onions' },
                  { id: 'remove-pickles-cb', name: 'Remove pickles' },
                  { id: 'remove-sauce-cb', name: 'Remove special sauce' }
                ]
              ]
            },
            {
              id: 'bacon-burger',
              name: 'Bacon Burger',
              description: 'Beef patty, crispy bacon, American cheese, lettuce, tomato, and BBQ sauce',
              price: 11.99,
              popular: false,
              vegetarian: false
            },
            {
              id: 'veggie-burger',
              name: 'Veggie Burger',
              description: 'Plant-based patty, lettuce, tomato, avocado, pickles, and vegan mayo',
              price: 10.99,
              image: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?q=80&w=1780',
              popular: false,
              vegetarian: true
            }
          ]
        },
        {
          id: 'sides',
          name: 'Sides',
          items: [
            {
              id: 'french-fries',
              name: 'French Fries',
              description: 'Crispy golden fries seasoned with sea salt',
              price: 3.99,
              image: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?q=80&w=1925',
              popular: true,
              vegetarian: true
            },
            {
              id: 'onion-rings',
              name: 'Onion Rings',
              description: 'Crispy battered onion rings served with dipping sauce',
              price: 4.99,
              popular: false,
              vegetarian: true
            },
            {
              id: 'coleslaw',
              name: 'Coleslaw',
              description: 'Fresh cabbage, carrots, and mayo dressing',
              price: 2.99,
              popular: false,
              vegetarian: true
            },
            {
              id: 'sweet-potato-fries',
              name: 'Sweet Potato Fries',
              description: 'Crispy sweet potato fries with a hint of cinnamon',
              price: 4.99,
              popular: true,
              vegetarian: true
            }
          ]
        },
        {
          id: 'drinks',
          name: 'Drinks',
          items: [
            {
              id: 'soda',
              name: 'Soda',
              description: 'Your choice of Coke, Diet Coke, Sprite, or Dr Pepper',
              price: 1.99,
              popular: false,
              vegetarian: true
            },
            {
              id: 'milkshake',
              name: 'Milkshake',
              description: 'Hand-spun vanilla, chocolate, or strawberry milkshake',
              price: 4.99,
              image: 'https://images.unsplash.com/photo-1638176067000-9e2f3af1ea0a?q=80&w=1780',
              popular: true,
              vegetarian: true
            },
            {
              id: 'iced-tea',
              name: 'Iced Tea',
              description: 'Freshly brewed iced tea, sweetened or unsweetened',
              price: 2.49,
              popular: false,
              vegetarian: true
            },
            {
              id: 'lemonade',
              name: 'Lemonade',
              description: 'Fresh-squeezed lemonade with a hint of mint',
              price: 2.99,
              popular: false,
              vegetarian: true
            }
          ]
        },
        {
          id: 'desserts',
          name: 'Desserts',
          items: [
            {
              id: 'ice-cream',
              name: 'Ice Cream',
              description: 'Two scoops of vanilla, chocolate, or strawberry ice cream',
              price: 3.99,
              popular: true,
              vegetarian: true
            },
            {
              id: 'apple-pie',
              name: 'Apple Pie',
              description: 'Warm apple pie with a scoop of vanilla ice cream',
              price: 5.99,
              image: 'https://images.unsplash.com/photo-1570145820259-b5b80c5c8bd6?q=80&w=1888',
              popular: true,
              vegetarian: true
            },
            {
              id: 'chocolate-brownie',
              name: 'Chocolate Brownie',
              description: 'Warm chocolate brownie with fudge sauce',
              price: 4.99,
              popular: false,
              vegetarian: true
            }
          ]
        }
      ];
      
      setRestaurant(restaurantData);
      setMenuCategories(menuData);
      if (menuData.length > 0) {
        setActiveCategory(menuData[0].id);
      }
      setLoading(false);
    }, 1000);
  }, [id]);
  
  // Update the addToCart function to handle modifiers and quantity
  const addToCart = (item: MenuItemProps, quantity: number, removedModifiers: string[] = []) => {
    // For simplicity, we'll just add the item to the cart multiple times based on quantity
    const itemId = item.id;
    
    setCartItemCounts(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + quantity
    }));

    // Store removed modifiers if needed (you could extend cartItemCounts to include this info)
    console.log('Item added with removed modifiers:', removedModifiers);
  };
  
  // Handle removing items from cart
  const removeFromCart = (itemId: string) => {
    setCartItemCounts(prev => {
      const newCounts = { ...prev };
      if (newCounts[itemId] > 1) {
        newCounts[itemId] -= 1;
      } else {
        delete newCounts[itemId];
      }
      return newCounts;
    });
  };
  
  // Calculate total items in cart
  const totalCartItems = Object.values(cartItemCounts).reduce((sum, count) => sum + count, 0);
  
  // Calculate total price of cart
  const calculateCartTotal = () => {
    let total = 0;
    Object.entries(cartItemCounts).forEach(([itemId, count]) => {
      // Find the menu item by ID
      menuCategories.forEach(category => {
        const item = category.items.find(item => item.id === itemId);
        if (item) {
          total += item.price * count;
        }
      });
    });
    return total.toFixed(2);
  };
  
  // Find all items in the cart
  const getCartItems = () => {
    const items: { item: MenuItem; quantity: number }[] = [];
    
    Object.entries(cartItemCounts).forEach(([itemId, quantity]) => {
      menuCategories.forEach(category => {
        const menuItem = category.items.find(item => item.id === itemId);
        if (menuItem) {
          items.push({ item: menuItem, quantity });
        }
      });
    });
    
    return items;
  };
  
  // Enhance scrollToCategory function to account for sticky header
  const scrollToCategory = (categoryId: string) => {
    setActiveCategory(categoryId);
    const element = document.getElementById(`category-${categoryId}`);
    if (element) {
      // Calculate offset to account for sticky header and category nav
      const offset = isNavSticky ? 120 : 20;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };
  
  const MobileContent = () => {
    if (!restaurant) return null;
    
    return (
      <div className="h-full bg-white">
        {/* Mobile Header */}
        <header id="mobile-header" className={`fixed top-0 left-0 right-0 z-[60] ${
          isScrolled ? 'bg-white shadow-sm' : 'bg-gradient-to-b from-black/50 to-transparent'
        }`}>
          <div className={`flex flex-col ${isScrolled ? 'bg-white' : ''}`}>
            {/* Top Row: Back Button and Cart/Profile */}
            <div className="flex items-center px-4 py-2">
              <button
                onClick={() => navigate('/')}
                className={`p-2 rounded-full ${
                  isScrolled ? 'text-gray-800' : 'text-white'
                }`}
                aria-label="Go back"
              >
                <ArrowLeft size={20} />
              </button>
              
              <div className="flex-1"></div>
              
              {/* Profile Icon with Dropdown */}
              <div className="flex items-center relative">
                <button 
                  id="profile-button"
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className={`p-2 rounded-full ${
                    isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white bg-white/10 hover:bg-white/20'
                  }`}
                >
                  <User size={20} />
                </button>
                
                {/* Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <div 
                    id="profile-dropdown"
                    className="absolute right-0 top-full mt-1 w-36 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50"
                  >
                    <button 
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        openLoginDialog();
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 border-b border-gray-200"
                    >
                      Log in
                    </button>
                    <button 
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        openSignupDialog();
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50"
                    >
                      Sign up
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Location Row */}
            <div className={`flex items-center px-4 py-1.5 ${
              isScrolled ? 'hidden' : 'block'
            }`}>
              <MapPin size={18} className={isScrolled ? 'text-gray-700' : 'text-white'} />
              <span className={`ml-2 text-sm font-medium ${
                isScrolled ? 'text-gray-700' : 'text-white'
              }`}>
                123 Burger St, New York
              </span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="h-full">
          {/* Restaurant Cover */}
          <div className="relative w-full h-48">
            <img 
              src={restaurant.image} 
              alt={restaurant.name} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
            
            {/* Restaurant Info */}
            <div className="absolute bottom-0 left-0 w-full p-4">
              <div>
                <h1 className="text-lg font-bold text-white">{restaurant.name}</h1>
                <p className="text-white/80 text-xs">{restaurant.slogan || 'Serving delicious food'}</p>
              </div>
            </div>
          </div>

          {/* Restaurant Stats */}
          <div className="px-4 py-3 bg-white border-b border-gray-200">
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center">
                <Clock size={14} className="text-gray-500 mr-1" />
                <span>{restaurant.isOpen ? "Open" : "Closed"}</span>
              </div>
              <div className="flex items-center">
                <Star size={14} className="text-amber-400 mr-1" fill="currentColor" />
                <span>{restaurant.rating}</span>
                <span className="text-gray-500 ml-1">({restaurant.reviewCount})</span>
              </div>
              <div className="flex items-center">
                <MapPin size={14} className="text-gray-500 mr-1" />
                <span>{restaurant.distance} km</span>
              </div>
            </div>
          </div>

          {/* Search Bar and Categories Section */}
          <div id="search-bar-section">
            {/* Spacer for when search is fixed */}
            {isNavSticky && <div className="h-[104px]"></div>}
            
            <div className={`${
              isNavSticky 
                ? 'fixed top-0 left-0 right-0 z-[60] bg-white shadow-sm' 
                : 'bg-white'
            }`}>
              {/* Search Bar */}
              <div className="px-4 py-3 border-b border-gray-200">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search menu items..."
                    className="w-full bg-gray-100 rounded-full py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <Search size={18} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              {/* Menu Categories */}
              <div className="border-b border-gray-200">
                <div className="flex overflow-x-auto scrollbar-hide px-4 py-2 space-x-4">
                  {menuCategories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => scrollToCategory(category.id)}
                      className={`whitespace-nowrap px-3 py-1.5 rounded-full text-sm font-medium ${
                        activeCategory === category.id 
                          ? 'bg-primary text-white' 
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-4">
            {menuCategories.map(category => (
              <div 
                key={category.id} 
                id={`category-${category.id}`}
                className="mb-6"
              >
                <h2 className="text-lg font-bold mb-3">{category.name}</h2>
                <div className="space-y-3">
                  {category.items.map(item => (
                    <div 
                      key={item.id}
                      onClick={() => openMenuItemDialog(item as MenuItem)}
                      className="bg-white rounded-lg border border-gray-200 p-3 flex items-center space-x-3"
                    >
                      {item.image && (
                        <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                          <img 
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-500 line-clamp-2 mt-0.5">{item.description}</p>
                        <p className="text-primary font-medium mt-1">${item.price.toFixed(2)}</p>
                      </div>
                      <button 
                        className="flex-shrink-0 bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          openMenuItemDialog(item as MenuItem);
                        }}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <footer className="bg-[#202125] text-center text-sm text-gray-400">
            <div className="px-4 py-6">
              <p>Developed by students at <span className="text-[#f48225]">UT DALLAS</span> 🚀</p>
              <div className="mt-4 space-y-2">
                <p>English</p>
                <p>Theme</p>
                <p>Cookies</p>
                <p>Accessibility Statement</p>
                <p>User Terms of Service</p>
                <p>Privacy Statement</p>
                <p className="mt-4">© orderU 2025</p>
              </div>
            </div>
          </footer>
        </main>

        {/* Cart Button - Fixed Footer */}
        {totalCartItems > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
            <div className="p-4">
              <button
                onClick={() => setCartVisible(true)}
                className="w-full flex items-center justify-center bg-primary text-white py-2.5 px-4 rounded-lg text-sm"
              >
                <span>View cart</span>
                <span className="ml-2">${calculateCartTotal()}</span>
              </button>
            </div>
          </div>
        )}

        {/* Dialogs */}
        <AuthDialog 
          isOpen={authDialogOpen} 
          onClose={closeAuthDialog} 
          initialMode={authDialogMode} 
        />
        
        {selectedItem && (
          <MenuItemDialog
            item={selectedItem}
            isOpen={menuItemDialogOpen}
            onClose={closeMenuItemDialog}
            onAddToCart={addToCart}
          />
        )}
      </div>
    );
  };
  
  if (loading || !restaurant) {
    return (
      <div className="animate-pulse">
        {/* Cover image skeleton */}
        <div className="relative w-full h-56 md:h-[22rem] bg-gray-200"></div>
        
        <div className="max-w-7xl mx-auto px-4">
          {/* Restaurant header with logo skeleton */}
          <div className="relative -mt-8">
            <div className="flex items-center">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-md bg-gray-300 mr-4"></div>
              <div>
                <div className="h-7 bg-gray-300 rounded w-48 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-32"></div>
              </div>
            </div>
          </div>
          
          {/* Restaurant key information skeleton */}
          <div className="py-4 mt-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="h-5 bg-gray-300 rounded w-24"></div>
                <div className="h-5 bg-gray-300 rounded w-24"></div>
                <div className="h-5 bg-gray-300 rounded w-24"></div>
              </div>
              <div className="h-5 bg-gray-300 rounded w-24"></div>
            </div>
          </div>
          
          {/* Menu categories navigation skeleton */}
          <div className="py-3 mt-2 border-b border-gray-200">
            <div className="flex space-x-6 overflow-x-auto">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-8 bg-gray-300 rounded w-24 flex-shrink-0"></div>
              ))}
            </div>
          </div>
          
          {/* Menu items skeleton */}
          <div className="mt-6">
            {/* Category header */}
            <div className="h-8 bg-gray-300 rounded w-36 mb-4"></div>
            
            {/* Menu items grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-gray-100 rounded-lg border border-gray-200 p-4 flex h-32">
                  <div className="flex-grow pr-3">
                    <div className="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  </div>
                  <div className="w-24 h-24 bg-gray-300 rounded-md flex-shrink-0"></div>
                </div>
              ))}
            </div>
            
            {/* Second category */}
            <div className="h-8 bg-gray-300 rounded w-36 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-gray-100 rounded-lg border border-gray-200 p-4 flex h-32">
                  <div className="flex-grow pr-3">
                    <div className="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  </div>
                  <div className="w-24 h-24 bg-gray-300 rounded-md flex-shrink-0"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return isMobile ? (
    <MobileLayout>
      <MobileContent />
    </MobileLayout>
  ) : (
    <WebLayout>
    <div className="restaurant-detail-page bg-[#fbfbfb]">
      {/* Custom header with back button that changes on scroll */}
      <header className={`fixed top-0 left-0 right-0 z-[60] transition-colors duration-300 ${
        isScrolled ? 'bg-white shadow-sm' : 'bg-gradient-to-b from-black/50 to-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center py-3">
            <button
              onClick={() => navigate('/')}
              className={`mr-4 p-2 rounded-full transition-colors ${
                isScrolled ? 'text-gray-800 hover:bg-gray-100' : 'text-white bg-white/10 hover:bg-white/20'
              }`}
              aria-label="Go back"
            >
              <ArrowLeft size={20} />
            </button>
            
            {/* Only show search in header when not scrolled */}
            {!isScrolled && (
              <div className="flex-1 flex justify-center">
                <form className="relative w-full max-w-[200px]">
                  <input
                    type="text"
                    placeholder="Search in restaurant..."
                    className="w-full bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-full py-2 pl-9 pr-3 text-sm placeholder-white/70 focus:outline-none focus:ring-1 focus:ring-white/50"
                  />
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70" />
                </form>
              </div>
            )}
            
            {/* When scrolled, leave the center empty for a clean look */}
            {isScrolled && (
              <div className="flex-1"></div>
            )}
            
            <div className="flex items-center">
              {totalCartItems > 0 ? (
                <button
                  onClick={() => setCartVisible(true)}
                  className={`flex items-center bg-[#289dea] hover:bg-[#259de0] text-white font-semibold rounded-full px-4 py-2 shadow-md transition-colors relative`}
                >
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white text-[#289dea] font-bold text-sm mr-2">{totalCartItems}</span>
                  <span className="mr-3">View order</span>
                  <span className="font-semibold">${calculateCartTotal()}</span>
                </button>
              ) : (
                <>
                  <button 
                    onClick={openLoginDialog}
                    className={`mr-4 text-sm font-medium transition-colors ${
                      isScrolled ? 'text-gray-700 hover:text-primary' : 'text-white hover:text-white/80'
                    }`}
                  >
                    Log in
                  </button>
                  <button 
                    onClick={openSignupDialog}
                    className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90"
                  >
                    Sign up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
      
      {/* Auth Dialog */}
      <AuthDialog 
        isOpen={authDialogOpen} 
        onClose={closeAuthDialog} 
        initialMode={authDialogMode} 
      />
      
      {/* Menu Item Dialog */}
      {selectedItem && (
        <MenuItemDialog
          item={selectedItem}
          isOpen={menuItemDialogOpen}
          onClose={closeMenuItemDialog}
          onAddToCart={addToCart}
        />
      )}
      
      {/* Cover image and restaurant info - full width */}
      <div className="bg-[#fbfbfb]"> {/* Remove padding-top to allow header to overlay the cover image */}
        <div className="relative w-full h-56 md:h-[22rem]">
          <img 
            src={restaurant.image} 
            alt={restaurant.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
          
          {/* Restaurant logo, name and motto directly over the background */}
          <div className="absolute bottom-0 left-0 w-full p-5">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-md bg-[#292929] flex items-center justify-center mr-4">
                  <img 
                    src={restaurant.logo} 
                    alt={`${restaurant.name} logo`} 
                    className="w-4/5 h-4/5 object-contain"
                  />
                </div>
                <div>
                  <h1 className="text-xl md:text-3xl font-bold text-white">{restaurant.name}</h1>
                  <p className="text-white/80 text-xs md:text-sm">{restaurant.slogan || 'Serving delicious food'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Restaurant key information - full width */}
        <div className="w-full bg-white py-4">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="flex items-center">
                  <Clock size={16} className="text-gray-500 mr-1.5" />
                  <p className="text-sm">{restaurant.isOpen ? "Open until 10:00 PM" : "Closed"}</p>
                </div>
                
                <div className="flex items-center">
                  <ThumbsUp size={16} className="text-gray-500 mr-1.5" />
                  <div className="flex items-center">
                    <p className="text-sm mr-1">{restaurant.rating}</p>
                    <Star size={12} className="text-amber-400" fill="currentColor" />
                    <p className="text-sm text-gray-500 ml-1">({restaurant.reviewCount})</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <MapPin size={16} className="text-gray-500 mr-1.5" />
                  <p className="text-sm">{restaurant.distance} km</p>
                </div>
              </div>
              
              <button className="text-primary hover:text-primary-dark text-sm flex items-center">
                <Info size={16} className="mr-1" />
                More info
              </button>
            </div>
          </div>
        </div>
        
        {/* Divider between restaurant info and categories */}
        <div className="w-full h-px bg-gray-200"></div>
        
        <div className="max-w-7xl mx-auto px-4">
          {/* Sticky menu categories navigation */}
          <div 
            ref={categoriesRef} 
            className="sticky-categories-container"
          >
            {/* Menu categories as horizontal tabs */}
            <div className={`transition-all duration-300 ${
              isNavSticky 
                ? 'fixed top-[60px] left-0 right-0 shadow-sm transform translate-y-0 opacity-100 z-[55] bg-white' 
                : 'mt-2 transform translate-y-0 opacity-100 bg-[#fbfbfb]'
            }`}>
              <div className={`max-w-7xl mx-auto px-4 flex items-center justify-between py-3 ${
                isNavSticky ? 'bg-white' : ''
              }`}>
                <div className="flex space-x-6 overflow-x-auto scrollbar-hide">
                  {menuCategories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => scrollToCategory(category.id)}
                      className={`whitespace-nowrap px-1 py-2 border-b-2 transition-colors ${
                        activeCategory === category.id 
                          ? 'border-primary text-primary font-semibold' 
                          : 'border-transparent text-gray-600 hover:text-gray-900 font-medium'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
                
                {/* Search bar in the categories navigation */}
                <div className="ml-4">
                  <form className="relative">
                    <input
                      type="text"
                      placeholder="Search menu"
                      className="w-64 bg-gray-100 rounded-full py-1.5 pl-8 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <Search size={14} className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  </form>
                </div>
              </div>
            </div>
          </div>
          
          {/* Add a spacer when nav is sticky to prevent content jump */}
          {isNavSticky && <div className="h-14"></div>}
          
          {/* Menu items with enhanced positioning */}
          <div className="mt-6 relative z-10">
            {menuCategories.map(category => (
              <div 
                key={category.id} 
                id={`category-${category.id}`} 
                className={`mb-8 scroll-mt-20 ${activeCategory === category.id ? 'scroll-pt-4' : ''}`}
              >
                <h2 className="text-xl font-extrabold mb-4">
                  {category.name}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.items.map(item => (
                    <div 
                      key={item.id} 
                      className="bg-white rounded-lg border border-gray-200 p-4 flex group relative cursor-pointer hover:shadow-md transition-all duration-200 h-full"
                      onClick={() => openMenuItemDialog(item as MenuItem)}
                    >
                      <div className="flex flex-col flex-grow pr-3 relative z-10">
                        <h3 className="font-medium text-gray-800 text-base">{item.name}</h3>
                        <p className="text-gray-600 text-xs my-1 line-clamp-2">{item.description}</p>
                        <div className="flex-grow"></div>
                        <p className="text-[#259de0] text-sm mt-2">${item.price.toFixed(2)}</p>
                      </div>
                      
                      {item.image && (
                        <div className="w-24 h-24 rounded-md overflow-hidden flex-shrink-0 relative z-0">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-200"
                          />
                          
                          {/* Add to cart button - positioned at bottom right of the image */}
                          <button 
                            className="absolute right-1 bottom-1 bg-[#289dea] text-white rounded-full w-7 h-7 flex items-center justify-center opacity-100 md:opacity-0 group-hover:opacity-100 transition-all transform group-hover:scale-110 shadow-sm z-20"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent triggering the parent div click
                              openMenuItemDialog(item as MenuItem);
                            }}
                            aria-label={`Add ${item.name} to cart`}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
              </div>
    </WebLayout>
  );
};

// Add global styles for z-index layers
const style = document.createElement('style');
style.innerHTML = `
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scroll-mt-20 {
    scroll-margin-top: 5rem;
  }
  .scroll-pt-4 {
    scroll-padding-top: 1rem;
  }
  
  /* Z-index layers */
  .sticky-categories-container {
    position: relative;
    z-index: 55;
    background-color: white;
  }
  
  body {
    position: relative;
    overflow-x: hidden;
  }
`;
document.head.appendChild(style);

export default RestaurantDetailPage; 