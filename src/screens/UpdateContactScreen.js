import React, { useState, useContext, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform, Image, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FONTS } from '../styles/typography';
import { LoaderContext } from '../context/loaderContext';
import { AppContext } from '../context/appContext';
import StoreUnavailable from '../components/StoreUnavailable';
import LocationModal from '../components/LocationModal';
import { validatePhoneNumbers } from '../utils/validation';

// Placeholder for actual APIs - these should be added to userService.js securely
// Since I don't have the final endpoints, I'll use placeholders that call updateProfilePatchApi on success
import {
    requestEmailOtpApi,
    verifyEmailOtpApi,
    requestPhoneOtpApi,
    verifyPhoneOtpApi
} from '../api/userService';
import StatusModal from '../components/StatusModal';

const UpdateContactScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { type } = route.params || { type: 'phone' }; // 'phone' or 'email'
    const { showLoader } = useContext(LoaderContext);
    const { profile, loadProfile, isStoreUnavailable, storeUnavailableData } = useContext(AppContext);
    const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);

    const [value, setValue] = useState('');
    const [originalValue, setOriginalValue] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '']);
    const [step, setStep] = useState(1); // 1: Input, 2: OTP
    const [timer, setTimer] = useState(30);
    const [canResend, setCanResend] = useState(false);

    // Modal state
    const [statusModalVisible, setStatusModalVisible] = useState(false);
    const [statusType, setStatusType] = useState('success');
    const [statusTitle, setStatusTitle] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [onModalClose, setOnModalClose] = useState(null);

    const otpRefs = useRef([]);

    useEffect(() => {
        if (profile) {
            const currentVal = type === 'phone' ? profile.phoneNo : profile.emailId;
            setValue(currentVal || '');
            setOriginalValue(currentVal || '');
        }
    }, [profile, type]);

    useEffect(() => {
        let interval;
        if (step === 2 && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            setCanResend(true);
        }
        return () => clearInterval(interval);
    }, [step, timer]);

    const handleRequestOtp = async () => {
        if (!value.trim()) {
            setStatusType('error');
            setStatusTitle('Error');
            setStatusMessage(`Please enter a valid ${type === 'phone' ? 'phone number' : 'email ID'}`);
            setStatusModalVisible(true);
            return;
        }

        if (type === 'phone' && !validatePhoneNumbers(value)) {
            setStatusType('error');
            setStatusTitle('Error');
            setStatusMessage('Please enter a valid 10-digit mobile number');
            setStatusModalVisible(true);
            return;
        }

        try {
            showLoader(true);
            const payload = type === 'phone' ? { newPhone: value } : { newEmail: value };
            const response = type === 'phone'
                ? await requestPhoneOtpApi(payload)
                : await requestEmailOtpApi(payload);

            if (response?.success) {
                setStep(2);
                setTimer(30);
                setCanResend(false);
            } else {
                setStatusType('error');
                setStatusTitle('Error');
                setStatusMessage(response?.message || 'Failed to request OTP');
                setStatusModalVisible(true);
            }
        } catch (error) {
            console.error('Request OTP Error:', error);
            setStatusType('error');
            setStatusTitle('Error');
            setStatusMessage('Failed to request OTP. Please try again.');
            setStatusModalVisible(true);
        } finally {
            showLoader(false);
        }
    };

    const handleVerifyOtp = async () => {
        const otpValue = otp.join('');
        if (otpValue.length !== 5) {
            setStatusType('error');
            setStatusTitle('Error');
            setStatusMessage('Please enter the 5-digit OTP');
            setStatusModalVisible(true);
            return;
        }

        try {
            showLoader(true);
            const payload = type === 'phone'
                ? { newPhone: value, otp: otpValue }
                : { newEmail: value, otp: otpValue };

            const response = type === 'phone'
                ? await verifyPhoneOtpApi(payload)
                : await verifyEmailOtpApi(payload);

            if (response?.success) {
                await loadProfile();
                setStatusType('success');
                setStatusTitle('Success');
                setStatusMessage(`${type === 'phone' ? 'Phone Number' : 'Email ID'} updated successfully`);
                setOnModalClose(() => () => navigation.goBack());
                setStatusModalVisible(true);
            } else {
                setStatusType('error');
                setStatusTitle('Error');
                setStatusMessage(response?.message || 'Verification failed');
                setStatusModalVisible(true);
            }
        } catch (error) {
            console.error('Verify OTP Error:', error);
            setStatusType('error');
            setStatusTitle('Error');
            setStatusMessage('Invalid OTP or verification failed.');
            setStatusModalVisible(true);
        } finally {
            showLoader(false);
        }
    };

    const handleOtpChange = (text, index) => {
        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);

        if (text && index < 4) {
            otpRefs.current[index + 1].focus();
        }
    };

    const handleBackspace = (event, index) => {
        if (event.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs.current[index - 1].focus();
        }
    };

    const handleModalClose = () => {
        setStatusModalVisible(false);
        if (onModalClose) {
            onModalClose();
        }
    };

    const isDifferent = value.trim() !== originalValue.trim();
    const isInputValid = type === 'phone' ? validatePhoneNumbers(value) : value.includes('@');
    const canRequestOtp = isDifferent && isInputValid;

    return (
        <SafeAreaView style={styles.mainContainer}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                    <ImageBackground style={styles.backgroundImage} source={require('../assets/images/login_background_image.jpg')}>
                        <View style={styles.headerRow}>
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <AntDesign name={'left'} size={wp('6%')} color={'#FFFFFF'} />
                            </TouchableOpacity>
                            <Text style={styles.headerTitle}>Update {type === 'phone' ? 'Phone' : 'Email'}</Text>
                            <View style={{ width: wp('6%') }} />
                        </View>
                        <Image style={styles.kapraLogo} source={require('../assets/images/kapra_logo.png')} />
                    </ImageBackground>

                    <View style={styles.formContainer}>
                        {step === 1 ? (
                            <View>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.label}>New {type === 'phone' ? 'Phone Number' : 'Email ID'}</Text>
                                    <View style={styles.inputWrapper}>
                                        {type === 'phone' && <Text style={styles.prefix}>+91</Text>}
                                        <TextInput
                                            placeholder={type === 'phone' ? "Enter phone number" : "Enter email ID"}
                                            placeholderTextColor="#DADADA"
                                            style={styles.input}
                                            value={value}
                                            onChangeText={setValue}
                                            keyboardType={type === 'phone' ? 'phone-pad' : 'email-address'}
                                            autoCapitalize="none"
                                        />
                                    </View>
                                </View>

                                <TouchableOpacity
                                    onPress={handleRequestOtp}
                                    style={[styles.actionButton, !canRequestOtp && styles.actionButtonDisabled]}
                                    disabled={!canRequestOtp}
                                >
                                    <Text style={styles.actionButtonText}>Get OTP</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.label}>Enter OTP sent to {value}</Text>
                                    <View style={styles.otpContainer}>
                                        {otp.map((digit, index) => (
                                            <View style={styles.otpBox} key={index}>
                                                <TextInput
                                                    ref={(el) => (otpRefs.current[index] = el)}
                                                    style={styles.otpInput}
                                                    keyboardType="number-pad"
                                                    maxLength={1}
                                                    value={digit}
                                                    onChangeText={(text) => handleOtpChange(text, index)}
                                                    onKeyPress={(e) => handleBackspace(e, index)}
                                                />
                                            </View>
                                        ))}
                                    </View>
                                </View>

                                <View style={styles.resendRow}>
                                    {canResend ? (
                                        <TouchableOpacity onPress={handleRequestOtp}>
                                            <Text style={styles.resendTextActive}>Resend OTP</Text>
                                        </TouchableOpacity>
                                    ) : (
                                        <Text style={styles.resendTextDisabled}>Resend OTP in {timer}s</Text>
                                    )}
                                </View>

                                <TouchableOpacity onPress={handleVerifyOtp} style={styles.actionButton}>
                                    <Text style={styles.actionButtonText}>Verify & Update</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => setStep(1)} style={styles.changeContactLink}>
                                    <Text style={styles.changeContactLinkText}>Change {type === 'phone' ? 'Phone' : 'Email'}</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
            <LocationModal
                visible={isLocationModalVisible}
                onClose={() => setIsLocationModalVisible(false)}
            />
            <StatusModal
                visible={statusModalVisible}
                onClose={handleModalClose}
                type={statusType}
                title={statusTitle}
                message={statusMessage}
            />
        </SafeAreaView>
    );
};

export default UpdateContactScreen;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    backgroundImage: {
        height: hp('35%'),
        alignItems: 'center',
        paddingTop: hp('2%'),
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: wp('5%'),
        marginBottom: hp('4%')
    },
    headerTitle: {
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('5%'),
        color: '#FFFFFF',
    },
    kapraLogo: {
        width: wp('40%'),
        height: hp('8%'),
        resizeMode: 'contain',
        marginTop: hp('2%')
    },
    formContainer: {
        flex: 1,
        paddingHorizontal: wp('6%'),
        paddingTop: hp('4%'),
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: wp('10%'),
        borderTopRightRadius: wp('10%'),
        marginTop: -hp('5%'),
    },
    inputContainer: {
        marginBottom: hp('2%')
    },
    label: {
        fontFamily: FONTS.poppins.regular,
        fontSize: wp('3.8%'),
        color: '#616161',
        marginBottom: hp('0.5%')
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        height: hp('6%'),
        borderRadius: wp('2.5%'),
        borderWidth: 1,
        borderColor: '#E5E5E5',
        paddingHorizontal: wp('4%'),
        backgroundColor: '#fff',
    },
    prefix: {
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('4%'),
        color: '#000',
        marginRight: wp('2%'),
    },
    input: {
        flex: 1,
        color: '#000',
        fontSize: wp('4%'),
        fontFamily: FONTS.poppins.regular
    },
    actionButton: {
        backgroundColor: '#F25000',
        height: hp('6.5%'),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: wp('2.5%'),
        marginTop: hp('4%'),
        shadowColor: '#F25000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 6
    },
    actionButtonDisabled: {
        backgroundColor: '#FFCCBC',
        elevation: 0,
        shadowOpacity: 0
    },
    actionButtonText: {
        fontFamily: FONTS.poppins.bold,
        fontSize: wp('4.5%'),
        color: '#FFFFFF'
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: hp('1%')
    },
    otpBox: {
        width: wp('12%'),
        height: hp('6%'),
        backgroundColor: '#F5F5F5',
        borderRadius: wp('2.5%'),
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E5E5'
    },
    otpInput: {
        fontSize: wp('5%'),
        fontFamily: FONTS.poppins.bold,
        color: '#000',
        textAlign: 'center',
        width: '100%'
    },
    resendRow: {
        alignItems: 'center',
        marginTop: hp('2%')
    },
    resendTextActive: {
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('3.5%'),
        color: '#F25000'
    },
    resendTextDisabled: {
        fontFamily: FONTS.poppins.regular,
        fontSize: wp('3.5%'),
        color: '#616161'
    },
    changeContactLink: {
        alignItems: 'center',
        marginTop: hp('3%')
    },
    changeContactLinkText: {
        fontFamily: FONTS.poppins.regular,
        fontSize: wp('3.5%'),
        color: '#F25000',
        textDecorationLine: 'underline'
    }
})
