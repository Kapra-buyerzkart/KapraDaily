import { View, Text, TouchableOpacity, FlatList, Image, TextInput, ScrollView, ActivityIndicator } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect, useContext } from 'react'
import { useRoute } from '@react-navigation/native';
import { StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ProductCard from '../components/ProductCard';
import SelectedProducts from '../components/SelectedProducts';
import LinearGradient from 'react-native-linear-gradient';
import { FONTS } from '../styles/typography'
import { getCategoriesApi } from '../api/categoryService';
import { searchProductsApi } from '../api/productService';
import CONFIG from '../globals/config';
import FilterSortModal from '../components/FilterSortModal';
import { useCart } from '../context/CartContext';
import { LoaderContext } from '../context/loaderContext';
import { useDebounce } from '../hooks/useDebounce';
import { AppContext } from '../context/appContext';


const categories = [
    { id: "1", name: 'Fresh Vegetables', image: require("../assets/images/fv.png") },
    { id: "2", name: 'Fresh Fruits', image: require("../assets/images/ff.png") },
    { id: "3", name: 'Exotics', image: require("../assets/images/exotics.png") },
    { id: "4", name: 'Leafy', image: require("../assets/images/leafy.png") },
    { id: "5", name: 'Flowers & Leaves', image: require("../assets/images/fl.png") },
    { id: "6", name: 'Freshly Cut', image: require("../assets/images/fc.png") },
];

const categoryContent = {
    "1": [
        { id: "1", name: "Tomato", img: require('../assets/images/products/tomato.png'), price: "₹324" },
        { id: "2", name: "Green Chilli", img: require('../assets/images/products/chilli.png'), price: "₹324" },
        { id: "3", name: "Tomato", img: require('../assets/images/products/tomato.png'), price: "₹324" },
        { id: "4", name: "Green Chilli", img: require('../assets/images/products/chilli.png'), price: "₹324" },
        { id: "5", name: "Tomato", img: require('../assets/images/products/tomato.png'), price: "₹324" },
    ],
    "2": [
        { id: "1", name: "Tomato", img: require('../assets/images/products/tomato.png'), price: "₹324" },
        { id: "2", name: "Green Chilli", img: require('../assets/images/products/chilli.png'), price: "₹324" },
        { id: "3", name: "Tomato", img: require('../assets/images/products/tomato.png'), price: "₹324" },
        { id: "4", name: "Green Chilli", img: require('../assets/images/products/chilli.png'), price: "₹324" },
        { id: "5", name: "Tomato", img: require('../assets/images/products/tomato.png'), price: "₹324" },
    ],
    "3": [
        { id: "1", name: "Tomato", img: require('../assets/images/products/tomato.png'), price: "₹324" },
        { id: "2", name: "Green Chilli", img: require('../assets/images/products/chilli.png'), price: "₹324" },
        { id: "3", name: "Tomato", img: require('../assets/images/products/tomato.png'), price: "₹324" },
        { id: "4", name: "Green Chilli", img: require('../assets/images/products/chilli.png'), price: "₹324" },
        { id: "5", name: "Tomato", img: require('../assets/images/products/tomato.png'), price: "₹324" },
    ],
};

const selectedProducts = [
    { id: "1", image: require('../assets/images/product1.png') },
    { id: "2", image: require('../assets/images/product2.png') },
    { id: "3", image: require('../assets/images/product3.png') },
    { id: "4", image: require('../assets/images/product1.png') },
    { id: "5", image: require('../assets/images/product2.png') },
    { id: "6", image: require('../assets/images/product3.png') },
];

const dummyProducts = [
    { id: "1", image: require('../assets/images/mango.jpg'), name: "Mango" },
    { id: "2", image: require('../assets/images/apple.jpg'), name: "Apple" },
    { id: "3", image: require('../assets/images/mango.jpg'), name: "Mango" },
    { id: "4", image: require('../assets/images/apple.jpg'), name: "Apple" },
    { id: "5", image: require('../assets/images/mango.jpg'), name: "Mango" },
    { id: "6", image: require('../assets/images/apple.jpg'), name: "Apple" },
]


export default function CategoriesScreen() {
    const route = useRoute();
    const { catId } = route.params || {};
    const [selectedId, setSelectedId] = useState(catId?.toString() || "1");
    const [selectedSubCatId, setSelectedSubCatId] = useState(null);
    const [categoriesList, setCategoriesList] = useState([]);
    const [subCategoriesList, setSubCategoriesList] = useState([]);
    const [productsList, setProductsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState("");
    const [pincodeAreaId, setPincodeAreaId] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [isFilterSortModalVisible, setIsFilterSortModalVisible] = useState(false);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const { showLoader } = useContext(LoaderContext);
    const { profile } = useContext(AppContext);

    const [filters, setFilters] = useState({
        sortBy: 'relevance',
        priceMin: 0,
        priceMax: 5000
    });

    const debouncedSearchText = useDebounce(searchText, 500);

    useEffect(() => {
        const initializeLocation = async () => {
            try {
                const storedPincodeAreaId = await AsyncStorage.getItem('pincodeAreaId');
                if (storedPincodeAreaId) {
                    setPincodeAreaId(parseInt(storedPincodeAreaId));
                } else if (profile?.pincode) {
                    setPincodeAreaId(profile.pincode);
                }
            } catch (error) {
                console.error('Error fetching pincodeAreaId in CategoriesScreen:', error);
            }
        };

        initializeLocation();
        fetchCategories();
    }, []);

    useEffect(() => {
        if (catId) {
            setSelectedId(catId.toString());
        }
    }, [catId]);

    useEffect(() => {
        if (selectedId) {
            fetchSubCategories(selectedId);
        }
    }, [selectedId]);

    useEffect(() => {
        const catIdToFetch = selectedSubCatId || selectedId;
        if (catIdToFetch) {
            console.log('Fetching products for:', catIdToFetch, 'with search:', debouncedSearchText);
            fetchProducts(catIdToFetch);
        }
    }, [selectedSubCatId, debouncedSearchText, selectedId, filters]);

    const fetchProducts = async (catId) => {
        try {
            setLoadingProducts(true);
            const payload = {
                pincodeAreaId: pincodeAreaId,
                prName: debouncedSearchText,
                catId: parseInt(catId),
                priceMin: filters.priceMin,
                priceMax: filters.priceMax,
                filterValues: null,
                sortBy: filters.sortBy,
                pageNumber: 1, // Reset to page 1 on new sort/filter
                pageSize: pageSize
            };
            console.log('Fetching Products Payload:', JSON.stringify(payload, null, 2));
            const response = await searchProductsApi(payload);
            console.log('Products Response:', JSON.stringify(response, null, 2));
            if (response && response.success && response.data && response.data.items) {
                setProductsList(response.data.items);
                setPageNumber(1);
            } else {
                setProductsList([]);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            setProductsList([]);
        } finally {
            setLoadingProducts(false);
        }
    };

    const fetchCategories = async () => {
        try {
            setLoading(true);
            showLoader(true);
            const response = await getCategoriesApi(1); // Fetch main categories
            console.log('Categories Response:', JSON.stringify(response, null, 2));
            if (response && response.success && response.data && response.data.items) {
                setCategoriesList(response.data.items);
                if (response.data.items.length > 0) {
                    setSelectedId(response.data.items[0]?.catId?.toString());
                }
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
            showLoader(false);
        }
    };

    const fetchSubCategories = async (parentId) => {
        try {
            showLoader(true);
            const response = await getCategoriesApi(parentId);
            console.log('SubCategories Response:', JSON.stringify(response, null, 2));
            if (response && response.success && response.data && response.data.items) {
                setSubCategoriesList(response.data.items);
                if (response.data.items.length > 0) {
                    setSelectedSubCatId(response.data.items[0]?.catId?.toString());
                } else {
                    setSelectedSubCatId(null);
                }
            } else {
                setSubCategoriesList([]);
            }
        } catch (error) {
            console.error('Error fetching subcategories:', error);
            setSubCategoriesList([]);
        } finally {
            showLoader(false);
        }
    };

    const getImageUrl = (imagePath) => {
        if (!imagePath) return require("../assets/images/fv.png");
        if (imagePath.startsWith('http')) return { uri: imagePath };
        return { uri: `${CONFIG.image_base_url}/${imagePath}`.replace(/([^:]\/)\/+/g, "$1") }; // Simple clean of double slashes
    };

    const categoryName = categoriesList.find(cat => cat.catId.toString() === selectedId)?.catName || "";

    const renderItem = ({ item }) => {
        const isSelected = item?.catId?.toString() === selectedId;

        return (
            <TouchableOpacity
                onPress={() => setSelectedId(item?.catId?.toString())}
                activeOpacity={0.8}
                style={{
                    marginBottom: hp("1.7%"),
                    marginLeft: wp("1.7%")
                }}
            >
                {isSelected ? (<LinearGradient
                    colors={["#FFFFFF", "#FFDB99"]}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 0, y: 0 }}
                    // style={[styles.card, isSelected && styles.activeCard]}
                    style={styles.activeCard}
                >
                    <Image
                        source={getImageUrl(item.imageUrl)}
                        style={styles.image}
                        resizeMode="contain"
                    />


                </LinearGradient>
                ) : (<View
                    style={styles.card}
                >
                    <Image
                        source={getImageUrl(item.imageUrl)}
                        style={styles.image}
                        resizeMode="contain"
                    />

                </View>
                )}
                <Text style={isSelected ? styles.title : [styles.title, {
                    color: "#666666", marginTop: 0
                }]} numberOfLines={2}>
                    {item.catName || item.name}
                </Text>

            </TouchableOpacity>
        );
    };

    const renderSubCategory = ({ item }) => {
        const isSelected = item.catId.toString() === selectedSubCatId;

        return (
            <>
                {isSelected ? (<TouchableOpacity onPress={() => setSelectedSubCatId(item.catId.toString())} style={styles.selectedSubCategory}>
                    <View style={styles.selectedSubCategoryImageView}>
                        <Image style={styles.selectedSubCategoryImage} source={getImageUrl(item.imageUrl)} />
                    </View>
                    <Text style={styles.selectedSubCatText}>{item.catName}</Text>
                </TouchableOpacity>) : (
                    <TouchableOpacity onPress={() => setSelectedSubCatId(item.catId.toString())} style={[styles.selectedSubCategory, {
                        justifyContent: "center"
                    }]}>
                        <View style={styles.unselectedSubCatImageView}>
                            <Image style={styles.unselectedSubCatImage} source={getImageUrl(item.imageUrl)} />
                        </View>
                        <Text style={styles.unselectedSubCatText}>{item.catName}</Text>
                    </TouchableOpacity>)}
                <View style={{ width: wp('1%') }} />
            </>
        );
    };

    const renderHeader = React.useCallback(() => (
        <>
            <FlatList
                data={subCategoriesList}
                keyExtractor={(item) => item.catId.toString()}
                renderItem={renderSubCategory}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                    paddingLeft: wp("3%"),
                    paddingRight: wp("3%"),
                    marginTop: hp("0.8%"),
                    paddingBottom: hp("1.5%"),
                    gap: wp('2.5%'),
                }}
            />
            {loadingProducts && (
                <View style={{ alignItems: 'center', marginTop: hp('10%') }}>
                    <ActivityIndicator size="large" color="#F25000" />
                </View>
            )}
        </>
    ), [subCategoriesList, selectedSubCatId, loadingProducts]);


    return (
        <SafeAreaView style={styles.mainContainer} edges={['top', 'left', 'right']}>
            <View style={{
                flexDirection: "row"
            }}>
                <View style={styles.viewOne} />
                <View style={styles.viewTwo}>
                    <Text style={styles.categoryHeaderText}>{categoryName}</Text>
                    <View style={styles.viewThree}>
                        <View style={styles.searchContainer}>
                            <Feather name="search" color={"#2D0F0D"} size={wp("5%")} />
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Search product"
                                placeholderTextColor="#000000"
                                value={searchText}
                                onChangeText={setSearchText}
                            />
                            {/* <View style={styles.divider} />
                    <Ionicons name="clipboard-outline" color={"#8F8F8F"} size={wp("6%")} style={styles.clipboardIcon} /> */}
                        </View>
                        <TouchableOpacity
                            style={styles.filterView}
                            onPress={() => setIsFilterSortModalVisible(true)}
                        >
                            <Ionicons name="options-outline" color={"#2D0F0D"} size={wp("5%")} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <View style={styles.row}>

                {/* LEFT MENU */}
                <View style={styles.leftMenu}>
                    <FlatList
                        data={categoriesList}
                        keyExtractor={(item) => item.catId.toString()}
                        renderItem={renderItem}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingBottom: hp("6%"),
                            // alignItems: "flex-end"
                        }}
                    />
                </View>

                {/* RIGHT CONTENT */}
                <View style={styles.rightContent}>
                    <FlatList
                        data={loadingProducts ? [] : productsList}
                        keyExtractor={(item) => (item.productId || item.id).toString()}
                        renderItem={({ item }) => <ProductCard item={item} />}
                        numColumns={2}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingLeft: wp("2.3%"),
                            paddingBottom: hp("8.5%"),
                            paddingTop: hp("0.5%")
                        }}
                        ListHeaderComponent={renderHeader}
                        ListEmptyComponent={
                            !loadingProducts ? (
                                <View style={styles.emptyContainer}>
                                    <Image
                                        source={require('../assets/images/noimages/noproductfound.png')}
                                        style={styles.emptyImage}
                                    />
                                    {/* <Text style={styles.emptyText}>No products found</Text> */}
                                </View>
                            ) : null
                        }
                    />
                </View>
            </View>
            <View style={styles.floatingContainer}>
                <SelectedProducts selectedProducts={selectedProducts} />
            </View>
            <FilterSortModal
                visible={isFilterSortModalVisible}
                onClose={() => setIsFilterSortModalVisible(false)}
                initialSort={filters.sortBy}
                initialMin={filters.priceMin}
                initialMax={filters.priceMax}
                onApply={({ sort, min, max }) => {
                    setFilters({ sortBy: sort, priceMin: min, priceMax: max });
                }}
            />

            {/* <FilterSortModal
                visible={filterVisible}
                onClose={() => setFilterVisible(false)}
                onApply={(filters) => {
                    setSortBy(filters.sort);
                    setMinPrice(filters.min);
                    setMaxPrice(filters.max);
                }}
                initialSort={sortBy}
                initialMin={minPrice}
                initialMax={maxPrice}
            /> */}
        </SafeAreaView >
    );
}


const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    row: {
        flex: 1,
        flexDirection: "row",
    },
    leftMenu: {
        width: wp("22%"),
        // paddingVertical: hp("1%"),
        // backgroundColor: "yellow",
        borderRightWidth: 1,
        borderColor: "#FFF3E8"
    },
    rightContent: {
        flex: 1,
        // backgroundColor: "red",
        // paddingLeft: wp("3.2%")
        // paddingBottom: 10
    },

    itemWrapper: {
        flexDirection: "row",
        backgroundColor: "#F6F1EF",
        // height: hp("15%"),
        // marginBottom: hp("1.8%"),
    },

    activeIndicator: {
        width: wp("1.86%"),
        backgroundColor: "#F25000",
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        marginVertical: hp("2%")
    },

    card: {
        alignItems: "center",
        width: wp("18.6%"),
        height: hp("8%"),
        justifyContent: "center"
    },

    activeCard: {
        // backgroundColor: "#FFFFFF",
        alignItems: "center",
        borderRadius: 10,
        borderWidth: 0.2,
        borderColor: "#FF7B3A",
        width: wp("18.6%"),
        height: hp("8%"),
        justifyContent: "center"
    },

    topCurve: {
        position: "absolute",
        top: -hp("8%"),
        width: "100%",
        height: hp("10%"),
        backgroundColor: "#F6F1EF",
        // borderBottomLeftRadius: 200,
        borderBottomRightRadius: wp("7%"),
    },

    bottomCurve: {
        position: "absolute",
        bottom: -hp("8%"),
        width: "100%",
        height: hp("10%"),
        backgroundColor: "#F6F1EF",
        // borderTopLeftRadius: 200,
        borderTopRightRadius: wp("7%"),
    },

    image: {
        width: wp("15%"),
        height: wp("15%"),
        // marginBottom: hp("1%"),
        // zIndex: 1,
    },

    title: {
        fontSize: wp("3%"),
        // fontWeight: "700",
        textAlign: "center",
        color: "#000000",
        // lineHeight: 18,
        // zIndex: 1,
        fontFamily: FONTS.poppins.medium,
        marginTop: hp("0.5%")
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: wp('1.4%'),
        paddingHorizontal: wp('2%'),
        height: hp('4.5%'),
        flex: 1,
        borderWidth: 1,
        borderColor: "#E3E3E3",
        marginRight: wp('2.5%')
    },
    searchInput: {
        flex: 1,
        fontSize: wp('3.25%'),
        marginHorizontal: wp('1.5%'),
        color: '#000000',
        fontFamily: FONTS.outfit.light,
    },
    floatingContainer: {
        position: "absolute",
        bottom: hp("0.7%"),
        left: 0,
        right: 0,
        alignItems: "center",
    },
    categoryHeaderText: {
        fontFamily: FONTS.lexend.semiBold,
        fontSize: wp("5.1%"),
        marginLeft: wp("10%")
    },
    filterText: {
        fontFamily: FONTS.lexend.medium,
        fontSize: wp("3.48%")
    },
    categoryBanner: {
        width: wp("64.65%"),
        height: hp("9.12%"),
        borderRadius: wp("3.48%"),
        marginTop: hp("1%"),
    },
    filterView: {
        width: wp("10%"),
        height: hp("4.5%"),
        borderWidth: 1,
        borderColor: "#E3E3E3",
        borderRadius: wp('1.4%'),
        alignItems: "center",
        justifyContent: "center",
    },
    filterIconStyle: {
        height: wp("3.25%"),
        width: wp("3.25%")
    },
    viewOne: {
        width: wp("21.7%"),
        backgroundColor: "#FFFFFF"
    },
    viewTwo: {
        backgroundColor: "#FFFFFF",
        flex: 1,
        paddingTop: hp("3%"),
        paddingBottom: hp("0.5%"),
        borderLeftWidth: 1,
        borderLeftColor: "#FFF3E8"
    },
    viewThree: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingLeft: wp("2.2%"),
        paddingRight: wp("4%"),
        marginTop: hp("1.3%")
    },
    subCatCard: {
        width: wp("16.28%"),
        alignItems: "center"
    },
    selectedSubCategory: {
        // alignItems: "center"
        // backgroundColor: "green",
        width: wp("18.6%"),
        alignItems: "center"
    },
    selectedSubCategoryImageView: {
        width: wp("18.6%"),
        height: hp("8.04%"),
        borderRadius: 10,
        backgroundColor: "#FFDB99",
        justifyContent: "center",
        alignItems: "center"
    },
    selectedSubCategoryImage: {
        width: wp("13.95%"),
        height: wp("13.95%"),
        borderRadius: 60,
        resizeMode: "cover"
    },
    selectedSubCatText: {
        color: "#000000",
        fontFamily: FONTS.lexend.medium,
        fontSize: wp("2.79%"),
        marginTop: hp("0.1%"),
        textAlign: "center"
    },
    unselectedSubCatImageView: {
        width: wp("18.6%"),
        height: hp("6.5%"),
        borderRadius: 10,
        backgroundColor: "#FFFFFF",
        justifyContent: "center",
        alignItems: "center"
    },
    unselectedSubCatImage: {
        width: wp("11.63%"),
        height: wp("11.63%"),
        borderRadius: 60,
        resizeMode: "cover"
    },
    unselectedSubCatText: {
        color: "#666666",
        fontFamily: FONTS.lexend.medium,
        fontSize: wp("2.79%"),
        textAlign: "center"
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: hp('5%'),
        paddingHorizontal: wp('10%')
    },
    emptyImage: {
        width: wp('40%'),
        height: wp('40%'),
        resizeMode: 'contain',
        marginBottom: hp('2%')
    },
    emptyText: {
        fontFamily: FONTS.lexend.regular,
        fontSize: wp('3.5%'),
        color: '#999',
        textAlign: 'center'
    }
});
