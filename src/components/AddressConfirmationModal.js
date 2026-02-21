import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { FONTS } from '../styles/typography';

const AddressConfirmationModal = ({ visible, onClose, pincode, areaName }) => {
    return (
        <Modal
            transparent={true}
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.title}>Delivery Address</Text>

                    <Text style={styles.message}>
                        <Text style={styles.messageRegular}>Your order will be delivered to pincode </Text>
                        <Text style={styles.messageHighlight}>{pincode} {areaName}</Text>
                    </Text>

                    <Text style={styles.warningMessage}>
                        Note: your cart might have been updated due to address change
                    </Text>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={onClose}
                        >
                            <Text style={styles.buttonText}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: wp('85%'),
        backgroundColor: '#FFFFFF',
        borderRadius: wp('5%'),
        padding: wp('5%'),
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    title: {
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('4.5%'),
        color: '#000000',
        marginBottom: hp('1.5%'),
        textAlign: 'center',
    },
    message: {
        textAlign: 'center',
        marginBottom: hp('2%'),
        lineHeight: wp('5.5%'),
    },
    messageRegular: {
        fontFamily: FONTS.poppins.regular,
        fontSize: wp('3.5%'),
        color: '#616161',
    },
    messageHighlight: {
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('3.8%'),
        color: '#F25000',
    },
    warningMessage: {
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('3%'),
        color: '#FF0000',
        textAlign: 'center',
        marginBottom: hp('3%'),
        lineHeight: wp('4.5%'),
    },
    buttonContainer: {
        width: '100%',
    },
    button: {
        width: '100%',
        paddingVertical: hp('1.5%'),
        borderRadius: wp('2.5%'),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F25000',
    },
    buttonText: {
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('3.7%'),
        color: '#FFFFFF',
    },
});

export default AddressConfirmationModal;
