import React from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { colors } from '../theme/colours';
import { Fonts } from '../theme/fonts';
import { AppIcons } from '../assets/icons';

interface AddressConfirmationModalProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: () => void;
    data: {
        pincode: string;
        areaName: string;
        isServiceable: boolean;
        unavailableMessage?: string;
        isPlacingOrder?: boolean;
    } | null;
}

const AddressConfirmationModal: React.FC<AddressConfirmationModalProps> = ({
    visible,
    onClose,
    onConfirm,
    data
}) => {
    if (!data) return null;

    const { pincode, areaName, isServiceable, unavailableMessage } = data;

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.content}>
                    <View style={[styles.iconContainer, !isServiceable && styles.iconContainerError]}>
                        {isServiceable ? (
                            <AppIcons.Check color={colors.white} size={32} />
                        ) : (
                            <AppIcons.Close color={colors.white} size={32} />
                        )}
                    </View>

                    <Text style={styles.title}>
                        {isServiceable ? 'Confirm Address' : 'Service Unavailable'}
                    </Text>

                    <View style={styles.addressBox}>
                        <View style={styles.addressRow}>
                            <Text style={styles.label}>Pincode:</Text>
                            <Text style={styles.value}>{pincode}</Text>
                        </View>
                        <View style={styles.addressRow}>
                            <Text style={styles.label}>Area:</Text>
                            <Text style={styles.value} numberOfLines={1}>{areaName}</Text>
                        </View>
                    </View>

                    {isServiceable ? (
                        <Text style={styles.message}>
                            Is this the correct delivery address for your order?
                        </Text>
                    ) : (
                        <Text style={[styles.message, styles.messageError]}>
                            {unavailableMessage || "Delivery currently not available in this area."}
                        </Text>
                    )}

                    <View style={styles.buttonContainer}>
                        {isServiceable ? (
                            <>
                                <TouchableOpacity
                                    style={[styles.button, styles.confirmButton]}
                                    onPress={onConfirm}
                                >
                                    <Text style={styles.confirmButtonText}>Confirm & Place Order</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.button, styles.cancelButton]}
                                    onPress={onClose}
                                >
                                    <Text style={styles.cancelButtonText}>Change Address</Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <TouchableOpacity
                                style={[styles.button, styles.confirmButton]}
                                onPress={onClose}
                            >
                                <Text style={styles.confirmButtonText}>Change Address</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    content: {
        backgroundColor: colors.white,
        borderRadius: 30,
        width: '100%',
        padding: 30,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    iconContainer: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: colors.themeTeal,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    iconContainerError: {
        backgroundColor: '#FF4242',
    },
    title: {
        fontSize: 22,
        fontFamily: Fonts.gilroyBold,
        color: colors.black,
        marginBottom: 16,
    },
    addressBox: {
        backgroundColor: '#F9F9F9',
        borderRadius: 16,
        padding: 16,
        width: '100%',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#EEE',
    },
    addressRow: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    label: {
        width: 80,
        fontSize: 14,
        fontFamily: Fonts.gilroyMedium,
        color: '#999',
    },
    value: {
        flex: 1,
        fontSize: 14,
        fontFamily: Fonts.gilroyBold,
        color: colors.black,
    },
    message: {
        fontSize: 16,
        fontFamily: Fonts.gilroyMedium,
        color: '#666',
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 22,
    },
    messageError: {
        color: '#FF4242',
    },
    buttonContainer: {
        width: '100%',
        gap: 12,
    },
    button: {
        height: 54,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    confirmButton: {
        backgroundColor: colors.themeTeal,
        shadowColor: colors.themeTeal,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    confirmButtonText: {
        color: colors.white,
        fontSize: 16,
        fontFamily: Fonts.gilroyBold,
    },
    cancelButton: {
        backgroundColor: '#F0F0F0',
    },
    cancelButtonText: {
        color: '#666',
        fontSize: 16,
        fontFamily: Fonts.gilroyBold,
    },
});
export default AddressConfirmationModal;
