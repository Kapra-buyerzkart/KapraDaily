import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { FONTS } from '../styles/typography'

const OfferCard = ({ item, onApply, onReject }) => {

    const [addClicked, setAddClicked] = useState(true)
    // console.log('item.applyClicked', item)
    return (
        <>{
            item.applyCliked ? (
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
                        <Text style={styles.offerTextTwo}>{item.content}</Text>
                    </View>
                    <View style={{
                        height: hp('7.3%'),
                        justifyContent: 'space-between'
                    }}>
                        <TouchableOpacity onPress={onReject} style={[styles.applyButton, {
                            flexDirection: 'row',
                            justifyContent: "space-between",
                            paddingHorizontal: wp('4%')
                        }]}>
                            <Image style={styles.closeIcon} source={require('../assets/images/close.png')} />
                            <Text style={[styles.applyButtonText, {
                                color: '#FF0000'
                            }]}>Rejected</Text>
                        </TouchableOpacity>
                        <View style={styles.appliedStyle}>
                            <Image style={styles.tickIcon} source={require('../assets/images/tick.png')} />
                            <Text style={[styles.applyButtonText, {
                                color: '#0CA201'
                            }]}>Applied</Text>
                        </View>
                    </View>
                </View>
            ) : (<View style={styles.offerContainer}>
                <Image style={styles.offerImage} source={item.image} />
                <View style={styles.offerInnerView}>
                    <Text style={styles.offerText}>{item.name}</Text>
                    <Text style={styles.offerTextTwo}>{item.content}</Text>
                </View>
                <TouchableOpacity onPress={onApply} style={styles.applyButton}>
                    <Text style={styles.applyButtonText}>Apply</Text>
                </TouchableOpacity>
            </View>
            )
        }

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
    appliedStyle: {
        // width: wp('25.1%'),
        // height: hp('3.86%'),
        // backgroundColor: '#FFFFFF',
        // borderRadius: wp('2.3%'),
        // justifyContent: "center",
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