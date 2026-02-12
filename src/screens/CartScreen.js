import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, FlatList, ImageBackground, Modal, Platform, TextInput, KeyboardAvoidingView, Alert } from 'react-native'
import React from 'react'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { FONTS } from '../styles/typography'
import { useNavigation } from '@react-navigation/native'
import CartProductCard from '../components/CartProductCard'
import OfferCard from '../components/OfferCard'
import LinearGradient from 'react-native-linear-gradient'
import Entypo from 'react-native-vector-icons/Entypo';
import { useCartScreen } from '../hooks/useCartScreen';
import AppButton from '../components/AppButton';
import { LoaderContext } from '../context/loaderContext';
import { useContext, useState } from 'react';
import ConfirmationModal from '../components/ConfirmationModal';

const CartScreen = () => {
    const navigation = useNavigation()
    const {
        // State
        cartItems,
        billCalculations,
        showAddressModal,
        setShowAddressModal,
        showSlotModal,
        setShowSlotModal,
        showCouponModal,
        setShowCouponModal,
        couponCode,
        setCouponCode,
        isGiftCard,
        availableCoupons,
        availableGiftCards,
        selectedDeliveryType,
        setSelectedDeliveryType,
        selectedDateIndex,
        setSelectedDateIndex,
        selectedSlot,
        setSelectedSlot,
        offers,
        addresses,
        datesList,
        slotsByDate,

        // Actions
        loadCart,
        clearCart,
        onApplyOffer,
        onRejectOffer,
        handleApplyCoupon,
        handleCouponClick,
        onSelectAddress,
        onThreeDotsClicked,
        onDeleteClicked,
        onCloseThreeDots,
    } = useCartScreen();
    const { showLoader } = useContext(LoaderContext);
    const [isClearCartModalVisible, setIsClearCartModalVisible] = useState(false);

    const insets = useSafeAreaInsets();

    const handleClearCart = () => {
        setIsClearCartModalVisible(true);
    };

    const AddressCard = (item) => {
        return (
            <TouchableOpacity onPress={item.item.selected === true ? () => {
                setShowAddressModal(false)
                navigation.navigate("AddAddressScreen")
            } : () => {
                onSelectAddress(item.item.id)
            }}

                style={item.item.selected === false ? (
                    [styles.addressContainer, {
                        borderColor: '#DADADA'
                    }]) : (
                    styles.addressContainer
                )}>
                <View style={item.item.selected === true ?
                    (styles.addressContainerTopView) :
                    ([styles.addressContainerTopView, { marginBottom: hp('1%') }])}>
                    <View style={styles.addressContainerInnerView}>
                        <Image style={item.item.type === 'home' ? (
                            styles.homeIcon
                        ) : ([
                            styles.homeIcon, {
                                height: wp('3%')
                            }
                        ])} source={item.item.type === 'Home' ? (
                            require('../assets/images/home_icon.png')) : (
                            require('../assets/images/office_icon.png'))} />
                        <Text style={styles.addressTypeText}>{item.item.type}</Text>
                    </View>
                    {
                        item.item.selected === true ? (
                            item.item.threeDotsClicked === false ? (
                                <View style={{
                                    flexDirection: 'row'
                                }}>
                                    <View style={styles.selectedView}>
                                        <Image style={styles.tickImage} source={require('../assets/images/tick.png')} />
                                        <Text style={styles.selectedText}>Selected</Text>
                                    </View>
                                    <TouchableOpacity
                                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                        onPress={() => onThreeDotsClicked(item.item.id)}>
                                        <Image style={styles.threeDotsIcon} source={require('../assets/images/three_dots.png')} />
                                    </TouchableOpacity>
                                </View>

                            ) : (< View style={styles.threeDotActionContainer}>
                                <TouchableOpacity>
                                    <Image style={styles.editIcon} source={require('../assets/images/edit_icon.png')} />
                                </TouchableOpacity>
                                <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={() => onDeleteClicked(item.item.id)}>
                                    <Image style={styles.editIcon} source={require('../assets/images/delete_icon_two.png')} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={onCloseThreeDots}>
                                    <Image style={styles.editIcon} source={require('../assets/images/right_arrow.png')} />
                                </TouchableOpacity>
                            </View>)
                        ) : (
                            item.item.threeDotsClicked === false ? (<TouchableOpacity
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                onPress={() => onThreeDotsClicked(item.item.id)}>
                                <Image style={styles.threeDotsIcon} source={require('../assets/images/three_dots.png')} />
                            </TouchableOpacity>
                            ) : (< View style={styles.threeDotActionContainer}>
                                <TouchableOpacity>
                                    <Image style={styles.editIcon} source={require('../assets/images/edit_icon.png')} />
                                </TouchableOpacity>
                                <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={() => onDeleteClicked(item.item.id)}>
                                    <Image style={styles.editIcon} source={require('../assets/images/delete_icon_two.png')} />
                                </TouchableOpacity>
                                <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={onCloseThreeDots}>
                                    <Image style={styles.editIcon} source={require('../assets/images/right_arrow.png')} />
                                </TouchableOpacity>
                            </View>
                            )
                        )
                    }
                </View>
                {
                    item.item.selected === false ? (
                        <View style={styles.unSelectedAddressInnerContainer}>
                            <Text style={[styles.addressLine, {
                                marginHorizontal: wp('4%')
                            }]}>{item.item.address}</Text>
                            <View style={styles.addressContainerBottomView}>
                                <View style={styles.addressBottomInnerView}>
                                    <Image style={styles.phoneIcon} source={require('../assets/images/phone_icon.png')} />
                                    <Text style={styles.addressLine}>{item.item.phone}</Text>
                                </View>
                                <Text style={styles.addressLine}>PIN: {item.item.pin}</Text>
                            </View>
                        </View>
                    ) : (
                        <>
                            <Text style={[styles.addressLine, {
                                marginHorizontal: wp('4%')
                            }]}>{item.item.address}</Text>
                            <View style={styles.addressContainerBottomView}>
                                <View style={styles.addressBottomInnerView}>
                                    <Image style={styles.phoneIcon} source={require('../assets/images/phone_icon.png')} />
                                    <Text style={styles.addressLine}>{item.item.phone}</Text>
                                </View>
                                <Text style={styles.addressLine}>PIN: {item.item.pin}</Text>
                            </View>

                        </>
                    )
                }
            </TouchableOpacity >
        )
    }

    return (
        <SafeAreaView
            edges={['top']}
            style={Platform.OS === 'android' ? [styles.mainContainer, { paddingBottom: insets.bottom }] : styles.mainContainer}>
            <View style={styles.headerContainer}>
                <TouchableOpacity style={{
                    top: Platform.OS === 'android' && hp('-0.2%')
                }} onPress={() => navigation.goBack()}>
                    <AntDesign name={'left'} size={wp('5%')} color={'#777777'} />
                </TouchableOpacity>
                <Text style={styles.headerText}>Cart</Text>
                <TouchableOpacity onPress={() => setShowSlotModal(true)} style={styles.headerInnerView}>
                    <Image style={Platform.OS === 'android' ?
                        [styles.timeImage, { top: hp('-0.2%') }] :
                        styles.timeImage
                    } source={require('../assets/images/lighting.png')} />
                    <Text style={styles.timeText}>20 min</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.dashedDivider} />
            <TouchableOpacity onPress={() => setShowAddressModal(true)} style={styles.addressView}>
                <Text style={styles.addressText}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >Vennala: Chakkarapparambuabcdefg</Text>
                <Entypo style={Platform.OS === 'android' && {
                    top: hp('-0.2%')
                }} name={"chevron-down"} size={wp('3.6%')} color={"#000000"} />
            </TouchableOpacity>
            <ScrollView>
                <View style={styles.bannerView}>
                    <Image style={styles.bannerStyle} source={require('../assets/images/cart-banner.png')} />
                </View>
                <View style={styles.clearCartContainer}>
                    <TouchableOpacity onPress={handleClearCart} style={styles.clearCartButton}>
                        <Text style={styles.clearCartText}>Clear Cart</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.productListingContainer}>
                    <FlatList
                        data={cartItems}
                        keyExtractor={(item, index) => item.cartItemId?.toString() || item.productId?.toString() || index.toString()}
                        renderItem={({ item }) => <CartProductCard item={item} />}
                    />
                </View>
                <View style={styles.itemsCountContainer}>
                    <Text style={styles.itemsCountText}>{cartItems.length} Items</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={styles.btokenContainer}>
                            <Image style={styles.btokenImage} source={require('../assets/images/btoken-icon.png')} />
                            <Text style={styles.btokenText}>{billCalculations.totalBtokens}B Token</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.offersContainer}>
                    <View style={styles.offersHeaderView}>
                        <Image style={styles.offersHeaderImage} source={require('../assets/images/add_offer.png')} />
                        <Text style={styles.offersHeaderText}>Add Offers</Text>
                    </View>
                    <FlatList
                        data={offers}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => {
                            return (
                                <OfferCard
                                    item={item}
                                    onApply={() => onApplyOffer(item.id)}
                                    onReject={() => onRejectOffer(item.id)}
                                />
                            )
                        }}
                    />
                </View>
                <ImageBackground style={styles.billImageBackground} source={require('../assets/images/bill_background.png')}>
                    <View style={styles.billHeaderContainer}>
                        <Image style={styles.billIcon} source={require('../assets/images/bill_icon.png')} />
                        <Text style={styles.billHeaderText}>View Your Bill</Text>
                    </View>
                    <View>

                        <View style={styles.billContentContainer}>
                            <Text style={styles.billContentText}>Item total</Text>
                            <View style={styles.priceContainer}>
                                {billCalculations.savings > 0 && (
                                    <Text style={styles.mrpText}>₹{billCalculations.mrpTotal.toFixed(2)}</Text>
                                )}
                                <Text style={styles.priceText}>₹{billCalculations.itemTotal.toFixed(2)}</Text>
                            </View>
                        </View>

                        <View style={styles.billContentContainer}>
                            <Text style={styles.billContentText}>Delivery charge</Text>
                            <Text style={styles.priceText}>{billCalculations.deliveryCharge === 0 ? 'FREE' : `₹${billCalculations.deliveryCharge.toFixed(2)}`}</Text>
                        </View>

                        {billCalculations.totalTax > 0 && (
                            <View style={styles.billContentContainer}>
                                <Text style={styles.billContentText}>Total Tax</Text>
                                <Text style={styles.priceText}>₹{billCalculations.totalTax.toFixed(2)}</Text>
                            </View>
                        )}

                        {billCalculations.couponDiscount > 0 && (
                            <View style={styles.billContentContainer}>
                                <Text style={styles.billContentText}>Coupon Discount</Text>
                                <Text style={styles.priceText}>- ₹{billCalculations.couponDiscount.toFixed(2)}</Text>
                            </View>
                        )}

                        {billCalculations.giftCardAmount > 0 && (
                            <View style={styles.billContentContainer}>
                                <Text style={styles.billContentText}>Gift Card</Text>
                                <Text style={styles.priceText}>- ₹{billCalculations.giftCardAmount.toFixed(2)}</Text>
                            </View>
                        )}

                        {billCalculations.bcoinsAppliedValue > 0 && (
                            <View style={styles.billContentContainer}>
                                <Text style={styles.billContentText}>B-Coins Applied</Text>
                                <Text style={styles.priceText}>- ₹{billCalculations.bcoinsAppliedValue.toFixed(2)}</Text>
                            </View>
                        )}

                        {billCalculations.totalSavings > 0 && (
                            <View style={styles.billContentContainer}>
                                <Text style={styles.billContentText}>You have saved</Text>
                                <Text style={[styles.priceText, {
                                    color: '#0CA201',
                                }]}>₹{billCalculations.totalSavings.toFixed(2)}</Text>
                            </View>
                        )}

                        <View style={styles.billDivider} />
                        <View style={styles.billSumView}>
                            <Text style={styles.billSumText}>To Pay</Text>
                            <Text style={styles.billSumText}>₹{billCalculations.toPay.toFixed(2)}</Text>
                        </View>
                    </View>
                </ImageBackground>
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

                    <LinearGradient style={styles.selectAddressButtonGradient} colors={['#F25000', '#FF7B3A']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}>
                        <AppButton
                            title="Proceed to Pay"
                            onPress={() => navigation.navigate("OrderSuccessScreen")}
                            style={{ backgroundColor: 'transparent', width: '100%', alignItems: 'center' }}
                            textStyle={styles.proceedToPayText}
                        />
                    </LinearGradient>
                </View>
                <Modal
                    visible={showAddressModal}
                    animationType="slide"
                    transparent
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <View style={styles.modalHeaderView}>
                                <Text style={styles.modalHeaderText}>Select Your Address</Text>
                                <TouchableOpacity onPress={() => setShowAddressModal(false)}>
                                    <Image style={styles.closeIcon} source={require('../assets/images/close_two.png')} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.modalInnerView}>
                                <TouchableOpacity style={styles.chooseLocationContainer}>
                                    <Image style={Platform.OS === 'ios' ? styles.locationIcon : [styles.locationIcon, {
                                        bottom: hp('0.25%')
                                    }]} source={require('../assets/images/location_three.png')} />
                                    <Text style={styles.locationText}>Choose current location</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {
                                    setShowAddressModal(false)
                                    navigation.navigate('AddLocationScreen')
                                }} style={styles.chooseLocationContainer}>
                                    <Image style={Platform.OS === 'ios' ? styles.locationIcon : [styles.locationIcon, {
                                        bottom: hp('0.25%')
                                    }]} source={require('../assets/images/add_icon.png')} />
                                    <Text style={styles.locationText}>Add new location</Text>
                                </TouchableOpacity>

                                <View>
                                    <Text style={styles.savedLocationText}>Saved Location</Text>

                                    <View style={{ maxHeight: hp('35%') }}>
                                        <FlatList
                                            data={addresses}
                                            keyExtractor={(item) => item.id}
                                            renderItem={({ item }) => <AddressCard item={item} />}
                                            showsVerticalScrollIndicator={false}
                                        />
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>
                <Modal
                    visible={showSlotModal}
                    animationType="slide"
                    transparent
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <View style={styles.modalHeaderView}>
                                <Text style={styles.modalHeaderText}>Schedule Your Time</Text>
                                <TouchableOpacity onPress={() => setShowSlotModal(false)}>
                                    <Image style={styles.closeIcon} source={require('../assets/images/close_two.png')} />
                                </TouchableOpacity>
                            </View>
                            <ScrollView>
                                <View style={styles.quickDeliveryContainer}>
                                    {/* <View style={styles.radioSelected} /> */}
                                    <TouchableOpacity
                                        onPress={() => setSelectedDeliveryType('quick')}
                                        style={selectedDeliveryType === 'quick' ? styles.radioSelected : styles.radioUnselected}
                                    />
                                    <View style={styles.quickDeliveryInnerView}>
                                        <Image style={styles.lightingImage} source={require('../assets/images/lighting.png')} />
                                        <Text style={styles.timeTextTwo}>20 min</Text>
                                    </View>
                                    <Text style={styles.quickDeliveryText}>Quick delivery</Text>
                                </View>

                                <View style={styles.slotDeliveryContainer}>
                                    <View style={styles.slotDeliveryInnerView}>
                                        <TouchableOpacity
                                            onPress={() => setSelectedDeliveryType('slot')}
                                            style={selectedDeliveryType === 'slot' ? styles.radioSelected : styles.radioUnselected}
                                        />
                                        <Image style={styles.clockImage} source={require('../assets/images/clock.png')} />
                                        <Text style={styles.timeTextTwo}>Slot Delivery</Text>
                                    </View>
                                    <View style={{
                                        // paddingHorizontal: wp('4.65%'),
                                        marginTop: hp('2.5%')
                                    }}>
                                        <Text style={styles.sectionTitle}>Select Date</Text>
                                        <View style={styles.datesContainer}>
                                            {datesList.map((item, index) => (
                                                <TouchableOpacity onPress={() => {
                                                    setSelectedDateIndex(index);
                                                    setSelectedSlot(null);
                                                }} style={[
                                                    styles.dateCard,
                                                    selectedDateIndex === index && styles.dateSelected
                                                ]}>
                                                    <Text style={styles.dateLabelText}>{item.label}</Text>
                                                    <Text style={styles.dateText}>{item.formatted}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </View>
                                    <View style={{
                                        marginTop: hp('2.5%')
                                    }}>
                                        <Text style={styles.sectionTitle}>Select Time</Text>
                                        <View style={styles.slotsContainer}>
                                            {slotsByDate[selectedDateIndex]?.map((slot, index) => (
                                                <TouchableOpacity
                                                    key={index}
                                                    onPress={() => setSelectedSlot(slot)}
                                                    style={[
                                                        styles.slotCard,
                                                        selectedSlot === slot && styles.slotSelected
                                                    ]}
                                                >
                                                    <Text style={[
                                                        styles.slotText,
                                                        selectedSlot === slot && styles.slotTextSelected
                                                    ]}>
                                                        {slot}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </View>
                                </View>
                            </ScrollView>
                        </View>
                    </View>
                </Modal>
                <Modal
                    visible={showCouponModal}
                    animationType="slide"
                    transparent
                >
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        style={styles.modalOverlay}
                    >
                        <View style={styles.modalContainer}>
                            <View style={styles.modalHeaderView}>
                                <Text style={styles.modalHeaderText}>{isGiftCard ? "Apply Gift Card" : "Apply Coupon"}</Text>
                                <TouchableOpacity onPress={() => setShowCouponModal(false)}>
                                    <Image style={styles.closeIcon} source={require('../assets/images/close_two.png')} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.couponInputContainer}>
                                <TextInput
                                    style={styles.couponInput}
                                    placeholder={isGiftCard ? "Enter Gift Card Code" : "Enter Coupon Code"}
                                    value={couponCode}
                                    onChangeText={setCouponCode}
                                    autoCapitalize="characters"
                                />
                                <TouchableOpacity style={styles.applyCouponButton} onPress={handleApplyCoupon}>
                                    <Text style={styles.applyCouponButtonText}>APPLY</Text>
                                </TouchableOpacity>
                            </View>

                            {!isGiftCard ? (
                                <>
                                    <Text style={styles.sectionTitle}>Available Coupons</Text>
                                    <FlatList
                                        data={availableCoupons}
                                        keyExtractor={(item, index) => item.id?.toString() || item.code || index.toString()}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity style={styles.couponCard} onPress={() => handleCouponClick(item.code)}>
                                                <View style={styles.couponCodeContainer}>
                                                    <Text style={styles.couponCodeText}>{item.code}</Text>
                                                </View>
                                                <Text style={styles.couponDescription}>{item.description}</Text>
                                                <Text style={styles.applyText}>TAP TO APPLY</Text>
                                            </TouchableOpacity>
                                        )}
                                        contentContainerStyle={{ paddingBottom: hp('2%') }}
                                    />
                                </>
                            ) : (
                                <>
                                    <Text style={styles.sectionTitle}>Available Gift Cards</Text>
                                    <FlatList
                                        data={availableGiftCards}
                                        keyExtractor={item => item.id}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity style={styles.couponCard} onPress={() => handleCouponClick(item.code)}>
                                                <View style={styles.couponCodeContainer}>
                                                    <Text style={styles.couponCodeText}>{item.code}</Text>
                                                </View>
                                                <Text style={styles.couponDescription}>{item.description}</Text>
                                                <Text style={styles.applyText}>TAP TO APPLY</Text>
                                            </TouchableOpacity>
                                        )}
                                        contentContainerStyle={{ paddingBottom: hp('2%') }}
                                    />
                                </>
                            )}
                        </View>
                    </KeyboardAvoidingView>
                </Modal>
            </ScrollView>
            <ConfirmationModal
                visible={isClearCartModalVisible}
                onClose={() => setIsClearCartModalVisible(false)}
                onConfirm={clearCart}
                title="Clear Cart"
                message="Are you sure you want to remove all items from your cart?"
                confirmText="Clear"
            />
        </SafeAreaView>
    )
}

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
        // backgroundColor: 'red'
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
        // marginTop: hp('1%')
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
    billImageBackground: {
        width: wp('90.7%'),
        // height: hp('35%'),
        alignSelf: 'center',
        marginTop: hp('2%'),
        paddingVertical: hp('2%'),
        paddingHorizontal: wp('4%'),
        marginBottom: hp('12%')
    },
    billHeaderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: hp('1%')
    },
    billIcon: {
        width: wp('5%'),
        height: wp('5%'),
        resizeMode: 'contain'
    },
    billHeaderText: {
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('4%'),
        color: '#000000',
        marginLeft: wp('2%')
    },
    billContentContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: hp('1%')
    },
    billContentText: {
        fontFamily: FONTS.outfit.regular,
        fontSize: wp('3.5%'),
        color: '#777777'
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    mrpText: {
        fontFamily: FONTS.outfit.regular,
        fontSize: wp('3%'),
        color: '#777777',
        textDecorationLine: 'line-through',
        marginRight: wp('2%')
    },
    priceText: {
        fontFamily: FONTS.outfit.medium,
        fontSize: wp('3.5%'),
        color: '#000000'
    },
    billDivider: {
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: '#E8E8E8',
        marginTop: hp('2%')
    },
    billSumView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: hp('2%')
    },
    billSumText: {
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('4%'),
        color: '#000000'
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
        shadowOffset: {
            width: 0,
            height: 2,
        },
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
        // width: wp('45%'),
        flex: 1,
        marginLeft: wp('5%'),
        // height: hp('6%'),
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center'
    },
    selectAddressButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        justifyContent: 'center'
    },
    proceedToPayText: {
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('4%'),
        color: '#FFFFFF'
    },
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
    modalInnerView: {
        marginTop: hp('1%')
    },
    chooseLocationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: hp('2%')
    },
    locationIcon: {
        width: wp('5%'),
        height: wp('5%'),
        resizeMode: 'contain'
    },
    locationText: {
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('4%'),
        color: '#F25000',
        marginLeft: wp('3%')
    },
    savedLocationText: {
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('4%'),
        color: '#000000',
        marginVertical: hp('1.5%')
    },
    addressContainer: {
        borderWidth: 1,
        borderColor: '#F25000',
        borderRadius: 12,
        padding: wp('3%'),
        marginBottom: hp('1.5%')
    },
    addressContainerTopView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    addressContainerInnerView: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    homeIcon: {
        width: wp('4%'),
        height: wp('4%'),
        resizeMode: 'contain'
    },
    addressTypeText: {
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('3.5%'),
        color: '#000000',
        marginLeft: wp('2%')
    },
    selectedView: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F25000',
        paddingHorizontal: wp('2%'),
        paddingVertical: hp('0.3%'),
        borderRadius: 4,
        marginRight: wp('3%')
    },
    tickImage: {
        width: wp('3%'),
        height: wp('3%'),
        resizeMode: 'contain',
        tintColor: '#FFFFFF'
    },
    selectedText: {
        fontFamily: FONTS.outfit.medium,
        fontSize: wp('3%'),
        color: '#FFFFFF',
        marginLeft: wp('1%')
    },
    threeDotsIcon: {
        width: wp('1%'),
        height: wp('4%'),
        resizeMode: 'contain',
        tintColor: '#777777'
    },
    unSelectedAddressInnerContainer: {
        opacity: 0.5
    },
    addressLine: {
        fontFamily: FONTS.outfit.regular,
        fontSize: wp('3.5%'),
        color: '#777777',
        marginTop: hp('0.5%')
    },
    addressContainerBottomView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: hp('1%')
    },
    addressBottomInnerView: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    phoneIcon: {
        width: wp('3.5%'),
        height: wp('3.5%'),
        resizeMode: 'contain',
        tintColor: '#777777',
        marginRight: wp('2%')
    },
    threeDotActionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: wp('26%'),
        justifyContent: 'space-between'
    },
    editIcon: {
        width: wp('6%'),
        height: wp('6%'),
        resizeMode: 'contain'
    },
    quickDeliveryContainer: {
        borderWidth: 1,
        borderColor: '#DADADA',
        borderRadius: 12,
        padding: wp('3%'),
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: hp('2%')
    },
    radioSelected: {
        width: wp('5%'),
        height: wp('5%'),
        borderRadius: wp('2.5%'),
        borderWidth: 5,
        borderColor: '#F25000'
    },
    radioUnselected: {
        width: wp('5%'),
        height: wp('5%'),
        borderRadius: wp('2.5%'),
        borderWidth: 1,
        borderColor: '#DADADA'
    },
    quickDeliveryInnerView: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF5F0',
        paddingHorizontal: wp('3%'),
        paddingVertical: hp('0.5%'),
        borderRadius: 50,
        marginLeft: wp('3%'),
        marginRight: wp('3%')
    },
    lightingImage: {
        width: wp('4%'),
        height: wp('4%'),
        resizeMode: 'contain'
    },
    timeTextTwo: {
        fontFamily: FONTS.outfit.medium,
        fontSize: wp('3.5%'),
        color: '#F25000',
        marginLeft: wp('1%')
    },
    quickDeliveryText: {
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('4%'),
        color: '#000000'
    },
    slotDeliveryContainer: {
        borderWidth: 1,
        borderColor: '#DADADA',
        borderRadius: 12,
        padding: wp('3%')
    },
    slotDeliveryInnerView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: hp('1%')
    },
    clockImage: {
        width: wp('5%'),
        height: wp('5%'),
        resizeMode: 'contain',
        marginLeft: wp('3%'),
        marginRight: wp('3%')
    },
    datesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: hp('1.5%')
    },
    dateCard: {
        borderWidth: 1,
        borderColor: '#DADADA',
        borderRadius: 8,
        paddingVertical: hp('1.5%'),
        paddingHorizontal: wp('3%'),
        alignItems: 'center',
        width: wp('28%')
    },
    dateSelected: {
        borderColor: '#F25000',
        backgroundColor: '#FFF5F0'
    },
    dateLabelText: {
        fontFamily: FONTS.outfit.regular,
        fontSize: wp('3%'),
        color: '#777777'
    },
    dateText: {
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('3.5%'),
        color: '#000000',
        marginTop: hp('0.5%')
    },
    slotsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: hp('1.5%'),
        gap: wp('3%')
    },
    slotCard: {
        borderWidth: 1,
        borderColor: '#DADADA',
        borderRadius: 8,
        paddingVertical: hp('1%'),
        paddingHorizontal: wp('4%')
    },
    slotSelected: {
        borderColor: '#F25000',
        backgroundColor: '#FFF5F0'
    },
    slotText: {
        fontFamily: FONTS.outfit.medium,
        fontSize: wp('3.5%'),
        color: '#777777'
    },
    slotTextSelected: {
        color: '#F25000'
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
    clearCartButton: {
        backgroundColor: '#FFF5F0',
        paddingHorizontal: wp('3%'),
        paddingVertical: hp('0.8%'),
        borderRadius: wp('1.5%'),
        borderWidth: 1,
        borderColor: '#F25000',
        justifyContent: 'center',
        alignItems: 'center'
    },
    clearCartText: {
        fontFamily: FONTS.outfit.medium,
        fontSize: wp('3.2%'),
        color: '#F25000',
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
    }
});