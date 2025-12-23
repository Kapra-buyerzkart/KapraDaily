import { View, Text, StyleSheet, Touchable, TouchableOpacity, Image, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import LinearGradient from 'react-native-linear-gradient'
import { useNavigation } from '@react-navigation/native'

export default function ProfileScreen() {
    const navigation = useNavigation()
    return (
        <SafeAreaView style={styles.mainConatiner}>
            <ScrollView>
                <LinearGradient
                    colors={['#FFE7DB', '#FFFFFF']}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                >
                    <View style={styles.topView}>
                        <View style={styles.headerView}>
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <AntDesign
                                    name={'left'}
                                    size={wp('6%')}
                                    color={'#777777'}
                                />
                            </TouchableOpacity>
                            <Text style={styles.profileHeaderText}>Profile</Text>
                            <TouchableOpacity>
                                <Image source={require('../assets/images/dots.png')} style={styles.dotsIcon} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.userView}>
                            <Image style={styles.userIcon} source={require('../assets/images/user.png')} />
                            <View style={styles.userNamePhoneView}>
                                <Text style={styles.userNameText}>Unknown Person</Text>
                                <Text style={styles.phoneNumberStyle}>9999999999</Text>
                            </View>
                            <View style={styles.bcoinContainer}>
                                <Image style={styles.bcoinImage} source={require('../assets/images/rupee.png')} />
                                <Text style={styles.bcoinText}>0.00</Text>
                            </View>
                        </View>
                    </View>
                </LinearGradient>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: "space-evenly"
                }}>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        width: wp('43.02%'),
                        height: hp('6.43%'),
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor: '#DADADA',
                        // justifyContent: "space-between"
                        paddingLeft: wp('3%')
                    }}>
                        <Image style={{
                            height: wp('6.9%'),
                            width: wp('6.9%'),
                        }} source={require('../assets/images/location_two.png')} />
                        <Text style={{
                            fontFamily: 'Poppins-Regular',
                            fontSize: wp('3.25%'),
                            marginLeft: wp('2%')
                        }}>Save Address</Text>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        width: wp('43.02%'),
                        height: hp('6.43%'),
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor: '#DADADA',
                        // justifyContent: "space-between"
                        paddingLeft: wp('3%')
                    }}>
                        <Image style={{
                            height: wp('6.9%'),
                            width: wp('6.9%'),
                        }} source={require('../assets/images/order.png')} />
                        <Text style={{
                            fontFamily: 'Poppins-Regular',
                            fontSize: wp('3.25%'),
                            marginLeft: wp('2%')
                        }}>My Order</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    mainConatiner: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    headerView: {
        // backgroundColor: '#FFEFE7',
        flexDirection: 'row',
        paddingTop: hp('4%'),
        alignItems: "center",
        paddingHorizontal: wp('4.65%'),
        justifyContent: 'space-between'
    },
    profileHeaderText: {
        color: '#000000',
        fontFamily: 'Poppins-SemiBold',
        fontSize: wp('5.1%'),
        flex: 1,
        marginLeft: wp('4%')
    },
    dotsIcon: {
        width: wp('0.7%'),
        height: hp("1.6%")
    },
    topView: {

    },
    userView: {
        flexDirection: 'row',
        paddingHorizontal: wp('5%'),
        justifyContent: 'space-between',
        marginTop: hp('3%'),
        alignItems: 'center'
    },
    userIcon: {
        height: wp('9.3%'),
        width: wp('9.3%')
    },
    userNamePhoneView: {
        flex: 1,
        marginLeft: wp('5%')
    },
    userNameText: {
        color: '#000000',
        fontFamily: 'Poppins-Medium',
        fontSize: wp('4.18%')
    },
    phoneNumberStyle: {
        fontSize: wp('2.79%'),
        fontFamily: 'Poppins-Medium',
        color: '#5C5C5C',
        marginTop: hp('0.2%')
    },
    bcoinContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#DADADA',
        borderRadius: 10,
        width: wp('16.5%'),
        height: hp('3%'),
        justifyContent: "space-between",
        paddingHorizontal: wp('1.5%')
    },
    bcoinImage: {
        width: wp('4.65%'),
        height: wp('4.65%'),
    },
    bcoinText: {
        fontFamily: 'Poppins-Regular',
        fontSize: wp('3.25%'),
        color: '#000000'
    }
})