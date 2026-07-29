import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, ShoppingBag, Clock, User } from 'lucide-react';
import { useCartStore } from '../store/cartStore';

export const BottomNav = () => {
  const { cart } = useCartStore();
  const itemCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  const navItems = [
    { label: 'Home', path: '/home', icon: Home },

    { label: 'Search', path: '/restaurants', icon: Search },
    { label: 'Cart', path: '/cart', icon: ShoppingBag, badge: itemCount },
    { label: 'Orders', path: '/orders', icon: Clock },
    { label: 'Profile', path: '/profile', icon: User }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#1C1E22]/95 backdrop-blur-lg border-t border-white/[0.07] h-16 px-4 md:hidden">
      <div className="flex items-center justify-around h-full max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `relative flex flex-col items-center justify-center w-12 h-full transition-colors ${
                  isActive ? 'text-[#E87722] font-semibold' : 'text-[#55585F] hover:text-[#9A9DA6]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="relative">
                    <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                    {item.badge > 0 && (
                      <span className="absolute -top-1.5 -right-2.5 bg-[#E87722] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] mt-1 font-body">{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
