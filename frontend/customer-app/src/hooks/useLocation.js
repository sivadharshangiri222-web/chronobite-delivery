import { useLocationStore } from '../store/locationStore';
import api from '../services/api';

export const useLocation = () => {
  const { location, setLocation, setLoading, setError } = useLocationStore();

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setError('unavailable');
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await api.get(`/location/reverse-geocode?lat=${latitude}&lng=${longitude}`);
          const data = res.data.data;

          setLocation({
            coordinates: { lat: latitude, lng: longitude },
            area: data.area,
            city: data.city,
            pincode: data.pincode,
            source: 'gps',
            isLoading: false,
            error: null
          });
        } catch (err) {
          setError('unavailable');
        }
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setError('denied');
        } else {
          setError('unavailable');
        }
      },
      { timeout: 10000 }
    );
  };

  const setManualLocation = (locationData) => {
    setLocation({
      coordinates: locationData.coordinates,
      area: locationData.area,
      city: locationData.city,
      pincode: locationData.pincode,
      source: 'manual',
      isLoading: false,
      error: null
    });
  };

  return {
    location,
    detectLocation,
    setManualLocation
  };
};
