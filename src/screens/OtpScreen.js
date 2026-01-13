import { View, Text, StyleSheet, ImageBackground, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { FONTS } from '../styles/typography'
import { useNavigation } from '@react-navigation/native'

const OtpScreen = () => {

    const navigation = useNavigation()

    return (
        <SafeAreaView style={styles.mainContainer}>
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
                    <View style={styles.bottomContainer}>
                        <Text style={styles.headerText}>Login or Sign up</Text>
                        <View style={styles.phoneNoEditContainer}>
                            <Text style={styles.phoneNoText}>9988776655</Text>
                            <Image style={Platform.OS === 'android' ? [styles.editIconImage, {
                                bottom: hp('0.2%')
                            }] : styles.editIconImage} tintColor={'#000000'} source={require('../assets/images/edit_icon.png')} />
                        </View>
                        <Text style={styles.enterNumberText}>Enter OTP</Text>

                        <View style={styles.otpContainer}>
                            <View style={styles.numberBox} >
                                <TextInput keyboardType='numeric' />
                            </View>
                            <View style={styles.numberBox} >
                                <TextInput keyboardType='numeric' />
                            </View>
                            <View style={styles.numberBox} >
                                <TextInput keyboardType='numeric' />
                            </View>
                            <View style={styles.numberBox} >
                                <TextInput keyboardType='numeric' />
                            </View>
                            <View style={styles.numberBox} >
                                <TextInput keyboardType='numeric' />
                            </View>
                        </View>

                        <View style={styles.pwdResendTimeContainer}>
                            <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
                                <Text style={styles.usePwdText}>Use password</Text>
                            </TouchableOpacity>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center'
                            }}>
                                <Text style={[styles.usePwdText, {
                                    color: '#616161'
                                }]}>Resend OTP in </Text>
                                <Text style={styles.time}>1:20</Text>
                            </View>
                        </View>

                        <TouchableOpacity style={styles.continueButton}>
                            <Text style={styles.continueButtonText}>Continue</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default OtpScreen

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
        height: hp('32.33%'),
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
        // marginBottom: hp('3.5%')
    },
    enterNumberText: {
        fontFamily: FONTS.poppins.regular,
        fontSize: wp('3.72%'),
        color: '#616161',
        marginBottom: hp('0.5%'),
        alignSelf: 'center'
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
    numberBox: {
        width: wp('13.95%'),
        height: hp('5.36%'),
        backgroundColor: '#DADADA',
        borderRadius: wp('2.33%'),
        justifyContent: 'center',
        alignItems: 'center'
    },
    phoneNoEditContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: hp('1%'),
        alignSelf: 'center',
        marginBottom: hp('3%')
    },
    phoneNoText: {
        fontFamily: FONTS.poppins.regular,
        fontSize: wp('3.72%'),
        color: '#000000'
    },
    editIconImage: {
        width: wp('2.79%'),
        height: wp('2.79%'),
        marginLeft: wp('2%')
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: wp('5%')
    },
    pwdResendTimeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: hp('0.8%'),
        paddingHorizontal: wp('5%')
    },
    usePwdText: {
        fontFamily: FONTS.poppins.regular,
        fontSize: wp('3.25%'),
        color: '#F25000',
    },
    time: {
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('3.25%'),
        color: '#616161'
    }
})