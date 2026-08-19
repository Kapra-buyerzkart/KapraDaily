import { StyleSheet } from 'react-native';
import { colors } from '../../assets/theme/colours';
import { Fonts } from '../../assets/theme/fonts';
import { hp } from '../../utils/responsive';

export const cartItemCardStyles = StyleSheet.create({
    itemCard: {
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: 12,
        marginBottom: 12,
        // borderColor: '#DADADA',
        // borderWidth: 0.5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    itemTopRow: {
        flexDirection: 'row',
    },
    imageContainer: {
        position: 'relative',
    },
    itemImage: {
        width: 100,
        height: 100,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    deleteButton: {
        position: 'absolute',
        top: -6,
        left: -6,
        backgroundColor: colors.white,
        borderRadius: 12,
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#EEEEEE',
    },
    itemDetails: {
        flex: 1,
        marginLeft: 15,
        justifyContent: 'space-between',
    },
    itemTitle: {
        fontSize: 14,
        color: colors.black,
        fontFamily: Fonts.gilroyMedium,
        lineHeight: 18,
    },
    variantRowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    variantRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    variantLabel: {
        fontSize: 12,
        color: '#999999',
        fontFamily: Fonts.gilroyMedium,
    },
    variantValue: {
        fontSize: 12,
        color: colors.black,
        fontFamily: Fonts.gilroyMedium,
    },
    colorCircle: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    mrpText: {
        fontSize: 10,
        color: '#999999',
        fontFamily: Fonts.gilroyMedium,
        marginTop: 6,
    },
    priceQtyRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 2,
    },
    priceText: {
        fontSize: 16,
        color: colors.black,
        fontFamily: Fonts.gilroyBold,
    },
    rupeeSign: {
        fontFamily: Fonts.gilroyBold,
        fontSize: 16,
    },
    quantitySelector: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    qtyBtn: {
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    qtyText: {
        paddingHorizontal: 12,
        fontSize: 14,
        fontFamily: Fonts.gilroyBold,
        color: colors.black,
    },
});
