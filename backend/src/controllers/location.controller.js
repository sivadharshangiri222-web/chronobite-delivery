// GET /api/location/reverse-geocode?lat=xx&lng=yy
export const reverseGeocode = async (req, res, next) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ message: 'Latitude and Longitude are required', code: 'BAD_REQUEST' });
    }

    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'ChronoBite-FoodDelivery-App/1.0'
      }
    });

    if (!response.ok) {
      // Fallback response if Nominatim fails
      return res.json({
        success: true,
        data: {
          area: 'Detected Area',
          city: 'City Center',
          pincode: '600001',
          coordinates: { lat: parseFloat(lat), lng: parseFloat(lng) }
        }
      });
    }

    const data = await response.json();
    const address = data.address || {};

    const area = address.suburb || address.neighbourhood || address.residential || address.road || address.county || 'Current Location';
    const city = address.city || address.town || address.village || address.state_district || 'City';
    const pincode = address.postcode || '600001';

    res.json({
      success: true,
      data: {
        area,
        city,
        pincode,
        coordinates: { lat: parseFloat(lat), lng: parseFloat(lng) },
        displayName: data.display_name
      }
    });
  } catch (error) {
    // Fallback error response
    res.json({
      success: true,
      data: {
        area: 'Detected Location',
        city: 'City Center',
        pincode: '600001',
        coordinates: { lat: parseFloat(req.query.lat || 13.0827), lng: parseFloat(req.query.lng || 80.2707) }
      }
    });
  }
};

// GET /api/location/search?query=Chennai
export const searchLocation = async (req, res, next) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: 'Search query is required', code: 'BAD_REQUEST' });
    }

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'ChronoBite-FoodDelivery-App/1.0'
      }
    });

    if (!response.ok) {
      return res.json({ success: true, data: [] });
    }

    const data = await response.json();

    const results = data.map((item) => {
      const address = item.address || {};
      return {
        area: address.suburb || address.neighbourhood || address.residential || address.road || item.display_name.split(',')[0],
        city: address.city || address.town || address.village || address.state || 'City',
        pincode: address.postcode || '600001',
        coordinates: {
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon)
        },
        displayName: item.display_name
      };
    });

    res.json({ success: true, data: results });
  } catch (error) {
    res.json({ success: true, data: [] });
  }
};
