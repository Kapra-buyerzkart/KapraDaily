import React from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, Modal, TextInput, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { FONTS } from '../styles/typography';

const CouponModal = ({
    visible,
    onClose,
    isGiftCard,
    couponCode,
    setCouponCode,
    onApply,
    availableCoupons,
    availableGiftCards,
    onCouponClick,
}) => (
    <Modal visible={visible} animationType="slide" transparent>
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.modalOverlay}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalHeaderView}>
                    <Text style={styles.modalHeaderText}>
                        {isGiftCard ? "Apply Gift Card" : "Apply Coupon"}
                    </Text>
                    <TouchableOpacity onPress={onClose}>
                        <Image style={styles.closeIcon} source={require('../assets/images/close_two.png')} />
                    </TouchableOpacity>
                </View>

                {/* Input */}
                <View style={styles.couponInputContainer}>
                    <TextInput
                        style={styles.couponInput}
                        placeholder={isGiftCard ? "Enter Gift Card Code" : "Enter Coupon Code"}
                        value={couponCode}
                        onChangeText={setCouponCode}
                        autoCapitalize="characters"
                    />
                    <TouchableOpacity style={styles.applyCouponButton} onPress={onApply}>
                        <Text style={styles.applyCouponButtonText}>APPLY</Text>
                    </TouchableOpacity>
                </View>

                {/* List */}
                <Text style={styles.sectionTitle}>
                    {isGiftCard ? "Available Gift Cards" : "Available Coupons"}
                </Text>
                <FlatList
                    data={isGiftCard ? availableGiftCards : availableCoupons}
                    keyExtractor={(item, index) => item.id?.toString() || item.code || index.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.couponCard} onPress={() => onCouponClick(item.code)}>
                            <View style={styles.couponCodeContainer}>
                                <Text style={styles.couponCodeText}>{item.code}</Text>
                            </View>
                            <Text style={styles.couponDescription}>{item.description}</Text>
                            <Text style={styles.applyText}>TAP TO APPLY</Text>
                        </TouchableOpacity>
                    )}
                    contentContainerStyle={{ paddingBottom: hp('2%') }}
                />
            </View>
        </KeyboardAvoidingView>
    </Modal>
);

export default React.memo(CouponModal);

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end'
    },
    modalContainer: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: wp('4.65%'),
        paddingVertical: hp('2%'),
        maxHeight: hp('80%')
    },
    modalHeaderView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: hp('2%')
    },
    modalHeaderText: {
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('4.5%'),
        color: '#000000'
    },
    closeIcon: {
        width: wp('6%'),
        height: wp('6%'),
        resizeMode: 'contain'
    },
    sectionTitle: {
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('3.5%'),
        color: '#000000'
    },
    couponInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp('3%'),
        marginBottom: hp('2%')
    },
    couponInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#E8E8E8',
        borderRadius: 8,
        paddingHorizontal: wp('4%'),
        paddingVertical: hp('1.5%'),
        fontFamily: FONTS.outfit.regular,
        color: '#000000'
    },
    applyCouponButton: {
        backgroundColor: '#F25000',
        paddingHorizontal: wp('6%'),
        paddingVertical: hp('1.5%'),
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    applyCouponButtonText: {
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('3.5%'),
        color: '#FFFFFF'
    },
    couponCard: {
        borderWidth: 1,
        borderColor: '#E8E8E8',
        borderRadius: 12,
        padding: wp('4%'),
        marginBottom: hp('1.5%'),
        backgroundColor: '#F9F9F9'
    },
    couponCodeContainer: {
        backgroundColor: '#FFF5F0',
        alignSelf: 'flex-start',
        borderWidth: 1,
        borderColor: '#F25000',
        borderRadius: 4,
        paddingHorizontal: wp('2%'),
        paddingVertical: hp('0.5%'),
        marginBottom: hp('1%'),
        borderStyle: 'dashed'
    },
    couponCodeText: {
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('3.5%'),
        color: '#F25000'
    },
    couponDescription: {
        fontFamily: FONTS.outfit.regular,
        fontSize: wp('3.5%'),
        color: '#777777',
        marginBottom: hp('1%')
    },
    applyText: {
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('3.5%'),
        color: '#F25000',
        alignSelf: 'flex-end'
    },
});
