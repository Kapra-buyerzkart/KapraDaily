import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Dimensions } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { FONTS } from '../styles/typography';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const ConfirmationModal = ({ visible, onClose, onConfirm, title, message, confirmText = "Remove", cancelText = "Cancel" }) => {
    return (
        <Modal
            transparent={true}
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.iconContainer}>
                        <MaterialIcons name="warning" size={wp('12%')} color="#F04B1B" />
                    </View>

                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={onClose}
                        >
                            <Text style={styles.cancelButtonText}>{cancelText}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, styles.confirmButton]}
                            onPress={() => {
                                onConfirm();
                                onClose();
                            }}
                        >
                            <Text style={styles.confirmButtonText}>{confirmText}</Text>
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
    iconContainer: {
        marginBottom: hp('2%'),
    },
    title: {
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('4.5%'),
        color: '#000000',
        marginBottom: hp('1%'),
        textAlign: 'center',
    },
    message: {
        fontFamily: FONTS.poppins.regular,
        fontSize: wp('3.5%'),
        color: '#666666',
        textAlign: 'center',
        marginBottom: hp('3%'),
        lineHeight: wp('5%'),
    },
    buttonContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        gap: wp('3%'),
    },
    button: {
        flex: 1,
        paddingVertical: hp('1.5%'),
        borderRadius: wp('2.5%'),
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButton: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#DADADA',
    },
    confirmButton: {
        backgroundColor: '#F04B1B',
    },
    cancelButtonText: {
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('3.7%'),
        color: '#666666',
    },
    confirmButtonText: {
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('3.7%'),
        color: '#FFFFFF',
    },
});

export default ConfirmationModal;
