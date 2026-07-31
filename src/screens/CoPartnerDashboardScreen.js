import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Modal,
  Platform,
  StatusBar,
  ImageBackground,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import icons from '@/assets/icons';
import LinearGradient from 'react-native-linear-gradient';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { FONTS } from '../styles/typography';
import {
  getCoPartnerAreasApi,
  getCoPartnerListApi,
  getCoPartnerSummaryApi,
  getCoPartnerCustomersApi,
  getCoPartnerOrdersApi,
  getCoPartnerPayoutsApi,
} from '../api/userService';
import images from '@/assets/images';

const formatDate = dateStr => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr.split('T')[0];
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  return `${d.getDate().toString().padStart(2, '0')} ${months[d.getMonth()]}`;
};

const formatAmount = val => {
  if (val == null) return '';
  const str = val.toString().replace(/[^0-9.-]+/g, '');
  const num = parseFloat(str)?.toFixed(2);
  if (isNaN(num)) return val;
  return `₹${num.toLocaleString('en-IN')}`;
};

const CoPartnerDashboardScreen = () => {
  const navigation = useNavigation();
  const [areas, setAreas] = useState([]);
  const [activeArea, setActiveArea] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [visibleLimits, setVisibleLimits] = useState({
    customers: 5,
    orders: 5,
    copartners: 5,
    payouts: 5,
  });

  // States for data
  const [summary, setSummary] = useState(null);
  const [copartners, setCopartners] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [payouts, setPayouts] = useState([]);

  // Dynamic default dates for current month
  const today = new Date();
  const defaultYear = today.getFullYear();
  const defaultMonth = String(today.getMonth() + 1).padStart(2, '0');
  const defaultDay = String(today.getDate()).padStart(2, '0');
  const defaultToDate = `${defaultYear}-${defaultMonth}-${defaultDay}`;
  const defaultFromDate = `${defaultYear}-${defaultMonth}-01`;

  const [fromDate, setFromDate] = useState(defaultFromDate);
  const [toDate, setToDate] = useState(defaultToDate);

  // States for custom date range picker selection
  const [tempFromDate, setTempFromDate] = useState(defaultFromDate);
  const [tempToDate, setTempToDate] = useState(defaultToDate);
  const [selectingField, setSelectingField] = useState('from'); // 'from' or 'to'
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const openFilterModal = () => {
    setTempFromDate(fromDate);
    setTempToDate(toDate);
    setSelectingField('from');
    const start = new Date(fromDate);
    if (!isNaN(start)) {
      setCurrentMonth(start.getMonth());
      setCurrentYear(start.getFullYear());
    } else {
      setCurrentMonth(new Date().getMonth());
      setCurrentYear(new Date().getFullYear());
    }
    setIsFilterVisible(true);
  };

  useEffect(() => {
    fetchAreas();
  }, []);

  useEffect(() => {
    if (activeArea) {
      fetchAllData(activeArea.pincodeAreaId || activeArea.id);
    }
  }, [activeArea, fromDate, toDate]);

  const fetchAllData = async areaId => {
    if (!areaId) return;
    try {
      setIsLoading(true);
      setVisibleLimits({ customers: 5, orders: 5, copartners: 5, payouts: 5 });
      const params = { pincodeAreaId: areaId, fromDate, toDate };

      const [summaryRes, listRes, customersRes, ordersRes, payoutsRes] =
        await Promise.all([
          getCoPartnerSummaryApi(areaId),
          getCoPartnerListApi(areaId),
          getCoPartnerCustomersApi(params),
          getCoPartnerOrdersApi(params),
          getCoPartnerPayoutsApi(params),
        ]);

      console.log(
        '📊 [CoPartner] summaryRes:',
        summaryRes,
      );
      console.log('📋 [CoPartner] listRes:', listRes);
      console.log(
        '👥 [CoPartner] customersRes:',
        customersRes,
      );
      console.log(
        '🛒 [CoPartner] ordersRes:',
        ordersRes,
      );
      console.log(
        '💰 [CoPartner] payoutsRes:',
        payoutsRes,
      );

      if (summaryRes?.success && summaryRes?.data) setSummary(summaryRes.data);
      else setSummary(null);

      setCopartners(
        listRes?.success && listRes?.data
          ? Array.isArray(listRes.data)
            ? listRes.data
            : listRes.data.items || []
          : [],
      );
      setCustomers(
        customersRes?.success && customersRes?.data
          ? Array.isArray(customersRes.data)
            ? customersRes.data
            : customersRes.data.items || []
          : [],
      );
      setOrders(
        ordersRes?.success && ordersRes?.data
          ? Array.isArray(ordersRes.data)
            ? ordersRes.data
            : ordersRes.data.items || []
          : [],
      );
      setPayouts(
        payoutsRes?.success && payoutsRes?.data
          ? Array.isArray(payoutsRes.data)
            ? payoutsRes.data
            : payoutsRes.data.items || []
          : [],
      );
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAreas = async () => {
    try {
      setIsLoading(true);
      const response = await getCoPartnerAreasApi();
      console.log(
        '📍 [CoPartner] areasRes:',
        response,
      );
      if (response && response.success && response.data) {
        const fetchedAreas = Array.isArray(response.data)
          ? response.data
          : response.data.items || [];
        console.log(
          '📍 [CoPartner] fetchedAreas:',
          fetchedAreas,
        );
        setAreas(fetchedAreas);
        if (fetchedAreas.length > 0) {
          setActiveArea(fetchedAreas[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching areas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // All fetch logic now in fetchAllData

  const getSummaryStats = () => {
    return [
      {
        icon: 'account-multiple',
        label: 'Referrals',
        value: summary?.totalReferrals ?? summary?.referrals ?? '0',
        iconColor: '#F25000',
      },
      {
        icon: 'hand-heart',
        label: 'Occupancy',
        value:
          summary?.areaOccupancy != null
            ? `${summary.areaOccupancy}%`
            : summary?.occupancy || summary?.occupancyPercentage || '0%',
        iconColor: '#F25000',
      },
      {
        icon: 'account-group',
        label: 'Customers',
        value: summary?.totalCustomers ?? summary?.customers ?? '0',
        iconColor: '#F25000',
      },
      {
        icon: 'credit-card',
        label: 'Credited',
        value:
          summary?.creditedProfit != null
            ? formatAmount(summary.creditedProfit)
            : summary?.credited || summary?.totalCredited || '₹0',
        iconColor: '#F25000',
      },
      {
        icon: 'trending-up',
        label: 'Expected',
        value:
          summary?.expectedProfit != null
            ? formatAmount(summary.expectedProfit)
            : summary?.expected || summary?.expectedEarnings || '₹0',
        iconColor: '#F25000',
      },
      {
        icon: 'package-variant',
        label: 'Orders',
        value: summary?.orders || summary?.totalOrders || '0',
        iconColor: '#F25000',
      },
    ];
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        hitSlop={40}
        onPress={() => navigation.goBack()}
        style={styles.backBtn}
      >
        <Image
          source={icons.backArrowNew}
          style={{
            resizeMode: 'contain',
            tintColor: '#000',
          }}
        />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Co-Partner Dashboard</Text>
    </View>
  );

  const renderTabs = () => (
    <View style={styles.tabsContainer}>
      {isLoading && areas.length === 0 ? (
        <ActivityIndicator size="small" color="#F25000" />
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'space-around',
          }}
        >
          {areas.map((area, index) => {
            const areaId = area.pincodeAreaId || area.id;
            const activeId = activeArea?.pincodeAreaId || activeArea?.id;
            const isSelected = activeId === areaId;
            return (
              <TouchableOpacity
                key={areaId || index}
                style={[
                  styles.tab,
                  isSelected && styles.activeTab,
                  { marginHorizontal: wp('2%') },
                ]}
                onPress={() => setActiveArea(area)}
              >
                <Text
                  style={[styles.tabText, isSelected && styles.activeTabText]}
                >
                  {area.areaName || area.name || `Area ${index + 1}`}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </View>
  );

  const renderTopBackground = () => (
    <ImageBackground
      source={require('../assets/images/splash/copartnerbg.png')}
      style={styles.mainCard}
      resizeMode="cover"
    >
      <Text style={styles.mainCardLabel}>Total Area Sales</Text>
      <Text style={styles.mainCardValue}>
        ₹{summary?.totalAreaSales || summary?.totalSales || '0'}
      </Text>
    </ImageBackground>
  );

  const renderStatsGrid = () => {
    const stats = getSummaryStats();
    return (
      <View style={styles.statsGrid}>
        {stats.map((item, index) => (
          <View
            key={index}
            style={[
              styles.statItem,
              index % 2 === 0 ? styles.statItemLeft : styles.statItemRight,
              index < 4 && styles.statItemTopBorder,
            ]}
          >
            <View style={styles.statIconWrap}>
              <MaterialCommunityIcons
                name={item.icon}
                size={wp('6%')}
                color={item.iconColor}
              />
            </View>
            <View style={styles.statTextWrap}>
              <Text style={styles.statLabel}>{item.label}</Text>
              <Text style={styles.statValue}>{item.value}</Text>
            </View>
          </View>
        ))}
      </View>
    );
  };

  const handleDateFilter = days => {
    const to = new Date();
    const from = new Date();
    if (days === 'month') {
      from.setDate(1);
    } else {
      from.setDate(to.getDate() - days);
    }
    const toStr = to.toISOString().split('T')[0];
    const fromStr = from.toISOString().split('T')[0];
    setToDate(toStr);
    setFromDate(fromStr);
    setTempFromDate(fromStr);
    setTempToDate(toStr);
    setIsFilterVisible(false);
  };

  const handleApplyCustomRange = () => {
    if (tempFromDate && tempToDate) {
      setFromDate(tempFromDate);
      setToDate(tempToDate);
      setIsFilterVisible(false);
    }
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const handleDayPress = dateStr => {
    if (!dateStr) return;

    if (!tempFromDate || (tempFromDate && tempToDate)) {
      setTempFromDate(dateStr);
      setTempToDate(null);
      setSelectingField('to');
    } else {
      const start = new Date(tempFromDate);
      const end = new Date(dateStr);
      if (end < start) {
        setTempFromDate(dateStr);
        setTempToDate(null);
        setSelectingField('to');
      } else {
        setTempToDate(dateStr);
        setSelectingField('from');
      }
    }
  };

  const getDaysInMonth = (month, year) =>
    new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const generateDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const daysList = [];

    // Add empty slots for the first week
    for (let i = 0; i < firstDay; i++) {
      daysList.push({ key: `empty-${i}`, day: null, dateStr: null });
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentYear}-${(currentMonth + 1)
        .toString()
        .padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      daysList.push({ key: dateStr, day, dateStr });
    }

    return daysList;
  };

  const getDayStyle = dateStr => {
    if (!dateStr) return {};

    const isStart = dateStr === tempFromDate;
    const isEnd = dateStr === tempToDate;

    if (isStart || isEnd) {
      return styles.calendarDaySelected;
    }

    if (tempFromDate && tempToDate) {
      const current = new Date(dateStr);
      const start = new Date(tempFromDate);
      const end = new Date(tempToDate);
      if (current > start && current < end) {
        return styles.calendarDayInRange;
      }
    }

    return {};
  };

  const getDayTextStyle = dateStr => {
    if (!dateStr) return {};

    const isStart = dateStr === tempFromDate;
    const isEnd = dateStr === tempToDate;

    if (isStart || isEnd) {
      return styles.calendarDayTextSelected;
    }

    if (tempFromDate && tempToDate) {
      const current = new Date(dateStr);
      const start = new Date(tempFromDate);
      const end = new Date(tempToDate);
      if (current > start && current < end) {
        return styles.calendarDayTextInRange;
      }
    }

    return {};
  };

  const renderDateRange = () => (
    <View style={styles.dateRangeBox}>
      <View>
        <Text style={styles.dateRangeLabel}>DATE RANGE</Text>
        <Text style={styles.dateRangeValue}>
          {fromDate} → {toDate}
        </Text>
      </View>
      <TouchableOpacity onPress={openFilterModal} style={styles.filterBtn}>
        {/* <LinearGradient
                    colors={['#FF7B3A', '#F25000']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}

                > */}
        <Text style={styles.filterBtnText}>Filters</Text>
        {/* </LinearGradient> */}
      </TouchableOpacity>
    </View>
  );

  const renderFilterModal = () => {
    const daysList = generateDays();
    const canApply = tempFromDate && tempToDate;
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    return (
      <Modal
        visible={isFilterVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsFilterVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsFilterVisible(false)}
        >
          <TouchableOpacity style={styles.modalContentLarge} activeOpacity={1}>
            <Text style={styles.modalTitle}>Select Date Range</Text>

            {/* Presets Row */}
            <View style={{ height: hp('6%'), marginBottom: hp('1%') }}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.presetsContent}
              >
                <TouchableOpacity
                  style={styles.presetPill}
                  onPress={() => handleDateFilter(7)}
                >
                  <Text style={styles.presetPillText}>Last 7 Days</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.presetPill}
                  onPress={() => handleDateFilter(30)}
                >
                  <Text style={styles.presetPillText}>Last 30 Days</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.presetPill}
                  onPress={() => handleDateFilter('month')}
                >
                  <Text style={styles.presetPillText}>This Month</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.presetPill}
                  onPress={() => handleDateFilter(90)}
                >
                  <Text style={styles.presetPillText}>Last 3 Months</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>

            {/* Selected Range Display */}
            <View style={styles.selectedRangeDisplay}>
              <TouchableOpacity
                style={[
                  styles.rangeDisplayBox,
                  selectingField === 'from' && styles.rangeDisplayBoxActive,
                ]}
                onPress={() => setSelectingField('from')}
              >
                <Text style={styles.rangeDisplayLabel}>START DATE</Text>
                <Text style={styles.rangeDisplayValue}>
                  {tempFromDate ? formatDate(tempFromDate) : 'Select Start'}
                </Text>
              </TouchableOpacity>

              <MaterialCommunityIcons
                name="arrow-right"
                size={wp('5%')}
                color="#888888"
                style={{ marginHorizontal: wp('2%') }}
              />

              <TouchableOpacity
                style={[
                  styles.rangeDisplayBox,
                  selectingField === 'to' && styles.rangeDisplayBoxActive,
                ]}
                onPress={() => setSelectingField('to')}
              >
                <Text style={styles.rangeDisplayLabel}>END DATE</Text>
                <Text style={styles.rangeDisplayValue}>
                  {tempToDate ? formatDate(tempToDate) : 'Select End'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Calendar Component */}
            <View style={styles.calendarContainer}>
              <View style={styles.calendarHeader}>
                <TouchableOpacity
                  onPress={handlePrevMonth}
                  style={styles.calendarNavBtn}
                >
                  <MaterialCommunityIcons
                    name="chevron-left"
                    size={wp('6%')}
                    color="#F25000"
                  />
                </TouchableOpacity>
                <Text style={styles.calendarMonthYear}>
                  {months[currentMonth]} {currentYear}
                </Text>
                <TouchableOpacity
                  onPress={handleNextMonth}
                  style={styles.calendarNavBtn}
                >
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={wp('6%')}
                    color="#F25000"
                  />
                </TouchableOpacity>
              </View>

              {/* Weekdays Row */}
              <View style={styles.calendarWeekdays}>
                {weekdays.map(day => (
                  <Text key={day} style={styles.calendarWeekdayText}>
                    {day}
                  </Text>
                ))}
              </View>

              {/* Days Grid */}
              <View style={styles.calendarGrid}>
                {daysList.map((item, index) => {
                  const dayStyle = getDayStyle(item.dateStr);
                  const dayTextStyle = getDayTextStyle(item.dateStr);
                  return (
                    <TouchableOpacity
                      key={item.key || index}
                      style={[styles.calendarDayCell, dayStyle]}
                      onPress={() =>
                        item.dateStr && handleDayPress(item.dateStr)
                      }
                      disabled={!item.dateStr}
                      activeOpacity={0.7}
                    >
                      {item.day && (
                        <Text style={[styles.calendarDayText, dayTextStyle]}>
                          {item.day}
                        </Text>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setIsFilterVisible(false)}
              >
                <Text style={styles.modalCancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalApplyBtn,
                  !canApply && styles.modalApplyBtnDisabled,
                ]}
                onPress={handleApplyCustomRange}
                disabled={!canApply}
              >
                <Text style={styles.modalApplyBtnText}>Apply Range</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    );
  };

  const handleViewMore = type => {
    setVisibleLimits(prev => ({
      ...prev,
      [type]: prev[type] + 5,
    }));
  };

  const renderListSection = (title, icon, items, type) => {
    const limit = 5;
    const visibleItems = items.slice(0, limit);

    return (
      <View style={styles.listSection}>
        <View style={styles.listHeader}>
          <View style={styles.listHeaderLeft}>
            <MaterialCommunityIcons
              name={icon}
              size={wp('5%')}
              color="#F25000"
            />
            <Text style={styles.listTitle}>{title}</Text>
          </View>
          {items.length > 5 && (
            <TouchableOpacity
              style={styles.viewAllBtn}
              onPress={() =>
                navigation.navigate('CoPartnerListScreen', {
                  title,
                  icon,
                  items,
                  type,
                })
              }
            >
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          )}
        </View>

        {visibleItems.map((item, index) => {
          const maskPhone = phone => {
            if (!phone) return '';
            const phoneStr = String(phone);
            if (phoneStr.length <= 4) return phoneStr;
            return phoneStr.slice(0, 2) + '******' + phoneStr.slice(-2);
          };

          const itemName =
            type === 'orders'
              ? item.orderNumber || item.id || item.orderId || `#ORD${index}`
              : type === 'payouts'
              ? item.payMode || item.type || item.payoutMethod || 'Transfer'
              : item.name || item.custName || 'User';

          let itemSubRaw =
            type === 'orders'
              ? item.orderStatusKey || item.status || item.orderStatus
              : type === 'payouts'
              ? 'Success' || item.status || item.payoutStatus
              : item.phone || item.phoneNo || '';
          const itemSub =
            type !== 'orders' && type !== 'payouts' && itemSubRaw
              ? maskPhone(itemSubRaw)
              : itemSubRaw;

          let itemStatusValue =
            type === 'copartners'
              ? item.type || item.status || 'Registered on'
              : item.status || '';
          if (type === 'orders' || type === 'payouts') {
            itemStatusValue = formatAmount(
              item.grandTotal || item.amount || item.totalAmount || 0,
            );
          }
          if (type === 'customers') {
            itemStatusValue = formatDate(item.createdDate);
          }

          const rawDate =
            type === 'payouts'
              ? item.paidOn
              : type === 'copartners'
              ? item.addedOn
              : item.orderDate || item.date || item.createdAt || '';
          const itemDate = formatDate(rawDate);

          return (
            <View key={index} style={styles.listItem}>
              <View style={styles.listItemLeft}>
                <Text style={styles.itemName}>{itemName}</Text>
                <Text
                  style={[
                    styles.itemSub,
                    type === 'payouts' && { color: 'green' },
                  ]}
                >
                  {itemSub}
                </Text>
              </View>
              <View style={styles.listItemRight}>
                <Text
                  style={[
                    styles.itemStatusValue,
                    type === 'copartners' && styles.itemDate,
                  ]}
                >
                  {itemStatusValue}
                </Text>
                <Text style={styles.itemDate}>{itemDate}</Text>
              </View>
            </View>
          );
        })}
        {items.length === 0 && !isLoading && (
          <View
            style={{
              alignItems: 'center',
              marginTop: hp('0%'),
              marginBottom: hp('2%'),
            }}
          >
            <Text style={{ color: '#888', fontSize: wp('3%') }}>
              No items available
            </Text>
          </View>
        )}
        {items.length === 0 && isLoading && (
          <ActivityIndicator
            size="small"
            color="#F25000"
            style={{ marginTop: hp('1%') }}
          />
        )}
      </View>
    );
  };

  if (isLoading && areas.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="#FFFFFF"
          translucent={false}
        />
        {renderHeader()}
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <ActivityIndicator size="large" color="#F25000" />
        </View>
      </SafeAreaView>
    );
  }

  if (!isLoading && areas.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="#FFFFFF"
          translucent={false}
        />
        {renderHeader()}
        <View style={styles.emptyStateContainer}>
          {/* <MaterialCommunityIcons
            name="account-cancel-outline"
            size={wp('16%')}
            color="#CCCCCC"
          /> */}

          <Image source={icons.copartnerDash} />
          <Text style={styles.emptyStateTitle}>No Data Found</Text>
          <Text style={styles.emptyStateSubtitle}>
            You aren't a registered Co-Partner.
          </Text>
          <TouchableOpacity
            hitSlop={40}
            style={styles.emptyStateBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.emptyStateBtnText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
        translucent={false}
      />
      {renderHeader()}
      {areas?.length > 0 && renderTabs()}
      {renderTopBackground()}
      <View style={styles.bottomScrollContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {renderStatsGrid()}
          <View style={styles.contentWrap}>
            {renderDateRange()}
            {renderListSection(
              'Customers',
              'account-multiple',
              customers,
              'customers',
            )}
            {renderListSection('Orders', 'cart-outline', orders, 'orders')}
            {renderListSection(
              'Co-partners in area',
              'handshake-outline',
              copartners,
              'copartners',
            )}
            {renderListSection('Payouts', 'wallet-outline', payouts, 'payouts')}
          </View>
        </ScrollView>
      </View>
      {renderFilterModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp('10%'),
  },
  emptyStateTitle: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('5%'),
    color: '#333333',
    marginTop: hp('2%'),
  },
  emptyStateSubtitle: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('3.5%'),
    color: '#888888',
    textAlign: 'center',
    marginTop: hp('1%'),
  },
  emptyStateBtn: {
    backgroundColor: '#F25000',
    paddingHorizontal: wp('8%'),
    paddingVertical: hp('1.5%'),
    borderRadius: wp('2%'),
    marginTop: hp('10%'),
  },
  emptyStateBtnText: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('3.8%'),
    color: '#FFFFFF',
  },
  bottomScrollContainer: {
    flex: 1,
    backgroundColor: '#FFF2EB',
    borderTopLeftRadius: wp('7%'),
    borderTopRightRadius: wp('7%'),
    overflow: 'hidden',
    marginTop: -hp('2.5%'),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('2%'),
    marginTop: hp('1%'),
    marginBottom: hp('1%'),
  },
  backBtn: {
    padding: wp('2%'),
  },
  headerTitle: {
    fontFamily: FONTS.gilroy.semiBold,
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
    borderBottomLeftRadius: wp('7%'),
    borderBottomRightRadius: wp('7%'),
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.05,
    // shadowRadius: 3,
    // elevation: 10,
    zIndex: 10,
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
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('3.5%'),
    color: '#666666',
  },
  activeTabText: {
    color: '#F25000',
    fontFamily: FONTS.gilroy.semiBold,
  },
  contentWrap: {
    paddingHorizontal: wp('4%'),
    //  marginTop: hp('2%'),
  },
  mainCard: {
    width: wp('100%'),
    height: hp('15%'),
    // borderTopLeftRadius: wp('5%'),
    //  borderTopRightRadius: wp('5%'),
    marginTop: -hp('2.5%'),
    paddingTop: hp('2%'), // add positive padding so content inside isn't cut off
    alignItems: 'center',
    alignSelf: 'center',
    // //shadowColor: '#F25000',
    // shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.3,
    // shadowRadius: 5,
    // elevation: 5,
    overflow: 'hidden',
    // marginBottom: hp('2%'),
  },
  mainCardLabel: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('3.5%'),
    color: '#FFFFFF',
    opacity: 0.9,
    marginTop: hp('2.3%'),
  },
  mainCardValue: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('8%'),
    color: '#FFFFFF',
    marginTop: hp('0%'),
    marginBottom: hp('1%'),
  },
  statsGrid: {
    marginTop: hp('2%'),
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#FFFFFF',
    width: '90%',
    alignSelf: 'center',
    //  top: -hp('1%'),
    paddingVertical: hp('1%'),
    borderRadius: wp('5%'),
    borderRadius: wp('5%'),
  },
  statItem: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp('1.5%'),
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
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('2.8%'),
    color: '#4A3D3D',
  },
  statValue: {
    fontFamily: FONTS.gilroy.bold,
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
    marginBottom: hp('2%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    marginTop: hp('2%'),
    elevation: 2,
  },
  dateRangeLabel: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('2.5%'),
    color: '#888888',
    marginBottom: hp('0.2%'),
  },
  dateRangeValue: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('3.2%'),
    color: '#000000',
  },
  filterBtn: {
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('0.8%'),
    borderRadius: wp('7%'),
    width: wp('20%'),
    height: hp('4%'),
    backgroundColor: '#F25000',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  filterBtnText: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('3%'),
    color: '#FFFFFF',
    textAlign: 'center',
  },
  listSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: wp('6%'),
    paddingHorizontal: wp('5%'),
    paddingTop: hp('2.5%'),
    paddingBottom: hp('1%'),
    marginBottom: hp('2%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
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
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('4%'),
    color: '#000000',
    marginLeft: wp('2%'),
  },
  viewAllBtn: {
    borderBottomWidth: 0,
    borderBottomColor: '#F25000',
    paddingBottom: hp('0.2%'),
  },
  viewAllText: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('3.5%'),
    color: '#F25000',
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
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('3.5%'),
    color: '#F25000',
    marginRight: wp('1%'),
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: hp('1.5%'),
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F2F2F2',
    borderRadius: wp('6%'),
    paddingHorizontal: wp('5%'),
    marginBottom: hp('1.5%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  listItemLeft: {
    flex: 1,
  },
  itemName: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('3.5%'),
    color: '#181C1E',
  },
  itemSub: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('2.8%'),
    color: '#4A3D3D',
    marginTop: hp('0.2%'),
  },
  listItemRight: {
    alignItems: 'flex-end',
  },
  itemStatusValue: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('3.5%'),
    color: '#181C1E',
  },
  itemDate: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('2.8%'),
    color: '#4A3D3D',
    marginTop: hp('0.2%'),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContentLarge: {
    width: wp('90%'),
    backgroundColor: '#FFFFFF',
    borderRadius: wp('6%'),
    padding: wp('5%'),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 10,
  },
  modalTitle: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('4.5%'),
    color: '#181C1E',
    marginBottom: hp('1.5%'),
  },
  presetsContent: {
    alignItems: 'center',
    paddingHorizontal: wp('2%'),
  },
  presetPill: {
    backgroundColor: '#FFF2EB',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('0.8%'),
    borderRadius: wp('5%'),
    marginHorizontal: wp('1.5%'),
    borderWidth: 1,
    borderColor: '#FFE0CC',
  },
  presetPillText: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('3.2%'),
    color: '#F25000',
  },
  selectedRangeDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: hp('2%'),
  },
  rangeDisplayBox: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    borderWidth: 1.5,
    borderColor: '#EFEFEF',
    borderRadius: wp('3%'),
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('3%'),
    alignItems: 'center',
  },
  rangeDisplayBoxActive: {
    borderColor: '#F25000',
    backgroundColor: '#FFF2EB',
  },
  rangeDisplayLabel: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('2.3%'),
    color: '#888888',
    marginBottom: hp('0.2%'),
  },
  rangeDisplayValue: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('3.2%'),
    color: '#181C1E',
  },
  calendarContainer: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderRadius: wp('4%'),
    padding: wp('3%'),
    backgroundColor: '#FAFAFA',
    marginBottom: hp('2.5%'),
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('1.5%'),
  },
  calendarNavBtn: {
    padding: wp('1%'),
  },
  calendarMonthYear: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('3.8%'),
    color: '#181C1E',
  },
  calendarWeekdays: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: hp('1%'),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingBottom: hp('0.5%'),
  },
  calendarWeekdayText: {
    width: '14.28%',
    textAlign: 'center',
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('2.8%'),
    color: '#888888',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
  },
  calendarDayCell: {
    width: '14.28%',
    height: wp('9%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: hp('0.2%'),
    borderRadius: wp('4.5%'),
  },
  calendarDayText: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('3%'),
    color: '#181C1E',
  },
  calendarDaySelected: {
    backgroundColor: '#F25000',
    borderRadius: wp('4.5%'),
  },
  calendarDayTextSelected: {
    color: '#FFFFFF',
    fontFamily: FONTS.gilroy.bold,
  },
  calendarDayInRange: {
    backgroundColor: '#FFE6D5',
    borderRadius: 0,
  },
  calendarDayTextInRange: {
    color: '#F25000',
    fontFamily: FONTS.gilroy.medium,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: hp('1.5%'),
    marginRight: wp('2%'),
    borderRadius: wp('6%'),
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelBtnText: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('3.5%'),
    color: '#666666',
  },
  modalApplyBtn: {
    flex: 1.5,
    paddingVertical: hp('1.5%'),
    marginLeft: wp('2%'),
    borderRadius: wp('6%'),
    backgroundColor: '#F25000',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#F25000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  modalApplyBtnDisabled: {
    backgroundColor: '#CCCCCC',
    shadowOpacity: 0,
    elevation: 0,
  },
  modalApplyBtnText: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('3.5%'),
    color: '#FFFFFF',
  },
});

export default CoPartnerDashboardScreen;
