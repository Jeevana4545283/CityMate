import React, { createContext, useContext, useState } from 'react';

interface LocationContextType {
  city: string;
  area: string;
  latitude: number;
  longitude: number;
  setCity: (city: string) => void;
  setArea: (area: string) => void;
  updateLocation: (city: string, area: string, lat?: number, lng?: number) => void;
  detectCurrentLocation: () => Promise<void>;
  isDetecting: boolean;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [city, setCity] = useState<string>('Hyderabad');
  const [area, setArea] = useState<string>('Gachibowli');
  const [latitude, setLatitude] = useState<number>(17.4401);
  const [longitude, setLongitude] = useState<number>(78.3489);
  const [isDetecting, setIsDetecting] = useState<boolean>(false);

  const updateLocation = (newCity: string, newArea: string, lat?: number, lng?: number) => {
    setCity(newCity);
    setArea(newArea);
    if (lat && lng) {
      setLatitude(lat);
      setLongitude(lng);
    }
  };

  const detectCurrentLocation = async () => {
    setIsDetecting(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(pos.coords.latitude);
          setLongitude(pos.coords.longitude);
          setCity('Hyderabad');
          setArea('Gachibowli');
          setIsDetecting(false);
        },
        (err) => {
          console.warn('Geolocation access declined or unavailable, defaulting to Hyderabad:', err);
          setIsDetecting(false);
        }
      );
    } else {
      setIsDetecting(false);
    }
  };

  return (
    <LocationContext.Provider
      value={{
        city,
        area,
        latitude,
        longitude,
        setCity,
        setArea,
        updateLocation,
        detectCurrentLocation,
        isDetecting
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
