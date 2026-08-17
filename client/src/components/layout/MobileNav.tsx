import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, Wrench, MessageSquare, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const MobileNav: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const navItems = [
    { label: 'Home', path: isAuthenticated ? '/dashboard' : '/', icon: Home },
    { label: 'Explore', path: '/explore', icon: Compass },
    { label: 'Services', path: '/services', icon: Wrench },
    { label: 'Messages', path: '/messages', icon: MessageSquare },
    { label: 'Profile', path: isAuthenticated ? '/profile' : '/login', icon: User }
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-neutral-200 px-2 py-2 shadow-lg">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex flex-col items-center justify-center w-14 py-1 rounded-xl transition-colors ${
                isActive ? 'text-neutral-900 font-bold bg-neutral-100' : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] font-medium tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
