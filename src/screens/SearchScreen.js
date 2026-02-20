import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Platform, FlatList, ActivityIndicator } from 'react-native'
import React, { useState, useEffect, useCallback, useContext } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { FONTS } from '../styles/typography'
import { useNavigation, useRoute } from '@react-navigation/native'
import useProductSearch from '../hooks/useProductSearch'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppContext } from '../context/appContext';
import ProductCard from '../components/ProductCard';

// Truncate text to a specific limit with dots
const truncateText = (text, limit = 7) => {
    if (!text) return '';
    if (text.length <= limit) return text;
    return text.substring(0, limit) + '..';
};

import StoreUnavailable from '../components/StoreUnavailable';
import LocationModal from '../components/LocationModal';

const RECENT_SEARCH_KEY = 'recent_searches_list';

const SearchScreen = () => {
    const navigation = useNavigation()
    const route = useRoute()
    const { catId, catName } = route.params || {}
    const { profile, isStoreUnavailable, storeUnavailableData } = useContext(AppContext);
    const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);

    const [currentPincodeId, setCurrentPincodeId] = useState(null);
    const [recentSearches, setRecentSearches] = useState([]);

    const {
        searchTerm,
        setSearchTerm,
        suggestions,
        loading,
        resultCount,
        setCatId,
        isGlobalFallback
    } = useProductSearch(currentPincodeId, catId);

    useEffect(() => {
        const fetchPincode = async () => {
            const stored = await AsyncStorage.getItem('pincodeAreaId');
            if (stored) {
                setCurrentPincodeId(parseInt(stored));
            } else if (profile?.pincode) {
                setCurrentPincodeId(profile.pincode);
            }
        };
        fetchPincode();
        loadRecentSearches();
    }, [profile]);

    const loadRecentSearches = async () => {
        try {
            const stored = await AsyncStorage.getItem(RECENT_SEARCH_KEY);
            if (stored) {
                setRecentSearches(JSON.parse(stored));
            }
        } catch (error) {
            console.error('Error loading recent searches:', error);
        }
    };

    const saveSearch = async (keyword) => {
        if (!keyword || keyword.trim().length === 0) return;
        const cleanKeyword = keyword.trim();

        try {
            const updated = [cleanKeyword, ...recentSearches.filter(s => s !== cleanKeyword)].slice(0, 10);
            setRecentSearches(updated);
            await AsyncStorage.setItem(RECENT_SEARCH_KEY, JSON.stringify(updated));
        } catch (error) {
            console.error('Error saving search:', error);
        }
    };

    useEffect(() => {
        if (catId) {
            setCatId(catId);
        }
    }, [catId]);

    // Save search term if results are found
    useEffect(() => {
        if (!loading && searchTerm.trim().length > 0 && resultCount > 0) {
            saveSearch(searchTerm);
        }
    }, [loading, resultCount]);

    // const { showLoader } = useContext(LoaderContext) // Loader handling moved to hook or local loading state used

    const renderItem = ({ item }) => {
        return (
            <View style={styles.productWrapper}>
                <ProductCard item={item} hideWishlist={true} />
            </View>
        )
    }

    const ListHeader = () => {
        if (searchTerm.length > 0 || recentSearches.length === 0) return null;
        return (
            <View>
                <Text style={styles.recentTitle}>Recent search</Text>
                <View style={styles.recentContainer}>
                    {recentSearches.slice(0, 8).map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.recentProduct}
                            onPress={() => setSearchTerm(item)}
                        >
                            <Text style={styles.recentProductText}>{truncateText(item, 7)}</Text>
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
                <Text style={styles.searchText}>{catName ? catName : 'Search'}</Text>
            </View>
            <View style={styles.searchContainer}>
                <Image
                    style={Platform.OS === 'ios' ? (styles.searchIcon) : ([styles.searchIcon, { bottom: hp('0.1%') }])}
                    tintColor={'#F25000'}
                    source={require('../assets/images/search_icon.png')}
                />
                <TextInput
                    placeholder='What are you looking for ?'
                    placeholderTextColor={'#222222'}
                    style={styles.searchInput}
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                    autoFocus={true}
                />
                <View style={styles.divider} />
                <Image style={styles.clipboardIcon} source={require('../assets/images/clipboard-two.png')} />
            </View>

            {isStoreUnavailable ? (
                <StoreUnavailable
                    image={storeUnavailableData.image}
                    text={storeUnavailableData.text}
                    onChangeLocation={() => setIsLocationModalVisible(true)}
                />
            ) : (
                <>
                    {searchTerm.trim().length > 0 && (
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingRight: wp('5%') }}>
                            <Text style={styles.resultText}>
                                {loading ? 'Searching...' : `Results found : ${resultCount}`}
                            </Text>
                            {isGlobalFallback && (
                                <Text style={styles.fallbackNoticeText}>
                                    Showing results from all categories
                                </Text>
                            )}
                        </View>
                    )}

                    {loading && (
                        <View style={styles.centeredLoader}>
                            <ActivityIndicator size="large" color="#F25000" />
                        </View>
                    )}

                    <FlatList
                        data={loading ? [] : suggestions}
                        keyExtractor={(item, index) => (item.productId || item.id || index).toString()}
                        renderItem={renderItem}
                        numColumns={2}
                        showsVerticalScrollIndicator={false}
                        ListHeaderComponent={ListHeader}
                        contentContainerStyle={{
                            paddingHorizontal: wp('2%'),
                            paddingTop: hp('1%'),
                            paddingBottom: hp('10%')
                        }}
                        ListEmptyComponent={!loading && (searchTerm.length > 0 || catId) && (
                            <View style={styles.emptyContainer}>
                                <Image
                                    source={require('../assets/images/noimages/noproductfound.png')}
                                    style={styles.emptyImage}
                                />
                                <Text style={styles.noResultsText}>
                                    {searchTerm.length > 0
                                        ? `No products found for "${searchTerm}"`
                                        : `No products found in ${catName || 'this category'}`
                                    }
                                </Text>
                            </View>
                        )}
                    />
                </>
            )}
            <LocationModal
                visible={isLocationModalVisible}
                onClose={() => setIsLocationModalVisible(false)}
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
        color: '#222222',
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
    fallbackNoticeText: {
        color: '#F25000',
        fontFamily: FONTS.outfit.medium,
        fontSize: wp('2.8%'),
        marginHorizontal: wp('5%'),
        marginTop: hp('0.5%')
    },
    productCardWrapper: {
        flex: 1,
        alignItems: 'center',
        marginBottom: hp('0.5%'),
    },
    columnWrapper: {
        justifyContent: 'flex-start',
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
    },
    productWrapper: {
        flex: 0.5,
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: hp('10%'),
    },
    emptyImage: {
        width: wp('50%'),
        height: wp('50%'),
        resizeMode: 'contain',
    },
    noResultsText: {
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('3.5%'),
        color: '#666666',
        textAlign: 'center',
        marginTop: hp('2%'),
        paddingHorizontal: wp('10%'),
    },
    centeredLoader: {
        position: 'absolute',
        top: hp('35%'),
        left: 0,
        right: 0,
        zIndex: 10,
    }
})