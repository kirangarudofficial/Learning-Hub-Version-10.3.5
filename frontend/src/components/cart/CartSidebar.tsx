import React from 'react';
import { X, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export default function CartSidebar({ isOpen, onClose, onCheckout }: CartSidebarProps) {
  const { items, removeFromCart, total, clearCart } = useCart();
  const { user } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
              <ShoppingBag className="w-6 h-6" />
              <span>Shopping Cart ({items.length})</span>
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Your cart is empty</h3>
                <p className="text-gray-500">Add some courses to get started!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.courseId} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                    <img
                      src={item.course.image}
                      alt={item.course.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-800 text-sm line-clamp-2">
                        {item.course.title}
                      </h4>
                      <p className="text-xs text-gray-600 mt-1">by {item.course.instructor.name}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-bold text-blue-600">${item.course.price}</span>
                        <button
                          onClick={() => removeFromCart(item.courseId)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-gray-200 p-6 space-y-4">
              <div className="flex items-center justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-blue-600">${total.toFixed(2)}</span>
              </div>
              
              <div className="space-y-2">
                <button
                  onClick={onCheckout}
                  disabled={!user}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {user ? 'Proceed to Checkout' : 'Login to Checkout'}
                </button>
                
                <button
                  onClick={clearCart}
                  className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Clear Cart
                </button>
              </div>

              {!user && (
                <p className="text-sm text-gray-500 text-center">
                  Please log in to proceed with checkout
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}