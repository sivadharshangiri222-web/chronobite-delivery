import { create } from 'zustand';

const initialLocation = JSON.parse(localStorage.getItem('chronobite_location') || 'null') || {
  coordinates: { lat: 13.0827, lng: 80.2707 },
  area: 'Anna Nagar',
  city: 'Chennai',
  pincode: '600040',
  source: 'gps',
  isLoading: false,
  error: null
};

export const useLocationStore = create((set) => ({
  location: initialLocation,

  setLocation: (newLoc) => {
    const updated = { ...initialLocation, ...newLoc };
    localStorage.setItem('chronobite_location', JSON.stringify(updated));
    set({ location: updated });
  },

  setLoading: (isLoading) => {
    set((state) => ({ location: { ...state.location, isLoading } }));
  },

  setError: (error) => {
    set((state) => ({ location: { ...state.location, error, isLoading: false } }));
  }
}));
