import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '../../theme/colours';
import { Fonts } from '../../theme/fonts';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.themeWhite,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 55, // safe area
        paddingBottom: 15,
        backgroundColor: colors.themeWhite,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontFamily: Fonts.gilroyBold,
        fontSize: 20,
        color: colors.themeBlack,
        marginLeft: 15,
    },
    listContainer: {
        padding: 8,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    productCard: {
        width: (width - 32) / 2,
        marginBottom: 16,
        backgroundColor: colors.themeWhite,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: colors.outlineTeal,
        paddingTop: 10,
        paddingHorizontal: 0,
        overflow: 'hidden',
    },
    topBadgesRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        marginBottom: '-25%',
        zIndex: 2,
    },
    discountCircle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: colors.tealIconFont,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.white,
    },
    discountCircleText: {
        color: colors.tealIconFont,
        fontSize: 7,
        fontFamily: Fonts.gilroyMedium,
        fontWeight: '500',
        textAlign: 'center',
    },
    productImage: {
        width: '100%',
        height: 132,
    },
    outOfStockOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255,255,255,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    outOfStockText: {
        color: colors.black,
        fontFamily: Fonts.gilroyBold,
        fontSize: 10,
        backgroundColor: 'rgba(255,255,255,0.9)',
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 4,
        overflow: 'hidden',
    },
    infoContainer: {
        padding: 8,
        flex: 1,
        justifyContent: 'space-between',
    },
    productName: {
        fontFamily: Fonts.gilroyRegular,
        fontSize: 12,
        color: colors.themeBlack,
        fontWeight: '300',
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
        gap: 4,
    },
    pricePill: {
        backgroundColor: colors.themeTealTwo,
        borderRadius: 8,
        paddingHorizontal: 2,
        height: 29,
        elevation: 2,
        shadowColor: colors.themeBlack,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.85,
        shadowRadius: 2,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 65,
    },
    pricePillText: {
        color: colors.themeWhite,
        fontSize: 12,
        fontFamily: Fonts.gilroyRegular,
        fontWeight: '700',
    },
    unitPrice: {
        fontFamily: Fonts.gilroyRegular,
        fontSize: 10,
        color: colors.themeDarkGray,
        textDecorationLine: 'line-through',
        fontWeight: '300',
    },
});
