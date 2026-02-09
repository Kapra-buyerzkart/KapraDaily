import { View, Text, StyleSheet, ImageBackground, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView, Alert } from 'react-native'
import React, { useState, useContext, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { FONTS } from '../styles/typography'
import { useNavigation } from '@react-navigation/native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { AppContext } from '../context/appContext'
import { LoaderContext } from '../context/loaderContext'
import { updateProfilePatchApi } from '../api/userService'

const EditProfileScreen = () => {
    const navigation = useNavigation()
    const { profile, loadProfile } = useContext(AppContext)
    const { showLoader } = useContext(LoaderContext)

    const [fullName, setFullName] = useState(profile?.custName || '')
    const [dob, setDob] = useState(profile?.dob || '')
    const [gender, setGender] = useState(profile?.gender || '')

    // Phone and Email are handled separately via OTP flow now
    const email = profile?.emailId || ''
    const phone = profile?.phoneNo || ''

    const handleSave = async () => {
        if (!fullName.trim()) {
            Alert.alert('Error', 'Full Name is required')
            return
        }

        try {
            showLoader(true)
            const payload = {
                fullName: fullName.trim(),
                dob: dob.trim(),
                gender: gender
            }
            const response = await updateProfilePatchApi(payload)
            if (response?.success) {
                await loadProfile() // Refresh global profile state
                Alert.alert('Success', 'Profile updated successfully', [
                    { text: 'OK', onPress: () => navigation.goBack() }
                ])
            } else {
                Alert.alert('Error', response?.message || 'Failed to update profile')
            }
        } catch (error) {
            console.error('Update Profile Error:', error)
            Alert.alert('Error', 'An unexpected error occurred')
        } finally {
            showLoader(false)
        }
    }

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
                            <Text style={styles.headerTitle}>Edit Profile</Text>
                            <View style={{ width: wp('6%') }} />
                        </View>
                        <Image style={styles.kapraLogo} source={require('../assets/images/kapra_logo.png')} />
                    </ImageBackground>

                    <View style={styles.formContainer}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Full Name</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    placeholder="Enter your name"
                                    placeholderTextColor="#DADADA"
                                    style={styles.input}
                                    value={fullName}
                                    onChangeText={setFullName}
                                />
                            </View>
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Date of Birth (YYYY-MM-DD)</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    placeholder="YYYY-MM-DD"
                                    placeholderTextColor="#DADADA"
                                    style={styles.input}
                                    value={dob}
                                    onChangeText={setDob}
                                />
                            </View>
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Gender</Text>
                            <View style={styles.genderContainer}>
                                {['Male', 'Female', 'Other'].map((item) => (
                                    <TouchableOpacity
                                        key={item}
                                        onPress={() => setGender(item)}
                                        style={[
                                            styles.genderButton,
                                            gender === item && styles.genderButtonActive
                                        ]}
                                    >
                                        <Text style={[
                                            styles.genderButtonText,
                                            gender === item && styles.genderButtonTextActive
                                        ]}>{item}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        <View style={[styles.inputContainer, { opacity: 0.6 }]}>
                            <Text style={styles.label}>Email ID (Update from Security)</Text>
                            <View style={[styles.inputWrapper, { backgroundColor: '#F9F9F9' }]}>
                                <TextInput
                                    style={styles.input}
                                    value={email}
                                    editable={false}
                                />
                            </View>
                        </View>

                        <View style={[styles.inputContainer, { opacity: 0.6 }]}>
                            <Text style={styles.label}>Phone Number (Update from Security)</Text>
                            <View style={[styles.inputWrapper, { backgroundColor: '#F9F9F9' }]}>
                                <TextInput
                                    style={styles.input}
                                    value={phone}
                                    editable={false}
                                />
                            </View>
                        </View>

                        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                            <Text style={styles.saveButtonText}>Save Changes</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default EditProfileScreen

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
    input: {
        flex: 1,
        color: '#000',
        fontSize: wp('4%'),
        fontFamily: FONTS.poppins.regular
    },
    saveButton: {
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
    saveButtonText: {
        fontFamily: FONTS.poppins.bold,
        fontSize: wp('4.5%'),
        color: '#FFFFFF'
    },
    genderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: hp('0.5%'),
    },
    genderButton: {
        flex: 1,
        height: hp('5%'),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: wp('2.5%'),
        borderWidth: 1,
        borderColor: '#E5E5E5',
        marginHorizontal: wp('1%'),
    },
    genderButtonActive: {
        backgroundColor: '#F25000',
        borderColor: '#F25000',
    },
    genderButtonText: {
        fontFamily: FONTS.poppins.regular,
        fontSize: wp('3.8%'),
        color: '#616161',
    },
    genderButtonTextActive: {
        color: '#FFFFFF',
        fontFamily: FONTS.poppins.medium,
    },
})
