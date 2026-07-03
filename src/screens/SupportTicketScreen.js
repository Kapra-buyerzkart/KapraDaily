import { View, Text, StyleSheet, ImageBackground, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform } from 'react-native'
import React, { useState, useContext, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { FONTS } from '../styles/typography'
import { useNavigation, useRoute } from '@react-navigation/native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { AppContext } from '../context/appContext'
import { LoaderContext } from '../context/loaderContext'
import { createSupportTicketApi } from '../api/supportService'
import StatusModal from '../components/StatusModal'

const SupportTicketScreen = () => {
    const navigation = useNavigation()
    const route = useRoute()
    const { orderId: passedOrderId, orderNumber: passedOrderNumber } = route.params || {}
    const { profile } = useContext(AppContext)
    const { showLoader } = useContext(LoaderContext)

    const [title, setTitle] = useState('')
    const [message, setMessage] = useState('')
    const [priority, setPriority] = useState('normal')
    const [orderNumber, setOrderNumber] = useState(passedOrderNumber || (passedOrderId ? passedOrderId.toString() : ''))
    const [internalOrderId, setInternalOrderId] = useState(passedOrderId || 0)

    const [statusModalVisible, setStatusModalVisible] = useState(false)
    const [statusType, setStatusType] = useState('success')
    const [statusTitle, setStatusTitle] = useState('')
    const [statusMessage, setStatusMessage] = useState('')

    const handleSubmit = async () => {
        if (!title.trim() || !message.trim()) {
            setStatusType('error')
            setStatusTitle('Missing Information')
            setStatusMessage('Please provide both a title and a message.')
            setStatusModalVisible(true)
            return
        }

        try {
            showLoader(true)
            const payload = {
                title: title.trim(),
                message: message.trim(),
                priority: priority,
                orderId: internalOrderId || (orderNumber ? parseInt(orderNumber) : 0)
            }
            const response = await createSupportTicketApi(payload)
            if (response?.success) {
                setStatusType('success')
                setStatusTitle('Ticket Created')
                setStatusMessage('Your support ticket has been created successfully. Our team will get back to you soon.')
                setStatusModalVisible(true)
                // Reset form
                setTitle('')
                setMessage('')
                setPriority('normal')
                if (!passedOrderId && !passedOrderNumber) {
                    setOrderNumber('')
                    setInternalOrderId(0)
                }
            } else {
                setStatusType('error')
                setStatusTitle('Error')
                setStatusMessage(response?.message || 'Failed to create support ticket.')
                setStatusModalVisible(true)
            }
        } catch (error) {
            console.error('Create Ticket Error Details:', error)
            setStatusType('error')
            setStatusTitle('Error')
            const errorMessage = typeof error === 'string'
                ? error
                : (error?.Message || error?.message || error?.response?.data?.Message || error?.response?.data?.message || 'An unexpected error occurred')
            setStatusMessage(errorMessage)
            setStatusModalVisible(true)
        } finally {
            showLoader(false)
        }
    }

    const handleModalClose = () => {
        setStatusModalVisible(false)
        if (statusType === 'success') {
            navigation.goBack()
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
                            <TouchableOpacity hitSlop={40} onPress={() => navigation.goBack()}>
                                <AntDesign name="left" size={wp('5%')} color={'#FFFFFF'} />
                            </TouchableOpacity>
                            <Text style={styles.headerTitle}>Support Ticket</Text>
                            <View style={{ width: wp('5%') }} />
                        </View>
                        <Image style={styles.kapraLogo} source={require('../assets/images/kapra_logo.png')} />
                    </ImageBackground>

                    <View style={styles.formContainer}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Title</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    placeholder="Enter subject"
                                    placeholderTextColor="#DADADA"
                                    style={styles.input}
                                    value={title}
                                    onChangeText={setTitle}
                                />
                            </View>
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Order Number (Optional)</Text>
                            <View style={[styles.inputWrapper, (passedOrderId || passedOrderNumber) && { backgroundColor: '#F9F9F9' }]}>
                                <TextInput
                                    placeholder="e.g. ORD123"
                                    placeholderTextColor="#DADADA"
                                    style={styles.input}
                                    value={orderNumber}
                                    onChangeText={(val) => {
                                        setOrderNumber(val)
                                        // If user manually types, clear internal ID so it defaults to parseInt(orderNumber)
                                        setInternalOrderId(0)
                                    }}
                                    keyboardType={passedOrderId || passedOrderNumber ? "default" : "numeric"}
                                    editable={!passedOrderId && !passedOrderNumber}
                                />
                            </View>
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Priority</Text>
                            <View style={styles.priorityContainer}>
                                {['normal', 'urgent', 'high'].map((p) => (
                                    <TouchableOpacity
                                        key={p}
                                        onPress={() => setPriority(p)}
                                        style={[
                                            styles.priorityButton,
                                            priority === p && styles.priorityButtonActive,
                                            priority === p && (p === 'high' || p === 'urgent') && { backgroundColor: p === 'high' ? '#EB5757' : '#F2994A', borderColor: p === 'high' ? '#EB5757' : '#F2994A' }
                                        ]}
                                    >
                                        <Text style={[
                                            styles.priorityButtonText,
                                            priority === p && styles.priorityButtonTextActive
                                        ]}>{p.charAt(0).toUpperCase() + p.slice(1)}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Message</Text>
                            <View style={[styles.inputWrapper, { height: hp('15%'), alignItems: 'flex-start', paddingTop: hp('1%') }]}>
                                <TextInput
                                    placeholder="Describe your issue..."
                                    placeholderTextColor="#DADADA"
                                    style={[styles.input, { textAlignVertical: 'top' }]}
                                    value={message}
                                    onChangeText={setMessage}
                                    multiline
                                    numberOfLines={5}
                                />
                            </View>
                        </View>

                        <TouchableOpacity
                            onPress={handleSubmit}
                            style={styles.submitButton}
                        >
                            <Text style={styles.submitButtonText}>Submit Ticket</Text>
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

export default SupportTicketScreen

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    backgroundImage: {
        height: hp('30%'),
        alignItems: 'center',
        paddingTop: hp('2%'),
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: wp('5%'),
        marginBottom: hp('3%')
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
        marginTop: hp('1%')
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
    priorityContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    priorityButton: {
        flex: 1,
        height: hp('5%'),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: wp('2.5%'),
        borderWidth: 1,
        borderColor: '#E5E5E5',
        marginHorizontal: wp('1%'),
    },
    priorityButtonActive: {
        backgroundColor: '#F25000',
        borderColor: '#F25000',
    },
    priorityButtonText: {
        fontFamily: FONTS.poppins.regular,
        fontSize: wp('3.8%'),
        color: '#616161',
    },
    priorityButtonTextActive: {
        color: '#FFFFFF',
        fontFamily: FONTS.poppins.medium,
    },
    submitButton: {
        backgroundColor: '#F25000',
        height: hp('6.5%'),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: wp('2.5%'),
        marginTop: hp('3%'),
        marginBottom: hp('4%'),
        shadowColor: '#F25000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 6
    },
    submitButtonText: {
        fontFamily: FONTS.poppins.bold,
        fontSize: wp('4.5%'),
        color: '#FFFFFF'
    },
})
