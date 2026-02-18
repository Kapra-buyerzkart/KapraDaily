import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import Entypo from 'react-native-vector-icons/Entypo'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { FONTS } from '../styles/typography'

const OfferCard = ({ item, onApply, onReject, appliedCode }) => {

    const isApplied = item.applyCliked;
    const showPill = isApplied && appliedCode; // coupon/gift card with a code

    return (
        <>
            {isApplied ? (
                <View style={[styles.offerContainer, {
                    borderColor: '#0CA201',
                    height: hp('9.54%'),
                    backgroundColor: '#0CA2010F',
                    alignItems: "flex-start",
                    paddingVertical: hp('0.8%')
                }]}>
                    <Image style={[styles.offerImage, {
                        top: hp('0.7%')
                    }]} source={item.image} />
                    <View style={styles.offerInnerView}>
                        <Text style={styles.offerText}>{item.name}</Text>
                        {showPill ? (
                            <View style={styles.appliedPillRow}>
                                <View style={styles.appliedPill}>
                                    <MaterialCommunityIcons name="ticket-percent" size={wp('3.2%')} color="#F25000" />
                                    <Text style={styles.appliedPillCode}>{appliedCode}</Text>
                                </View>
                                <Text style={styles.appliedSavingsText}>✓ Applied</Text>
                            </View>
                        ) : (
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={styles.offerTextTwo}>{item.content}</Text>
                                <Entypo name="chevron-small-right" size={wp('4%')} color="#424242" />
                            </View>
                        )}
                    </View>

                    <TouchableOpacity onPress={onReject} style={[styles.applyButton, {
                        borderColor: '#FF0000',
                        borderWidth: 1,
                        alignSelf: 'center',
                        marginRight: wp('2.5%')
                    }]}>
                        <Text style={[styles.applyButtonText, {
                            color: '#FF0000'
                        }]}>Remove</Text>
                    </TouchableOpacity>
                </View>
            ) : (<View style={styles.offerContainer}>
                <Image style={styles.offerImage} source={item.image} />
                <View style={styles.offerInnerView}>
                    <Text style={styles.offerText}>{item.name}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.offerTextTwo}>{item.content}</Text>
                        <Entypo name="chevron-small-right" size={wp('4%')} color="#424242" />
                    </View>
                </View>
                <TouchableOpacity onPress={onApply} style={styles.applyButton}>
                    <Text style={styles.applyButtonText}>Apply</Text>
                </TouchableOpacity>
            </View>
            )}

        </>
    )
}

export default OfferCard

const styles = StyleSheet.create({
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
    appliedPillRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp('2%'),
        marginTop: hp('0.2%'),
    },
    appliedPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF5F0',
        borderWidth: 1,
        borderColor: '#F25000',
        borderStyle: 'dashed',
        borderRadius: 4,
        paddingHorizontal: wp('2%'),
        paddingVertical: hp('0.25%'),
        gap: wp('1%'),
    },
    appliedPillCode: {
        color: '#F25000',
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('3%'),
        letterSpacing: 0.5,
    },
    appliedSavingsText: {
        color: '#0CA201',
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('2.8%'),
    },
    appliedStyle: {
        alignItems: "center",
        flexDirection: 'row',
        justifyContent: "space-between",
        paddingHorizontal: wp('4%')
    },
    closeIcon: {
        width: wp('1.86%'),
        height: wp('1.86%')
    },
    tickIcon: {
        width: wp('3.48%'),
        height: hp('1.28%')
    }
})