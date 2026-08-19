import { DEALS48_ROUTES } from '../../navigation/routes';
import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    Dimensions,
    Platform,
    BackHandler,
    ScrollView,
} from 'react-native';
import { useNavigation, useRoute, CommonActions } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../../assets/theme/colours';
import { Fonts } from '../../assets/theme/fonts';
import { AppIcons } from '../../assets/icons';

const { width } = Dimensions.get('window');

const OrderFailedScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const {
        errorMessage,
        orderId,
        orderNumber,
        paymentMethod,
        totalItems,
        totalAmount
    } = route.params || {};

    useEffect(() => {
        // Prevent Android hardware back button
        const backAction = () => true;
        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

        // Prevent navigation remove (iOS swipe, back button)
        const unsubscribe = navigation.addListener('beforeRemove', (e: any) => {
            const action = e.data.action;
            if (action.type === 'RESET' || action.type === 'REPLACE') {
                return;
            }
            e.preventDefault();
        });

        return () => {
            backHandler.remove();
            unsubscribe();
        };
    }, [navigation]);

    const handleRetryPayment = () => {
        // Navigate to MyOrder where user can retry the payment
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{
                    name: DEALS48_ROUTES.MY_ORDER_DETAILS,
                    params: { orderId }
                }],
            })
        );
    };

    const handleBackToHome = () => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: DEALS48_ROUTES.HOME }],
            })
        );
    };

    const displayOrderNumber = orderNumber || orderId || '--';
    const displayTotal = totalAmount || 0;

    const getPaymentLabel = (method: string) => {
        if (!method) return 'Online Payment';
        const m = method.toUpperCase();
        if (m === 'COD') return 'Cash On Delivery';
        if (m === 'ONLINE' || m === 'UPI') return 'Online Payment';
        return method;
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Failure Icon */}
                <View style={styles.failureSection}>
                    <View style={styles.failedIconContainer}>
                        <LinearGradient
                            colors={['#FF5252', '#D32F2F']}
                            style={styles.iconGradient}
                        >
                            <AppIcons.Delete color={colors.white} size={60} />
                        </LinearGradient>
                    </View>
                    <Text style={styles.title}>{'Oops!\nPayment Failed'}</Text>
                    <Text style={styles.subtitle}>
                        {"We're unable to process your payment at this time."}
                    </Text>
                    <Text style={styles.refundNote}>
                        {"If any amount has been debited, it will be automatically refunded to your account within the standard processing time."}
                    </Text>
                </View>

                {/* Order Summary Card */}
                <View style={styles.orderCard}>
                    <View style={styles.orderCardHeader}>
                        <AppIcons.Check color={colors.themeTeal} size={20} />
                        <Text style={styles.orderCardTitle}>Order Details</Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Order ID</Text>
                        <Text style={styles.detailValue}>#{displayOrderNumber}</Text>
                    </View>
                    <View style={styles.divider} />

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Payment Method</Text>
                        <View style={styles.detailBadge}>
                            <Text style={styles.detailBadgeText}>
                                {getPaymentLabel(paymentMethod)}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.divider} />

                    {totalItems ? (
                        <>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Total Items</Text>
                                <Text style={styles.detailValue}>{totalItems} item{totalItems !== 1 ? 's' : ''}</Text>
                            </View>
                            <View style={styles.divider} />
                        </>
                    ) : null}

                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Grand Total</Text>
                        <Text style={styles.totalAmount}>₹{Number(displayTotal).toFixed(2)}</Text>
                    </View>
                </View>

                {/* Buttons */}
                <View style={styles.buttonsContainer}>
                    {orderId && (
                        <TouchableOpacity
                            style={styles.retryButton}
                            onPress={handleRetryPayment}
                            activeOpacity={0.7}
                        >
                            <LinearGradient
                                colors={[colors.themeTeal, colors.themeDarkTeal]}
                                start={{ x: 0, y: 0.5 }}
                                end={{ x: 1, y: 0.5 }}
                                style={styles.buttonGradient}
                            >
                                <Text style={styles.retryButtonText}>View Order Details</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity
                        style={styles.homeButton}
                        onPress={handleBackToHome}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.homeButtonText}>Go to Home</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.footerNote}>
                    Don't worry, your money is safe. If debited, it will be refunded automatically within 5-7 working days.
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    failureSection: {
        alignItems: 'center',
        marginTop: 50,
    },
    failedIconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 24,
        ...Platform.select({
            ios: {
                shadowColor: '#FF5252',
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.3,
                shadowRadius: 15,
            },
            android: {
                elevation: 10,
            },
        }),
    },
    iconGradient: {
        width: '100%',
        height: '100%',
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 26,
        fontFamily: Fonts.gilroyBold,
        color: '#FF0000',
        textAlign: 'center',
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 14,
        fontFamily: Fonts.gilroyMedium,
        color: '#666',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 8,
    },
    refundNote: {
        fontSize: 12,
        fontFamily: Fonts.gilroyMedium,
        color: '#999',
        textAlign: 'center',
        lineHeight: 18,
        paddingHorizontal: 20,
    },
    orderCard: {
        backgroundColor: '#F9F9F9',
        borderRadius: 16,
        padding: 20,
        marginTop: 30,
        borderWidth: 1,
        borderColor: '#EEE',
    },
    orderCardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    orderCardTitle: {
        fontFamily: Fonts.gilroyBold,
        fontSize: 16,
        color: colors.black,
        marginLeft: 8,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
    },
    detailLabel: {
        fontFamily: Fonts.gilroyMedium,
        fontSize: 14,
        color: '#999',
    },
    detailValue: {
        fontFamily: Fonts.gilroyBold,
        fontSize: 14,
        color: '#333',
    },
    detailBadge: {
        backgroundColor: '#F0F7FF',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
    },
    detailBadgeText: {
        fontFamily: Fonts.gilroyBold,
        fontSize: 12,
        color: '#333',
    },
    divider: {
        height: 1,
        backgroundColor: '#F0F0F0',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1.5,
        borderTopColor: '#E0E0E0',
    },
    totalLabel: {
        fontFamily: Fonts.gilroyBold,
        fontSize: 16,
        color: colors.black,
    },
    totalAmount: {
        fontFamily: Fonts.gilroyBold,
        fontSize: 22,
        color: '#FF0000',
    },
    buttonsContainer: {
        marginTop: 30,
        gap: 12,
    },
    retryButton: {
        height: 56,
        borderRadius: 16,
        overflow: 'hidden',
    },
    buttonGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    retryButtonText: {
        color: colors.white,
        fontSize: 18,
        fontFamily: Fonts.gilroyBold,
    },
    homeButton: {
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F0F0F0',
    },
    homeButtonText: {
        color: '#666',
        fontSize: 16,
        fontFamily: Fonts.gilroyBold,
    },
    footerNote: {
        fontFamily: Fonts.gilroyMedium,
        fontSize: 12,
        color: '#9E9E9E',
        textAlign: 'center',
        marginTop: 24,
        lineHeight: 18,
        paddingHorizontal: 20,
    },
});

export default OrderFailedScreen;
