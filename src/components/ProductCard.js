import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';


export default function ProductCard(props) {
    return (
        <TouchableOpacity style={styles.productCard}>
            <View style={styles.productCardViewOne}>
                <EvilIcons name={"heart"} size={wp("7%")} />
                <Text style={styles.btokenText}>Upto 1B Token</Text>
                <View style={styles.plusIconView}>
                    <Entypo name={"plus"} color={"#FFFFFF"} size={wp("3.8%")} />
                </View>
            </View>
            <View style={styles.productCardViewTwo}>
                <Image source={props.item.img} style={styles.productCardImage} />
            </View>

            <View style={styles.productCardViewThree}>
                <View>
                    <Text style={styles.offerText}>17% OFF</Text>
                </View>

                <View>
                    <View style={styles.productCardViewFour}>
                        <Text style={styles.mrpText}>MRP </Text>
                        <MaterialIcons name={'currency-rupee'} color={'#777777'} size={wp("2.5%")} style={{
                            bottom: hp("0.1%")
                        }} />
                        <Text style={[styles.mrpText, {
                            textDecorationLine: "line-through",
                            textDecorationColor: "#777777"
                        }]}>394</Text>

                    </View>
                    <View style={styles.priceView}>
                        <MaterialIcons name={'currency-rupee'} color={'#0CA201'} size={wp("3.7%")} style={{
                            bottom: hp("0.15%")
                        }} />
                        <Text style={styles.priceText}>324</Text>
                    </View>
                </View>
            </View>
            <View style={{
                // alignSelf: "center"
            }}>
                <Text style={styles.productNameText}>Lorem lpsum is simply dummy text</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    productCard: {
        width: wp('34.7%'),
        height: hp('24.2%'),
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: wp('1.9%'),
        marginRight: wp('3.8%'),
        shadowColor: '#000000',
        shadowOpacity: 0.10,
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 4,
        elevation: 3,
        marginTop: hp("1.5%"),
        // alignItems:'center'
        // width: wp('34%'),
        // height: hp('23%'),
        // backgroundColor: '#FFFFFF',
        // borderRadius: 20,
        // padding: wp('3%'),
        // marginRight: wp('4%'),
        // shadowColor: '#000',
        // shadowOpacity: 0.10,
        // shadowOffset: { width: 0, height: 2 },
        // shadowRadius: 4,
        // elevation: 3,
    },
    productCardViewOne: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        // backgroundColor: "yellow",
    },
    btokenText: {
        fontFamily: "Outfit-Regular",
        fontSize: wp("2.3%"),
        color: "#5E3568"
    },
    plusIconView: {
        backgroundColor: "#F04B1B",
        padding: wp("1%"),
        borderRadius: 100
    },
    productCardViewTwo: {
        // backgroundColor:"blue",
        alignItems: "center"
    },
    productCardImage: {
        width: wp("24.65%"),
        height: wp("23.25%")
    },
    productCardViewThree: {
        flexDirection: "row",
        justifyContent: "space-between",
        // backgroundColor: "yellow",
        alignItems: "center"
    },
    offerText: {
        color: "#F04B1B",
        fontSize: wp("2.5%"),
        fontFamily: "Outfit-SemiBold"
    },
    productCardViewFour: {
        flexDirection: "row",
        alignItems: "center"
    },
    mrpText: {
        fontFamily: "Poppins-Light",
        fontSize: wp("2.5%"),
        color: "#777777"
    },
    priceView: {
        flexDirection: "row",
        alignItems: "center",
        borderColor: "#0CA201",
        borderWidth: 1,
        borderRadius: 8,
        padding: wp("0.5%")
    },
    priceText: {
        fontFamily: "Poppins-SemiBold",
        fontSize: wp("3.7%"),
        color: "#0CA201"
    },
    productNameText: {
        fontFamily: "Outfit-Light",
        fontSize: wp("3.25%"),
        color: "#000000",
        textAlign: "center",
        marginTop: hp("0.5%")
    },
})