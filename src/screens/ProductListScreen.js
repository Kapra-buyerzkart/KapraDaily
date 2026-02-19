import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Image } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Feather from 'react-native-vector-icons/Feather'
import { useNavigation, useRoute } from '@react-navigation/native'
import ProductCard from '../components/ProductCard'
import SelectedProducts from '../components/SelectedProducts'
import { FONTS } from '../styles/typography'
import StoreUnavailable from '../components/StoreUnavailable'
import LocationModal from '../components/LocationModal'
import { AppContext } from '../context/appContext'
import { useContext } from 'react'

const ProductListScreen = () => {
    const navigation = useNavigation()
    const route = useRoute()
    const { title, products } = route.params || { title: 'Products', products: [] }

    const [searchText, setSearchText] = useState('')
    const { isStoreUnavailable, storeUnavailableData } = useContext(AppContext)
    const [isLocationModalVisible, setIsLocationModalVisible] = useState(false)

    const filteredProducts = products.filter(item =>
        (item.prName || item.name || '').toLowerCase().includes(searchText.toLowerCase())
    )

    return (
        <SafeAreaView style={styles.mainContainer} edges={['top', 'left', 'right']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={wp('6%')} color="#000000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{title}</Text>
            </View>

            {/* Search Bar */}
            <View style={styles.searchSection}>
                <View style={styles.searchContainer}>
                    <Feather name="search" color={"#2D0F0D"} size={wp("5%")} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search in this list"
                        placeholderTextColor="#767676"
                        value={searchText}
                        onChangeText={setSearchText}
                    />
                    {searchText.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchText('')}>
                            <Ionicons name="close-circle" size={wp('5%')} color="#CCCCCC" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {isStoreUnavailable ? (
                <StoreUnavailable
                    image={storeUnavailableData.image}
                    text={storeUnavailableData.text}
                    onChangeLocation={() => setIsLocationModalVisible(true)}
                />
            ) : (
                <FlatList
                    data={filteredProducts}
                    keyExtractor={(item) => (item.productId || item.id || Math.random()).toString()}
                    renderItem={({ item }) => (
                        <View style={styles.productWrapper}>
                            <ProductCard item={item} />
                        </View>
                    )}
                    numColumns={2}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Image
                                source={require('../assets/images/noimages/noproductfound.png')}
                                style={styles.emptyImage}
                            />
                            {/* <Text style={styles.emptyText}>No products found</Text> */}
                        </View>
                    }
                />
            )}

            {/* Floating Selection Bar */}
            <View style={styles.floatingContainer}>
                <SelectedProducts />
            </View>
            <LocationModal
                visible={isLocationModalVisible}
                onClose={() => setIsLocationModalVisible(false)}
            />
        </SafeAreaView>
    )
}

export default ProductListScreen

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: wp('4%'),
        paddingVertical: hp('1.5%'),
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
    },
    backButton: {
        padding: wp('1%'),
    },
    headerTitle: {
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('4.5%'),
        color: '#000000',
        marginLeft: wp('3%'),
    },
    searchSection: {
        paddingHorizontal: wp('4%'),
        paddingVertical: hp('1%'),
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9F9F9',
        borderRadius: wp('2%'),
        paddingHorizontal: wp('3%'),
        height: hp('5%'),
        borderWidth: 1,
        borderColor: "#E3E3E3"
    },
    searchInput: {
        flex: 1,
        fontSize: wp('3.5%'),
        color: '#000000',
        fontFamily: FONTS.outfit.regular,
        marginLeft: wp('2%'),
    },
    listContent: {
        paddingHorizontal: wp('2%'),
        paddingTop: hp('1%'),
        paddingBottom: hp('10%'),
    },
    productWrapper: {
        flex: 0.5,
        alignItems: 'center',
    },
    emptyContainer: {
        marginTop: hp('20%'),
        alignItems: 'center',
    },
    emptyText: {
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('4%'),
        color: '#999999',
    },
    floatingContainer: {
        position: "absolute",
        bottom: hp("1%"),
        left: 0,
        right: 0,
        alignItems: "center",
    },
})
