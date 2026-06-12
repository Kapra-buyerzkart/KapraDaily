import React, { useState, useEffect, useRef } from 'react'
import {
    View, Text, StyleSheet, Image, TouchableOpacity, TextInput,
    Platform, ScrollView, KeyboardAvoidingView, ActivityIndicator,
    PermissionsAndroid, Alert
} from 'react-native'
import MapView from 'react-native-maps'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { FONTS } from '../styles/typography'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { useNavigation, useRoute } from '@react-navigation/native'
import DropDownPicker from 'react-native-dropdown-picker'
import LinearGradient from 'react-native-linear-gradient'
import { addAddressApi, updateAddressApi } from '../api/addressService'
import { getAreasByPincode } from '../api'
import Toast from 'react-native-simple-toast'
import { useAddresses } from '../hooks/useAddresses'
import axios from 'axios'
import { validatePhoneNumbers } from '../utils/validation'
import Geolocation from '@react-native-community/geolocation'
import CustomLoader from '../components/CustomLoader'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { AppContext } from '../context/appContext'
import AsyncStorage from '@react-native-async-storage/async-storage'

// Height of the map area — pin is centred on this
const MAP_HEIGHT = hp('45%')

const AddLocationScreen = () => {
    const navigation = useNavigation()
    const route = useRoute()
    const insets = useSafeAreaInsets()
    const { refreshAddresses } = useAddresses()
    const { editPincode } = React.useContext(AppContext)
    const isMountedRef = useRef(true)
    const mapRef = useRef(null)
    const googleAutocompleteRef = useRef(null)

    const editAddress = route.params?.address
    const isEditMode = !!editAddress

    const [open, setOpen] = useState(false)
    const [pincodeAreaId, setPincodeAreaId] = useState(editAddress?.pincodeAreaId || null)
    const [items, setItems] = useState([])

    const [custName, setCustName] = useState(editAddress?.custName || '')
    const [addLine1, setAddLine1] = useState(editAddress?.addLine1 || '')
    const [addLine2, setAddLine2] = useState(editAddress?.addLine2 || '')
    const [landmark, setLandmark] = useState(editAddress?.landmark || '')
    const [phone, setPhone] = useState(editAddress?.phone || '')
    const [pincode, setPincode] = useState(editAddress?.pincode || '')
    const [addressType, setAddressType] = useState(editAddress?.addressType || 'HOME')
    const [isLoading, setIsLoading] = useState(false)
    const [isInitialLoading, setIsInitialLoading] = useState(!isEditMode)
    const [isAreasLoading, setIsAreasLoading] = useState(false)
    const [isGeocoding, setIsGeocoding] = useState(false)
    // isDragging: lift the pin slightly while map is moving (nice UX touch)
    const [isDragging, setIsDragging] = useState(false)

    const defaultCoords = { latitude: 10.0205, longitude: 76.3052 }
    const apiKey = 'AIzaSyDhItv0zoWdQbDh-5jjKLAEjwRDDrFNc1Y'

    // The map region — this is the source of truth for where the pin points
    const [region, setRegion] = useState({
        latitude: Number(editAddress?.latitude) || defaultCoords.latitude,
        longitude: Number(editAddress?.longitude) || defaultCoords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
    })

    useEffect(() => {
        return () => { isMountedRef.current = false }
    }, [])

    useEffect(() => {
        if (isEditMode && editAddress?.latitude != null && editAddress?.longitude != null) {
            // Edit mode — map is already centred on the saved coords via initialRegion
            setIsInitialLoading(false)
        } else {
            handleInitialLocation()
        }
    }, [])

    const handleInitialLocation = async () => {
        const hasPermission = await requestLocationPermission()
        if (hasPermission) {
            getCurrentLocation()
        } else {
            setIsInitialLoading(false)
            Toast.show('Location permission denied', Toast.SHORT)
        }
    }

    const requestLocationPermission = async () => {
        if (Platform.OS === 'ios') {
            Geolocation.requestAuthorization()
            return true
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
            )
            return granted === PermissionsAndroid.RESULTS.GRANTED
        } catch (err) {
            console.warn(err)
            return false
        }
    }

    const getCurrentLocation = (showLoader = false) => {
        if (showLoader) setIsLoading(true)

        const onSuccess = (position) => {
            if (!isMountedRef.current) return
            const { latitude, longitude } = position.coords
            const newRegion = { latitude, longitude, latitudeDelta: 0.005, longitudeDelta: 0.005 }

            // Move the map — the fixed pin automatically points to the new centre
            setRegion(newRegion)
            mapRef.current?.animateToRegion(newRegion, 600)

            if (!isEditMode) setIsInitialLoading(false)
            reverseGeocode(latitude, longitude)
            if (showLoader) setIsLoading(false)
        }

        const onFinalError = (error) => {
            if (!isMountedRef.current) return
            if (!isEditMode) setIsInitialLoading(false)
            if (showLoader) setIsLoading(false)
            const msg =
                error.code === 1 ? 'Permission denied' :
                    error.code === 2 ? 'Position unavailable' :
                        error.code === 3 ? 'Timeout' : 'Failed to fetch location'
            Toast.show(msg, Toast.SHORT)
        }

        Geolocation.getCurrentPosition(
            onSuccess,
            () => {
                Geolocation.getCurrentPosition(
                    onSuccess,
                    (error) => {
                        Geolocation.getCurrentPosition(
                            onSuccess,
                            onFinalError,
                            { enableHighAccuracy: false, timeout: 15000, maximumAge: 60000 }
                        )
                    },
                    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
                )
            },
            { enableHighAccuracy: false, timeout: 1000, maximumAge: 600000 }
        )
    }

    // Called when user STOPS panning — grab the centre coords and reverse-geocode
    const onRegionChangeComplete = (newRegion) => {
        setRegion(newRegion)
        setIsDragging(false)
        reverseGeocode(newRegion.latitude, newRegion.longitude)
    }

    const onRegionChange = () => {
        // Map is actively moving — lift the pin
        setIsDragging(true)
    }

    useEffect(() => {
        if (pincode && pincode.length === 6) {
            fetchAreas(pincode)
        } else {
            setItems([])
            if (!isEditMode) setPincodeAreaId(null)
        }
    }, [pincode])

    const fetchAreas = async (pin) => {
        try {
            setIsAreasLoading(true)
            const response = await getAreasByPincode(pin)
            if (response && response.success && Array.isArray(response.data)) {
                const formattedAreas = response.data.map(area => ({
                    label: area.areaName,
                    value: area.pincodeAreaId || area.id
                }))
                setItems(formattedAreas)
                if (formattedAreas.length > 0 && !isEditMode) {
                    setPincodeAreaId(formattedAreas[0].value)
                }
            } else {
                setItems([])
            }
        } catch (error) {
            console.error('Error fetching areas:', error)
            setItems([])
        } finally {
            setIsAreasLoading(false)
        }
    }

    const reverseGeocode = async (lat, lng) => {
        if (!isMountedRef.current) return
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
        try {
            setIsGeocoding(true)
            const response = await axios.get(url, { timeout: 8000 })
            if (response.data.results && response.data.results.length > 0) {
                const components = response.data.results[0].address_components
                const streetNumber = components.find(c => c.types.includes('street_number'))?.long_name || ''
                const routeName = components.find(c => c.types.includes('route'))?.long_name || ''
                const sublocality2 = components.find(c => c.types.includes('sublocality_level_2'))?.long_name || ''
                const sublocality1 = components.find(c => c.types.includes('sublocality_level_1'))?.long_name || ''
                const neighborhood = components.find(c => c.types.includes('neighborhood'))?.long_name || ''
                const locality = components.find(c => c.types.includes('locality'))?.long_name || ''
                const postalCode = components.find(c => c.types.includes('postal_code'))?.long_name || ''

                setAddLine1(`${streetNumber} ${routeName}`.trim() || sublocality2 || sublocality1 || '')
                setAddLine2((sublocality1 || neighborhood || locality).trim())
                if (postalCode) setPincode(postalCode)
            }
        } catch (error) {
            console.error('Reverse geocode error', error)
        } finally {
            if (isMountedRef.current) setIsGeocoding(false)
        }
    }

    const handleSave = async () => {
        if (!custName || !addLine1 || !phone || !pincode || !pincodeAreaId) {
            Toast.show('Please fill all required fields', Toast.SHORT)
            return
        }
        if (!validatePhoneNumbers(phone)) {
            Toast.show('Please enter a valid 10-digit phone number', Toast.SHORT)
            return
        }

        const payload = {
            custName, addLine1, addLine2, landmark, phone,
            country: 'India', state: 'Kerala', district: 'Ernakulam',
            pincode, pincodeAreaId,
            pincodeAreaName: items.find(i => i.value === pincodeAreaId)?.label || '',
            // Coordinates come from the map region centre — wherever the fixed pin is pointing
            latitude: Number(region.latitude),
            longitude: Number(region.longitude),
            addressType,
            isDefaultBillingAddress: true,
            isDefaultShippingAddress: true,
        }

        setIsLoading(true)
        try {
            const response = isEditMode
                ? await updateAddressApi(editAddress.addressId, payload)
                : await addAddressApi(payload)

            if (response && response.success !== false) {
                Toast.show(isEditMode ? 'Address updated' : 'Address added', Toast.SHORT)

                // Update the app's active location to the chosen pincode area
                const selectedAreaName = items.find(i => i.value === pincodeAreaId)?.label || ''
                await editPincode({
                    pincodeAreaId: pincodeAreaId,
                    areaName: selectedAreaName,
                })

                // Persist the selected address ID so other screens can use it
                const savedAddressId = response?.data?.custAddressId || response?.data?.addressId || response?.data?.id
                if (savedAddressId) {
                    await AsyncStorage.setItem('selectedAddressId', String(savedAddressId))
                }

                await refreshAddresses()
                navigation.goBack()
            } else {
                Toast.show(response?.message || 'Failed to save address', Toast.SHORT)
            }
        } catch (error) {
            console.error('Error saving address:', error)
            Toast.show('An error occurred', Toast.SHORT)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <CustomLoader visible={isInitialLoading} text="Fetching your location..." />

            <SafeAreaView
                edges={['top']}
                style={[styles.mainContainer, Platform.OS === 'android' && { paddingBottom: insets.bottom }]}
            >
                {/* ── MAP (absolutely positioned behind everything) ── */}
                <View style={styles.mapContainer}>
                    <MapView
                        ref={mapRef}
                        style={styles.map}
                        initialRegion={region}
                        onRegionChange={onRegionChange}
                        onRegionChangeComplete={onRegionChangeComplete}
                        showsUserLocation={true}
                        showsMyLocationButton={false}
                    />

                    <View style={styles.fixedPinContainer} pointerEvents="none">
                        <View style={[styles.pinShadow, isDragging && styles.pinShadowLifted]} />
                        <Image
                            source={require('../assets/images/location_four.png')}
                            style={[
                                styles.fixedPinImage,
                                isDragging && styles.fixedPinLifted,
                            ]}
                        />
                    </View>

                    <TouchableOpacity
                        style={styles.reCenterButton}
                        onPress={() => getCurrentLocation(true)}
                    >
                        <Ionicons name="locate" size={wp('6%')} color="#F25000" />
                    </TouchableOpacity>
                </View>

                {/* ── SEARCH BAR (floats over the map) ── */}
                <View style={styles.searchLayer}>
                    <View style={styles.searchAbsoluteContainer}>
                        <GooglePlacesAutocomplete
                            ref={googleAutocompleteRef}
                            onFail={error => Alert.alert('Google Places Error', String(error))}
                            placeholder="Search Location"
                            textInputProps={{
                                placeholderTextColor: '#000000',
                                color: '#000000',
                                returnKeyType: 'search',
                            }}
                            fetchDetails={true}
                            onPress={(data, details = null) => {
                                if (details) {
                                    const description = data.description || details.formatted_address || ''
                                    googleAutocompleteRef.current?.setAddressText(description)

                                    const lat = details.geometry.location.lat
                                    const lng = details.geometry.location.lng
                                    const newRegion = { latitude: lat, longitude: lng, latitudeDelta: 0.005, longitudeDelta: 0.005 }

                                    // Move the map — fixed pin stays centred, now points to new place
                                    setRegion(newRegion)
                                    mapRef.current?.animateToRegion(newRegion, 600)
                                    reverseGeocode(lat, lng)
                                }
                            }}
                            query={{ key: apiKey, language: 'en', components: 'country:in' }}
                            styles={{
                                container: { flex: 0 },
                                textInputContainer: {
                                    backgroundColor: '#FFFFFF',
                                    borderRadius: wp('2.32%'),
                                    borderWidth: 1,
                                    borderColor: '#DADADA',
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
                                description: { color: '#000000' },
                                predefinedPlacesDescription: { color: '#000000' },
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
                                    zIndex: 100,
                                },
                                row: { padding: wp('3%'), height: hp('6%'), flexDirection: 'row' },
                                separator: { height: 1, backgroundColor: '#DADADA' },
                                loader: { flexDirection: 'row', justifyContent: 'flex-end', height: 20 },
                            }}
                        />
                    </View>

                    {isGeocoding && !isInitialLoading && (
                        <View style={styles.geocodingBanner}>
                            <ActivityIndicator size="small" color="#F25000" />
                            <Text style={styles.geocodingText}>Fetching address…</Text>
                        </View>
                    )}
                </View>

                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >

                    <ScrollView
                        style={styles.detailedAddressContainer}
                        contentContainerStyle={{ paddingBottom: hp('10%') }}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >

                        <View style={styles.topView}>
                            <TouchableOpacity
                                style={styles.backButtonContainer}
                                onPress={() => navigation.goBack()}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            >
                                <Image style={styles.leftArrowIcon} source={require('../assets/images/left_arrow.png')} />
                            </TouchableOpacity>
                            <Text style={styles.addLocationText}>
                                {isEditMode ? 'Edit location' : 'Add location'}
                            </Text>
                        </View>

                        <View style={styles.innerView}>
                            <Image
                                style={[styles.locationIcon, { top: hp('-1%') }]}
                                source={require('../assets/images/location_four.png')}
                            />
                            <View style={{ flex: 1 }}>
                                <Text style={styles.fetchingLocation} numberOfLines={2}>
                                    {addLine1 || (isGeocoding || isInitialLoading ? 'Fetching Location...' : 'Address not found')}
                                </Text>
                                <Text style={styles.addressLineText}>{addLine2 || ''}</Text>
                            </View>
                        </View>

                        <View style={styles.delboyContainer}>
                            <Image style={styles.delBoyImage} source={require('../assets/images/del_boy.png')} />
                            <View style={styles.detailedLocationContainer}>
                                <Text style={styles.detailedLocationText}>Detailed location for helping our</Text>
                                <Text style={[styles.detailedLocationText, { fontFamily: FONTS.poppins.semiBold }]}>delivery boy</Text>
                            </View>
                        </View>

                        <Text style={styles.saveAsText}>Save as</Text>
                        <View style={styles.addressTypesContainer}>
                            {[
                                { key: 'HOME', label: 'Home', icon: require('../assets/images/home_primary_color.png') },
                                { key: 'OFFICE', label: 'Office', icon: require('../assets/images/office_primary_color.png') },
                                { key: 'OTHER', label: 'Other', icon: require('../assets/images/location_five.png') },
                            ].map(({ key, label, icon }) => (
                                <TouchableOpacity
                                    key={key}
                                    onPress={() => setAddressType(key)}
                                    style={[
                                        styles.addressTypeContainer,
                                        addressType === key
                                            ? { borderColor: '#F25000', backgroundColor: '#F25000' }
                                            : { borderColor: '#DADADA' },
                                    ]}
                                >
                                    <Image
                                        style={[styles.addressTypeIcon, { tintColor: addressType === key ? '#FFFFFF' : undefined }]}
                                        source={icon}
                                    />
                                    <Text style={[styles.addressTypeText, addressType === key && { color: '#FFFFFF' }]}>
                                        {label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View style={styles.inputWrapper}>
                            <Text style={styles.label}>Full Address House / Flat / Block no</Text>
                            <TextInput style={styles.input} value={addLine1} onChangeText={setAddLine1} />
                        </View>

                        <View style={styles.inputWrapper}>
                            <Text style={styles.label}>Appartment / Road / Area</Text>
                            <TextInput style={styles.input} value={addLine2} onChangeText={setAddLine2} />
                        </View>

                        <View style={[styles.pincodeContainer, { zIndex: 10 }]}>
                            <View style={[styles.inputWrapper, { width: wp('42%') }]}>
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
                                    placeholder="PIN Code Area"
                                    placeholderStyle={{ fontFamily: FONTS.poppins.regular, color: '#DADADA', fontSize: wp('3.4%') }}
                                    loading={isAreasLoading}
                                    style={{ borderColor: '#DADADA', height: hp('5.5%'), width: wp('42%'), minHeight: hp('4.3%') }}
                                />
                            </View>
                        </View>

                        <View style={{ marginTop: hp('1.5%'), marginBottom: hp('3.5%') }}>
                            <Text style={{ fontFamily: FONTS.poppins.regular, color: '#000000', fontSize: wp('3.4%') }}>
                                Land mark / Delivery instruction
                            </Text>
                            <TextInput
                                placeholderTextColor="#616161"
                                placeholder="eg. Near Lulu Mall"
                                value={landmark}
                                onChangeText={setLandmark}
                                multiline
                                style={[styles.input, { height: hp('6.27%'), paddingHorizontal: wp('3.25%'), textAlignVertical: 'top' }]}
                            />
                        </View>

                        <View style={styles.inputWrapper}>
                            <Text style={styles.label}>Customer name</Text>
                            <TextInput style={styles.input} value={custName} onChangeText={setCustName} />
                        </View>

                        <View style={styles.inputWrapper}>
                            <Text style={styles.label}>Phone number</Text>
                            <TextInput
                                placeholder="Enter mobile number"
                                style={styles.input}
                                placeholderTextColor="#616161"
                                value={phone}
                                onChangeText={setPhone}
                                keyboardType="phone-pad"
                                maxLength={10}
                            />
                        </View>

                        <LinearGradient
                            colors={['#F25000', '#FF7B3A']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.buttonGradientStyle}
                        >
                            <TouchableOpacity disabled={isLoading} onPress={handleSave}>
                                {isLoading
                                    ? <ActivityIndicator color="#FFFFFF" />
                                    : <Text style={styles.buttonText}>{isEditMode ? 'UPDATE ADDRESS' : 'SAVE ADDRESS'}</Text>
                                }
                            </TouchableOpacity>
                        </LinearGradient>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </>
    )
}

export default AddLocationScreen

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },

    // ── Map ──────────────────────────────────────────────────────────────────
    mapContainer: {
        width: wp('100%'),
        height: MAP_HEIGHT,
        position: 'absolute',
        top: 0,
    },
    map: {
        flex: 1,
    },

    // ── Fixed crosshair pin ──────────────────────────────────────────────────
    // Sits at the exact centre of the map area. pointerEvents="none" so all
    // touch events pass straight through to the MapView underneath.
    fixedPinContainer: {
        position: 'absolute',
        // Centre horizontally
        left: 0,
        right: 0,
        alignItems: 'center',
        top: MAP_HEIGHT / 2,
        zIndex: 10,
    },
    fixedPinImage: {
        width: wp('8%'),
        height: wp('10%'),
        resizeMode: 'contain',
        tintColor: '#F25000',
        // No transform by default
    },
    // Lift pin up while map is panning — classic Google Maps feel
    fixedPinLifted: {
        transform: [{ translateY: -6 }],
    },
    // Small shadow ellipse beneath the pin on the map surface
    pinShadow: {
        width: wp('4%'),
        height: wp('1.5%'),
        borderRadius: wp('2%'),
        backgroundColor: 'rgba(0,0,0,0.18)',
        marginTop: 2,
        alignSelf: 'center',
    },
    pinShadowLifted: {
        width: wp('3%'),
        height: wp('1%'),
        backgroundColor: 'rgba(0,0,0,0.10)',
    },

    // ── Re-centre button ─────────────────────────────────────────────────────
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

    // ── Search layer (floats over map) ───────────────────────────────────────
    searchLayer: {
        zIndex: 999,
        elevation: 10,
    },
    searchAbsoluteContainer: {
        width: wp('90.7%'),
        alignSelf: 'center',
        marginTop: hp('1.5%'),
        zIndex: 999,
        elevation: 10,
    },
    geocodingBanner: {
        width: wp('90.7%'),
        alignSelf: 'center',
        marginTop: hp('1%'),
        backgroundColor: '#FFFFFF',
        borderRadius: wp('2.32%'),
        paddingVertical: hp('0.8%'),
        paddingHorizontal: wp('3%'),
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#DADADA',
        elevation: 4,
    },
    geocodingText: {
        marginLeft: wp('2%'),
        color: '#000000',
        fontFamily: FONTS.poppins.regular,
        fontSize: wp('3.2%'),
    },

    // ── Form sheet ───────────────────────────────────────────────────────────
    detailedAddressContainer: {
        backgroundColor: '#FFFFFF',
        flex: 1,
        borderTopLeftRadius: hp('4.3%'),
        borderTopRightRadius: hp('4.3%'),
        marginTop: hp('30%'),
        paddingTop: hp('1%'),
        paddingHorizontal: wp('4.65%'),
    },
    upperDivider: {
        width: wp('21.16%'),
        height: hp('0.96%'),
        backgroundColor: '#C9C9C9',
        borderRadius: 20,
        alignSelf: 'center',
    },
    dragInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: hp('1.5%'),
        backgroundColor: '#FFF0F0',
        paddingVertical: hp('0.8%'),
        paddingHorizontal: wp('2.5%'),
        borderRadius: wp('2%'),
        borderWidth: 1,
        borderColor: '#FFD1D1',
    },
    dragInfoText: {
        fontSize: wp('3.1%'),
        color: 'red',
        fontStyle: 'italic',
        fontFamily: FONTS.poppins.regular,
        marginLeft: wp('1.5%'),
        flex: 1,
    },
    topView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: hp('2%'),
    },
    backButtonContainer: {
        padding: wp('1%'),
    },
    leftArrowIcon: {
        width: wp('4.5%'),
        height: hp('2.5%'),
        resizeMode: 'contain',
        tintColor: '#000000',
    },
    addLocationText: {
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('4.65%'),
        color: '#000000',
        flex: 1,
        marginLeft: wp('4%'),
    },
    locationIcon: {
        width: wp('5.6%'),
        height: wp('7%'),
    },
    fetchingLocation: {
        color: '#000000',
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('4.18%'),
        marginLeft: wp('4%'),
    },
    innerView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: hp('2.2%'),
    },
    addressLineText: {
        color: '#616161',
        fontSize: wp('3.6%'),
        fontFamily: FONTS.poppins.regular,
        marginLeft: wp('4%'),
        marginTop: hp('1%'),
    },
    delboyContainer: {
        height: hp('6.2%'),
        width: wp('90.7%'),
        backgroundColor: '#FFFAF7',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: hp('1.5%'),
    },
    delBoyImage: {
        width: wp('11.03%'),
        height: hp('4.53%'),
        resizeMode: 'contain',
        marginLeft: wp('6%'),
    },
    detailedLocationContainer: {
        marginLeft: wp('3%'),
    },
    detailedLocationText: {
        fontFamily: FONTS.poppins.regular,
        fontSize: wp('3.25%'),
    },
    saveAsText: {
        fontFamily: FONTS.poppins.regular,
        fontSize: wp('3.72%'),
        alignSelf: 'center',
        marginTop: hp('1%'),
    },
    addressTypesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: wp('10%'),
        marginTop: hp('1.1%'),
        marginBottom: hp('3%'),
    },
    addressTypeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: wp('2.12%'),
        paddingHorizontal: wp('2.8%'),
        paddingVertical: hp('0.2%'),
    },
    addressTypeIcon: {
        width: wp('3.95%'),
        height: hp('3.25%'),
        resizeMode: 'contain',
    },
    addressTypeText: {
        fontFamily: FONTS.poppins.regular,
        fontSize: wp('3.72%'),
        marginLeft: wp('1%'),
    },
    inputWrapper: {
        marginBottom: hp('2.5%'),
        position: 'relative',
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
        fontFamily: FONTS.poppins.regular,
    },
    input: {
        height: hp('5.5%'),
        borderWidth: 1,
        borderColor: '#D9D9D9',
        borderRadius: wp('2.32%'),
        paddingHorizontal: wp('5%'),
        fontSize: wp('3%'),
        color: '#000000',
        fontFamily: FONTS.poppins.regular,
    },
    pincodeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: hp('1%'),
    },
    buttonGradientStyle: {
        height: hp('5.5%'),
        borderRadius: wp('2.3%'),
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: hp('4%'),
    },
    buttonText: {
        color: '#FFFFFF',
        fontFamily: FONTS.poppins.bold,
        fontSize: wp('3.72%'),
    },
})