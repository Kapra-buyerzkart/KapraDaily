import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Platform, ScrollView, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, ActivityIndicator } from 'react-native'
import MapView from 'react-native-maps'
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
    const [isAreasLoading, setIsAreasLoading] = useState(false);

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
                Toast.show('No areas found for this pincode', Toast.SHORT);
            }
        } catch (error) {
            console.error('Error fetching areas:', error);
            setItems([]);
        } finally {
            setIsAreasLoading(false);
        }
    };

    const handleSave = async () => {
        if (!custName || !addLine1 || !phone || !pincode || !pincodeAreaId) {
            Toast.show('Please fill all required fields', Toast.SHORT);
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
            latitude: 10.0205225253,
            longitude: 76.30524553585,
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
        <SafeAreaView edges={['top']} style={Platform.OS === "android" ? [styles.mainContainer, {
            paddingBottom: insets.bottom
        }] : styles.mainContainer}>
            <MapView
                style={StyleSheet.absoluteFillObject}
                initialRegion={{
                    latitude: editAddress?.latitude || 10.8505,
                    longitude: editAddress?.longitude || 76.2711,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                }}
            />
            <View style={styles.topView}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image style={styles.leftArrowIcon} source={require('../assets/images/left_arrow.png')} />
                </TouchableOpacity>
                <Text style={styles.addLocationText}>{isEditMode ? 'Edit location' : 'Add location'}</Text>
                <Image style={styles.homeIcon} source={require('../assets/images/home_two.png')} />
            </View>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView
                        style={styles.detailedAddressContainer}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.upperDivider} />
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
                                style={[styles.addressTypeContainer, addressType === 'HOME' && { borderColor: '#F25000', backgroundColor: '#FFF5F0' }]}
                            >
                                <Image style={Platform.OS === 'android' ?
                                    [styles.addressTypeIcon, {
                                        bottom: hp('0.2%')
                                    }] : styles.addressTypeIcon
                                } source={require('../assets/images/home_primary_color.png')} />
                                <Text style={styles.addressTypeText}>Home</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => setAddressType('OFFICE')}
                                style={[styles.addressTypeContainer, addressType === 'OFFICE' && { borderColor: '#F25000', backgroundColor: '#FFF5F0' }]}
                            >
                                <Image style={Platform.OS === 'android' ? [styles.addressTypeIcon, {
                                    width: wp('2.79%%'),
                                    bottom: hp('0.2%')
                                }] : [styles.addressTypeIcon, {
                                    width: wp('2.79%%'),
                                }]} source={require('../assets/images/office_primary_color.png')} />
                                <Text style={styles.addressTypeText}>Office</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => setAddressType('OTHER')}
                                style={[styles.addressTypeContainer, addressType === 'OTHER' && { borderColor: '#F25000', backgroundColor: '#FFF5F0' }]}
                            >
                                <Image style={Platform.OS === 'android' ? [styles.addressTypeIcon, {
                                    width: wp('2.55%'),
                                    bottom: hp('0.2%')
                                }] : [styles.addressTypeIcon, {
                                    width: wp('2.55%'),
                                }]} source={require('../assets/images/location_five.png')} />
                                <Text style={styles.addressTypeText}>Other</Text>
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
                        <View style={styles.pincodeContainer}>
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
                                    height: hp('14.27%'),
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
                                placeholder='000 000 0000'
                                style={styles.input}
                                placeholderTextColor={'#616161'}
                                value={phone}
                                onChangeText={setPhone}
                                keyboardType="phone-pad"
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
    )
}

export default AddLocationScreen

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
        width: wp('2.33%'),
        height: hp('2.04%')
    },
    homeIcon: {
        height: wp('7.9'),
        width: wp('7.9%'),
    },
    topView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: wp('4.65%'),
        marginTop: hp('1%')
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
        marginTop: hp('2%'),
        paddingTop: hp('1%'),
        paddingHorizontal: wp('4.65%'),
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
        paddingHorizontal: wp('1.7%'),
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
