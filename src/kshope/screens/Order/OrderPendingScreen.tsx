import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    Dimensions,
    ActivityIndicator,
    Platform,
    BackHandler,
    ScrollView,
} from 'react-native';
import { useNavigation, useRoute, CommonActions } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../../theme/colours';
import { Fonts } from '../../theme/fonts';
import { AppIcons } from '../../assets/icons';

const { width } = Dimensions.get('window');

const OrderPendingScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const {
        orderId,
        orderNumber,
        razorpayOrderId,
        razorpayAmount,
        razorpayKeyId,
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

    const handleCheckStatus = () => {
        navigation.navigate('KshopeMyOrderDetails', { orderId });
    };

    const handleBackToHome = () => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: 'KshopeHome' }],
            })
        );
    };

    const displayOrderNumber = orderNumber || orderId || '--';

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Pending Icon */}
                <View style={styles.pendingSection}>
                    <View style={styles.pendingIconContainer}>
                        <LinearGradient
                            colors={['#FFB300', '#FFA000']}
                            style={styles.iconGradient}
                        >
                            <ActivityIndicator size="large" color={colors.white} />
                        </LinearGradient>
                    </View>

                    <Text style={styles.title}>Payment Pending</Text>
                    <Text style={styles.subtitle}>
                        We are verifying your payment with the bank. This usually takes a few minutes.
                    </Text>
                </View>

                {/* Info Card */}
                <View style={styles.infoCard}>
                    <Text style={styles.infoTitle}>What happens next?</Text>
                    <View style={styles.stepRow}>
                        <View style={[styles.stepDot, { backgroundColor: '#FFB300' }]} />
                        <Text style={styles.stepText}>Your order will be confirmed once payment is verified.</Text>
                    </View>
                    <View style={styles.stepRow}>
                        <View style={[styles.stepDot, { backgroundColor: '#FFB300' }]} />
                        <Text style={styles.stepText}>You can track the status in the "My Orders" section.</Text>
                    </View>
                    <View style={styles.stepRow}>
                        <View style={[styles.stepDot, { backgroundColor: '#FFB300' }]} />
                        <Text style={styles.stepText}>If payment fails, it will be refunded to your original method.</Text>
                    </View>
                </View>

                {/* Order Number Display */}
                <View style={styles.orderNumberCard}>
                    <Text style={styles.orderNumberLabel}>Order Number</Text>
                    <Text style={styles.orderNumberText}>#{displayOrderNumber}</Text>
                </View>

                {/* Buttons */}
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity
                        style={styles.checkStatusButton}
                        onPress={handleCheckStatus}
                        activeOpacity={0.7}
                    >
                        <LinearGradient
                            colors={[colors.themeTeal, colors.themeDarkTeal]}
                            start={{ x: 0, y: 0.5 }}
                            end={{ x: 1, y: 0.5 }}
                            style={styles.buttonGradient}
                        >
                            <Text style={styles.checkStatusButtonText}>Check Order Status</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.homeButton}
                        onPress={handleBackToHome}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.homeButtonText}>Go to Home</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.footerNote}>
                    In case of any issues, please contact our support team from the order details page.
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
    pendingSection: {
        alignItems: 'center',
        marginTop: 50,
    },
    pendingIconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 24,
        ...Platform.select({
            ios: {
                shadowColor: '#FFB300',
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
        color: '#FFB300',
        textAlign: 'center',
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 14,
        fontFamily: Fonts.gilroyMedium,
        color: '#666',
        textAlign: 'center',
        lineHeight: 22,
        paddingHorizontal: 20,
    },
    infoCard: {
        backgroundColor: '#FFFDF5',
        borderRadius: 16,
        padding: 20,
        marginTop: 30,
        borderWidth: 1,
        borderColor: '#FFE082',
    },
    infoTitle: {
        fontFamily: Fonts.gilroyBold,
        fontSize: 16,
        color: '#333',
        marginBottom: 14,
    },
    stepRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    stepDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginTop: 6,
        marginRight: 12,
    },
    stepText: {
        fontFamily: Fonts.gilroyMedium,
        fontSize: 14,
        color: '#666',
        flex: 1,
        lineHeight: 20,
    },
    orderNumberCard: {
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        padding: 16,
        marginTop: 16,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    orderNumberLabel: {
        fontFamily: Fonts.gilroyMedium,
        fontSize: 14,
        color: '#999',
        marginRight: 8,
    },
    orderNumberText: {
        fontFamily: Fonts.gilroyBold,
        fontSize: 16,
        color: '#333',
    },
    buttonsContainer: {
        marginTop: 30,
        gap: 12,
    },
    checkStatusButton: {
        height: 56,
        borderRadius: 16,
        overflow: 'hidden',
    },
    buttonGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkStatusButtonText: {
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

export default OrderPendingScreen;
