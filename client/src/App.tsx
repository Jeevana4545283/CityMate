import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LocationProvider } from './context/LocationContext';
import { NotificationProvider } from './context/NotificationContext';
import { SidebarProvider } from './context/SidebarContext';

import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { MobileNav } from './components/layout/MobileNav';
import { Footer } from './components/layout/Footer';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { ExplorePage } from './pages/ExplorePage';
import { PropertiesPage } from './pages/PropertiesPage';
import { PropertyDetailsPage } from './pages/PropertyDetailsPage';
import { CreatePropertyPage } from './pages/CreatePropertyPage';
import { EditPropertyPage } from './pages/EditPropertyPage';
import { MyListingsPage } from './pages/MyListingsPage';
import { BookingRequestsPage } from './pages/BookingRequestsPage';
import { MyBookingsPage } from './pages/MyBookingsPage';
import { RoommateFinderPage } from './pages/RoommateFinderPage';
import { RoommateProfilePage } from './pages/RoommateProfilePage';
import { MyMatchesPage } from './pages/MyMatchesPage';
import { ServicesPage } from './pages/ServicesPage';
import { ProviderDashboardPage } from './pages/ProviderDashboardPage';
import { SportsPage } from './pages/SportsPage';
import { SportsRequestsPage } from './pages/SportsRequestsPage';
import { CommunitiesPage } from './pages/CommunitiesPage';
import { MessagingPage } from './pages/MessagingPage';
import { EssentialsPage } from './pages/EssentialsPage';
import { MarketplacePage } from './pages/MarketplacePage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { NotificationsPage } from './pages/NotificationsPage';
import { EventsPage } from './pages/EventsPage';
import { EventDetailsPage } from './pages/EventDetailsPage';
import { EventPartnersPage } from './pages/EventPartnersPage';

// Protected Route Component Guard
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 text-neutral-900 text-xs font-extrabold space-x-2">
        <div className="w-5 h-5 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin" />
        <span>Authenticating session...</span>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Root Route Handler (First Visit -> /login, Authenticated -> /dashboard)
const RootRouteHandler: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 text-neutral-900 text-xs font-extrabold space-x-2">
        <div className="w-5 h-5 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin" />
        <span>Loading CityMate...</span>
      </div>
    );
  }

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
};

// Public Auth Page Guard (If logged in, redirect /login & /register to /dashboard)
const PublicAuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [globalSearch, setGlobalSearch] = useState('');

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const showAppLayout = isAuthenticated && !isAuthPage;

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50 text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white overflow-x-hidden">
      {showAppLayout && (
        <>
          <Sidebar onOpenPostModal={() => (window.location.href = '/communities?tab=qa')} />
          <Navbar onSearchChange={(q) => setGlobalSearch(q)} />
        </>
      )}

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<RootRouteHandler />} />

          <Route
            path="/login"
            element={
              <PublicAuthRoute>
                <LoginPage />
              </PublicAuthRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicAuthRoute>
                <RegisterPage />
              </PublicAuthRoute>
            }
          />

          {/* Protected Private Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/explore" element={<ProtectedRoute><ExplorePage /></ProtectedRoute>} />
          <Route path="/properties" element={<ProtectedRoute><PropertiesPage /></ProtectedRoute>} />
          <Route path="/properties/create" element={<ProtectedRoute><CreatePropertyPage /></ProtectedRoute>} />
          <Route path="/properties/:id" element={<ProtectedRoute><PropertyDetailsPage /></ProtectedRoute>} />
          <Route path="/properties/:id/edit" element={<ProtectedRoute><EditPropertyPage /></ProtectedRoute>} />
          <Route path="/my-listings" element={<ProtectedRoute><MyListingsPage /></ProtectedRoute>} />
          <Route path="/booking-requests" element={<ProtectedRoute><BookingRequestsPage /></ProtectedRoute>} />
          <Route path="/my-bookings" element={<ProtectedRoute><MyBookingsPage /></ProtectedRoute>} />
          <Route path="/find-partner" element={<ProtectedRoute><RoommateFinderPage /></ProtectedRoute>} />
          <Route path="/roommate-profile" element={<ProtectedRoute><RoommateProfilePage /></ProtectedRoute>} />
          <Route path="/my-matches" element={<ProtectedRoute><MyMatchesPage /></ProtectedRoute>} />
          <Route path="/services" element={<ProtectedRoute><ServicesPage /></ProtectedRoute>} />
          <Route path="/provider-dashboard" element={<ProtectedRoute><ProviderDashboardPage /></ProtectedRoute>} />
          <Route path="/sports" element={<ProtectedRoute><SportsPage /></ProtectedRoute>} />
          <Route path="/sports-requests" element={<ProtectedRoute><SportsRequestsPage /></ProtectedRoute>} />
          <Route path="/events" element={<ProtectedRoute><EventsPage /></ProtectedRoute>} />
          <Route path="/events/:id" element={<ProtectedRoute><EventDetailsPage /></ProtectedRoute>} />
          <Route path="/events/:id/partners" element={<ProtectedRoute><EventPartnersPage /></ProtectedRoute>} />
          <Route path="/people" element={<ProtectedRoute><RoommateFinderPage /></ProtectedRoute>} />
          <Route path="/communities" element={<ProtectedRoute><CommunitiesPage /></ProtectedRoute>} />
          <Route path="/messages" element={<ProtectedRoute><MessagingPage /></ProtectedRoute>} />
          <Route path="/essentials" element={<ProtectedRoute><EssentialsPage /></ProtectedRoute>} />
          <Route path="/marketplace" element={<ProtectedRoute><MarketplacePage /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><AdminDashboardPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {showAppLayout && (
        <>
          <MobileNav />
          <Footer />
        </>
      )}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LocationProvider>
          <NotificationProvider>
            <SidebarProvider>
              <AppContent />
            </SidebarProvider>
          </NotificationProvider>
        </LocationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
