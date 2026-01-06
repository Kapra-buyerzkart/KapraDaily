import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, FlatList, ImageBackground, Modal, Platform } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { FONTS } from '../styles/typography'
import { useNavigation } from '@react-navigation/native'
import CartProductCard from '../components/CartProductCard'
import OfferCard from '../components/OfferCard'
import LinearGradient from 'react-native-linear-gradient'
import Entypo from 'react-native-vector-icons/Entypo';

const CartScreen = () => {
    const navigation = useNavigation()
    const [showAddressModal, setShowAddressModal] = useState(false)
    const [showSlotModal, setShowSlotModal] = useState(false)
    const [selectedDeliveryType, setSelectedDeliveryType] = useState('quick');
    const [selectedDateIndex, setSelectedDateIndex] = useState(0);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [offers, setOffers] = useState([
        {
            id: '1',
            name: "Smart point",
            content: "get flat 50%",
            applyCliked: false,
            image: require('../assets/images/smart_point_two.png')
        },
        {
            id: '2',
            name: "Coupon",
            content: "get flat 50%",
            applyCliked: false,
            image: require('../assets/images/coupon-two.png')
        },
        {
            id: '3',
            name: "B-Coin",
            content: "1000.00",
            applyCliked: false,
            image: require('../assets/images/bcoin_two.png')
        },
    ])
    const products = [
        {
            id: "1",
            name: 'Lorem lpsum is simply dummy text',
            image: require('../assets/images/wl1.png'),
            soldOut: false
        },
        {
            id: "2",
            name: 'Lorem lpsum is simply dummy text',
            image: require('../assets/images/wl1.png'),
            soldOut: false
        },
        {
            id: "3",
            name: 'Lorem lpsum is simply dummy text',
            image: require('../assets/images/wl1.png'),
            soldOut: false
        },
        {
            id: "4",
            name: 'Lorem lpsum is simply dummy text',
            image: require('../assets/images/wl1.png'),
            soldOut: true
        },
    ]

    const [addresses, setAddresses] = useState([
        {
            id: '1',
            type: 'Home',
            address: 'american city main street road 1234',
            phone: '9999999999',
            pin: '676501',
            icon: require('../assets/images/home_icon.png'),
            selected: true,
            threeDotsClicked: false,
        },
        {
            id: '2',
            type: 'Office',
            address: 'indian city main street road 1234',
            phone: '8888888888',
            pin: '676502',
            icon: require('../assets/images/office_icon.png'),
            selected: false,
            threeDotsClicked: false,
        },
        // {
        //     id: '3',
        //     type: 'Office',
        //     address: 'indian city main street road 1234',
        //     phone: '8888888888',
        //     pin: '676502',
        //     icon: require('../assets/images/office_icon.png'),
        //     selected: false,
        //     threeDotsClicked: false
        // },
        // {
        //     id: '4',
        //     type: 'Home',
        //     address: 'indian city main street road 1234',
        //     phone: '8888888888',
        //     pin: '676502',
        //     icon: require('../assets/images/office_icon.png'),
        //     selected: false,
        //     threeDotsClicked: false
        // },
    ]);

    const insets = useSafeAreaInsets();

    const onApplyOffer = (offerId) => {
        setOffers(prev =>
            prev.map(item =>
                item.id === offerId
                    ? { ...item, applyCliked: true }
                    : item
            )
        )
    }

    const onRejectOffer = (offerId) => {
        setOffers(prev =>
            prev.map(item =>
                item.id === offerId
                    ? { ...item, applyCliked: false }
                    : item
            )
        )
    }


    const onSelectAddress = (addressId) => {
        setAddresses(prev =>
            prev.map(item => ({
                ...item,
                selected: item.id === addressId
            }))
        );
    };

    const onThreeDotsClicked = (addressId) => {
        setAddresses(prev =>
            prev.map(item => ({
                ...item,
                threeDotsClicked: item.id === addressId
            }))
        );
    };

    const onDeleteClicked = (addressId) => {
        setAddresses(prev =>
            prev.filter(item => item.id !== addressId)
        )
    }

    const onCloseThreeDots = () => {
        setAddresses(prev =>
            prev.map(item => ({
                ...item,
                threeDotsClicked: false
            }))
        );
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

    const formatDDMMYYYY = (date) => {
        const dd = String(date.getDate()).padStart(2, '0');
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const yyyy = date.getFullYear();
        return `${dd}-${mm}-${yyyy}`;
    };

    const getNextDates = () => {
        const dates = [];
        for (let i = 0; i < 3; i++) {
            const d = new Date();
            d.setDate(d.getDate() + i);

            dates.push({
                id: i,
                label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'long' }),
                date: d,
                formatted: formatDDMMYYYY(d)
            });
        }
        return dates;
    };

    const datesList = getNextDates();

    const slotsByDate = {
        0: [
            '6:00pm - 7:00pm',
            '7:00pm - 8:00pm',
            '8:00pm - 9:00pm',
        ],
        1: [
            '10:00am - 11:00am',
            '11:00am - 12:00pm',
            '6:00pm - 7:00pm',
        ],
        2: [
            '9:00am - 10:00am',
            '5:00pm - 6:00pm',
        ],
    };

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
                <View style={styles.productListingContainer}>
                    <FlatList
                        data={products}
                        keyExtractor={(item, index) => item.id}
                        renderItem={({ item }) => <CartProductCard item={item} />}
                    />
                </View>
                <View style={styles.itemsCountContainer}>
                    <Text style={styles.itemsCountText}>{products.length} Items</Text>
                    <View style={styles.btokenContainer}>
                        <Image style={styles.btokenImage} source={require('../assets/images/btoken-icon.png')} />
                        <Text style={styles.btokenText}>4B Token</Text>
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
                            console.log('itttt', item)
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
                                <Text style={styles.mrpText}>₹394</Text>
                                <Text style={styles.priceText}>₹324</Text>
                            </View>
                        </View>

                        <View style={styles.billContentContainer}>
                            <Text style={styles.billContentText}>Delivery charge</Text>
                            <Text style={styles.priceText}>FREE</Text>
                        </View>

                        <View style={styles.billContentContainer}>
                            <Text style={styles.billContentText}>Coupon Discount</Text>
                            <Text style={styles.priceText}>- ₹324</Text>
                        </View>

                        <View style={styles.billContentContainer}>
                            <Text style={styles.billContentText}>You have saved</Text>
                            <Text style={[styles.priceText, {
                                color: '#0CA201',
                            }]}>- ₹324</Text>
                        </View>

                        <View style={styles.billDivider} />
                        <View style={styles.billSumView}>
                            <Text style={styles.billSumText}>To Pay</Text>
                            <Text style={styles.billSumText}>₹324</Text>
                        </View>
                    </View>
                </ImageBackground>
                <View style={styles.bottomContainer}>
                    <View>
                        <TouchableOpacity style={styles.bottomContainerInnerView}>
                            <Image style={styles.bottomContainerBillIcon} source={require('../assets/images/bill_icon.png')} />
                            <Text style={styles.bottomContainerPriceText}>₹324.00</Text>
                            <Image style={styles.bottomContainerDownArrowIcon} source={require('../assets/images/down_arrow.png')} />
                        </TouchableOpacity>
                        <Text style={styles.savedPriceText}>You saved ₹324.00</Text>
                    </View>
                    <LinearGradient style={styles.selectAddressButtonGradient} colors={['#F25000', '#FF7B3A']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}>
                        <TouchableOpacity onPress={() => { }} style={styles.selectAddressButtonContainer}>
                            {/* <Image style={styles.selectAddressButtonLocationIcon} source={require('../assets/images/location_white_icon.png')} /> */}
                            <Text style={styles.proceedToPayText}>Proceed to Pay</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                </View>
                <Modal
                    visible={showAddressModal}
                    animationType="slide"
                    transparent
                >
                    <View style={styles.modalOverlay}>
                        {/* <TouchableOpacity onPress={() => setShowAddressModal(false)} style={{
                            backgroundColor: "#FFFFFF",
                            borderRadius: 50,
                            alignSelf: 'center',
                            width: wp('11.63%'),
                            height: hp('5.36%'),
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: hp('0.8%')
                        }}>
                            <Image style={{
                                height: wp('4.2%'),
                                width: wp('4.2%')
                            }} source={require('../assets/images/close_two.png')} />
                        </TouchableOpacity> */}
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
            </ScrollView>
        </SafeAreaView>
    )
}

export default CartScreen

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    // headerContainer: {
    //     flexDirection: 'row',
    //     alignItems: 'center',
    //     justifyContent: 'space-between',
    //     // paddingLeft: wp('4.6%'),
    //     // paddingRight: wp('12%'),
    // },
    headerText: {
        fontSize: wp('4.65%'),
        color: '#000000',
        fontFamily: FONTS.poppins.semiBold,
        flex: 1,
        marginLeft: wp('4%')
    },
    timeText: {
        color: '#000000',
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('4.65%')
    },
    bannerView: {
        // borderWidth: 1,
        // borderColor: '#DADADA',
        // borderTopLeftRadius: wp('9.3%'),
        // borderTopRightRadius: wp('9.3%'),
        // borderBottomWidth: 0,
        alignItems: 'center',
        // paddingTop: wp('1%'),
        marginTop: hp('2.5%')
    },
    bannerStyle: {
        width: wp('95%'),
        height: hp('9.2%'),
        resizeMode: "stretch"
    },
    productListingContainer: {
        alignItems: "center"
    },
    itemsCountContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 1,
        // backgroundColor: 'yellow',
        marginHorizontal: wp('6%'),
        marginTop: hp('0.7%')
    },
    itemsCountText: {
        color: '#4F4F4F',
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('3.48%')
    },
    btokenContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    btokenImage: {
        width: wp('4.65%'),
        height: hp('1.28%')
    },
    btokenText: {
        color: '#5E3568',
        fontFamily: FONTS.outfit.regular,
        fontSize: wp('3.48%'),
        marginLeft: wp('2%')
    },
    offersContainer: {
        marginTop: hp('3%'),
        alignItems: 'center'
    },
    offersHeaderView: {
        flexDirection: 'row',
        // alignSelf: "center",
        alignItems: "center",
        marginBottom: hp('1%')
    },
    offersHeaderImage: {
        height: wp('4.65%'),
        width: wp('4.65%')
    },
    offersHeaderText: {
        color: '#000000',
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('4.18%'),
        marginLeft: wp('2%'),
    },
    offerContainer: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#E9E9E9',
        width: wp('90.7%'),
        height: hp('6%'),
        backgroundColor: '#F2F2F2',
        borderRadius: wp('2.32%'),
        shadowColor: '#0000001A',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 9,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: wp('2.5%'),
        marginBottom: hp('1%')
    },
    offerImage: {
        height: wp('6.97%'),
        width: wp('6.97%'),
    },
    offerInnerView: {
        flex: 1,
        marginLeft: wp('2.5%')
    },
    offerText: {
        color: '#000000',
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('3.25%')
    },
    offerTextTwo: {
        color: '#424242',
        fontFamily: FONTS.poppins.regular,
        fontSize: wp('3.25%')
    },
    applyButton: {
        width: wp('25.1%'),
        height: hp('3.86%'),
        backgroundColor: '#FFFFFF',
        borderRadius: wp('2.3%'),
        justifyContent: "center",
        alignItems: "center",
    },
    applyButtonText: {
        color: '#000000',
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('3%')
    },
    billImageBackground: {
        width: wp('97%'),
        height: hp('32.6%'),
        marginTop: hp('0.5%'),
        alignSelf: 'center',
        marginTop: hp('1%'),
        alignItems: 'center',
        paddingVertical: hp('4.5%'),
    },
    billHeaderContainer: {
        flexDirection: "row",
        alignItems: 'center',
        marginBottom: hp('1.8%')
    },
    billIcon: {
        width: wp('3%'),
        height: hp('1.7%'),
    },
    billHeaderText: {
        color: '#616161',
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('4.18%'),
        marginLeft: wp('3%')
    },
    billContentContainer: {
        flexDirection: 'row',
        width: wp('86%'),
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: wp('3%'),
        marginBottom: hp('0.9%')
    },
    billContentText: {
        color: '#616161',
        fontFamily: FONTS.poppins.regular,
        fontSize: wp('3.25%'),
    },
    priceContainer: {
        flexDirection: "row",
        alignItems: 'center'
    },
    mrpText: {
        color: '#616161',
        fontFamily: FONTS.poppins.regular,
        fontSize: wp('3.48%'),
        textDecorationLine: 'line-through',
        marginRight: wp('3%')
    },
    priceText: {
        color: '#616161',
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('3.25%'),
    },
    billDivider: {
        height: '1',
        width: wp('81%'),
        backgroundColor: '#707070',
        alignSelf: "center",
        marginTop: hp('1%'),
        marginBottom: hp('1.5%')
    },
    billSumView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: wp('3%'),
    },
    billSumText: {
        color: '#616161',
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('5.1%')
    },
    bottomContainer: {
        paddingLeft: wp('7%'),
        paddingRight: wp('6%'),
        paddingBottom: hp('3%'),
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: wp('2.5%'),
        borderTopLeftRadius: wp('2.32%'),
        borderTopRightRadius: wp('2.32%'),
        borderWidth: 1,
        borderColor: '#c4c4c4',
        marginTop: hp('2%'),
        borderBottomWidth: 0
    },
    selectAddressButtonGradient: {
        borderRadius: wp('2%'),
    },
    selectAddressButtonContainer: {
        width: wp('44.18%'),
        height: hp('5.36%'),
        justifyContent: 'center',
        alignItems: 'center',
        // flexDirection: 'row',
        // paddingHorizontal: wp('5.2%')
    },
    selectAddressButtonLocationIcon: {
        width: wp('3.72%'),
        height: hp('2.14%'),
    },
    proceedToPayText: {
        color: '#FFFFFF',
        fontFamily: FONTS.poppins.bold,
        fontSize: wp('3.72%'),
        // top: hp('0.2%')
    },
    savedPriceText: {
        color: '#0CA201',
        fontFamily: FONTS.poppins.semiBold
    },
    bottomContainerDownArrowIcon: {
        width: wp('2%'),
        height: hp('1.3%'),
        resizeMode: 'center',
        marginLeft: wp('2%'),
        bottom: hp('0.2%')
    },
    bottomContainerPriceText: {
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('4.65%'),
        marginLeft: wp('1%')
    },
    bottomContainerBillIcon: {
        width: wp('1.86%'),
        height: hp('1.07%'),
        bottom: hp('0.1%')
    },
    bottomContainerInnerView: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: wp('9.3%'),
        borderTopRightRadius: wp('9.3%'),
        paddingVertical: hp('3.4%'),
        // paddingHorizontal: wp('4.65%'),
        maxHeight: hp('70%'),
    },
    chooseLocationContainer: {
        flexDirection: 'row',
        paddingHorizontal: wp('4%'),
        paddingVertical: wp('2.5%'),
        borderWidth: 1,
        borderColor: '#DADADA',
        borderRadius: wp('2.3%'),
        alignItems: "center",
        marginBottom: hp('1%')
    },
    locationIcon: {
        width: wp('4.65%'),
        height: wp('4.65%'),
    },
    locationText: {
        color: '#3A3A3A',
        fontFamily: FONTS.poppins.regular,
        fontSize: wp('4.1%'),
        marginLeft: wp('3%')
    },
    savedLocationText: {
        color: '#000000',
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('4.19%'),
        textAlign: "center",
        marginTop: hp('2%'),
        marginBottom: hp('1.3%')
    },
    addressContainer: {
        borderColor: '#0CA201',
        borderWidth: 1,
        borderRadius: wp('2.3%'),
        // paddingHorizontal: wp('4%'),
        paddingVertical: hp('1.1%'),
        marginBottom: hp('2.5%'),
        height: hp('16.1%')
    },
    addressContainerTopView: {
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: hp('1.7%'),
        paddingHorizontal: wp('4%')
    },
    addressContainerInnerView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    addressTypeText: {
        color: '#000000',
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('3.72%'),
        marginLeft: wp('1%'),
    },
    addressLine: {
        color: '#3A3A3A',
        fontFamily: FONTS.poppins.regular,
        fontSize: wp('3.72%'),
    },
    addressContainerBottomView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: hp('3.4%'),
        paddingHorizontal: wp('4%')
    },
    phoneIcon: {
        width: wp('3.25%'),
        height: hp('1.5%'),
        marginRight: wp('2%')
    },
    addressBottomInnerView: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    homeIcon: {
        width: wp('4%'),
        height: wp('4%'),
        // bottom: wp('0.2%')
        resizeMode: 'contain',
        top: Platform.OS === 'android' ? hp('-0.3%') : hp('-0.1%')
    },
    selectedView: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#A5F99F',
        borderRadius: wp('4.65%'),
        padding: wp('0.5%')
    },
    tickImage: {
        width: wp('3.48%'),
        height: hp('1.28%')
    },
    selectedText: {
        fontFamily: FONTS.poppins.medium,
        color: '#0CA201',
        fontSize: wp('2.32%'),
        marginLeft: wp('0.5%')
    },
    threeDotsIcon: {
        width: wp('0.93%'),
        height: hp('2.14%'),
        marginLeft: wp('4%')
    },
    unSelectedAddressInnerContainer: {
        borderTopWidth: 1,
        borderTopColor: "#DADADA",
        paddingTop: hp('0.6%')
    },
    threeDotActionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#DADADA',
        borderWidth: 1,
        borderRadius: wp('2.32%'),
        width: wp('26.5%'),
        height: hp('3.64%'),
        justifyContent: 'space-between',
        paddingLeft: wp('1.5%'),
        paddingRight: wp('2.5%')
    },
    editIcon: {
        width: wp('3.72%'),
        height: wp('3.72%'),
        resizeMode: 'contain'
    },
    headerInnerView: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    timeImage: {
        width: wp('1.86%'),
        height: hp('1.8%'),
        marginRight: wp('0.7%')
    },
    addressView: {
        flexDirection: "row",
        alignItems: 'center',
        // borderBottomLeftRadius: 20,
        // borderBottomRightRadius: 30,
        borderColor: '#00000040',
        // borderWidth: 1
        backgroundColor: '#FFFFFF',
        paddingLeft: wp('4.6%'),
        paddingVertical: hp('1%'),
        borderBottomRightRadius: wp('6.97%'),
        borderBottomLeftRadius: wp('4.65%'),
        borderWidth: 1,
        borderTopWidth: 0,
        // borderColor: 'red',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 2,
    },
    addressText: {
        color: "#000000CC",
        fontSize: wp('3.2%'),
        fontFamily: FONTS.poppins.medium,
        maxWidth: wp('52%'),
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        // paddingLeft: wp('4.6%'),
        // paddingRight: wp('12%'),
        paddingLeft: wp('3.5%'),
        paddingBottom: hp('1.1%'),
        paddingRight: wp('4.5%')
    },
    dashedDivider: {
        borderWidth: 1,
        borderColor: '#D7D7D7',
        borderStyle: "dashed"
    },
    modalHeaderView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: wp('4.65%'),
        paddingBottom: hp('0.8%'),
        paddingRight: wp('7%')
    },
    modalHeaderText: {
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('4.5%'),
    },
    closeIcon: {
        height: wp('4.18%'),
        width: wp('4.18%')
    },
    modalInnerView: {
        borderColor: '#8F8F8F40',
        borderTopWidth: 1,
        paddingHorizontal: wp('4.65%'),
        paddingTop: hp('1.5%'),
    },
    quickDeliveryContainer: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#DADADA',
        marginHorizontal: wp('4.65%'),
        paddingHorizontal: wp('3%'),
        paddingVertical: hp('0.9%'),
        borderRadius: wp('2.33%'),
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    radioSelected: {
        height: wp('4.65%'),
        width: wp('4.65%'),
        backgroundColor: '#F25000',
        borderRadius: 20,
    },
    radioUnselected: {
        height: wp('4.65%'),
        width: wp('4.65%'),
        borderColor: '#F25000',
        borderRadius: 20,
        borderWidth: 2
    },
    quickDeliveryInnerView: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginLeft: wp('5%')
    },
    lightingImage: {
        width: wp('1.86%'),
        height: hp('1.8%'),
    },
    timeTextTwo: {
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('3.72%'),
        marginLeft: wp('1.5%'),
    },
    quickDeliveryText: {
        color: '#0CA201',
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('3%')
    },
    clockImage: {
        width: wp('3.5%'),
        height: hp('1.5%'),
        marginLeft: wp('5%')
    },
    sectionTitle: {
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('4.18%'),
        color: '#000000'
    },
    dateCard: {
        backgroundColor: '#FFFFFF',
        width: wp('23.72%'),
        height: hp('9.76%'),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: wp('4.65%'),
        marginRight: wp('2.32%')
    },
    dateSelected: {
        backgroundColor: '#FFDB99',
    },
    slotDeliveryContainer: {
        borderWidth: 1,
        borderColor: '#DADADA',
        borderRadius: wp('2.33%'),
        marginHorizontal: wp('4.65%'),
        marginTop: hp('1.5%'),
        paddingHorizontal: wp('3%'),
        paddingTop: hp('0.9%')
    },
    slotDeliveryInnerView: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    datesContainer: {
        flexDirection: 'row',
        marginTop: hp('0.6%')
    },
    dateLabelText: {
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('3.72%'),
        color: '#000000'
    },
    dateText: {
        fontFamily: FONTS.poppins.regular,
        fontSize: wp('2.79%'),
        color: '#000000'
    },
    slotsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: hp('0.6%')
    },
    slotCard: {
        width: wp('40.9%'),
        borderWidth: 1,
        borderColor: '#DADADA',
        borderRadius: wp('2.32%'),
        // paddingVertical: hp('1.8%'),
        alignItems: 'center',
        marginBottom: hp('1.7%'),
        height: hp('4.84%'),
        justifyContent: 'center'
    },
    slotSelected: {
        backgroundColor: '#F25000',
        // borderColor: '#F25000',
    },
    slotText: {
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('3.5%'),
        color: '#555',
    },
    slotTextSelected: {
        color: '#ffffff',
    },
})