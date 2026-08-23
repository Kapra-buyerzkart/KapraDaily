import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '../../theme/colours';
import { Fonts } from '../../theme/fonts';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.themeWhite,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backIcon: {
        width: 24,
        height: 24,
        marginRight: 15,
        resizeMode: 'contain',
        tintColor: colors.themeBlack,
    },
    titleContainer: {
        flexDirection: 'column',
    },
    titleBold: {
        fontFamily: Fonts.gilroyBold,
        fontSize: 18,
        color: colors.themeBlack,
        lineHeight: 22,
    },
    titleRegular: {
        fontFamily: Fonts.gilroyRegular,
        fontSize: 18,
        color: colors.themeBlack,
        lineHeight: 22,
    },
    searchIcon: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
        tintColor: colors.themeBlack,
    },
    scrollContainer: {
        paddingBottom: 40,
    },

    topCategoryContainer: {
        paddingHorizontal: 15,
        marginTop: 10,
    },
    topCategoryItem: {
        alignItems: 'center',
        marginHorizontal: 5,
        width: width * 0.22,
        borderRadius: 15,
        borderWidth: 1.5,
        borderColor: colors.outlineTeal,
        overflow: 'hidden',
    },
    topCategoryImageContainer: {
        backgroundColor: colors.homeScreenBackground,
        width: '100%',
        height: width * 0.22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    topCategoryImage: {
        width: '80%',
        height: '80%',
        resizeMode: 'contain',
    },
    topCategoryTextContainer: {
        width: '100%',
        backgroundColor: colors.themeWhite,
        paddingVertical: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    topCategoryText: {
        fontFamily: Fonts.gilroyMedium,
        fontSize: 11,
        color: colors.themeBlack,
        textAlign: 'center',
    },

    sectionTitle: {
        fontFamily: Fonts.gilroyBold,
        fontSize: 14,
        color: colors.themeBlack,
        textAlign: 'center',
        marginTop: 25,
        marginBottom: 15,
        textTransform: 'uppercase',
    },

    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
    },
    gridItem: {
        alignItems: 'center',
        width: '23%',
        marginBottom: 15,
    },
    gridImageContainer: {
        backgroundColor: colors.homeScreenBackground,
        borderRadius: 15,
        width: '100%',
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        marginBottom: 5,
    },
    gridImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    gridText: {
        fontFamily: Fonts.gilroyMedium,
        fontSize: 12,
        color: colors.themeBlack,
        textAlign: 'center',
    },

    listContainer: {
        paddingHorizontal: 20,
        marginTop: 10,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.themeLightGray,
    },
    listItemImageContainer: {
        width: 50,
        height: 50,
        borderRadius: 10,
        backgroundColor: colors.homeScreenBackground,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    listItemImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    listItemText: {
        flex: 1,
        fontFamily: Fonts.gilroyMedium,
        fontSize: 14,
        color: colors.themeBlack,
        textTransform: 'uppercase',
    },
    listRightArrow: {
        width: 16,
        height: 16,
        resizeMode: 'contain',
        tintColor: colors.outlineTeal,
    },

    fashionItem: {
        alignItems: 'center',
        marginHorizontal: 10,
    },
    fashionImageContainer: {
        backgroundColor: colors.homeScreenBackground,
        borderRadius: 15,
        width: width * 0.28,
        height: width * 0.28,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    fashionImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    fashionText: {
        fontFamily: Fonts.gilroyMedium,
        fontSize: 12,
        color: colors.themeBlack,
        textAlign: 'center',
    },

    concernItem: {
        marginHorizontal: 10,
        width: width * 0.35,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.themeLightGray,
        overflow: 'hidden',
    },
    concernImage: {
        width: '100%',
        height: width * 0.35,
        resizeMode: 'cover',
    },
    concernFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.outlineTeal,
        paddingHorizontal: 10,
        paddingVertical: 8,
    },
    concernText: {
        fontFamily: Fonts.gilroyMedium,
        fontSize: 12,
        color: colors.themeBlack,
    },
    concernArrowContainer: {
        backgroundColor: colors.themeWhite,
        borderRadius: 10,
        width: 16,
        height: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    concernArrow: {
        width: 8,
        height: 8,
        resizeMode: 'contain',
        tintColor: colors.outlineTeal,
    },

    brandGridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    brandItem: {
        alignItems: 'center',
        width: '24%',
        marginBottom: 20,
    },
    brandImageContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: colors.themeLightGray,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    brandImage: {
        width: '70%',
        height: '70%',
        resizeMode: 'contain',
    },
    brandText: {
        fontFamily: Fonts.gilroyMedium,
        fontSize: 12,
        color: colors.themeBlack,
    },
});
