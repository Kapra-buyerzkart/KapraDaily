import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colours';
import { Fonts } from '../../theme/fonts';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.themeWhite,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: wp('5%'),
        paddingTop: hp('4%'),
        paddingBottom: hp('2%'),
        backgroundColor: colors.themeWhite,
    },
    backButton: {
        marginRight: wp('3%'),
    },
    headerTitle: {
        fontFamily: Fonts.bold,
        fontSize: wp('4.5%'),
        color: colors.black,
    },
    listContent: {
        paddingHorizontal: wp('4%'),
        paddingTop: hp('2%'),
        paddingBottom: hp('5%'),
    },
    card: {
        backgroundColor: colors.white,
        borderRadius: wp('3%'),
        padding: wp('4%'),
        marginBottom: hp('2%'),
        borderWidth: 1,
        borderColor: '#EEEEEE',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: hp('1.5%'),
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusText: {
        fontFamily: Fonts.semiBold,
        fontSize: 14,
        color: colors.black,
        marginLeft: wp('2%'),
        fontWeight: '300'
    },
    dateText: {
        fontFamily: Fonts.regular,
        fontSize: 14,
        color: colors.grey,
        fontWeight: '300'
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: hp('1.5%'),
    },
    itemImage: {
        width: 50,
        height: 50,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.lightGrey,
        backgroundColor: '#F5F5F5',
    },
    itemDetails: {
        flex: 1,
        marginLeft: wp('3%'),
        justifyContent: 'center',
    },
    itemName: {
        fontFamily: Fonts.medium,
        fontSize: 16,
        color: colors.black,
        marginBottom: 2,
        fontWeight: '400'
    },
    originalPriceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    originalPrice: {
        fontFamily: Fonts.regular,
        fontSize: 10,
        color: colors.grey,
        textDecorationLine: 'line-through',
        fontWeight: '300'
    },
    discountedPrice: {
        fontFamily: Fonts.bold,
        fontSize: 12,
        color: colors.themeTeal,
        fontWeight: '500'
    },
    chevronContainer: {
        justifyContent: 'center',
        alignItems: 'flex-end',
        width: wp('8%'),
    },
    separatorContainer: {
        width: '100%',
        marginVertical: hp('1.5%'),
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginTop: hp('0.5%'),
    },
    footerLabel: {
        fontFamily: Fonts.regular,
        fontSize: 14,
        color: colors.black,
        //marginBottom: 2,
        fontWeight: '300'
    },
    orderIdText: {
        fontFamily: Fonts.regular,
        fontSize: 14,
        color: colors.black,
        fontWeight: '300'
    },
    totalAmountText: {
        fontFamily: Fonts.bold,
        fontSize: 18,
        color: colors.themeTeal,
        fontWeight: '600'
    },
    footerLeft: {
        flex: 1,
    },
    footerRight: {
        alignItems: 'center',
    },
    // ---- Details Screen Styles ----
    detailsContainer: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    detailsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: wp('5%'),
        paddingTop: hp('2%'),
        paddingBottom: hp('2%'),
        backgroundColor: colors.themeWhite,
    },
    detailsHeaderTitle: {
        fontFamily: Fonts.bold,
        fontSize: 18,
        color: '#301717',
        marginLeft: wp('2%'),
    },
    detailsScrollView: {
        paddingTop: hp('2%'),
        paddingBottom: hp('15%'), // bottom bar space
    },
    detailCard: {
        backgroundColor: colors.white,
        borderRadius: wp('4%'),
        padding: wp('4%'),
        marginBottom: hp('2%'),
        borderWidth: 1,
        borderColor: '#EFEFEF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    productTopRow: {
        flexDirection: 'row',
        marginBottom: hp('2%'),
    },
    productImageContainer: {
        width: wp('25%'),
        height: wp('22%'),
        borderRadius: wp('3%'),
        borderWidth: 1,
        borderColor: colors.lightGrey,
        backgroundColor: '#F5F5F5',
        overflow: 'hidden',
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    productRightInfo: {
        flex: 1,
        marginLeft: wp('3%'),
        justifyContent: 'center',
    },
    productNameDetail: {
        fontFamily: Fonts.medium,
        fontSize: 16,
        color: colors.black,
        marginBottom: 8,
        fontWeight: '400',
        lineHeight: 20
    },
    productAttributeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    productAttributeLabel: {
        fontFamily: Fonts.regular,
        fontSize: 14,
        color: colors.black,
        width: wp('12%'),
        fontWeight: '300'
    },
    productAttributeValue: {
        fontFamily: Fonts.medium,
        fontSize: 12,
        color: colors.black,
    },
    colorCircle: {
        width: 14,
        height: 14,
        borderRadius: 7,
    },
    buyAgainBtn: {
        width: '100%',
        paddingVertical: hp('1.2%'),
        borderRadius: wp('6%'),
        borderWidth: 1,
        borderColor: colors.lightGrey,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buyAgainText: {
        fontFamily: Fonts.bold,
        fontSize: 16,
        color: colors.themeTeal,
        fontWeight: '600'

    },
    trackingTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    trackingLeftInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    trackingIcon: {
        width: wp('10%'),
        height: wp('10%'),
        marginRight: wp('3%'),
    },
    trackingStatusDetail: {
        fontFamily: Fonts.medium,
        fontSize: 16,
        color: colors.black,
        marginBottom: 2,
        fontWeight: '300'
    },
    trackingDateDetail: {
        fontFamily: Fonts.regular,
        fontSize: 12,
        color: colors.black,
        fontWeight: '500'
    },
    trackOrderBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.themeTeal,
        borderRadius: 20,
        paddingHorizontal: 8,
        height: 40
    },
    trackOrderText: {
        fontFamily: Fonts.medium,
        fontSize: 15,
        color: colors.themeTeal,
        marginRight: 4,
    },
    trackingDashedSeparator: {
        marginVertical: hp('1.5%'),
    },
    returnWindowRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    returnWindowText: {
        fontFamily: Fonts.regular,
        fontSize: 12,
        color: colors.black,
        marginLeft: 6,
        fontWeight: '300'
    },
    returnWindowRedText: {
        color: colors.red,
        fontFamily: Fonts.regular,
        fontSize: 12,
        marginLeft: 6,
        fontWeight: '300'
    },
    ratingFullWidth: {
        width: wp('100%'),
        backgroundColor: '#EBF7F7',
        paddingVertical: hp('2.5%'),
        alignItems: 'center',
        marginBottom: hp('2%'),
    },
    ratingTitle: {
        fontFamily: Fonts.medium,
        fontSize: 14,
        color: colors.black,
        marginBottom: hp('1.5%'),
        fontWeight: '400'
    },
    starsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: wp('3%'),
    },
    otherProductsTitle: {
        fontFamily: Fonts.medium,
        fontSize: 14,
        color: colors.black,
        marginBottom: hp('1.5%'),
    },
    otherProductsRow: {
        flexDirection: 'row',
        gap: wp('3%'),
        marginBottom: hp('2%'),
    },
    otherProductItemImage: {
        width: wp('22%'),
        height: wp('18%'),
        borderRadius: wp('2%'),
        backgroundColor: '#F5F5F5',
    },
    orderIdContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    orderIdLabelDetail: {
        fontFamily: Fonts.medium,
        fontSize: 14,
        color: colors.black,
    },
    deliveryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: hp('1%'),
    },
    deliveryPinContainer: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#EBF7F7',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: wp('2%'),
    },
    deliveryToText: {
        fontFamily: Fonts.regular,
        fontSize: 14,
        color: colors.black,
    },
    deliveryTypeText: {
        fontFamily: Fonts.bold,
        fontSize: 14,
        color: colors.black,
        marginLeft: 4,
    },
    addressText: {
        fontFamily: Fonts.regular,
        fontSize: 14,
        color: colors.black,
        lineHeight: 20,
    },
    fixedBottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.white,
        flexDirection: 'row',
        paddingHorizontal: wp('4%'),
        paddingTop: hp('2%'),
        paddingBottom: hp('4%'),
        borderTopWidth: 1,
        borderColor: '#EFEFEF',
        borderTopLeftRadius: wp('6%'),
        borderTopRightRadius: wp('6%'),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 10,
    },
    returnBtn: {
        flex: 1,
        borderWidth: 1,
        borderColor: colors.themeTeal,
        borderRadius: wp('8%'),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: hp('1.5%'),
        marginRight: wp('2%'),
    },
    reorderBtn: {
        flex: 1,
        backgroundColor: colors.themeDarkTeal,
        borderRadius: wp('8%'),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: hp('1.5%'),
        marginLeft: wp('2%'),
    },
    returnBtnText: {
        fontFamily: Fonts.bold,
        fontSize: 16,
        color: colors.black,
        marginLeft: 6,
    },
    reorderBtnText: {
        fontFamily: Fonts.bold,
        fontSize: 16,
        color: colors.white,
        marginLeft: 6,
    },
    trackingExpandedContainer: {
        marginTop: hp('2%'),
        paddingLeft: wp('2%'),
    },
    trackingStepRow: {
        flexDirection: 'row',
    },
    trackingStepLeft: {
        alignItems: 'center',
        marginRight: wp('4%'),
        width: wp('8%'),
    },
    trackingDotCompleted: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: colors.themeTeal,
        shadowColor: colors.themeTeal,
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 3,
        marginTop: 4,
    },
    trackingDotCurrentContainer: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#EBF7F7',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -4,
    },
    trackingDotPending: {
        width: 14,
        height: 14,
        borderRadius: 7,
        borderWidth: 1.5,
        borderColor: colors.grey,
        backgroundColor: colors.white,
        marginTop: 4,
    },
    trackingLineCompleted: {
        width: 2,
        flex: 1,
        backgroundColor: colors.themeTeal,
        marginVertical: 4,
        minHeight: hp('3%'),
    },
    trackingLinePending: {
        width: 2,
        flex: 1,
        backgroundColor: '#EFEFEF',
        marginVertical: 4,
        minHeight: hp('3%'),
    },
    trackingStepRight: {
        flex: 1,
        paddingBottom: hp('3%'),
    },
    trackingStepTitleCompleted: {
        fontFamily: Fonts.medium,
        fontSize: 14,
        color: colors.black,
        marginBottom: 2,
    },
    trackingStepTitleCurrent: {
        fontFamily: Fonts.bold,
        fontSize: 14,
        color: colors.themeTeal,
        marginBottom: 2,
    },
    trackingStepTitlePending: {
        fontFamily: Fonts.medium,
        fontSize: 14,
        color: colors.black,
        marginBottom: 2,
    },
    trackingStepSubtitle: {
        fontFamily: Fonts.regular,
        fontSize: 12,
        color: '#555555',
        marginBottom: 4,
    },
    trackingStepTime: {
        fontFamily: Fonts.regular,
        fontSize: 12,
        color: colors.grey,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: hp('20%'),
        paddingHorizontal: wp('10%'),
    },
    emptyImage: {
        width: wp('60%'),
        height: wp('60%'),
        marginBottom: hp('3%'),
    },
    emptyTitle: {
        fontFamily: Fonts.bold,
        fontSize: wp('5%'),
        color: colors.black,
        marginBottom: hp('1%'),
        textAlign: 'center',
    },
    emptySubtitle: {
        fontFamily: Fonts.regular,
        fontSize: wp('3.8%'),
        color: colors.grey,
        textAlign: 'center',
        lineHeight: 22,
    },
    productQtyText: {
        fontFamily: Fonts.medium,
        fontSize: 14,
        color: '#666',
    },
    productPriceText: {
        fontFamily: Fonts.bold,
        fontSize: 16,
        color: colors.themeTeal,
    },
    productInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 4,
    },
});
