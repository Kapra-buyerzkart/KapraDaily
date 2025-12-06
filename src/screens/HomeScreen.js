import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Image, TextInput } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/Ionicons';
import Svg, { Defs, RadialGradient, Stop, Path } from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';

const HomeScreen = () => {

    const GradientUserIcon = ({ size }) => {
        return (
            <Svg width={size} height={size} viewBox="0 0 24 24">

                <Defs>
                    <RadialGradient
                        id="grad"
                        cx="50%" cy="50%"
                        r="60%"
                    >
                        <Stop offset="0%" stopColor="#4C4C4C" />
                        <Stop offset="100%" stopColor="#000000" />
                    </RadialGradient>
                </Defs>

                {/* Fills the user icon with the gradient */}
                <Path
                    fill="url(#grad)"
                    d="M12 12c2.76 0 5-2.46 5-5.5S14.76 1 12 1 7 3.46 7 6.5 9.24 12 12 12zm0 2c-3.33 0-10 1.67-10 5v4h20v-4c0-3.33-6.67-5-10-5z"
                />
            </Svg>
        );
    };

    return (
        <SafeAreaView>
            {/* <ImageBackground
                source={require('../assets/images/header-bg.jpg')}
                style={styles.headerBackground}
                imageStyle={styles.headerImageStyle}
            > */}
            <View style={styles.headerMainView}>
                <Image
                    source={require('../assets/images/curves.png')}
                    style={styles.topLeftCurve}
                />
                <Image
                    source={require('../assets/images/bear2.png')}
                    style={styles.bear}
                />
                <View style={styles.headerViewOne}>
                    <View>
                        <Text style={styles.timeText}>20 min</Text>
                        <TouchableOpacity style={styles.addressView}>
                            <Text style={styles.addressText}
                                numberOfLines={1}
                                ellipsizeMode="tail"
                            >Vennala: Chakkarapparambuabcdefg</Text>
                            <Entypo name={"chevron-right"} size={wp('3.6%')} color={"#FFFFFF"} />
                        </TouchableOpacity>
                    </View>
                    {/* <View>
                        <TouchableOpacity style={{
                            backgroundColor: "#FFFFFF"
                        }}>
                            <FontAwesome name="user" size={wp('8%')} color={'#000000'} />
                        </TouchableOpacity>
                    </View> */}

                    {/* <View style={{
                        // padding: 
                    }}> */}
                    {/* <View>
                        <View>
                            <Text style={{
                                color: "#FFBA33",
                                fontFamily: "Poppins-Bold",
                                fontSize: wp('3%')
                            }}>10.0 B</Text>
                        </View>
                    </View> */}
                    <View style={styles.container}>

                        {/* Coin */}
                        <LinearGradient
                            colors={['#3A2400', '#3A2400', '#A06200', '#A06200']}
                            locations={[0, 0.3, 0.7, 1]}
                            start={{ x: 0.5, y: 0 }}
                            end={{ x: 0.5, y: 1 }}
                            style={styles.coin}
                        >
                            {/* <Text style={styles.coinSymbol}>₹</Text> */}
                            <MaterialIcons name={'currency-rupee'} size={wp('4%')} color={'#FFD98F'} />
                        </LinearGradient>

                        {/* Badge */}
                        <LinearGradient
                            colors={['#311C00', '#000000']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.badge}
                        >
                            <Text style={styles.badgeText}>10.0 B</Text>
                        </LinearGradient>

                    </View>
                    <TouchableOpacity style={styles.profileIconView}>
                        {/* <FontAwesome name="user" size={wp('9%')} color="#000000" /> */}
                        <GradientUserIcon size={wp('6%')} />
                    </TouchableOpacity>
                    {/* </View> */}

                </View>
                <View style={styles.searchContainer}>
                    {/* <Icon name="search-outline" size={wp('5%')} color="#666" />

                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search product"
                        placeholderTextColor="#888"
                    />

                    <Icon name="clipboard-outline" size={wp('5%')} color="#666" /> */}
                    <Feather name="search" color={"#8F8F8F"} size={wp("6%")} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search product"
                        placeholderTextColor="#3A3A3A"
                    />
                    <View style={styles.divider} />
                    <Ionicons name="clipboard-outline" color={"#8F8F8F"} size={wp("6%")} style={{
                        marginLeft: wp('4%')
                    }}/>
                </View>
            </View>
            {/* </ImageBackground> */}
        </SafeAreaView>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    headerMainView: {
        backgroundColor: "#502E59",
        height: hp('38%'), // responsive height
        borderBottomLeftRadius: wp('10%'),
        borderBottomRightRadius: wp('10%'),
        overflow: "hidden"
    },
    topLeftCurve: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: wp('33%'),      // adjust based on your SVG size
        height: wp('33%'),
        resizeMode: 'contain',
    },
    headerBackground: {
        width: wp('100%'),
        height: hp('38%'), // responsive height
        // paddingHorizontal: wp('5%'),
    },

    headerImageStyle: {
        resizeMode: 'cover',
        borderBottomLeftRadius: wp('10%'),
        borderBottomRightRadius: wp('10%'),
    },
    headerViewOne: {
        flexDirection: "row",
        marginTop: hp('5%'),
        marginHorizontal: wp('6.9%'),
        justifyContent: "space-between",
        // marginRight: wp('4%')
    },
    timeText: {
        fontFamily: "Poppins-ExtraBold",
        color: "#FFFFFF",
        fontSize: wp('6%'),
    },
    addressView: {
        flexDirection: "row",
        alignItems: 'center',
    },
    addressText: {
        color: "#FFFFFF",
        fontSize: wp('3.3%'),
        fontFamily: "Poppins-Medium",
        maxWidth: wp('53%'),
    },
    container: {
        alignItems: 'center',
        width: wp('20%'),
        // marginTop: hp('1%'),
    },
    coin: {
        width: wp('7%'),   // ~30px
        height: wp('7%'),
        borderRadius: wp('4%'),
        justifyContent: 'center',
        alignItems: 'center',

        // drop shadow
        // shadowColor: '#000',
        // shadowOpacity: 0.4,
        // shadowRadius: 4,
        // shadowOffset: { width: 0, height: 2 },
        // elevation: 6,
    },
    coinSymbol: {
        color: '#FFD98F',
        fontSize: wp('4%'),
        fontFamily: 'Poppins-Bold',
    },
    badge: {
        width: wp('14%'),     // ~49px
        height: hp('2.1%'),   // ~16px
        borderRadius: wp('4%'),
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -hp('1%'), // overlap upward

        // shadow like figma
        shadowColor: '#744700',
        shadowOpacity: 0.5,
        shadowRadius: 2,
        shadowOffset: { width: 0, height: -1 },
        elevation: 3,
    },
    badgeText: {
        color: '#F4C05D',     // gold
        fontSize: wp('3%'),
        fontFamily: 'Poppins-Bold',
    },
    profileIconView: {
        width: wp('8.5%'),
        height: wp('8.5%'),
        borderRadius: wp('7.5%'), // perfect circle
        // borderWidth: 2,
        // borderColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF'
    },
    bear: {
        position: 'absolute',
        // bottom: -hp('1.7%'),  
        // right: -wp('1%'),    
        bottom: 0,
        right: 0,
        width: wp('33%'),
        height: wp('33%'),
        resizeMode: "cover",
    },
    searchContainer: {
        marginTop: hp('1.7%'),
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: wp('2.5%'),
        paddingHorizontal: wp('4%'),
        height: hp('5.4%'),
        // justifyContent: 'center',
        marginHorizontal: wp('4.7%'),
        // paddingVertical: hp('0.6%')
    },

    searchInput: {
        flex: 1,
        fontSize: wp('3.8%'),
        marginHorizontal: wp('1.5%'),
        color: '#000000',
        fontFamily: 'Poppins-Light',
        // backgroundColor:"red",
        // borderRightWidth: 1,
        // borderRightColor: "#8F8F8F",
        // backgroundColor:'red'
        // lineHeight: wp('3.8%'),
    },
    divider: {
        width: 1,
        height: hp('3.5%'),  // adjust for smaller border height
        backgroundColor: '#8F8F8F',
        marginLeft: wp('2%'),
    }
})