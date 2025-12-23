import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'

const OfferCard = (props) => {

    const [addClicked, setAddClicked] = useState(true)

    return (
        <View style={styles.offerView}>
            <Image style={styles.offerImage} source={props.image} />
            <View style={styles.offerInnerView}>
                <Text style={styles.offerText}>{props.name}</Text>
                <Text style={[styles.offerText, {
                    color: '#424242',
                    marginTop: hp('0.1%')
                }]}>{props.content}</Text>
            </View>
            {addClicked ? (
                <TouchableOpacity onPress={() => setAddClicked(!addClicked)}
                    style={styles.addButtonContainer}>
                    <Text style={styles.addButtonText}>ADD</Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity
                    onPress={() => setAddClicked(!addClicked)}
                    style={styles.addButtonContainer}>
                    <Text style={[styles.addButtonText, {
                        textDecorationLine: "underline"
                    }]}>Remove</Text>
                </TouchableOpacity>
            )}
        </View>
    )
}

export default OfferCard

const styles = StyleSheet.create({
    offerView: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#DADADA',
        alignItems: 'center',
        marginHorizontal: wp('4.5%'),
        borderRadius: wp('2.3%'),
        padding: wp('2%'),
        justifyContent: 'space-between',
        marginBottom: hp('1%')
    },
    offerImage: {
        height: wp('9.3%'),
        width: wp('9.3%')
    },
    offerInnerView: {
        marginLeft: wp('2%'),
        flex: 1
    },
    offerText: {
        fontFamily: 'Poppins-Regular',
        fontSize: wp('3.25%'),
        color: '#000000'
    },
    addButtonContainer: {
        borderWidth: 1,
        borderColor: '#F250004D',
        borderRadius: wp('1.4%'),
        width: wp('25.1%'),
        height: hp('3.1%'),
        justifyContent: "center",
        alignItems: 'center',
    },
    addButtonText: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: wp('3%'),
        color: '#F25000',
    }
})