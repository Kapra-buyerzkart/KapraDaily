import { View, Text, StyleSheet, ImageBackground, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { FONTS } from '../styles/typography'
import { resetPassword } from '../api'; // adjust path as needed
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { getResetToken } from '../api/tokenService'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useCart } from '../context/CartContext'

const ChangePwdScreen = () => {
    const navigation = useNavigation()
    const route = useRoute()
    const { showStatus } = useCart()
    const { resetToken, phone } = route.params || {}
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChangePassword = async () => {
        if (!newPassword || !confirmPassword) {
            showStatus({
                type: 'error',
                title: 'Error',
                message: 'Please fill in both fields'
            });
            return;
        }

        if (newPassword !== confirmPassword) {
            showStatus({
                type: 'error',
                title: 'Error',
                message: 'Passwords do not match'
            });
            return;
        }

        try {
            setLoading(true);
            // const resetToken = await getResetToken();
            if (!resetToken) {
                showStatus({
                    type: 'error',
                    title: 'Error',
                    message: 'Reset token not found. Please restart the process.'
                });
                return;
            }

            const response = await resetPassword(resetToken, newPassword);
            if (response?.success) {
                showStatus({
                    type: 'success',
                    title: 'Success',
                    message: 'Password changed successfully',
                    onClose: () => navigation.navigate('LoginPwdScreen', { phone })
                });
            } else {
                showStatus({
                    type: 'error',
                    title: 'Error',
                    message: response?.message || 'Something went wrong'
                });
            }
        } catch (error) {
            showStatus({
                type: 'error',
                title: 'Error',
                message: 'Failed to reset password'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.mainContainer}>
            {/* {console.log('PHHHHH', phone)} */}
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
                    {/* <View style={styles.bottomContainer}>
                        <Text style={styles.headerText}>Login or Sign up</Text>
                        <Text style={styles.enterNumberText}>Enter your mobile number</Text>

                        <View style={styles.inputWrapper}>
                            <Text style={styles.countryCode}>+91</Text>

                            <View style={styles.divider} />

                            <TextInput
                                placeholder="000 000 0000"
                                placeholderTextColor="#616161"
                                keyboardType="number-pad"
                                style={styles.input}
                            />
                        </View>
                        <TouchableOpacity style={styles.continueButton}>
                            <Text style={styles.continueButtonText}>Continue</Text>
                        </TouchableOpacity>
                    </View> */}
                    <View style={styles.bottomContainer}>
                        <Text style={styles.headerText}>Change Password</Text>

                        <Text style={styles.enterNumberText}>Create new password</Text>
                        <View style={styles.inputContainer}>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    placeholder="Enter password"
                                    placeholderTextColor="#DADADA"
                                    style={styles.input}
                                    secureTextEntry={!showNewPassword}
                                    value={newPassword}
                                    onChangeText={setNewPassword}
                                />
                                <TouchableOpacity hitSlop={{
                                    top: 10,
                                    bottom: 10,
                                    left: 10,
                                    right: 10
                                }} onPress={() => setShowNewPassword(!showNewPassword)}>
                                    <Image tintColor={showNewPassword ? '#F25000' : undefined} style={styles.eyeIcon} source={require('../assets/images/eye_icon.png')} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <Text style={styles.enterNumberText}>Confirm password</Text>
                        <View style={styles.inputContainer}>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    placeholder="Enter password"
                                    placeholderTextColor="#DADADA"
                                    style={styles.input}
                                    secureTextEntry={!showConfirmPassword}
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                />
                                <TouchableOpacity hitSlop={{
                                    top: 10,
                                    bottom: 10,
                                    left: 10,
                                    right: 10
                                }} onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                                    <Image tintColor={showConfirmPassword ? '#F25000' : undefined} style={styles.eyeIcon} source={require('../assets/images/eye_icon.png')} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.continueButton} onPress={handleChangePassword} disabled={loading}>
                            {loading ? (
                                <ActivityIndicator size={'large'} color={'#FFFFFF'} />
                            ) : (
                                <Text style={styles.continueButtonText}>Continue</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default ChangePwdScreen

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
        marginBottom: hp('1.4%')
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
        height: hp('36%'),
        paddingHorizontal: wp('5.8%'),
        paddingTop: hp('2.5%'),
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
        marginBottom: hp('2.5%')
    },
    enterNumberText: {
        fontFamily: FONTS.poppins.regular,
        fontSize: wp('3.72%'),
        color: '#616161',
    },
    continueButton: {
        backgroundColor: '#F25000',
        width: '100%',
        height: hp('6.11%'),
        justifyContent: "center",
        alignItems: 'center',
        borderRadius: wp('2.33%'),
        marginTop: hp('4%')
    },
    continueButtonText: {
        fontFamily: FONTS.poppins.bold,
        fontSize: wp('4.18%'),
        color: '#FFFFFF'
    },
    inputContainer: {
        marginTop: hp('0.3%')
    },
    eyeIcon: {
        width: wp('4.19%'),
        height: hp('1.29%'),
        resizeMode: 'contain'
    },
    forgotPwdText: {
        alignSelf: "flex-end",
        marginTop: hp('0.5%'),
        color: '#F25000',
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('3.25%')
    }
})