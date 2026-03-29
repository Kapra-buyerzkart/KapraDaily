import React from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Image, Dimensions } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const HomePopupModal = ({ visible, onClose, imageUrl }) => {
    if (!imageUrl) return null;

    return (
        <Modal
            transparent={true}
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Ionicons name="close-circle" size={wp('8%')} color="#FFFFFF" />
                    </TouchableOpacity>
                    <View style={styles.imageContainer}>
                        <Image
                            source={typeof imageUrl === 'string' ? { uri: imageUrl } : imageUrl}
                            style={styles.popupImage}
                            resizeMode="contain"
                        />
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
        maxHeight: hp('80%'),
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: -hp('5%'),
        right: 0,
        zIndex: 10,
    },
    imageContainer: {
        width: '100%',
        backgroundColor: 'transparent',
        borderRadius: wp('4%'),
        overflow: 'hidden',
    },
    popupImage: {
        width: '100%',
        aspectRatio: 1, // Default aspect ratio, Image usually handles this if resizeMode is contain
        borderRadius: wp('4%'),
    },
});

export default HomePopupModal;
