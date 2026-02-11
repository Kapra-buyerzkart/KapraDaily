import { View, Text, StyleSheet, ImageBackground, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { FONTS } from '../styles/typography'
import { useNavigation, useRoute } from '@react-navigation/native'
import { getAreasByPincode, sendRegisterOtp } from '../api'

const PINCODE_AREA_MAP = {
    '676519': ['Chungathara', 'Pukkottumanna', 'Manjeri'],
    '682001': ['Kochi', 'Edappally', 'Vyttila']
}

const RegistrationScreen = () => {

    const [showPassword, setShowPassword] = useState(false)
    const [selectedArea, setSelectedArea] = useState(null)
    const [pincode, setPincode] = useState('')
    const [areas, setAreas] = useState([])
    const [termsAndConditionsClicked, setTermsAndConditionsClicked] = useState(false)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const route = useRoute()

    const { phone } = route.params || {}

    const navigation = useNavigation()

    const handlePincodeChange = async (value) => {
        setPincode(value)

        if (value.length === 6) {
            try {
                const response = await getAreasByPincode(value)
                console.log('resss', response)

                // adjust based on your API response structure
                setAreas(response?.data || [])
                setSelectedArea(null)
            } catch (error) {
                console.log('Error fetching areas:', error)
                setAreas([])
            }
        } else {
            setAreas([])
            setSelectedArea(null)
        }
    }

    const handleContinue = async () => {
        if (!name || !email || !password) {
            alert('Please fill all details')
            return
        }

        if (pincode.length !== 6 || !selectedArea) {
            alert('Please select a valid area')
            return
        }

        if (!termsAndConditionsClicked) {
            alert('Please accept terms and conditions')
            return
        }

        try {
            setLoading(true)

            const response = await sendRegisterOtp(phone)
            console.log('OTP response:', response)

            if (response?.success === true) {
                navigation.navigate('OtpScreen', {
                    phone: phone,
                    otpType: 'register',
                    name: name,
                    email: email,
                    password: password,
                    pincodeAreaId: selectedArea.pincodeAreaId

                })
            } else {
                alert(response?.message || 'Failed to send OTP')
            }

        } catch (error) {
            console.log('OTP error:', error)
            alert('Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <SafeAreaView style={styles.mainContainer}>
            {console.log("KKKK", phone)}
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            // keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <ImageBackground style={styles.backgroundImage} source={require('../assets/images/login_background_image.jpg')}>
                        <Image style={styles.kapraLogo} source={require('../assets/images/kapra_logo.png')} />
                        <Image style={styles.tagLine} source={require('../assets/images/login_content.png')} />
                    </ImageBackground>
                    <View style={styles.registrationContainer}>
                        <Text style={[styles.headerText, {
                            marginBottom: hp('1%')
                        }]}>Registration</Text>
                        <View style={styles.mobilenoContainer}>
                            <Text style={styles.mobilenoText}>+91 {phone}</Text>
                            <TouchableOpacity>
                                <Image style={styles.editIcon} source={require('../assets/images/edit_icon.png')} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.enterNumberText}>Name</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    placeholder="Enter name"
                                    placeholderTextColor="#DADADA"
                                    style={styles.input}
                                    value={name}
                                    onChangeText={setName}
                                />
                            </View>
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.enterNumberText}>Email ID</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    placeholder="Enter email ID"
                                    placeholderTextColor="#DADADA"
                                    style={styles.input}
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                />
                            </View>
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.enterNumberText}>Password</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    placeholder="Enter password"
                                    placeholderTextColor="#DADADA"
                                    style={styles.input}
                                    secureTextEntry={!showPassword}
                                    value={password}
                                    onChangeText={setPassword}
                                />
                                <TouchableOpacity
                                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                    onPress={() => setShowPassword(!showPassword)}>
                                    <Image tintColor={showPassword ? 'red' : undefined} style={styles.eyeIcon} source={require('../assets/images/eye_icon.png')} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.enterNumberText}>Pincode</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    placeholder="00 00 00"
                                    placeholderTextColor="#DADADA"
                                    style={styles.input}
                                    value={pincode}
                                    onChangeText={handlePincodeChange}
                                    keyboardType="number-pad"
                                    maxLength={6}
                                />
                            </View>
                        </View>
                        {console.log('areas', areas)}
                        {areas.length > 0 && (
                            <View style={styles.areaCard}>
                                <Text style={styles.title}>Select your area</Text>

                                {areas.map((area, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.row}
                                        onPress={() => {
                                            setSelectedArea(area)
                                            setAreas([area])
                                        }}
                                    >
                                        <Text style={styles.areaText}>{area.areaName}</Text>
                                        {console.log('selectedArea', selectedArea)}
                                        {selectedArea?.areaName !== area?.areaName ? (<View style={styles.radioOuter} />) : (
                                            <Image style={styles.successIcon} source={require('../assets/images/success.png')} />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                        <View style={styles.termsAndConditionsContainer}>
                            <TouchableOpacity onPress={() => setTermsAndConditionsClicked(!termsAndConditionsClicked)} style={styles.termsAndConditionsRadioOuter}>
                                {termsAndConditionsClicked && (
                                    <View style={styles.termsAndConditionsRadioInner} />
                                )}
                            </TouchableOpacity>
                            <Text style={styles.agreeText}>I have read and agree to</Text>
                            <TouchableOpacity>
                                <Text style={styles.termsAndConditionsText}>Terms and conditions</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity onPress={handleContinue} style={[styles.continueButton, {
                        }]}>
                            <Text style={styles.continueButtonText}>Continue</Text>
                        </TouchableOpacity>

                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default RegistrationScreen

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        height: hp('5.36%'),
        borderRadius: wp('2.33%'),
        borderWidth: 1,
        borderColor: '#E5E5E5',
        paddingHorizontal: wp('4.18%'),
        backgroundColor: '#fff',
    },
    countryCode: {
        fontSize: wp('4.19%'),
        color: '#000000',
        marginRight: 12,
    },
    divider: {
        width: 1,
        height: hp('4%'),
        backgroundColor: '#E5E5E5',
        marginRight: wp('4%')
    },
    input: {
        flex: 1,
        color: '#000',
        fontSize: wp('4.19%'),
    },
    backgroundImage: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: hp('6%'),
        paddingBottom: hp('7.5%')
    },
    kapraLogo: {
        width: wp('47%'),
        height: hp('10%'),
        resizeMode: 'cover'
    },
    tagLine: {
        width: wp('50.7%'),
        height: hp('16.95%'),
        resizeMode: 'cover',
    },
    bottomContainer: {
        height: hp('30.33%'),
        paddingHorizontal: wp('5.8%'),
        paddingTop: hp('3.5%'),
        borderTopLeftRadius: wp('9.3%'),
        borderTopRightRadius: wp('9.3%'),
        backgroundColor: '#FFFFFF',
        bottom: hp('4%')
    },
    headerText: {
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('4.65%'),
        color: '#000000',
        alignSelf: 'center',
        marginBottom: hp('3.5%')
    },
    enterNumberText: {
        fontFamily: FONTS.poppins.regular,
        fontSize: wp('3.72%'),
        color: '#616161',
        marginBottom: hp('0.5%')
    },
    continueButton: {
        backgroundColor: '#F25000',
        width: '100%',
        height: hp('6.11%'),
        justifyContent: "center",
        alignItems: 'center',
        borderRadius: wp('2.33%'),
        marginTop: hp('5%')
    },
    continueButtonText: {
        fontFamily: FONTS.poppins.bold,
        fontSize: wp('4.18%'),
        color: '#FFFFFF'
    },
    areaCard: {
        borderWidth: 1,
        borderColor: '#DADADA',
        // borderRadius: 16,
        paddingVertical: hp('1.28%'),
        borderBottomLeftRadius: wp('2.33%'),
        borderBottomRightRadius: wp('2.33%')
    },
    title: {
        textAlign: 'center',
        fontSize: wp('3.72%'),
        marginBottom: hp('1%'),
        fontFamily: FONTS.poppins.semiBold,
        color: "#000000"
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: wp('3.72%'),
        paddingVertical: hp('1.2%')
    },
    areaText: {
        fontSize: wp('3.72%'),
        fontFamily: FONTS.poppins.regular,
        color: "#000000"
    },
    radioOuter: {
        width: wp('4.65%'),
        height: wp('4.65%'),
        borderRadius: wp('2.33%'),
        borderWidth: 2,
        borderColor: '#ccc',
        alignItems: 'center',
        justifyContent: 'center'
    },
    // registrationContainer: {
    //     height: hp('70%'),
    //     paddingHorizontal: wp('5.8%'),
    //     paddingTop: hp('3.5%'),
    //     borderTopLeftRadius: wp('9.3%'),
    //     borderTopRightRadius: wp('9.3%'),
    //     backgroundColor: '#FFFFFF',
    //     bottom: hp('4%'),
    // },
    registrationContainer: {
        paddingHorizontal: wp('5.8%'),
        paddingTop: hp('3.5%'),
        paddingBottom: hp('4%'), // important
        borderTopLeftRadius: wp('9.3%'),
        borderTopRightRadius: wp('9.3%'),
        backgroundColor: '#FFFFFF',
        bottom: hp('4%'),
    },
    mobilenoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center'
    },
    mobilenoText: {
        color: '#000000',
        fontFamily: FONTS.poppins.light,
        fontSize: wp('3.72%')
    },
    editIcon: {
        height: wp('2.79%'),
        width: wp('2.79%'),
        marginLeft: wp('3%')
    },
    eyeIcon: {
        width: wp('4.19%'),
        height: hp('1.29%'),
        resizeMode: 'contain'
    },
    successIcon: {
        height: wp('4.65%'),
        width: wp('4.65%'),
        // resizeMode: 'contain'
    },
    inputContainer: {
        marginTop: hp('1.5%')
    },
    termsAndConditionsContainer: {
        flexDirection: 'row',
        marginTop: hp('1.7%'),
        alignItems: 'center'
    },
    termsAndConditionsRadioOuter: {
        width: wp('3%'),
        height: wp('3%'),
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#F25000',
        justifyContent: 'center',
        alignItems: 'center'
    },
    termsAndConditionsRadioInner: {
        width: wp('2%'),
        height: wp('2%'),
        backgroundColor: '#F25000',
        borderRadius: 30,
    },
    agreeText: {
        color: '#00000033',
        fontFamily: FONTS.poppins.regular,
        fontSize: wp('3.25%'),
        marginLeft: wp('2%')
    },
    termsAndConditionsText: {
        color: '#F25000',
        fontFamily: FONTS.poppins.regular,
        fontSize: wp('3.25%'),
        marginLeft: wp('1%')
    }
})