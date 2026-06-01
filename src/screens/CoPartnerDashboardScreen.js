import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Dimensions, ActivityIndicator, Modal } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { FONTS } from '../styles/typography';
import { 
    getCoPartnerAreasApi, 
    getCoPartnerListApi, 
    getCoPartnerSummaryApi,
    getCoPartnerCustomersApi,
    getCoPartnerOrdersApi,
    getCoPartnerPayoutsApi
} from '../api/userService';

const CoPartnerDashboardScreen = () => {
    const navigation = useNavigation();
    const [areas, setAreas] = useState([]);
    const [activeArea, setActiveArea] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [visibleLimits, setVisibleLimits] = useState({
        customers: 5,
        orders: 5,
        copartners: 5,
        payouts: 5
    });
    
    // States for data
    const [summary, setSummary] = useState(null);
    const [copartners, setCopartners] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [payouts, setPayouts] = useState([]);

    // Default dates based on prompt example
    const [fromDate, setFromDate] = useState('2026-03-01');
    const [toDate, setToDate] = useState('2026-05-14');

    useEffect(() => {
        fetchAreas();
    }, []);

    useEffect(() => {
        if (activeArea) {
            fetchAllData(activeArea.pincodeAreaId || activeArea.id);
        }
    }, [activeArea, fromDate, toDate]);

    const fetchAllData = async (areaId) => {
        if (!areaId) return;
        try {
            setIsLoading(true);
            setVisibleLimits({ customers: 5, orders: 5, copartners: 5, payouts: 5 });
            const params = { pincodeAreaId: areaId, fromDate, toDate };
            
            const [
                summaryRes, 
                listRes, 
                customersRes, 
                ordersRes, 
                payoutsRes
            ] = await Promise.all([
                getCoPartnerSummaryApi(areaId),
                getCoPartnerListApi(areaId),
                getCoPartnerCustomersApi(params),
                getCoPartnerOrdersApi(params),
                getCoPartnerPayoutsApi(params)
            ]);

            if (summaryRes?.success && summaryRes?.data) setSummary(summaryRes.data);
            else setSummary(null);

            setCopartners(listRes?.success && listRes?.data ? (Array.isArray(listRes.data) ? listRes.data : listRes.data.items || []) : []);
            setCustomers(customersRes?.success && customersRes?.data ? (Array.isArray(customersRes.data) ? customersRes.data : customersRes.data.items || []) : []);
            setOrders(ordersRes?.success && ordersRes?.data ? (Array.isArray(ordersRes.data) ? ordersRes.data : ordersRes.data.items || []) : []);
            setPayouts(payoutsRes?.success && payoutsRes?.data ? (Array.isArray(payoutsRes.data) ? payoutsRes.data : payoutsRes.data.items || []) : []);

        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchAreas = async () => {
        try {
            setIsLoading(true);
            const response = await getCoPartnerAreasApi();
            if (response && response.success && response.data) {
                const fetchedAreas = Array.isArray(response.data) ? response.data : (response.data.items || []);
                setAreas(fetchedAreas);
                if (fetchedAreas.length > 0) {
                    setActiveArea(fetchedAreas[0]);
                }
            }
        } catch (error) {
            console.error("Error fetching areas:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // All fetch logic now in fetchAllData

    const getSummaryStats = () => {
        return [
            { icon: 'account-multiple', label: 'Referrals', value: summary?.referrals || summary?.totalReferrals || '0', iconColor: '#F25000' },
            { icon: 'hand-heart', label: 'Occupancy', value: summary?.occupancy || summary?.occupancyPercentage || '0%', iconColor: '#F25000' },
            { icon: 'account-group', label: 'Customers', value: summary?.customers || summary?.totalCustomers || '0', iconColor: '#F25000' },
            { icon: 'credit-card', label: 'Credited', value: summary?.credited || summary?.totalCredited || '₹0', iconColor: '#F25000' },
            { icon: 'trending-up', label: 'Expected', value: summary?.expected || summary?.expectedEarnings || '₹0', iconColor: '#F25000' },
            { icon: 'package-variant', label: 'Orders', value: summary?.orders || summary?.totalOrders || '0', iconColor: '#F25000' },
        ];
    };

    const renderHeader = () => (
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                <MaterialCommunityIcons name="chevron-left" size={wp('8%')} color="#000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Co-Partner Dashboard</Text>
        </View>
    );

    const renderTabs = () => (
        <View style={styles.tabsContainer}>
            {isLoading && areas.length === 0 ? (
                <ActivityIndicator size="small" color="#F25000" />
            ) : (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{flexGrow: 1, justifyContent: 'space-around'}}>
                    {areas.map((area, index) => {
                        const areaId = area.pincodeAreaId || area.id;
                        const activeId = activeArea?.pincodeAreaId || activeArea?.id;
                        const isSelected = activeId === areaId;
                        return (
                            <TouchableOpacity
                                key={areaId || index}
                                style={[styles.tab, isSelected && styles.activeTab, { marginHorizontal: wp('2%') }]}
                                onPress={() => setActiveArea(area)}
                            >
                                <Text style={[styles.tabText, isSelected && styles.activeTabText]}>
                                    {area.areaName || area.name || `Area ${index + 1}`}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            )}
        </View>
    );

    const renderMainCard = () => {
        const stats = getSummaryStats();
        return (
            <LinearGradient
                colors={['#FF7B3A', '#F25000']}
                style={styles.mainCard}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <Text style={styles.mainCardLabel}>Total Area Sales</Text>
                <Text style={styles.mainCardValue}>{summary?.totalAreaSales || summary?.totalSales || '₹0'}</Text>
                
                <View style={styles.statsGrid}>
                    {stats.map((item, index) => (
                        <View key={index} style={[styles.statItem, 
                            index % 2 === 0 ? styles.statItemLeft : styles.statItemRight,
                            index < 4 && styles.statItemTopBorder
                        ]}>
                            <View style={styles.statIconWrap}>
                                <MaterialCommunityIcons name={item.icon} size={wp('6%')} color={item.iconColor} />
                            </View>
                            <View style={styles.statTextWrap}>
                                <Text style={styles.statLabel}>{item.label}</Text>
                                <Text style={styles.statValue}>{item.value}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </LinearGradient>
        );
    };

    const handleDateFilter = (days) => {
        const to = new Date();
        const from = new Date();
        if (days === 'month') {
            from.setDate(1);
        } else {
            from.setDate(to.getDate() - days);
        }
        setToDate(to.toISOString().split('T')[0]);
        setFromDate(from.toISOString().split('T')[0]);
        setIsFilterVisible(false);
    };

    const renderDateRange = () => (
        <View style={styles.dateRangeBox}>
            <View>
                <Text style={styles.dateRangeLabel}>DATE RANGE</Text>
                <Text style={styles.dateRangeValue}>{fromDate} → {toDate}</Text>
            </View>
            <TouchableOpacity style={styles.filterBtn} onPress={() => setIsFilterVisible(true)}>
                <Text style={styles.filterBtnText}>Filters</Text>
            </TouchableOpacity>
        </View>
    );

    const renderFilterModal = () => (
        <Modal
            visible={isFilterVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setIsFilterVisible(false)}
        >
            <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setIsFilterVisible(false)}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Select Date Range</Text>
                    
                    <TouchableOpacity style={styles.filterOption} onPress={() => handleDateFilter(7)}>
                        <Text style={styles.filterOptionText}>Last 7 Days</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.filterOption} onPress={() => handleDateFilter(30)}>
                        <Text style={styles.filterOptionText}>Last 30 Days</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.filterOption} onPress={() => handleDateFilter('month')}>
                        <Text style={styles.filterOptionText}>This Month</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.filterOption} onPress={() => handleDateFilter(90)}>
                        <Text style={styles.filterOptionText}>Last 3 Months</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </Modal>
    );

    const handleViewMore = (type) => {
        setVisibleLimits(prev => ({
            ...prev,
            [type]: prev[type] + 5
        }));
    };

    const renderListSection = (title, icon, items, type) => {
        const limit = visibleLimits[type] || 5;
        const visibleItems = items.slice(0, limit);
        const hasMore = items.length > limit;

        return (
            <View style={styles.listSection}>
                <View style={styles.listHeader}>
                    <View style={styles.listHeaderLeft}>
                        <MaterialCommunityIcons name={icon} size={wp('5%')} color="#F25000" />
                        <Text style={styles.listTitle}>{title}</Text>
                    </View>
                </View>

            {visibleItems.map((item, index) => (
                <View key={index} style={styles.listItem}>
                    <View style={styles.listItemLeft}>
                        <Text style={styles.itemName}>
                            {type === 'orders' ? (item.id || item.orderId || `#ORD${index}`) : type === 'payouts' ? (item.type || item.payoutMethod || 'Transfer') : (item.name || item.custName || 'User')}
                        </Text>
                        <Text style={styles.itemSub}>
                            {type === 'orders' ? (item.status || item.orderStatus) : type === 'payouts' ? (item.status || item.payoutStatus) : (item.phone || item.phoneNo || '')}
                        </Text>
                    </View>
                    <View style={styles.listItemRight}>
                        <Text style={styles.itemStatusValue}>
                            {type === 'orders' || type === 'payouts' ? (item.amount || `₹${item.totalAmount || 0}`) : type === 'copartners' ? (item.type || item.status || 'Active') : item.status}
                        </Text>
                        <Text style={styles.itemDate}>{item.date || item.createdAt?.split('T')[0] || item.orderDate?.split('T')[0] || ''}</Text>
                    </View>
                </View>
            ))}
            {items.length === 0 && !isLoading && (
                <View style={{alignItems: 'center', marginTop: hp('1%')}}>
                    <Text style={{color: '#888', fontSize: wp('3%')}}>No items available</Text>
                </View>
            )}
            {items.length === 0 && isLoading && (
                <ActivityIndicator size="small" color="#F25000" style={{marginTop: hp('1%')}} />
            )}

            {hasMore && (
                <TouchableOpacity 
                    style={styles.viewMoreBtn}
                    onPress={() => handleViewMore(type)}
                >
                    <Text style={styles.viewMoreText}>View More</Text>
                    <MaterialCommunityIcons name="chevron-down" size={wp('4%')} color="#F25000" />
                </TouchableOpacity>
            )}
        </View>
    );
    };

    return (
        <SafeAreaView style={styles.container}>
            {renderHeader()}
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {renderTabs()}
                <View style={styles.contentWrap}>
                    {renderMainCard()}
                    {renderDateRange()}
                    {renderListSection('Customers', 'account-multiple', customers, 'customers')}
                    {renderListSection('Orders', 'cart-outline', orders, 'orders')}
                    {renderListSection('Co-partners in area', 'handshake-outline', copartners, 'copartners')}
                    {renderListSection('Payouts', 'wallet-outline', payouts, 'payouts')}
                </View>
            </ScrollView>
            {renderFilterModal()}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: wp('2%'),
        marginTop: hp('1%'),
        marginBottom: hp('1%')
    },
    backBtn: {
        padding: wp('2%'),
    },
    headerTitle: {
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('4.5%'),
        color: '#000000',
        marginLeft: wp('2%'),
    },
    scrollContent: {
        paddingBottom: hp('5%'),
        backgroundColor: '#FFF2EB', // Very light orange background from image
    },
    tabsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: wp('5%'),
        backgroundColor: '#FFFFFF',
        paddingBottom: hp('1.5%'),
        borderBottomLeftRadius: wp('5%'),
        borderBottomRightRadius: wp('5%'),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
        zIndex: 10
    },
    tab: {
        paddingVertical: hp('1%'),
        paddingHorizontal: wp('2%'),
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomColor: '#F25000',
    },
    tabText: {
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('3.5%'),
        color: '#666666',
    },
    activeTabText: {
        color: '#F25000',
        fontFamily: FONTS.poppins.semiBold,
    },
    contentWrap: {
        paddingHorizontal: wp('4%'),
        marginTop: hp('2%'),
    },
    mainCard: {
        borderRadius: wp('5%'),
        paddingTop: hp('3%'),
        alignItems: 'center',
        shadowColor: '#F25000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
        overflow: 'hidden'
    },
    mainCardLabel: {
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('3.5%'),
        color: '#FFFFFF',
        opacity: 0.9,
    },
    mainCardValue: {
        fontFamily: FONTS.poppins.bold,
        fontSize: wp('8%'),
        color: '#FFFFFF',
        marginTop: hp('0.5%'),
        marginBottom: hp('3%'),
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: '#FFFFFF',
        width: '100%',
        paddingVertical: hp('1%'),
        borderTopLeftRadius: wp('5%'),
        borderTopRightRadius: wp('5%'),
    },
    statItem: {
        width: '50%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: hp('2%'),
        paddingHorizontal: wp('5%'),
    },
    statItemLeft: {
        borderRightWidth: 1,
        borderRightColor: '#F0F0F0',
    },
    statItemRight: {
        paddingLeft: wp('8%'),
    },
    statItemTopBorder: {
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    statIconWrap: {
        marginRight: wp('3%'),
    },
    statTextWrap: {
        flex: 1,
    },
    statLabel: {
        fontFamily: FONTS.poppins.regular,
        fontSize: wp('2.8%'),
        color: '#666666',
    },
    statValue: {
        fontFamily: FONTS.poppins.bold,
        fontSize: wp('4%'),
        color: '#000000',
    },
    dateRangeBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: wp('3%'),
        paddingHorizontal: wp('5%'),
        paddingVertical: hp('1.5%'),
        marginTop: hp('2%'),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    dateRangeLabel: {
        fontFamily: FONTS.poppins.regular,
        fontSize: wp('2.5%'),
        color: '#888888',
        marginBottom: hp('0.2%'),
    },
    dateRangeValue: {
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('3.2%'),
        color: '#000000',
    },
    filterBtn: {
        backgroundColor: '#F25000',
        paddingHorizontal: wp('4%'),
        paddingVertical: hp('0.8%'),
        borderRadius: wp('5%'),
    },
    filterBtnText: {
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('3%'),
        color: '#FFFFFF',
    },
    listSection: {
        backgroundColor: '#FFFFFF',
        borderRadius: wp('4%'),
        padding: wp('4%'),
        marginTop: hp('2%'),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    listHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: hp('2%'),
    },
    listHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    listTitle: {
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('4%'),
        color: '#000000',
        marginLeft: wp('2%'),
    },
    viewAllText: {
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('3%'),
        color: '#F25000',
        textDecorationLine: 'underline',
    },
    viewMoreBtn: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: hp('1.5%'),
        paddingVertical: hp('1%'),
        borderTopWidth: 1,
        borderTopColor: '#F5F5F5',
    },
    viewMoreText: {
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('3.5%'),
        color: '#F25000',
        marginRight: wp('1%'),
    },
    listItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: hp('1.5%'),
        borderWidth: 1,
        borderColor: '#F5F5F5',
        borderRadius: wp('3%'),
        paddingHorizontal: wp('4%'),
        marginBottom: hp('1%'),
    },
    listItemLeft: {
        flex: 1,
    },
    itemName: {
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('3.5%'),
        color: '#333333',
    },
    itemSub: {
        fontFamily: FONTS.poppins.regular,
        fontSize: wp('2.8%'),
        color: '#888888',
        marginTop: hp('0.2%'),
    },
    listItemRight: {
        alignItems: 'flex-end',
    },
    itemStatusValue: {
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('3.5%'),
        color: '#333333',
    },
    itemDate: {
        fontFamily: FONTS.poppins.regular,
        fontSize: wp('2.8%'),
        color: '#888888',
        marginTop: hp('0.2%'),
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: wp('80%'),
        backgroundColor: '#FFFFFF',
        borderRadius: wp('4%'),
        padding: wp('5%'),
        alignItems: 'center',
    },
    modalTitle: {
        fontFamily: FONTS.poppins.bold,
        fontSize: wp('4.5%'),
        color: '#000000',
        marginBottom: hp('2%'),
    },
    filterOption: {
        width: '100%',
        paddingVertical: hp('1.5%'),
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        alignItems: 'center',
    },
    filterOptionText: {
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('3.5%'),
        color: '#F25000',
    },
});

export default CoPartnerDashboardScreen;
