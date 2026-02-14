import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, FlatList, Platform } from 'react-native'
import React, { useContext, useState, useEffect } from 'react'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { FONTS } from '../styles/typography'
import { useNavigation } from '@react-navigation/native'
import CartProductCard from '../components/CartProductCard'
import OfferCard from '../components/OfferCard'
import LinearGradient from 'react-native-linear-gradient'
import Entypo from 'react-native-vector-icons/Entypo'
import { useCartScreen } from '../hooks/useCartScreen'
import AppButton from '../components/AppButton'
import { LoaderContext } from '../context/loaderContext'
import ConfirmationModal from '../components/ConfirmationModal'
import { getDashboardDataApi } from '../api/userService'

// ─── Extracted Components ───
import AddressModal from '../components/AddressModal'
import SlotModal from '../components/SlotModal'
import CouponModal from '../components/CouponModal'
import BillSection from '../components/BillSection'
import CartEmptyComponent from '../components/CartEmptyComponent'

const CartScreen = () => {
    const navigation = useNavigation()
    const {
        // Cart
        cartItems,
        billCalculations,
        clearCart,

        // Offers
        offers,
        showCouponModal,
        setShowCouponModal,
        couponCode,
        setCouponCode,
        isGiftCard,
        availableCoupons,
        availableGiftCards,
        onApplyOffer,
        onRejectOffer,
        handleApplyCoupon,
        handleCouponClick,

        // Delivery
        selectedDeliveryType,
        setSelectedDeliveryType,
        selectedDateIndex,
        selectedSlot,
        setSelectedSlot,
        showSlotModal,
        setShowSlotModal,
        datesList,
        slotsByDate,
        onSelectDate,

        // Addresses
        addresses,
        showAddressModal,
        setShowAddressModal,
        onSelectAddress,
        onThreeDotsClicked,
        onDeleteClicked,
        onCloseThreeDots,
    } = useCartScreen();

    const { showLoader } = useContext(LoaderContext);
    const [isClearCartModalVisible, setIsClearCartModalVisible] = useState(false);
    const [bTokens, setBTokens] = useState(0);
    const insets = useSafeAreaInsets();

    useEffect(() => {
        const fetchWalletData = async () => {
            try {
                const response = await getDashboardDataApi();
                if (response?.success && response?.data?.wallet) {
                    setBTokens(response.data.wallet.bTokens || 0);
                }
            } catch (error) {
                console.error('Error fetching wallet data in Cart:', error);
            }
        };
        fetchWalletData();
    }, []);

    return (
        <SafeAreaView
            edges={['top']}
            style={Platform.OS === 'android' ? [styles.mainContainer, { paddingBottom: insets.bottom }] : styles.mainContainer}
        >
            {/* ─── Header ─── */}
            <View style={styles.headerContainer}>
                <TouchableOpacity style={{ top: Platform.OS === 'android' && hp('-0.2%') }} onPress={() => navigation.goBack()}>
                    <AntDesign name={'left'} size={wp('5%')} color={'#777777'} />
                </TouchableOpacity>
                <Text style={styles.headerText}>Cart</Text>
                <TouchableOpacity onPress={() => setShowSlotModal(true)} style={styles.headerInnerView}>
                    <Image
                        style={Platform.OS === 'android' ? [styles.timeImage, { top: hp('-0.2%') }] : styles.timeImage}
                        source={require('../assets/images/lighting.png')}
                    />
                    <Text style={styles.timeText}>20 min</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.dashedDivider} />

            {/* ─── Address Bar ─── */}
            <TouchableOpacity onPress={() => setShowAddressModal(true)} style={styles.addressView}>
                <Text style={styles.addressText} numberOfLines={1} ellipsizeMode="tail">
                    Vennala: Chakkarapparambuabcdefg
                </Text>
                <Entypo style={Platform.OS === 'android' && { top: hp('-0.2%') }} name={"chevron-down"} size={wp('3.6%')} color={"#000000"} />
            </TouchableOpacity>

            {cartItems.length === 0 ? (
                <CartEmptyComponent />
            ) : (
                <>
                    <ScrollView>
                        {/* ─── Banner ─── */}
                        <View style={styles.bannerView}>
                            <Image style={styles.bannerStyle} source={require('../assets/images/cart-banner.png')} />
                        </View>

                        {/* ─── Clear Cart ─── */}
                        <View style={styles.clearCartContainer}>
                            <TouchableOpacity onPress={() => setIsClearCartModalVisible(true)} style={styles.clearCartButton}>
                                <Text style={styles.clearCartText}>Clear Cart</Text>
                            </TouchableOpacity>
                        </View>

                        {/* ─── Products ─── */}
                        <View style={styles.productListingContainer}>
                            <FlatList
                                data={cartItems}
                                keyExtractor={(item, index) => item.cartItemId?.toString() || item.productId?.toString() || index.toString()}
                                renderItem={({ item }) => <CartProductCard item={item} />}
                            />
                        </View>

                        {/* ─── Item Count + B-Tokens ─── */}
                        <View style={styles.itemsCountContainer}>
                            <Text style={styles.itemsCountText}>{cartItems.length} Items</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={styles.btokenContainer}>
                                    <Image style={styles.btokenImage} source={require('../assets/images/btoken-icon.png')} />
                                    <Text style={styles.btokenText}>{bTokens} B Tokens</Text>
                                </View>
                            </View>
                        </View>

                        {/* ─── Offers ─── */}
                        <View style={styles.offersContainer}>
                            <View style={styles.offersHeaderView}>
                                <Image style={styles.offersHeaderImage} source={require('../assets/images/add_offer.png')} />
                                <Text style={styles.offersHeaderText}>Add Offers</Text>
                            </View>
                            <FlatList
                                data={offers}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => (
                                    <OfferCard
                                        item={item}
                                        onApply={() => onApplyOffer(item.id)}
                                        onReject={() => onRejectOffer(item.id)}
                                    />
                                )}
                            />
                        </View>

                        {/* ─── Bill ─── */}
                        <BillSection billCalculations={billCalculations} />

                        <View style={{ height: hp('15%') }} />
                    </ScrollView>

                    {/* ─── Bottom Bar ─── */}
                    <View style={styles.bottomContainer}>
                        <View>
                            <TouchableOpacity style={styles.bottomContainerInnerView}>
                                <Image style={styles.bottomContainerBillIcon} source={require('../assets/images/bill_icon.png')} />
                                <Text style={styles.bottomContainerPriceText}>₹{billCalculations.toPay.toFixed(2)}</Text>
                                <Image style={styles.bottomContainerDownArrowIcon} source={require('../assets/images/down_arrow.png')} />
                            </TouchableOpacity>
                            {billCalculations.totalSavings > 0 && (
                                <Text style={styles.savedPriceText}>You saved ₹{billCalculations.totalSavings.toFixed(2)}</Text>
                            )}
                        </View>
                        <LinearGradient style={styles.selectAddressButtonGradient} colors={['#F25000', '#FF7B3A']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                            <AppButton
                                title="Proceed to Pay"
                                onPress={() => {
                                    const selectedAddress = addresses.find(a => a.selected);
                                    const selectedDate = datesList[selectedDateIndex]?.formatted;

                                    if (!selectedAddress) {
                                        setShowAddressModal(true);
                                        return;
                                    }

                                    if (selectedDeliveryType === 'slot' && !selectedSlot) {
                                        setShowSlotModal(true);
                                        return;
                                    }

                                    navigation.navigate("CheckoutScreen", {
                                        selectedAddress,
                                        selectedDeliveryType,
                                        selectedSlot,
                                        selectedDate,
                                    });
                                }}
                                style={{ backgroundColor: 'transparent', width: '100%', alignItems: 'center' }}
                                textStyle={styles.proceedToPayText}
                            />
                        </LinearGradient>
                    </View>
                </>
            )}

            {/* ─── Modals (extracted) ─── */}
            <AddressModal
                visible={showAddressModal}
                onClose={() => setShowAddressModal(false)}
                addresses={addresses}
                onSelectAddress={onSelectAddress}
                onThreeDotsClicked={onThreeDotsClicked}
                onDeleteClicked={onDeleteClicked}
                onCloseThreeDots={onCloseThreeDots}
                navigation={navigation}
            />
            <SlotModal
                visible={showSlotModal}
                onClose={() => setShowSlotModal(false)}
                selectedDeliveryType={selectedDeliveryType}
                setSelectedDeliveryType={setSelectedDeliveryType}
                selectedDateIndex={selectedDateIndex}
                onSelectDate={onSelectDate}
                selectedSlot={selectedSlot}
                setSelectedSlot={setSelectedSlot}
                datesList={datesList}
                slotsByDate={slotsByDate}
            />
            <CouponModal
                visible={showCouponModal}
                onClose={() => setShowCouponModal(false)}
                isGiftCard={isGiftCard}
                couponCode={couponCode}
                setCouponCode={setCouponCode}
                onApply={handleApplyCoupon}
                availableCoupons={availableCoupons}
                availableGiftCards={availableGiftCards}
                onCouponClick={handleCouponClick}
            />

            <ConfirmationModal
                visible={isClearCartModalVisible}
                onClose={() => setIsClearCartModalVisible(false)}
                onConfirm={clearCart}
                title="Clear Cart"
                message="Are you sure you want to remove all items from your cart?"
                confirmText="Clear"
            />
        </SafeAreaView>
    );
};

export default CartScreen

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: wp('4.65%'),
        paddingVertical: hp('1.5%'),
        justifyContent: 'space-between',
    },
    headerText: {
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('4.65%'),
        color: '#000000',
        marginLeft: wp('4%')
    },
    headerInnerView: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9F9F9',
        paddingHorizontal: wp('2%'),
        paddingVertical: hp('0.5%'),
        borderRadius: 50
    },
    timeImage: {
        width: wp('3.5%'),
        height: wp('3.5%'),
        resizeMode: 'contain'
    },
    timeText: {
        fontFamily: FONTS.outfit.medium,
        fontSize: wp('3%'),
        color: '#000000',
        marginLeft: wp('1%')
    },
    dashedDivider: {
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: '#E8E8E8',
        marginHorizontal: wp('4.65%')
    },
    addressView: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: wp('4.65%'),
        paddingVertical: hp('1.5%'),
        justifyContent: 'space-between'
    },
    addressText: {
        fontFamily: FONTS.outfit.regular,
        fontSize: wp('3.5%'),
        color: '#000000',
        maxWidth: wp('85%')
    },
    bannerView: {
        paddingHorizontal: wp('4.65%'),
    },
    bannerStyle: {
        width: wp('90.7%'),
        height: hp('18%'),
        resizeMode: 'contain',
        alignSelf: 'center'
    },
    productListingContainer: {
        paddingHorizontal: wp('4.65%'),
        marginTop: hp('2%')
    },
    itemsCountContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: wp('4.65%'),
        marginTop: hp('1%'),
        alignItems: 'center'
    },
    clearCartContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingHorizontal: wp('4.65%'),
        marginTop: hp('1%'),
    },
    itemsCountText: {
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('4%'),
        color: '#000000'
    },
    btokenContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF5F0',
        paddingHorizontal: wp('2%'),
        paddingVertical: hp('0.5%'),
        borderRadius: 50
    },
    btokenImage: {
        width: wp('4%'),
        height: wp('4%'),
        resizeMode: 'contain'
    },
    btokenText: {
        fontFamily: FONTS.outfit.medium,
        fontSize: wp('3%'),
        color: '#F25000',
        marginLeft: wp('1%')
    },
    offersContainer: {
        marginTop: hp('2%'),
        paddingHorizontal: wp('4.65%')
    },
    offersHeaderView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: hp('1.5%')
    },
    offersHeaderImage: {
        width: wp('5%'),
        height: wp('5%'),
        resizeMode: 'contain'
    },
    offersHeaderText: {
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('4%'),
        color: '#000000',
        marginLeft: wp('2%')
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 0,
        backgroundColor: '#FFFFFF',
        width: wp('100%'),
        paddingHorizontal: wp('4.65%'),
        paddingVertical: hp('2%'),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    bottomContainerInnerView: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    bottomContainerBillIcon: {
        width: wp('5%'),
        height: wp('5%'),
        resizeMode: 'contain'
    },
    bottomContainerPriceText: {
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('4.5%'),
        color: '#000000',
        marginLeft: wp('2%')
    },
    bottomContainerDownArrowIcon: {
        width: wp('3%'),
        height: wp('3%'),
        resizeMode: 'contain',
        marginLeft: wp('2%'),
        transform: [{ rotate: '180deg' }]
    },
    savedPriceText: {
        fontFamily: FONTS.outfit.regular,
        fontSize: wp('3%'),
        color: '#0CA201',
        marginLeft: wp('7%'),
        marginTop: hp('0.5%')
    },
    selectAddressButtonGradient: {
        flex: 1,
        marginLeft: wp('5%'),
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center'
    },
    proceedToPayText: {
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('4%'),
        color: '#FFFFFF'
    },
    clearCartButton: {
        paddingVertical: hp('0.5%'),
    },
    clearCartText: {
        fontFamily: FONTS.outfit.medium,
        fontSize: wp('3.2%'),
        color: '#F25000',
        textDecorationLine: 'underline',
    },
});