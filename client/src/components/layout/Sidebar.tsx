import React from 'react';
import { Link, useLocation as useRouterLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Compass,
  Building,
  Wrench,
  Users,
  Trophy,
  HeartHandshake,
  ShoppingBag,
  HelpCircle,
  Clock,
  MessageSquare,
  Bell,
  Bookmark,
  User,
  Plus,
  Shield,
  X,
  Menu,
  MoreVertical
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { useSidebar } from '../../context/SidebarContext';

interface SidebarProps {
  onOpenPostModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenPostModal }) => {
  const routerLocation = useRouterLocation();
  const { user } = useAuth();
  const { unreadCount } = useNotification();
  const { isCollapsed, isMobileOpen, toggleSidebar, closeMobileSidebar } = useSidebar();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Explore', path: '/explore', icon: Compass },
    { name: 'Find a Place', path: '/properties', icon: Building },
    { name: 'Need Services', path: '/services', icon: Wrench },
    { name: 'Find People', path: '/people', icon: Users },
    { name: 'Sports Partners', path: '/sports', icon: Trophy },
    { name: 'Communities', path: '/communities', icon: HeartHandshake },
    { name: 'Marketplace', path: '/marketplace', icon: ShoppingBag },
    { name: 'Ask Your City', path: '/communities?tab=qa', icon: HelpCircle },
    { name: 'My Bookings', path: '/services', icon: Clock },
    { name: 'Messages', path: '/messages', icon: MessageSquare },
    { name: 'Notifications', path: '/notifications', icon: Bell, badge: unreadCount },
    { name: 'Saved Items', path: '/properties', icon: Bookmark },
    { name: 'Profile', path: '/profile', icon: User }
  ];

  if (user?.role === 'SERVICE_PROVIDER') {
    navItems.splice(1, 0, { name: 'Handyman Dashboard', path: '/provider-dashboard', icon: Wrench });
  }

  if (user?.role === 'ADMIN') {
    navItems.splice(1, 0, { name: 'Admin Dashboard', path: '/admin', icon: Shield });
  }

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          onClick={closeMobileSidebar}
          className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity duration-300 animate-fade-in"
        />
      )}

      {/* Sidebar Container (Desktop Collapsible & Mobile Slide-in Drawer) */}
      <aside
        className={`fixed top-0 bottom-0 left-0 bg-white border-r border-neutral-200 z-50 overflow-y-auto select-none transition-all duration-300 ease-in-out ${
          // Mobile classes: slide in from left
          isMobileOpen
            ? 'translate-x-0 w-[260px] shadow-2xl lg:shadow-none'
            : '-translate-x-full lg:translate-x-0'
        } ${
          // Desktop width: 72px when collapsed, 260px when expanded
          isCollapsed ? 'lg:w-[72px]' : 'lg:w-[260px]'
        }`}
      >
        {/* Brand Header */}
        <div className={`p-4 border-b border-neutral-100 flex items-center justify-between ${isCollapsed ? 'lg:px-3 lg:justify-center' : 'lg:px-6'}`}>
          {isCollapsed ? (
            <button
              onClick={toggleSidebar}
              className="hidden lg:flex flex-col items-center justify-center p-1.5 rounded-xl hover:bg-neutral-100 transition-colors group"
              title="Click to expand sidebar (⋮)"
            >
              <div className="w-9 h-9 rounded-xl bg-neutral-900 flex items-center justify-center font-black text-white text-sm tracking-tighter shadow-2xs">
                CM
              </div>
            </button>
          ) : (
            <Link
              to="/dashboard"
              onClick={closeMobileSidebar}
              className="flex items-center space-x-3 group"
            >
              <div className="w-9 h-9 rounded-xl bg-neutral-900 flex items-center justify-center font-black text-white text-sm tracking-tighter flex-shrink-0">
                CM
              </div>
              <div className="hidden lg:block overflow-hidden transition-all duration-300">
                <div className="text-base font-extrabold text-neutral-900 tracking-tight leading-none group-hover:text-neutral-700">
                  CityMate
                </div>
                <div className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mt-1">
                  YOUR CITY COMPANION
                </div>
              </div>
            </Link>
          )}

          {/* Mobile Drawer Header Brand */}
          <div className="lg:hidden flex items-center justify-between w-full">
            <Link to="/dashboard" onClick={closeMobileSidebar} className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-neutral-900 flex items-center justify-center font-black text-white text-sm tracking-tighter">
                CM
              </div>
              <div>
                <div className="text-base font-extrabold text-neutral-900 tracking-tight leading-none">
                  CityMate
                </div>
                <div className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mt-1">
                  YOUR CITY COMPANION
                </div>
              </div>
            </Link>

            <button
              onClick={closeMobileSidebar}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              routerLocation.pathname === item.path ||
              (item.path.includes('?') && routerLocation.pathname + routerLocation.search === item.path);

            return (
              <Link
                key={item.name + item.path}
                to={item.path}
                onClick={closeMobileSidebar}
                title={isCollapsed ? item.name : undefined}
                className={`flex items-center ${
                  isCollapsed ? 'lg:justify-center lg:px-0' : 'justify-between px-3.5'
                } py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-neutral-600'}`} />
                  {!isCollapsed && <span className="hidden lg:inline">{item.name}</span>}
                  <span className="lg:hidden">{item.name}</span>
                </div>

                {!isCollapsed && item.badge && item.badge > 0 ? (
                  <span
                    className={`hidden lg:inline-block px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-white text-neutral-900' : 'bg-neutral-900 text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                ) : null}

                {item.badge && item.badge > 0 ? (
                  <span
                    className={`lg:hidden px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-white text-neutral-900' : 'bg-neutral-900 text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Sidebar Widget: Post Something */}
        <div
          className={`p-4 m-3 rounded-2xl bg-neutral-50 border border-neutral-200 transition-all ${
            isCollapsed ? 'lg:p-2 lg:m-2 lg:flex lg:justify-center' : ''
          }`}
        >
          <div className="flex items-center justify-between w-full">
            {!isCollapsed && (
              <div className="hidden lg:block overflow-hidden">
                <div className="text-xs font-bold text-neutral-900">Post Something</div>
                <div className="text-[11px] text-neutral-500 mt-0.5">Ask, Share or Help others</div>
              </div>
            )}
            <div className="lg:hidden">
              <div className="text-xs font-bold text-neutral-900">Post Something</div>
              <div className="text-[11px] text-neutral-500 mt-0.5">Ask, Share or Help others</div>
            </div>
            <button
              onClick={() => {
                closeMobileSidebar();
                if (onOpenPostModal) onOpenPostModal();
              }}
              className="w-8 h-8 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white flex items-center justify-center shadow-xs transition-transform active:scale-95 flex-shrink-0"
              title="Create Post / Ask Question"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
