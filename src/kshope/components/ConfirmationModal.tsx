import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { colors } from '../theme/colours';
import { Fonts } from '../theme/fonts';

interface ConfirmationModalProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    iconName?: string;
    themeColor?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    visible,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    iconName,
    themeColor
}) => {
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
                        <MaterialIcons name={iconName || "warning"} size={wp('12%')} color={themeColor || colors.red} />
                    </View>

                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={onClose}
                        >
                            <Text style={styles.cancelButtonText} numberOfLines={1} adjustsFontSizeToFit>{cancelText}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, styles.confirmButton, themeColor ? { backgroundColor: themeColor } : {}]}
                            onPress={() => {
                                onClose();
                                onConfirm();
                            }}
                        >
                            <Text style={styles.confirmButtonText} numberOfLines={1} adjustsFontSizeToFit>{confirmText}</Text>
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
        backgroundColor: colors.halfTransparent,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: wp('85%'),
        backgroundColor: colors.white,
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
        marginBottom: hp('1%'),
    },
    title: {
        fontFamily: Fonts.gilroySemiBold,
        fontSize: wp('4.5%'),
        color: colors.black,
        marginBottom: hp('1%'),
        textAlign: 'center',
    },
    message: {
        fontFamily: Fonts.gilroyRegular,
        fontSize: wp('3.5%'),
        color: colors.grey,
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
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.lightGrey,
    },
    confirmButton: {
        backgroundColor: colors.red,
    },
    cancelButtonText: {
        fontFamily: Fonts.gilroyMedium,
        fontSize: wp('3.7%'),
        color: colors.grey,
    },
    confirmButtonText: {
        fontFamily: Fonts.gilroyMedium,
        fontSize: wp('3.7%'),
        color: colors.white,
    },
});

export default ConfirmationModal;
