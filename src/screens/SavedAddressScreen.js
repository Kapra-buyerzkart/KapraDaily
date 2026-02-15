import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, RefreshControl } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { useNavigation } from '@react-navigation/native'
import { FONTS } from '../styles/typography'
import { useAddresses } from '../hooks/useAddresses'

const SavedAddressScreen = () => {
    const navigation = useNavigation()
    const {
        addresses,
        onSelectAddress,
        onThreeDotsClicked,
        onDeleteClicked,
        onCloseThreeDots,
        isLoading,
        refreshAddresses
    } = useAddresses();

    const AddressCard = React.memo(({ item, onSelectAddress, onThreeDotsClicked, onDeleteClicked, navigation, onCloseThreeDots }) => {
        const handlePress = () => {
            if (item.selected) {
                navigation.navigate("AddLocationScreen", { address: item.raw });
            } else {
                onSelectAddress(item.id);
            }
        };

        return (
            <TouchableOpacity
                onPress={handlePress}
                style={[styles.addressContainer, !item.selected && { borderColor: '#DADADA' }]}
            >
                <View style={[styles.addressContainerTopView, !item.selected && { marginBottom: hp('1%') }]}>
                    <View style={styles.addressContainerInnerView}>
                        <Image
                            style={[styles.homeIcon, item.type !== 'Home' && { height: wp('3%') }]}
                            source={item.type === 'Home'
                                ? require('../assets/images/home_icon.png')
                                : require('../assets/images/office_icon.png')}
                        />
                        <Text style={styles.addressTypeText}>{item.type}</Text>
                    </View>

                    {item.selected ? (
                        !item.threeDotsClicked ? (
                            <View style={{ flexDirection: 'row' }}>
                                <View style={styles.selectedView}>
                                    <Image style={styles.tickImage} source={require('../assets/images/tick.png')} />
                                    <Text style={styles.selectedText}>Selected</Text>
                                </View>
                                <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={() => onThreeDotsClicked(item.id)}>
                                    <Image style={styles.threeDotsIcon} source={require('../assets/images/three_dots.png')} />
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <ThreeDotsActions
                                onEdit={() => navigation.navigate("AddLocationScreen", { address: item.raw })}
                                onDelete={() => onDeleteClicked(item.id)}
                                onCloseThreeDots={onCloseThreeDots}
                            />
                        )
                    ) : (
                        !item.threeDotsClicked ? (
                            <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={() => onThreeDotsClicked(item.id)}>
                                <Image style={styles.threeDotsIcon} source={require('../assets/images/three_dots.png')} />
                            </TouchableOpacity>
                        ) : (
                            <ThreeDotsActions
                                onEdit={() => navigation.navigate("AddLocationScreen", { address: item.raw })}
                                onDelete={() => onDeleteClicked(item.id)}
                                onCloseThreeDots={onCloseThreeDots}
                            />
                        )
                    )}
                </View>

                <View style={!item.selected ? styles.unSelectedAddressInnerContainer : undefined}>
                    <Text style={[styles.addressLine, { marginHorizontal: wp('4%') }]}>{item.address}</Text>
                    <View style={styles.addressContainerBottomView}>
                        <View style={styles.addressBottomInnerView}>
                            <Image style={styles.phoneIcon} source={require('../assets/images/phone_icon.png')} />
                            <Text style={styles.addressLine}>{item.phone}</Text>
                        </View>
                        <Text style={styles.addressLine}>PIN: {item.pin}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    });

    const ThreeDotsActions = ({ onEdit, onDelete, onCloseThreeDots }) => (
        <View style={styles.threeDotActionContainer}>
            <TouchableOpacity onPress={onEdit}>
                <Image style={styles.editIcon} source={require('../assets/images/edit_icon.png')} />
            </TouchableOpacity>
            <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={onDelete}>
                <Image style={styles.editIcon} source={require('../assets/images/delete_icon_two.png')} />
            </TouchableOpacity>
            <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={onCloseThreeDots}>
                <Image style={styles.editIcon} source={require('../assets/images/right_arrow.png')} />
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.mainContainer}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image style={styles.leftArrowIcon} source={require('../assets/images/left_arrow.png')} />
                </TouchableOpacity>
                <Text style={styles.addressText}>Address</Text>
            </View>
            <FlatList
                data={addresses}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <AddressCard
                        item={item}
                        onSelectAddress={onSelectAddress}
                        onThreeDotsClicked={onThreeDotsClicked}
                        onDeleteClicked={onDeleteClicked}
                        onCloseThreeDots={onCloseThreeDots}
                        navigation={navigation}
                    />
                )}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={isLoading} onRefresh={refreshAddresses} />
                }
                contentContainerStyle={{
                    paddingHorizontal: wp('4.65%'),
                    marginTop: hp('3%')
                }}
                ListFooterComponent={() => (
                    <>
                        <Text style={styles.addAddressText}>Add Address</Text>
                        <TouchableOpacity style={styles.chooseLocationContainer}>
                            <Image style={Platform.OS === 'ios' ? styles.locationIcon : [styles.locationIcon, {
                                bottom: hp('0.25%')
                            }]} source={require('../assets/images/location_three.png')} />
                            <Text style={styles.locationText}>Choose current location</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            navigation.navigate('AddLocationScreen')
                        }} style={styles.chooseLocationContainer}>
                            <Image style={Platform.OS === 'ios' ? styles.locationIcon : [styles.locationIcon, {
                                bottom: hp('0.25%')
                            }]} source={require('../assets/images/add_icon.png')} />
                            <Text style={styles.locationText}>Add new location</Text>
                        </TouchableOpacity>
                    </>
                )}
            />
        </SafeAreaView>
    )
}

export default SavedAddressScreen

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "#FFFFFF"
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: hp('1%'),
        marginLeft: wp('2%')
    },
    leftArrowIcon: {
        width: wp('10.33%'),
        height: hp('2.04%'),
        resizeMode: 'contain'
    },
    addressText: {
        color: '#000000',
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('4.65%'),
        marginLeft: wp('2%')
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
    homeIcon: {
        width: wp('4%'),
        height: wp('4%'),
        // bottom: wp('0.2%')
        resizeMode: 'contain',
        top: Platform.OS === 'android' ? hp('-0.3%') : hp('-0.1%')
    },
    addressTypeText: {
        color: '#000000',
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('3.72%'),
        marginLeft: wp('1%'),
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
    unSelectedAddressInnerContainer: {
        borderTopWidth: 1,
        borderTopColor: "#DADADA",
        paddingTop: hp('0.6%')
    },
    addressLine: {
        color: '#3A3A3A',
        fontFamily: FONTS.poppins.regular,
        fontSize: wp('3.72%'),
    },
    addressBottomInnerView: {
        flexDirection: 'row',
        alignItems: 'center'
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
    addAddressText: {
        color: '#000000',
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('4.19%'),
        alignSelf: 'center',
        marginBottom: hp("1.2%"),
        marginTop: hp('2%')
    }
})