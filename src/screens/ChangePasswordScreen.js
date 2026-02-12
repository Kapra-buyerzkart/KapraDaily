import { View, Text, StyleSheet, ImageBackground, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView, Alert } from 'react-native'
import React, { useState, useContext } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { FONTS } from '../styles/typography'
import { useNavigation } from '@react-navigation/native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { LoaderContext } from '../context/loaderContext'
import { changePasswordApi } from '../api/userService'
import StatusModal from '../components/StatusModal'

const ChangePasswordScreen = () => {
    const navigation = useNavigation()
    const { showLoader } = useContext(LoaderContext)

    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showOld, setShowOld] = useState(false)
    const [showNew, setShowNew] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    // Modal state
    const [statusModalVisible, setStatusModalVisible] = useState(false)
    const [statusType, setStatusType] = useState('success')
    const [statusTitle, setStatusTitle] = useState('')
    const [statusMessage, setStatusMessage] = useState('')
    const [onModalClose, setOnModalClose] = useState(null)

    const handleUpdate = async () => {
        if (!oldPassword || !newPassword || !confirmPassword) {
            setStatusType('error')
            setStatusTitle('Error')
            setStatusMessage('Please fill in all fields')
            setStatusModalVisible(true)
            return
        }

        if (newPassword !== confirmPassword) {
            setStatusType('error')
            setStatusTitle('Error')
            setStatusMessage('New passwords do not match')
            setStatusModalVisible(true)
            return
        }

        try {
            showLoader(true)
            const payload = {
                oldPassword,
                newPassword,
                confirmPassword
            }
            const response = await changePasswordApi(payload)
            if (response?.success) {
                setStatusType('success')
                setStatusTitle('Success')
                setStatusMessage('Password updated successfully')
                setOnModalClose(() => () => navigation.goBack())
                setStatusModalVisible(true)
            } else {
                setStatusType('error')
                setStatusTitle('Error')
                setStatusMessage(response?.message || 'Failed to update password')
                setStatusModalVisible(true)
            }
        } catch (error) {
            console.error('Change Password Error:', error)
            setStatusType('error')
            setStatusTitle('Error')
            setStatusMessage('An unexpected error occurred')
            setStatusModalVisible(true)
        } finally {
            showLoader(false)
        }
    }

    const handleModalClose = () => {
        setStatusModalVisible(false)
        if (onModalClose) {
            onModalClose()
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
                            <Text style={styles.headerTitle}>Change Password</Text>
                            <View style={{ width: wp('6%') }} />
                        </View>
                        <Image style={styles.kapraLogo} source={require('../assets/images/kapra_logo.png')} />
                    </ImageBackground>

                    <View style={styles.formContainer}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Old Password</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    placeholder="Enter old password"
                                    placeholderTextColor="#DADADA"
                                    style={styles.input}
                                    secureTextEntry={!showOld}
                                    value={oldPassword}
                                    onChangeText={setOldPassword}
                                />
                                <TouchableOpacity onPress={() => setShowOld(!showOld)}>
                                    <AntDesign name={showOld ? "eye" : "eyeo"} size={wp('5%')} color="#DADADA" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>New Password</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    placeholder="Enter new password"
                                    placeholderTextColor="#DADADA"
                                    style={styles.input}
                                    secureTextEntry={!showNew}
                                    value={newPassword}
                                    onChangeText={setNewPassword}
                                />
                                <TouchableOpacity onPress={() => setShowNew(!showNew)}>
                                    <AntDesign name={showNew ? "eye" : "eyeo"} size={wp('5%')} color="#DADADA" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Confirm New Password</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    placeholder="Confirm new password"
                                    placeholderTextColor="#DADADA"
                                    style={styles.input}
                                    secureTextEntry={!showConfirm}
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                />
                                <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                                    <AntDesign name={showConfirm ? "eye" : "eyeo"} size={wp('5%')} color="#DADADA" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <TouchableOpacity onPress={handleUpdate} style={styles.updateButton}>
                            <Text style={styles.updateButtonText}>Update Password</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
            <StatusModal
                visible={statusModalVisible}
                onClose={handleModalClose}
                type={statusType}
                title={statusTitle}
                message={statusMessage}
            />
        </SafeAreaView>
    )
}

export default ChangePasswordScreen

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
    updateButton: {
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
    updateButtonText: {
        fontFamily: FONTS.poppins.bold,
        fontSize: wp('4.5%'),
        color: '#FFFFFF'
    }
})
