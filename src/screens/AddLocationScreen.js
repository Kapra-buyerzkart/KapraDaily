import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Platform, ScrollView, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, ActivityIndicator, PermissionsAndroid } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { FONTS } from '../styles/typography'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { useNavigation, useRoute } from '@react-navigation/native'
import DropDownPicker from 'react-native-dropdown-picker';
import LinearGradient from 'react-native-linear-gradient'
import { addAddressApi, updateAddressApi } from '../api/addressService'
import { getAreasByPincode } from '../api';
import Toast from 'react-native-simple-toast'
import { useAddresses } from '../hooks/useAddresses'
import axios from 'axios'
import { validatePhoneNumbers } from '../utils/validation'
import Geolocation from '@react-native-community/geolocation';
import CustomLoader from '../components/CustomLoader'
import Ionicons from 'react-native-vector-icons/Ionicons'

const AddLocationScreen = () => {
    const navigation = useNavigation()
    const route = useRoute()
    const insets = useSafeAreaInsets()
    const { refreshAddresses } = useAddresses();

    // Edit mode check
    const editAddress = route.params?.address;
    const isEditMode = !!editAddress;

    const [open, setOpen] = useState(false);
    const [pincodeAreaId, setPincodeAreaId] = useState(editAddress?.pincodeAreaId || null);
    const [items, setItems] = useState([]);

    // Form state
    const [custName, setCustName] = useState(editAddress?.custName || '');
    const [addLine1, setAddLine1] = useState(editAddress?.addLine1 || '');
    const [addLine2, setAddLine2] = useState(editAddress?.addLine2 || '');
    const [landmark, setLandmark] = useState(editAddress?.landmark || '');
    const [phone, setPhone] = useState(editAddress?.phone || '');
    const [pincode, setPincode] = useState(editAddress?.pincode || '');
    const [addressType, setAddressType] = useState(editAddress?.addressType || 'HOME');
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(!isEditMode);
    const [isAreasLoading, setIsAreasLoading] = useState(false);
    const [isGeocoding, setIsGeocoding] = useState(false);

    const defaultCoords = { latitude: 10.0205, longitude: 76.3052 };
    const [region, setRegion] = useState({
        latitude: Number(editAddress?.latitude) || defaultCoords.latitude,
        longitude: Number(editAddress?.longitude) || defaultCoords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
    });
    // Selected pin position (for save & geocode). Draggable marker uses this.
    const [markerPosition, setMarkerPosition] = useState(() => ({
        latitude: Number(editAddress?.latitude) || defaultCoords.latitude,
        longitude: Number(editAddress?.longitude) || defaultCoords.longitude,
    }));

    useEffect(() => {
        if (isEditMode && editAddress?.latitude != null && editAddress?.longitude != null) {
            const lat = Number(editAddress.latitude);
            const lng = Number(editAddress.longitude);
            setRegion(r => ({ ...r, latitude: lat, longitude: lng }));
            setMarkerPosition({ latitude: lat, longitude: lng });
        } else {
            handleInitialLocation();
        }
    }, []);

    const handleInitialLocation = async () => {
        const hasPermission = await requestLocationPermission();
        if (hasPermission) {
            getCurrentLocation();
        } else {
            if (!isEditMode) setIsInitialLoading(false);
            Toast.show('Location permission denied', Toast.SHORT);
        }
    };

    const requestLocationPermission = async () => {
        if (Platform.OS === 'ios') {
            Geolocation.requestAuthorization();
            return true; // Assume true as Geolocation lib handles it on iOS
        }

        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Location Permission',
                    message: 'This app needs access to your location to help you set the delivery address.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (err) {
            console.warn(err);
            return false;
        }
    };

    const getCurrentLocation = (showLoader = false) => {
        if (showLoader) setIsLoading(true);
        console.log('📍 [GEOLOCATION] Fetching current position...');

        const onSuccess = (position) => {
            const { latitude, longitude } = position.coords;
            console.log('📍 [GEOLOCATION] Position received:', latitude, longitude);
            const newRegion = {
                ...region,
                latitude,
                longitude,
            };
            setRegion(newRegion);
            setMarkerPosition({ latitude, longitude });
            reverseGeocode(latitude, longitude, !isEditMode);
            if (showLoader) setIsLoading(false);
        };

        const onFinalError = (error) => {
            console.warn('📍 [GEOLOCATION] Final Error:', error);
            if (!isEditMode) setIsInitialLoading(false);
            if (showLoader) setIsLoading(false);
            const msg = error.code === 1 ? 'Permission denied' : error.code === 2 ? 'Position unavailable' : error.code === 3 ? 'Timeout' : 'Failed to fetch location';
            Toast.show(msg, Toast.SHORT);
        };

        // Try high accuracy first, fallback to low accuracy
        Geolocation.getCurrentPosition(
            onSuccess,
            (error) => {
                console.warn('📍 [GEOLOCATION] High accuracy failed, trying low accuracy...', error.message);
                Geolocation.getCurrentPosition(
                    onSuccess,
                    onFinalError,
                    { enableHighAccuracy: false, timeout: 15000, maximumAge: 60000 }
                );
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
        );
    };

    useEffect(() => {
        if (pincode && pincode.length === 6) {
            fetchAreas(pincode);
        } else {
            setItems([]);
            if (!isEditMode) setPincodeAreaId(null);
        }
    }, [pincode]);

    const fetchAreas = async (pin) => {
        try {
            setIsAreasLoading(true);
            const response = await getAreasByPincode(pin);
            if (response && response.success && Array.isArray(response.data)) {
                const formattedAreas = response.data.map(area => ({
                    label: area.areaName,
                    value: area.pincodeAreaId || area.id // Assuming pincodeAreaId or id
                }));
                setItems(formattedAreas);
                if (formattedAreas.length === 1 && !isEditMode) {
                    setPincodeAreaId(formattedAreas[0].value);
                }
            } else {
                setItems([]);
                // Only show toast if explicitly entered, not if from geocoding
                // Toast.show('No areas found for this pincode', Toast.SHORT);
            }
        } catch (error) {
            console.error('Error fetching areas:', error);
            setItems([]);
        } finally {
            setIsAreasLoading(false);
        }
    };

    const apiKey = 'AIzaSyDhItv0zoWdQbDh-5jjKLAEjwRDDrFNc1Y';

    const reverseGeocode = async (lat, lng, isInitial = false) => {
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

        try {
            setIsGeocoding(true);
            const response = await axios.get(url);
            if (response.data.results && response.data.results.length > 0) {
                const result = response.data.results[0];
                const address = result.formatted_address;

                // Simple parsing for address lines
                const components = result.address_components;
                const streetNumber = components.find(c => c.types.includes('street_number'))?.long_name || '';
                const routeName = components.find(c => c.types.includes('route'))?.long_name || '';
                const sublocality2 = components.find(c => c.types.includes('sublocality_level_2'))?.long_name || '';
                const sublocality1 = components.find(c => c.types.includes('sublocality_level_1'))?.long_name || '';
                const neighborhood = components.find(c => c.types.includes('neighborhood'))?.long_name || '';
                const locality = components.find(c => c.types.includes('locality'))?.long_name || '';
                const postalCode = components.find(c => c.types.includes('postal_code'))?.long_name || '';

                if (!custName) setCustName(editAddress?.custName || ''); // Keep name if already there
                setAddLine1(`${streetNumber} ${routeName}`.trim() || sublocality2 || sublocality1 || '');
                setAddLine2(`${sublocality1 || neighborhood || locality}`.trim());
                if (postalCode) {
                    setPincode(postalCode);
                }
            }
        } catch (error) {
            console.error('Reverse geocode error', error);
        } finally {
            setIsGeocoding(false);
            if (isInitial) setIsInitialLoading(false);
        }
    };

    const onRegionChangeComplete = (newRegion) => {
        // Selected position is the draggable marker only; panning the map does not change the pin.
        // Keep region in sync for camera only (optional); we do not reverse-geocode on pan.
        setRegion(newRegion);
    };

    const handleSave = async () => {
        if (!custName || !addLine1 || !phone || !pincode || !pincodeAreaId) {
            Toast.show('Please fill all required fields', Toast.SHORT);
            return;
        }

        if (!validatePhoneNumbers(phone)) {
            Toast.show('Please enter a valid 10-digit phone number', Toast.SHORT);
            return;
        }

        const payload = {
            custName,
            addLine1,
            addLine2,
            landmark,
            phone,
            country: "India",
            state: "Kerala",
            district: "Ernakulam",
            pincode,
            pincodeAreaId,
            pincodeAreaName: items.find(i => i.value === pincodeAreaId)?.label || "",
            latitude: Number(markerPosition.latitude),
            longitude: Number(markerPosition.longitude),
            addressType,
            isDefaultBillingAddress: true,
            isDefaultShippingAddress: true
        };

        setIsLoading(true);
        try {
            let response;
            if (isEditMode) {
                response = await updateAddressApi(editAddress.addressId, payload);
            } else {
                response = await addAddressApi(payload);
            }
            console.log('ressssnm=====', response);

            if (response && response.success !== false) {
                Toast.show(isEditMode ? 'Address updated' : 'Address added', Toast.SHORT);
                await refreshAddresses();
                navigation.goBack();
            } else {
                Toast.show(response?.message || 'Failed to save address', Toast.SHORT);
            }
        } catch (error) {
            console.error('Error saving address:', error);
            Toast.show('An error occurred', Toast.SHORT);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <CustomLoader visible={isInitialLoading} text="Fetching your location..." />
            <SafeAreaView edges={['top']} style={Platform.OS === "android" ? [styles.mainContainer, {
                paddingBottom: insets.bottom
            }] : styles.mainContainer}>
                <View style={styles.mapContainer}>
                    <MapView
                        style={styles.map}
                        region={region}
                        onRegionChangeComplete={onRegionChangeComplete}
                        showsUserLocation={true}
                        showsMyLocationButton={false}
                    >
                        <Marker
                            coordinate={markerPosition}
                            draggable
                            onDragEnd={(e) => {
                                const { latitude, longitude } = e.nativeEvent.coordinate;
                                setMarkerPosition({ latitude, longitude });
                                setRegion(r => ({ ...r, latitude, longitude }));
                                reverseGeocode(latitude, longitude);
                            }}
                            image={require('../assets/images/location_four.png')}
                            title="Delivery location"
                        />
                    </MapView>
                    {/* Re-center to current location */}
                    <TouchableOpacity
                        style={styles.reCenterButton}
                        onPress={() => getCurrentLocation(true)}
                    >
                        <Ionicons name="locate" size={wp('6%')} color="#F25000" />
                    </TouchableOpacity>
                </View>
                <View style={{ zIndex: 1, elevation: 5 }}>
                    <View style={[styles.searchAbsoluteContainer, { zIndex: 999 }]}>
                        <GooglePlacesAutocomplete
                            placeholder="Search Location"
                            placeholderTextColor="#000000"
                            fetchDetails={true}
                            onPress={(data, details = null) => {
                                if (details) {
                                    const lat = details.geometry.location.lat;
                                    const lng = details.geometry.location.lng;
                                    setRegion(prev => ({ ...prev, latitude: lat, longitude: lng }));
                                    setMarkerPosition({ latitude: lat, longitude: lng });
                                    reverseGeocode(lat, lng);
                                }
                            }}
                            query={{
                                key: apiKey,
                                language: 'en',
                                components: 'country:in',
                            }}
                            styles={{
                                container: { flex: 1 },
                                textInputContainer: {
                                    // backgroundColor: '#FFFFFF',
                                    // borderRadius: wp('2.32%'),
                                    // borderWidth: 1,
                                    // borderColor: '#DADADA',
                                    height: hp('5.36%'),
                                    paddingHorizontal: wp('2%'),
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                },
                                textInput: {
                                    fontFamily: FONTS.poppins.light,
                                    fontSize: wp('3.72%'),
                                    color: '#000000',
                                    height: hp('5.36%'),
                                    flex: 1,
                                },
                                description: {
                                    color: '#000000',
                                },
                                predefinedPlacesDescription: {
                                    color: '#000000',
                                },
                                listView: {
                                    backgroundColor: '#FFFFFF',
                                    borderRadius: wp('2.32%'),
                                    marginTop: hp('1%'),
                                    borderWidth: 1,
                                    borderColor: '#DADADA',
                                    elevation: 5,
                                    position: 'absolute',
                                    top: hp('5.5%'),
                                    width: '100%',
                                    zIndex: 100
                                },
                                row: {
                                    padding: wp('3%'),
                                    height: hp('6%'),
                                    flexDirection: 'row',
                                },
                                separator: {
                                    height: 1,
                                    backgroundColor: '#DADADA',
                                }
                            }}
                        />
                    </View>
                </View>

                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <ScrollView
                            style={styles.detailedAddressContainer}
                            contentContainerStyle={{ paddingBottom: hp('10%') }}
                            keyboardShouldPersistTaps="handled"
                            showsVerticalScrollIndicator={false}
                        >
                            <View style={styles.upperDivider} />
                            <View style={styles.topView}>
                                <TouchableOpacity style={styles.backButtonContainer} onPress={() => navigation.goBack()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                                    <Image style={styles.leftArrowIcon} source={require('../assets/images/left_arrow.png')} />
                                </TouchableOpacity>
                                <Text style={styles.addLocationText}>{isEditMode ? 'Edit location' : 'Add location'}</Text>
                                {/* <TouchableOpacity onPress={() => navigation.navigate('MainTabs')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                                    <Image style={styles.homeIcon} source={require('../assets/images/home_two.png')} />
                            </TouchableOpacity> */}
                            </View>
                            <View style={styles.innerView}>
                                <Image style={[styles.locationIcon, {
                                    top: hp('-1%')
                                }]} source={require('../assets/images/location_four.png')} />
                                <View>
                                    <Text style={styles.fetchingLocation}>{addLine1 || 'Fetching Location...'}</Text>
                                    <Text style={styles.addressLineText}>{addLine2 || ''}</Text>
                                </View>
                            </View>
                            <View style={styles.delboyContainer}>
                                <Image style={styles.delBoyImage} source={require('../assets/images/del_boy.png')} />
                                <View style={styles.detailedLocationContainer}>
                                    <Text style={styles.detailedLocationText}>Detailed location for helping our</Text>
                                    <Text style={[styles.detailedLocationText, {
                                        fontFamily: FONTS.poppins.semiBold
                                    }]}>delivery boy</Text>
                                </View>
                            </View>
                            <Text style={styles.saveAsText}>Save as</Text>
                            <View style={styles.addressTypesContainer}>
                                <TouchableOpacity
                                    onPress={() => setAddressType('HOME')}
                                    style={[styles.addressTypeContainer, addressType === 'HOME' ? { borderColor: '#F25000', backgroundColor: '#F25000' } : { borderColor: '#DADADA' }]}
                                >
                                    <Image style={Platform.OS === 'android' ?
                                        [styles.addressTypeIcon, {
                                            bottom: hp('0.2%'),
                                            tintColor: addressType === 'HOME' ? '#FFFFFF' : undefined
                                        }] : [styles.addressTypeIcon, { tintColor: addressType === 'HOME' ? '#FFFFFF' : undefined }]
                                    } source={require('../assets/images/home_primary_color.png')} />
                                    <Text style={[styles.addressTypeText, addressType === 'HOME' && { color: '#FFFFFF' }]}>Home</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => setAddressType('OFFICE')}
                                    style={[styles.addressTypeContainer, addressType === 'OFFICE' ? { borderColor: '#F25000', backgroundColor: '#F25000' } : { borderColor: '#DADADA' }]}
                                >
                                    <Image style={Platform.OS === 'android' ? [styles.addressTypeIcon, {
                                        width: wp('2.79%'),
                                        bottom: hp('0.2%'),
                                        tintColor: addressType === 'OFFICE' ? '#FFFFFF' : undefined
                                    }] : [styles.addressTypeIcon, {
                                        width: wp('2.79%'),
                                        tintColor: addressType === 'OFFICE' ? '#FFFFFF' : undefined
                                    }]} source={require('../assets/images/office_primary_color.png')} />
                                    <Text style={[styles.addressTypeText, addressType === 'OFFICE' && { color: '#FFFFFF' }]}>Office</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => setAddressType('OTHER')}
                                    style={[styles.addressTypeContainer, addressType === 'OTHER' ? { borderColor: '#F25000', backgroundColor: '#F25000' } : { borderColor: '#DADADA' }]}
                                >
                                    <Image style={Platform.OS === 'android' ? [styles.addressTypeIcon, {
                                        width: wp('2.55%'),
                                        bottom: hp('0.2%'),
                                        tintColor: addressType === 'OTHER' ? '#FFFFFF' : undefined
                                    }] : [styles.addressTypeIcon, {
                                        width: wp('2.55%'),
                                        tintColor: addressType === 'OTHER' ? '#FFFFFF' : undefined
                                    }]} source={require('../assets/images/location_five.png')} />
                                    <Text style={[styles.addressTypeText, addressType === 'OTHER' && { color: '#FFFFFF' }]}>Other</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.inputWrapper}>
                                <Text style={styles.label}>Full Address House / Flat / Block no</Text>
                                <TextInput
                                    style={styles.input}
                                    value={addLine1}
                                    onChangeText={setAddLine1}
                                />
                            </View>
                            <View style={styles.inputWrapper}>
                                <Text style={styles.label}>Appartment / Road / Area</Text>
                                <TextInput
                                    style={styles.input}
                                    value={addLine2}
                                    onChangeText={setAddLine2}
                                />
                            </View>
                            <View style={[styles.pincodeContainer, { zIndex: 10 }]}>
                                <View style={[styles.inputWrapper, {
                                    width: wp('42%')
                                }]}>
                                    <Text style={styles.label}>PIN Code</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={pincode}
                                        onChangeText={setPincode}
                                        keyboardType="numeric"
                                    />
                                </View>
                                <View>
                                    <DropDownPicker
                                        open={open}
                                        value={pincodeAreaId}
                                        items={items}
                                        setOpen={setOpen}
                                        setValue={setPincodeAreaId}
                                        setItems={setItems}
                                        placeholder={'PIN Code Area'}
                                        placeholderStyle={{
                                            fontFamily: FONTS.poppins.regular,
                                            color: '#DADADA',
                                            fontSize: wp('3.4%')
                                        }}
                                        loading={isAreasLoading}
                                        style={{
                                            borderColor: '#DADADA',
                                            height: hp('5.5%'),
                                            width: wp('42%'),
                                            minHeight: hp('4.3%'),
                                        }}
                                    />
                                </View>
                            </View>
                            <View style={{
                                marginTop: hp('1.5%'),
                                marginBottom: hp('3.5%')
                            }}>
                                <Text style={{
                                    fontFamily: FONTS.poppins.regular,
                                    color: '#000000',
                                    fontSize: wp('3.4%')
                                }}>Land mark / Delivery instruction</Text>
                                <TextInput
                                    placeholderTextColor={'#616161'}
                                    placeholder='eg. Near Lulu Mall'
                                    value={landmark}
                                    onChangeText={setLandmark}
                                    multiline
                                    style={[styles.input, {
                                        height: hp('6.27%'),
                                        paddingHorizontal: wp('3.25%'),
                                        textAlignVertical: 'top'
                                    }]}
                                />
                            </View>
                            <View style={styles.inputWrapper}>
                                <Text style={styles.label}>Customer name</Text>
                                <TextInput
                                    style={styles.input}
                                    value={custName}
                                    onChangeText={setCustName}
                                />
                            </View>
                            <View style={styles.inputWrapper}>
                                <Text style={styles.label}>Phone number</Text>
                                <TextInput
                                    placeholder='Enter mobile number'
                                    style={styles.input}
                                    placeholderTextColor={'#616161'}
                                    value={phone}
                                    onChangeText={setPhone}
                                    keyboardType="phone-pad"
                                    maxLength={10}
                                />
                            </View>
                            <LinearGradient colors={['#F25000', '#FF7B3A']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.buttonGradientStyle}
                            >
                                <TouchableOpacity disabled={isLoading} onPress={handleSave}>
                                    {isLoading ? (
                                        <ActivityIndicator color="#FFFFFF" />
                                    ) : (
                                        <Text style={styles.buttonText}>{isEditMode ? 'UPDATE ADDRESS' : 'SAVE ADDRESS'}</Text>
                                    )}
                                </TouchableOpacity>
                            </LinearGradient>
                        </ScrollView>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </>
    );
};

export default AddLocationScreen;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    addLocationText: {
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('4.65%'),
        color: '#000000',
        flex: 1,
        marginLeft: wp('4%')
    },
    leftArrowIcon: {
        width: wp('4.5%'),
        height: hp('2.5%'),
        resizeMode: 'contain',
        tintColor: '#000000'
    },
    homeIcon: {
        height: wp('7.9%'),
        width: wp('7.9%'),
    },
    topView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: hp('2%'),
        marginBottom: hp('1%'),
    },
    backButtonContainer: {
        padding: wp('1%'),
    },
    searchAbsoluteContainer: {
        width: wp('90.7%'),
        alignSelf: 'center',
        marginTop: hp('1.5%'),
        zIndex: 999,
        elevation: 10
    },
    searchContainer: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        height: hp('5.36%'),
        width: wp('90.7%'),
        borderRadius: wp('2.32%'),
        alignItems: 'center',
        alignSelf: 'center',
        paddingHorizontal: wp('4%'),
        borderWidth: 1,
        borderColor: '#DADADA',
        marginTop: hp('4%')
    },
    searchIcon: {
        width: wp('4.18%'),
        height: wp('4.18%')
    },
    searchInput: {
        fontFamily: FONTS.poppins.light,
        fontSize: wp('3.72%'),
        color: '#000000',
        marginLeft: wp('2.1%')
    },
    bottomContainer: {
        backgroundColor: '#FFFFFF',
        position: "absolute",
        bottom: 0,
        width: '100%',
        height: hp('13%'),
        paddingTop: hp('1%'),
        paddingHorizontal: wp('4.65%'),
        borderTopLeftRadius: hp('4.3%'),
        borderTopRightRadius: hp('4.3%')
    },
    locationIcon: {
        width: wp('5.6%'),
        height: wp('7%')
    },
    fetchingLocation: {
        color: '#000000',
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('4.18%'),
        marginLeft: wp('4%')
    },
    upperDivider: {
        width: wp('21.16%'),
        height: hp('0.96%'),
        backgroundColor: '#C9C9C9',
        borderRadius: 20,
        alignSelf: 'center'
    },
    innerView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: hp('2.2%')
    },
    addressLineText: {
        color: '#616161',
        fontSize: wp('3.6%'),
        fontFamily: FONTS.poppins.regular,
        marginLeft: wp('4%'),
        marginTop: hp('1%')
    },
    detailedAddressContainer: {
        backgroundColor: '#FFFFFF',
        flex: 1,
        borderTopLeftRadius: hp('4.3%'),
        borderTopRightRadius: hp('4.3%'),
        marginTop: hp('35%'), // Give more space for map
        paddingTop: hp('1%'),
        paddingHorizontal: wp('4.65%'),
    },
    mapContainer: {
        width: wp('100%'),
        height: hp('45%'),
        position: 'absolute',
        top: 0
    },
    map: {
        flex: 1
    },
    fixedMarkerContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [
            { translateX: -wp('2.8%') },
            { translateY: -wp('7%') }
        ],
        alignItems: 'center',
        justifyContent: 'center',
    },
    reCenterButton: {
        position: 'absolute',
        bottom: hp('2%'),
        right: wp('4%'),
        backgroundColor: '#FFFFFF',
        width: wp('11%'),
        height: wp('11%'),
        borderRadius: wp('5.5%'),
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    markerFixed: {
        left: '50%',
        marginLeft: -wp('2.8%'),
        marginTop: -wp('7%'),
        position: 'absolute',
        top: hp('22.5%') // Center of map height (45% / 2)
    },
    markerIcon: {
        width: wp('5.6%'),
        height: wp('7%'),
        tintColor: '#F25000'
    },
    delboyContainer: {
        height: hp('6.2%'),
        width: wp('90.7%'),
        backgroundColor: '#FFFAF7',
        flexDirection: "row",
        alignItems: "center",
        marginTop: hp('3%')
    },
    addressTypeText: {
        fontFamily: FONTS.poppins.regular,
        fontSize: wp('3.72%'),
        marginLeft: wp('1%')
    },
    delBoyImage: {
        width: wp('11.03%'),
        height: hp('4.53%'),
        resizeMode: 'contain',
        marginLeft: wp('6%')
    },
    detailedLocationContainer: {
        marginLeft: wp('3%')
    },
    detailedLocationText: {
        fontFamily: FONTS.poppins.regular,
        fontSize: wp('3.25%')
    },
    saveAsText: {
        fontFamily: FONTS.poppins.regular,
        fontSize: wp('3.72%'),
        alignSelf: 'center',
        marginTop: hp('3%')
    },
    addressTypesContainer: {
        flexDirection: "row",
        justifyContent: 'space-between',
        paddingHorizontal: wp('10%'),
        marginTop: hp('1.1%'),
        marginBottom: hp('5%')
    },
    addressTypeContainer: {
        flexDirection: "row",
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#F25000',
        borderRadius: wp('2.32%'),
        paddingHorizontal: wp('2.5%'),
        paddingVertical: hp('0.8%'),
    },
    addressTypeIcon: {
        width: wp('3.95%'),
        height: hp('3.25%'),
        resizeMode: 'contain'
    },
    inputWrapper: {
        marginBottom: hp('2.5%'),
        position: 'relative',
        // marginTop: hp('4%')
    },

    label: {
        position: 'absolute',
        top: hp('-1.07%'),
        left: wp('4%'),
        backgroundColor: '#fff',
        paddingHorizontal: 6,
        fontSize: wp('3.4%'),
        color: '#000',
        zIndex: 1,
        fontFamily: FONTS.poppins.regular
    },

    input: {
        height: hp('5.5%'),
        borderWidth: 1,
        borderColor: '#D9D9D9',
        borderRadius: wp('2.32%'),
        paddingHorizontal: wp('5%'),
        fontSize: wp('3%'),
        color: '#000000',
        fontFamily: FONTS.poppins.regular
    },

    pincodeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: hp('1%')
    },
    buttonGradientStyle: {
        height: hp('5.5%'),
        borderRadius: wp('2.3%'),
        justifyContent: "center",
        alignItems: 'center',
        marginBottom: hp('4%')
    },
    buttonText: {
        color: '#FFFFFF',
        fontFamily: FONTS.poppins.bold,
        fontSize: wp('3.72%')
    }
})
