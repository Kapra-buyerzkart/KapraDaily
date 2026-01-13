import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Platform, FlatList } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { FONTS } from '../styles/typography'
import { useNavigation } from '@react-navigation/native'

const DUMMY_RESULTS = Array(4).fill({
    name: 'BBQ Flavored Potato Chips.',
    brand: "Lay’s",
    image: require('../assets/images/lays.png'),
})

const RECENT_SEARCH = ['Tomato', 'Tomato', 'Tomato', 'Tomato']

const renderItem = ({ item }) => {
    return (
        <View style={styles.productContainer}>
            <Image style={styles.productImage} source={require('../assets/images/lays.png')} />
            <View style={styles.productInnerView}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={[styles.productName, {
                    color: '#616161'
                }]}>{item.brand}</Text>
            </View>
            <TouchableOpacity>
                <Image style={styles.rightArrowIcon} source={require('../assets/images/right-arrow-two.png')} />
            </TouchableOpacity>
        </View>
    )
}

const ListFooter = () => {
    return (
        <View>
            <TouchableOpacity style={styles.viewallButton}>
                <Text style={styles.viewallText}>View All</Text>
            </TouchableOpacity>
            <Text style={styles.recentTitle}>Recent search</Text>
            <View style={styles.recentContainer}>
                {RECENT_SEARCH.map((item, index) => (
                    <TouchableOpacity key={index} style={styles.recentProduct}>
                        <Text style={styles.recentProductText}>Tomato</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    )
}

const SearchScreen = () => {
    const navigation = useNavigation()
    return (
        <SafeAreaView style={styles.mainContainer}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image style={styles.leftArrowIcon} source={require('../assets/images/left_arrow.png')} />
                </TouchableOpacity>
                <Text style={styles.searchText}>Search</Text>
            </View>
            <View style={styles.searchContainer}>
                <Image style={Platform.OS === 'ios' ? (styles.searchIcon) : (
                    [styles.searchIcon, {
                        bottom: hp('0.1%')
                    }]
                )} tintColor={'#F25000'} source={require('../assets/images/search_icon.png')} />
                <TextInput
                    placeholder='What are you looking for ?'
                    style={styles.searchInput}
                />
                <View
                    style={styles.divider}
                />
                <Image style={styles.clipboardIcon} source={require('../assets/images/clipboard-two.png')} />
            </View>
            <Text style={styles.resultText}>Results found : 12</Text>
            <FlatList
                data={DUMMY_RESULTS}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
                ListFooterComponent={ListFooter}
            />
        </SafeAreaView>
    )
}

export default SearchScreen

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "FFFFFF",
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: hp('1%'),
        paddingHorizontal: wp('4.65%')
    },
    leftArrowIcon: {
        width: wp('2.33%'),
        height: hp('2.04%'),
        resizeMode: 'contain'
    },
    searchText: {
        color: '#000000',
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('4.65%'),
        marginLeft: wp('8%')
    },
    searchContainer: {
        backgroundColor: '#DADADA',
        width: wp('90.7%'),
        height: hp('5.36%'),
        borderRadius: wp('2.33%'),
        alignSelf: 'center',
        marginTop: hp('2.7%'),
        flexDirection: 'row',
        alignItems: "center",
        paddingHorizontal: wp('4.65%')
    },
    searchIcon: {
        width: wp('4.19%'),
        height: wp('4.19%')
    },
    searchInput: {
        fontFamily: FONTS.poppins.light,
        fontSize: wp('3.72%'),
        color: '#3A3A3A',
        marginLeft: wp('2%'),
        flex: 1
    },
    divider: {
        height: hp('3.65%'),
        width: 1,
        backgroundColor: '#8F8F8F'
    },
    clipboardIcon: {
        width: wp('4.65%'),
        height: wp('4.65%'),
        marginLeft: wp('3.5%')
    },
    resultText: {
        color: '#000000',
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('2.79%'),
        marginHorizontal: wp('5%'),
        marginTop: hp('1.5%')
    },
    productContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: wp('5%'),
        borderBottomWidth: 1,
        borderBottomColor: '#DADADA'
    },
    productImage: {
        width: wp('9.3%'),
        height: hp('9.3%'),
        resizeMode: 'contain'
    },
    productInnerView: {
        flex: 1,
        marginLeft: wp('6%')
    },
    productName: {
        fontFamily: FONTS.poppins.regular,
        fontSize: wp('3.02%'),
        color: '#000000'
    },
    rightArrowIcon: {
        width: wp('5.12%'),
        height: hp('5.12%'),
        resizeMode: 'contain'
    },
    viewallText: {
        fontSize: wp('2.79%'),
        color: '#616161',
        fontFamily: FONTS.poppins.medium,
        textDecorationLine: 'underline'
    },
    viewallButton: {
        alignSelf: 'center',
        marginTop: hp('2%')
    },
    recentTitle: {
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('2.79%'),
        color: '#000000',
        marginLeft: wp('5%'),
        marginTop: hp('4%')
    },
    recentProduct: {
        width: wp('20.23%'),
        height: hp('2.57%'),
        borderWidth: 1,
        borderColor: '#DADADA',
        borderRadius: wp('2.33%'),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: wp('2%'),
        marginBottom: hp('1.2%')
    },
    recentProductText: {
        fontFamily: FONTS.poppins.regular,
        fontSize: wp('2.79%'),
        color: '#000000'
    },
    recentContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: wp('5%'),
        marginTop: hp('1%')
    }
})