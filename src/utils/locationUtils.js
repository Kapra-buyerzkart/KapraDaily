import { Platform, PermissionsAndroid } from 'react-native';
import Geocoder from 'react-native-geocoding';
import Geolocation from '@react-native-community/geolocation';

Geocoder.init('AIzaSyDhItv0zoWdQbDh-5jjKLAEjwRDDrFNc1Y');

export const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true; // iOS permissions are handled by the OS/library usually, or check needed
};

export const getCurrentLocation = () => {
    return new Promise(async (resolve, reject) => {
        const hasPermission = await requestLocationPermission();
        if (!hasPermission) {
            reject('Location permission denied');
            return;
        }

        const timeoutId = setTimeout(() => {
            reject('Location request timed out');
        }, 20000); // 20 second safety timeout

        Geolocation.getCurrentPosition(
            async position => {
                clearTimeout(timeoutId);
                try {
                    const { latitude, longitude } = position.coords;
                    const geo = await Geocoder.from(latitude, longitude);
                    const data = geo.results[0];

                    const pincode =
                        data.address_components.find(c =>
                            c.types.includes('postal_code')
                        )?.long_name;

                    const locality =
                        data.address_components.find(c =>
                            c.types.includes('locality')
                        )?.long_name;

                    const area =
                        data.address_components.find(c =>
                            c.types.includes('sublocality')
                        )?.long_name;

                    resolve({
                        latitude,
                        longitude,
                        pincode,
                        locality,
                        area,
                        fullData: data
                    });
                } catch (error) {
                    reject(error);
                }
            },
            error => {
                clearTimeout(timeoutId);
                reject(error);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    });
};
