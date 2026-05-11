import * as Location from 'expo-location';

export const locationService = {
  getCurrentLocation: async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return { error: 'Permission denied' };
      }

      let location = await Location.getCurrentPositionAsync({});
      let reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (reverseGeocode.length > 0) {
        const address = reverseGeocode[0];
        return {
          coords: location.coords,
          displayAddress: `${address.name || address.district}, ${address.city || address.region}`,
          fullAddress: `${address.name}, ${address.street}, ${address.city}, ${address.region} - ${address.postalCode}`,
          city: address.city || address.region
        };
      }
      return { coords: location.coords };
    } catch (error) {
      console.error('Location error:', error);
      return { error: 'Failed to get location' };
    }
  },

  checkServiceAvailability: (city) => {
    // Demo logic: Services available in major cities
    const availableCities = ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Ahmedabad', 'New York', 'London'];
    return availableCities.includes(city);
  }
};
