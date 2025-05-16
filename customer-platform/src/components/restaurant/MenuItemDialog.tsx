import React, { useState } from 'react';
import { X, Minus, Plus } from 'lucide-react';

export interface MenuItemModifier {
  id: string;
  name: string;
  price?: number;
  default?: boolean;
}

export interface MenuItemProps {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  popular?: boolean;
  vegetarian?: boolean;
  modifiers?: MenuItemModifier[][];
}

interface MenuItemDialogProps {
  item: MenuItemProps;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: MenuItemProps, quantity: number, selectedModifiers: string[]) => void;
}

const MenuItemDialog: React.FC<MenuItemDialogProps> = ({
  item,
  isOpen,
  onClose,
  onAddToCart
}) => {
  const [quantity, setQuantity] = useState(1);
  // Initialize with all modifiers IDs so none are checked by default
  const [selectedModifiers, setSelectedModifiers] = useState<string[]>([]);
  
  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };
  
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };
  
  const toggleModifier = (modifierId: string) => {
    setSelectedModifiers(prev => 
      prev.includes(modifierId)
        ? prev.filter(id => id !== modifierId)
        : [...prev, modifierId]
    );
  };
  
  const handleAddToCart = () => {
    onAddToCart(item, quantity, selectedModifiers);
    onClose();
    // Reset state for next opening
    setQuantity(1);
    setSelectedModifiers([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-lg w-full max-w-md overflow-hidden shadow-xl dialog-animation-enter">
        {/* Header with close button */}
        <div className="relative">
          <button 
            onClick={onClose}
            className="absolute right-4 top-4 z-10 bg-white shadow-sm rounded-full w-8 h-8 flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Close dialog"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
          
          {/* Item image */}
          {item.image && (
            <div className="w-full h-56 relative">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          {/* Item details */}
          <div className="p-6 pb-3">
            {item.popular && (
              <div className="bg-primary text-white text-xs font-bold px-2 py-1 rounded-full inline-block mb-2">
                Popular
              </div>
            )}
            <h2 className="text-2xl font-bold text-text-dark mb-2">{item.name}</h2>
            <div className="text-lg font-semibold text-[#259de0] mb-4">
              ${item.price.toFixed(2)}
            </div>
            <p className="text-gray-600">{item.description}</p>
          </div>
        </div>
        
        {/* Item modifiers/specifications */}
        {item.modifiers && item.modifiers.length > 0 && (
          <div>
            {/* Border line divider - full width */}
            <div className="h-px bg-gray-200 w-full"></div>
            
            <div className="px-6 py-4">
              <h3 className="font-semibold text-gray-800 mb-3">Customize your order</h3>
              <p className="text-sm text-gray-500 mb-4">Choose up to {item.modifiers.length} additional items</p>
              
              {/* List of modifier groups */}
              {item.modifiers.map((modifierGroup, groupIndex) => (
                <div key={`group-${groupIndex}`} className="mb-4">
                  {modifierGroup.map(modifier => (
                    <div key={modifier.id} className="flex items-center py-2">
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          id={modifier.id}
                          checked={selectedModifiers.includes(modifier.id)}
                          onChange={() => toggleModifier(modifier.id)}
                          className="custom-checkbox w-4 h-4 rounded focus:ring-0 focus:ring-offset-0 cursor-pointer"
                        />
                      </div>
                      <label htmlFor={modifier.id} className="ml-2 flex-grow text-gray-700 cursor-pointer">
                        {modifier.name}
                      </label>
                      {modifier.price && modifier.price > 0 && (
                        <span className="text-gray-500">${modifier.price.toFixed(2)}</span>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Quantity adjuster and add to cart button */}
        <div className="sticky bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center border border-gray-300 rounded-md">
              <button 
                onClick={decreaseQuantity}
                className="p-2 text-gray-500 hover:text-gray-700"
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
              >
                <Minus size={16} />
              </button>
              <span className="w-8 text-center font-medium">{quantity}</span>
              <button 
                onClick={increaseQuantity}
                className="p-2 text-gray-500 hover:text-gray-700"
                aria-label="Increase quantity"
              >
                <Plus size={16} />
              </button>
            </div>
            
            <button 
              onClick={handleAddToCart}
              className="bg-[#289dea] text-white px-5 py-2 rounded-lg font-medium hover:bg-[#289dea]/90 transition-colors flex-grow ml-4"
            >
              <div className="flex justify-between items-center w-full">
                <span>Add to order</span>
                <span>${(item.price * quantity).toFixed(2)}</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Add global styles for custom checkbox */}
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-checkbox {
          appearance: none;
          background-color: white;
          border: 1px solid #d1d5db;
        }
        .custom-checkbox:checked {
          background-color: #289dea;
          background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e");
          border-color: #289dea;
        }
      `}} />
    </div>
  );
};

export default MenuItemDialog; 