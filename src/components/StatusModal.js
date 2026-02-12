import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { FONTS } from '../styles/typography';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const StatusModal = ({ visible, onClose, type = 'success', title, message }) => {
    const isSuccess = type === 'success';
    const iconName = isSuccess ? 'check-circle' : 'error';
    const iconColor = isSuccess ? '#0CA201' : '#FF0000';
    const buttonColor = isSuccess ? '#0CA201' : '#FF0000';

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
                        <MaterialIcons name={iconName} size={wp('12%')} color={iconColor} />
                    </View>

                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: buttonColor }]}
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
        color: '#616161',
        textAlign: 'center',
        marginBottom: hp('3%'),
        lineHeight: wp('5%'),
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
    },
    buttonText: {
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('3.7%'),
        color: '#FFFFFF',
    },
});

export default StatusModal;
