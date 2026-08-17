import React from 'react';
import { Link } from 'react-router-dom';
import { useSidebar } from '../../context/SidebarContext';

export const Footer: React.FC = () => {
  const { isCollapsed } = useSidebar();

  return (
    <footer
      className={`bg-white border-t border-neutral-200 pt-12 pb-24 lg:pb-12 text-neutral-600 text-xs transition-all duration-300 ease-in-out ${
        isCollapsed ? 'lg:pl-[72px]' : 'lg:pl-[260px]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-neutral-900 flex items-center justify-center font-bold text-white text-xs">
                CM
              </div>
              <span className="text-base font-extrabold text-neutral-900 tracking-tight">CityMate</span>
            </div>
            <p className="text-neutral-500 leading-relaxed mb-4">
              An all-in-one digital companion for people moving to a new city. Arrive anywhere, find everything, connect with everyone.
            </p>
            <p className="text-[11px] text-neutral-400 font-semibold uppercase tracking-wider">
              &quot;New city? New life. We&apos;ve got you covered.&quot;
            </p>
          </div>

          <div>
            <h4 className="text-xs font-extrabold text-neutral-900 uppercase tracking-wider mb-3">Discover</h4>
            <ul className="space-y-2">
              <li><Link to="/properties" className="hover:text-neutral-900">Find PGs & Hostels</Link></li>
              <li><Link to="/roommates" className="hover:text-neutral-900">Find Roommates</Link></li>
              <li><Link to="/services" className="hover:text-neutral-900">Find Local Services</Link></li>
              <li><Link to="/sports" className="hover:text-neutral-900">Sports Partner Finder</Link></li>
              <li><Link to="/communities" className="hover:text-neutral-900">City Communities</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-extrabold text-neutral-900 uppercase tracking-wider mb-3">Top Cities</h4>
            <ul className="space-y-2 text-neutral-500">
              <li><span className="text-neutral-800 font-semibold">Hyderabad (Gachibowli, Kondapur)</span></li>
              <li><span>Bangalore (Koramangala, HSR)</span></li>
              <li><span>Pune (Hinjewadi, Viman Nagar)</span></li>
              <li><span>Delhi NCR (Gurugram, Noida)</span></li>
              <li><span>Mumbai (Andheri, Powai)</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-extrabold text-neutral-900 uppercase tracking-wider mb-3">Safety & Trust</h4>
            <ul className="space-y-2 text-neutral-500">
              <li>Verified Providers & Owners</li>
              <li>Approximate Location Privacy</li>
              <li>24/7 Community Moderation</li>
              <li>Safety Reporting Guidelines</li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-neutral-100 flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0 text-neutral-500 text-[11px]">
          <p>© 2026 CityMate Platform. All rights reserved.</p>
          <p className="font-semibold text-neutral-700">Built for newcomers starting life in a new city.</p>
        </div>
      </div>
    </footer>
  );
};
