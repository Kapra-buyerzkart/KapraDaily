import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { FONTS } from '../styles/typography';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

const AddressConfirmationModal = ({ visible, onClose, pincode, areaName, onConfirm, isServiceable = true, unavailableMessage, isPlacingOrder = false, onChangeAddress }) => {
    return (
        <Modal
            transparent={true}
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <View style={[styles.iconContainer, !isServiceable && styles.iconContainerWarning]}>
                        <Ionicons
                            name={isServiceable ? "location" : "warning"}
                            size={wp('8%')}
                            color={isServiceable ? "#F25000" : "#FF0000"}
                        />
                    </View>

                    <Text style={styles.title}>{isServiceable ? "Delivery Confirmation" : "Delivery Unavailable"}</Text>

                    {isServiceable ? (
                        <Text style={styles.message}>
                            <Text style={styles.messageRegular}>Your order will be delivered to pincode </Text>
                            <Text style={styles.messageHighlight}>{pincode} {areaName}</Text>
                        </Text>
                    ) : (
                        <Text style={styles.message}>
                            <Text style={styles.messageRegular}>{unavailableMessage || "We currently do not serve this area: "}</Text>
                            {/* <Text style={styles.messageHighlight}>{pincode} {areaName}</Text> */}
                        </Text>
                    )}

                    {isServiceable && (
                        <Text style={styles.warningMessage}>
                            {isPlacingOrder ? "Clicking Confirm will finalize your order." : "Note: your cart might have been updated due to address change"}
                        </Text>
                    )}

                    <View style={styles.buttonContainer}>
                        {isServiceable ? (
                            <TouchableOpacity
                                style={{ width: '100%' }}
                                activeOpacity={0.8}
                                onPress={() => {
                                    if (onConfirm) {
                                        onConfirm();
                                    } else {
                                        onClose();
                                    }
                                }}
                            >
                                <LinearGradient
                                    colors={['#F25000', '#FF8C00']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.gradientButton}
                                >
                                    <Text
                                        style={styles.buttonText}
                                    >
                                        {isPlacingOrder ? "Confirm & Place Order" : "Confirm Delivery"}
                                    </Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                style={[styles.outlineButton, { width: '100%' }]}
                                onPress={() => {
                                    if (onChangeAddress) {
                                        onChangeAddress();
                                    } else {
                                        onClose();
                                    }
                                }}
                            >
                                <Text
                                    style={styles.outlineButtonText}
                                >
                                    Change Address
                                </Text>
                            </TouchableOpacity>
                        )}

                        {/* {!isServiceable && (
                            <TouchableOpacity
                                style={[styles.closeLabel, { marginTop: hp('1.5%') }]}
                                onPress={onClose}
                            >
                                <Text style={styles.closeLabelText}>Cancel</Text>
                            </TouchableOpacity>
                        )} */}
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: wp('90%'),
        backgroundColor: '#FFFFFF',
        borderRadius: wp('8%'),
        paddingVertical: wp('6%'),
        paddingHorizontal: wp('5%'),
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    iconContainer: {
        width: wp('16%'),
        height: wp('16%'),
        borderRadius: wp('8%'),
        backgroundColor: '#FFF5F0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: hp('2%'),
    },
    iconContainerWarning: {
        backgroundColor: '#FFF0F0',
    },
    title: {
        fontFamily: FONTS.poppins.bold,
        fontSize: wp('4.8%'),
        color: '#1A1A1A',
        marginBottom: hp('1.5%'),
        textAlign: 'center',
    },
    message: {
        textAlign: 'center',
        marginBottom: hp('2.5%'),
        lineHeight: wp('5.8%'),
        paddingHorizontal: wp('2%'),
    },
    messageRegular: {
        fontFamily: FONTS.poppins.regular,
        fontSize: wp('3.6%'),
        color: '#4A4A4A',
    },
    messageHighlight: {
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('3.8%'),
        color: '#F25000',
    },
    warningMessage: {
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('2.8%'),
        color: '#8C8C8C',
        textAlign: 'center',
        marginBottom: hp('3%'),
        backgroundColor: '#F9F9F9',
        paddingVertical: hp('1%'),
        paddingHorizontal: wp('4%'),
        borderRadius: wp('3%'),
        overflow: 'hidden',
    },
    buttonContainer: {
        width: '100%',
    },
    gradientButton: {
        width: '100%',
        height: wp('13%'),
        borderRadius: wp('4%'),
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#F25000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonText: {
        fontFamily: FONTS.poppins.bold,
        fontSize: wp('4.2%'),
        color: '#FFFFFF',
        textAlign: 'center',
    },
    outlineButton: {
        width: '100%',
        height: wp('13%'),
        borderRadius: wp('4%'),
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: '#F25000',
        backgroundColor: '#FFFFFF',
    },
    outlineButtonText: {
        fontFamily: FONTS.poppins.bold,
        fontSize: wp('4%'),
        color: '#F25000',
        textAlign: 'center',
    },
    closeLabel: {
        alignSelf: 'center',
    },
    closeLabelText: {
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('3.5%'),
        color: '#9E9E9E',
        textDecorationLine: 'underline',
    }
});

export default AddressConfirmationModal;
