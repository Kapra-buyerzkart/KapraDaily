import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    Image,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
    Alert,
    ActivityIndicator,
} from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { FONTS } from '../styles/typography';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { verifyLoginOtp, sendLoginOtp, sendForgotPwdOtp, verifyForgotPwdOtp, resendOtp, resendLoginOtp, resendForgotPwdOtp } from '../api'; // ✅ add sendLoginOtp
import { setResetToken } from '../api/tokenService';

const ACCESS_TOKEN = 'ACCESS_TOKEN';
const REFRESH_TOKEN = 'REFRESH_TOKEN';

const setTokens = async (accessToken, refreshToken) => {
    await AsyncStorage.multiSet([
        [ACCESS_TOKEN, accessToken],
        [REFRESH_TOKEN, refreshToken],
    ]);
};

const OtpScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { phone, type } = route.params || {};

    const [otp, setOtp] = useState(['', '', '', '', '']);
    const inputRefs = Array.from({ length: 5 }, () => useRef(null));

    const [timer, setTimer] = useState(60); // 1 minute
    const [isResendDisabled, setIsResendDisabled] = useState(true);
    const [loading, setLoading] = useState(false)

    // Countdown effect
    useEffect(() => {
        let interval;
        if (isResendDisabled) {
            interval = setInterval(() => {
                setTimer((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        setIsResendDisabled(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isResendDisabled]);

    const handleChange = (text, index) => {
        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);

        if (text && index < inputRefs.length - 1) {
            inputRefs[index + 1].current?.focus();
        }
    };

    const handleKeyPress = (e, index) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs[index - 1].current?.focus();
        }
    };

    const handleContinueLogin = async () => {
        // console.log('enteredOtp', enteredOtp)
        const enteredOtp = otp.join('');
        if (enteredOtp.length < 5) {
            Alert.alert('Error', 'Please enter complete OTP');
            return;
        }

        try {
            setLoading(true)
            const response = await verifyLoginOtp(phone, enteredOtp);
            // console.log('Verify OTP Response:', response);

            if (response?.success && response?.data) {
                const { accessToken, refreshToken } = response.data;
                await setTokens(accessToken, refreshToken);

                navigation.reset({
                    index: 0,
                    routes: [{ name: 'MainTabs' }],
                });
            } else {
                Alert.alert('Error', response?.message || 'OTP verification failed');
            }
        } catch (error) {
            console.log('Verify OTP Error:', error);
            Alert.alert('Error', error || 'Failed to verify OTP');
        } finally {
            setLoading(false)
        }
    };

    const handleContinueReset = async () => {
        const enteredOtp = otp.join('');
        if (enteredOtp.length < 5) {
            Alert.alert('Error', 'Please enter complete OTP');
            return;
        }

        try {
            setLoading(true)
            const response = await verifyForgotPwdOtp(phone, enteredOtp);
            // console.log('Verify OTP Response:', response);

            if (response?.success && response?.data) {
                // const { accessToken, refreshToken } = response.data;
                // await setResetToken(response?.data?.resetToken);

                navigation.reset({
                    index: 0,
                    routes: [{
                        name: 'ChangePwdScreen',
                        params: { resetToken: response?.data?.resetToken, phone }
                    }],
                });
            } else {
                Alert.alert('Error', response?.message || 'OTP verification failed');
            }
        } catch (error) {
            console.log('Verify OTP Error:', error);
            Alert.alert('Error', error || 'Failed to verify OTP');
        } finally {
            setLoading(false)
        }
    };

    const handleResendOtp = async () => {
        try {
            setLoading(true)
            if (type === 'login') {
                await resendLoginOtp(phone);
            }
            if (type === 'reset') {
                await resendForgotPwdOtp(phone);
            }
            Alert.alert('Success', 'OTP resent successfully');
            setOtp(['', '', '', '', '']); // clear inputs
            inputRefs[0].current?.focus();
            setTimer(60);
            setIsResendDisabled(true);
        } catch (error) {
            console.log('Resend OTP Error:', error);
            Alert.alert('Error', error?.message || 'Failed to resend OTP');
        } finally {
            setLoading(false)
        }
    };


    return (
        <SafeAreaView style={styles.mainContainer}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                    <ImageBackground
                        style={styles.backgroundImage}
                        source={require('../assets/images/login_background_image.jpg')}
                    >
                        <Image style={styles.kapraLogo} source={require('../assets/images/kapra_logo.png')} />
                        <Image style={styles.tagLine} source={require('../assets/images/login_content.png')} />
                    </ImageBackground>

                    <View style={styles.bottomContainer}>
                        <Text style={styles.headerText}>Login or Sign up</Text>

                        <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')} style={styles.phoneNoEditContainer}>
                            <Text style={styles.phoneNoText}>{phone}</Text>
                            <Image
                                style={
                                    Platform.OS === 'android'
                                        ? [styles.editIconImage, { bottom: hp('0.2%') }]
                                        : styles.editIconImage
                                }
                                tintColor={'#000000'}
                                source={require('../assets/images/edit_icon.png')}
                            />
                        </TouchableOpacity>

                        <Text style={styles.enterNumberText}>Enter OTP</Text>

                        <View style={styles.otpContainer}>
                            {otp.map((digit, index) => (
                                <View style={styles.numberBox} key={index}>
                                    <TextInput
                                        ref={inputRefs[index]}
                                        style={styles.otpInput}
                                        keyboardType="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChangeText={(text) => handleChange(text, index)}
                                        onKeyPress={(e) => handleKeyPress(e, index)}
                                    />
                                </View>
                            ))}
                        </View>

                        <View style={styles.pwdResendTimeContainer}>
                            <TouchableOpacity style={type === 'reset' ? {
                                height: 0
                            } : undefined} onPress={() => navigation.navigate('LoginPwdScreen', {
                                phone
                            })}>
                                <Text style={styles.usePwdText}>Use password</Text>
                            </TouchableOpacity>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                {isResendDisabled ? (
                                    <>
                                        <Text style={[styles.usePwdText, { color: '#616161' }]}>Resend OTP in </Text>
                                        <Text style={styles.time}>
                                            {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
                                        </Text>
                                    </>
                                ) : (
                                    <TouchableOpacity onPress={handleResendOtp}>
                                        <Text style={[styles.usePwdText, { color: '#F25000' }]}>Resend OTP</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>

                        <TouchableOpacity style={styles.continueButton} onPress={type === 'login' ?
                            handleContinueLogin :
                            handleContinueReset
                        }>
                            {loading ? (
                                <ActivityIndicator size={'large'} color={"#FFFFFF"} />
                            ) : (
                                <Text style={styles.continueButtonText}>Continue</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default OtpScreen;

const styles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: '#FFFFFF' },
    backgroundImage: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: hp('6%'),
        paddingBottom: hp('7.5%'),
    },
    kapraLogo: { width: wp('47%'), height: hp('10%'), resizeMode: 'cover' },
    tagLine: { width: wp('50.7%'), height: hp('16.95%'), resizeMode: 'cover' },
    bottomContainer: {
        height: hp('32.33%'),
        paddingHorizontal: wp('5.8%'),
        paddingTop: hp('3.5%'),
        borderTopLeftRadius: wp('9.3%'),
        borderTopRightRadius: wp('9.3%'),
        backgroundColor: '#FFFFFF',
        bottom: hp('4%'),
    },
    headerText: {
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('4.65%'),
        color: '#000000',
        alignSelf: 'center',
    },
    phoneNoEditContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: hp('1%'),
        alignSelf: 'center',
        marginBottom: hp('3%'),
    },
    phoneNoText: { fontFamily: FONTS.poppins.regular, fontSize: wp('3.72%'), color: '#000000' },
    editIconImage: { width: wp('2.79%'), height: wp('2.79%'), marginLeft: wp('2%') },
    enterNumberText: {
        fontFamily: FONTS.poppins.regular,
        fontSize: wp('3.72%'),
        color: '#616161',
        marginBottom: hp('0.5%'),
        alignSelf: 'center',
    },
    otpContainer: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: wp('5%') },
    numberBox: {
        width: wp('13.95%'),
        height: hp('5.36%'),
        backgroundColor: '#DADADA',
        borderRadius: wp('2.33%'),
        justifyContent: 'center',
        alignItems: 'center',
    },
    otpInput: { fontSize: wp('4.5%'), textAlign: 'center', width: '100%' },
    pwdResendTimeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: hp('0.8%'),
        paddingHorizontal: wp('5%'),
    },
    usePwdText: { fontFamily: FONTS.poppins.regular, fontSize: wp('3.25%'), color: '#F25000' },
    time: { fontFamily: FONTS.poppins.medium, fontSize: wp('3.25%'), color: '#616161' },
    continueButton: {
        backgroundColor: '#F25000',
        width: '100%',
        height: hp('6.11%'),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: wp('2.33%'),
        marginTop: hp('4%'),
    },
    continueButtonText: { fontFamily: FONTS.poppins.bold, fontSize: wp('4.18%'), color: '#FFFFFF' },
});
