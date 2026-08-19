import { StyleSheet } from 'react-native';
import { colors } from '../../assets/theme/colours';
import { Fonts } from '../../assets/theme/fonts';

export const billSectionStyles = StyleSheet.create({
    container: {
        marginHorizontal: 16,
        marginTop: 2,
    },
    billImageBackground: {
        width: '100%',
        paddingVertical: 20,
        paddingHorizontal: 20,
        marginTop: 8,
    },
    billImageStyle: {
        resizeMode: 'stretch',
    },
    billHeaderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginBottom: 16,
    },
    billIcon: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
    },
    billHeaderText: {
        fontFamily: Fonts.gilroySemiBold,
        fontSize: 16,
        color: '#000000',
        marginLeft: 8,
    },
    billContentContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
    },
    billContentText: {
        fontFamily: Fonts.gilroyMedium,
        fontSize: 12,
        color: '#999999',
    },
    priceText: {
        fontFamily: Fonts.gilroyMedium,
        fontSize: 12,
        color: '#000000',
    },
    strikethroughText: {
        fontFamily: Fonts.gilroyMedium,
        fontSize: 12,
        color: '#999999',
        textDecorationLine: 'line-through',
        marginRight: 8,
    },
    billDivider: {
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: '#E8E8E8',
        marginTop: 16,
    },
    billSumView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
    },
    billSumText: {
        fontFamily: Fonts.gilroySemiBold,
        fontSize: 16,
        color: '#000000',
    },
    savingsText: {
        fontFamily: Fonts.gilroyMedium,
        fontSize: 14,
        color: colors.green,
        marginTop: 10,
    },
});
