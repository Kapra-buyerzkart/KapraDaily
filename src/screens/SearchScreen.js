import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Platform, FlatList, ActivityIndicator } from 'react-native'
import React, { useState, useEffect, useCallback, useContext } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { FONTS } from '../styles/typography'
import { useNavigation } from '@react-navigation/native'
import { getProductSuggestionsApi } from '../api/productService'
import { getPincodeAreaId } from '../api/pincodeService'
import CONFIG from '../globals/config'
import { LoaderContext } from '../context/loaderContext'
import useProductSearch from '../hooks/useProductSearch'

const RECENT_SEARCH = ['Tomato', 'Potato', 'Onion', 'Mango']

const SearchScreen = () => {
    const navigation = useNavigation()
    const {
        searchTerm,
        setSearchTerm,
        suggestions,
        loading,
        resultCount
    } = useProductSearch(105); // Default pincode for now

    // const { showLoader } = useContext(LoaderContext) // Loader handling moved to hook or local loading state used


    const renderItem = ({ item }) => {
        const imageUri = item.featuredImage
            ? { uri: `${CONFIG.image_base_url}${item.featuredImage}` }
            : require('../assets/images/lays.png');

        return (
            <TouchableOpacity
                style={styles.productContainer}
                onPress={() => navigation.navigate('ProductDetailsScreen', { productId: item.productId })}
            >
                <Image style={styles.productImage} source={imageUri} />
                <View style={styles.productInnerView}>
                    <Text style={styles.productName}>{item.prName || item.name}</Text>
                    <Text style={[styles.productName, { color: '#616161' }]}>
                        {item.brandName || item.brand || 'Kapra Daily'}
                    </Text>
                </View>
                <Image style={styles.rightArrowIcon} source={require('../assets/images/right-arrow-two.png')} />
            </TouchableOpacity>
        )
    }

    const ListFooter = () => {
        if (searchTerm.length > 0) return null;
        return (
            <View>
                <Text style={styles.recentTitle}>Recent search</Text>
                <View style={styles.recentContainer}>
                    {RECENT_SEARCH.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.recentProduct}
                            onPress={() => setSearchTerm(item)}
                        >
                            <Text style={styles.recentProductText}>{item}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.mainContainer}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image style={styles.leftArrowIcon} source={require('../assets/images/left_arrow.png')} />
                </TouchableOpacity>
                <Text style={styles.searchText}>Search</Text>
            </View>
            <View style={styles.searchContainer}>
                <Image
                    style={Platform.OS === 'ios' ? (styles.searchIcon) : ([styles.searchIcon, { bottom: hp('0.1%') }])}
                    tintColor={'#F25000'}
                    source={require('../assets/images/search_icon.png')}
                />
                <TextInput
                    placeholder='What are you looking for ?'
                    style={styles.searchInput}
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                    autoFocus={true}
                />
                <View style={styles.divider} />
                <Image style={styles.clipboardIcon} source={require('../assets/images/clipboard-two.png')} />
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingRight: wp('5%') }}>
                <Text style={styles.resultText}>Results found : {resultCount}</Text>
            </View>

            <FlatList
                data={suggestions}
                keyExtractor={(item, index) => (item.productId || index).toString()}
                renderItem={renderItem}
                ListFooterComponent={ListFooter}
                contentContainerStyle={{ paddingBottom: hp('5%') }}
                ListEmptyComponent={!loading && searchTerm.length > 0 && (
                    <Text style={[styles.resultText, { textAlign: 'center', marginTop: hp('5%'), fontSize: wp('3.5%') }]}>
                        No products found for "{searchTerm}"
                    </Text>
                )}
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