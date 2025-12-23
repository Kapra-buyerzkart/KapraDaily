import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';

export default function SelectedProducts(props) {
    const navigation = useNavigation();
    return (
        <TouchableOpacity
            onPress={() => navigation.navigate("CartScreen")}
            style={styles.mainContainer}>
            {console.log("props", props)}
            <LinearGradient colors={["#F25000", "#FF7B3A", "#F25000"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientStyle}
            >
                <View style={styles.stackContainer}>
                    {props.selectedProducts.slice(0, 3).map((item, index) => (
                        <Image
                            key={index}
                            source={item.image}
                            style={[
                                styles.productImage,
                                {
                                    marginLeft: index === 0 ? 0 : wp("-7%"), // overlap to left
                                    // zIndex: index + 1,                 // last image on top
                                },
                            ]}
                        />
                    ))}
                </View>
                <View style={styles.viewOne}>
                    <Text style={styles.viewCartText}>View cart</Text>
                    <Text style={styles.itemsText}>{props.selectedProducts.length} items</Text>
                </View>
                <Image source={require("../assets/images/right-arrow.png")} style={styles.rightArrowImageStyle} />

            </LinearGradient>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        alignSelf: "center",
        // marginTop: hp("2%"),
        // marginBottom: hp("0.7%")
    },
    stackContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: wp("2%")
    },

    productImage: {
        height: wp("9.3%"),
        width: wp("9.3%"),
        borderRadius: wp("8%"),
        borderWidth: 1,
        borderColor: "#F25000",
        // backgroundColor: "#fff",
    },
    gradientStyle: {
        width: wp("49%"),
        height: hp("6.44%"),
        borderRadius: wp("9.76%"),
        alignItems: "center",
        flexDirection: "row",
        justifyContent: 'space-between',
        // paddingLeft: wp("2.5%"),
        // paddingRight: wp("4%"),
    },
    viewOne: {
        // flex: 0.5,
        // paddingLeft: wp("2%"),
        // alignItems: "center",
        justifyContent: "center",
    },
    viewCartText: {
        fontSize: wp("3.95%"),
        color: "#FFFFFF",
        fontFamily: "Poppins-SemiBold",
        top: hp("0.2%")
    },
    viewTwo: {
        flexDirection: "row",
        alignItems: "center",
        bottom: hp("0.2%")
    },
    rightArrowImageStyle: {
        width: wp("9.3%"),
        height: wp("9.3%"),
        // bottom: hp("0.2%"),
        marginRight: wp("2%"),
    },
    itemsText: {
        color: "#FFFFFF",
        fontFamily: "Poppins-Regular",
        fontSize: wp("2.79%"),
        bottom: hp("0.2%")
    }
})