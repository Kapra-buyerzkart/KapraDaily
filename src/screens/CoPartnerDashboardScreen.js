import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
  StatusBar,
  ImageBackground,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  CANVAS,
  SURFACE,
  HAIRLINE,
  INK,
  ACCENT,
  RADIUS,
  SPACE,
  TYPE,
  ELEVATION,
  GUTTER,
  MAX_FONT_SCALE,
  hitSlopTo,
} from '@/styles/homeTheme';
import {
  getCoPartnerAreasApi,
  getCoPartnerListApi,
  getCoPartnerSummaryApi,
  getCoPartnerCustomersApi,
  getCoPartnerOrdersApi,
  getCoPartnerPayoutsApi,
} from '../api/userService';

const MONTHS_SHORT = [
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

const HIT_SLOP = hitSlopTo(24);

const CARD_OVERLAP = hp('7%');

const formatDate = dateStr => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr.split('T')[0];
  return `${d.getDate().toString().padStart(2, '0')} ${
    MONTHS_SHORT[d.getMonth()]
  }`;
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
  const insets = useSafeAreaInsets();
  const [areas, setAreas] = useState([]);
  const [activeArea, setActiveArea] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const [summary, setSummary] = useState(null);
  const [copartners, setCopartners] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [payouts, setPayouts] = useState([]);

  const today = new Date();
  const defaultYear = today.getFullYear();
  const defaultMonth = String(today.getMonth() + 1).padStart(2, '0');
  const defaultDay = String(today.getDate()).padStart(2, '0');
  const defaultToDate = `${defaultYear}-${defaultMonth}-${defaultDay}`;
  const defaultFromDate = `${defaultYear}-${defaultMonth}-01`;

  const [fromDate, setFromDate] = useState(defaultFromDate);
  const [toDate, setToDate] = useState(defaultToDate);

  const [tempFromDate, setTempFromDate] = useState(defaultFromDate);
  const [tempToDate, setTempToDate] = useState(defaultToDate);
  const [selectingField, setSelectingField] = useState('from');
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
      const params = { pincodeAreaId: areaId, fromDate, toDate };

      const [summaryRes, listRes, customersRes, ordersRes, payoutsRes] =
        await Promise.all([
          getCoPartnerSummaryApi(areaId),
          getCoPartnerListApi(areaId),
          getCoPartnerCustomersApi(params),
          getCoPartnerOrdersApi(params),
          getCoPartnerPayoutsApi(params),
        ]);

      console.log('📊 [CoPartner] summaryRes:', summaryRes);
      console.log('📋 [CoPartner] listRes:', listRes);
      console.log('👥 [CoPartner] customersRes:', customersRes);
      console.log('🛒 [CoPartner] ordersRes:', ordersRes);
      console.log('💰 [CoPartner] payoutsRes:', payoutsRes);

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
      console.log('📍 [CoPartner] areasRes:', response);
      if (response && response.success && response.data) {
        const fetchedAreas = Array.isArray(response.data)
          ? response.data
          : response.data.items || [];
        console.log('📍 [CoPartner] fetchedAreas:', fetchedAreas);
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

  const getSummaryStats = () => {
    return [
      {
        icon: 'account-multiple',
        label: 'Referrals',
        value: summary?.totalReferrals ?? summary?.referrals ?? '0',
        tone: 'primary',
      },
      {
        icon: 'hand-heart',
        label: 'Occupancy',
        value:
          summary?.areaOccupancy != null
            ? `${summary.areaOccupancy}%`
            : summary?.occupancy || summary?.occupancyPercentage || '0%',
        tone: 'primary',
      },
      {
        icon: 'account-group',
        label: 'Customers',
        value: summary?.totalCustomers ?? summary?.customers ?? '0',
        tone: 'primary',
      },
      {
        icon: 'credit-card',
        label: 'Credited',
        value:
          summary?.creditedProfit != null
            ? formatAmount(summary.creditedProfit)
            : summary?.credited || summary?.totalCredited || '₹0',
        tone: 'success',
      },
      {
        icon: 'trending-up',
        label: 'Expected',
        value:
          summary?.expectedProfit != null
            ? formatAmount(summary.expectedProfit)
            : summary?.expected || summary?.expectedEarnings || '₹0',
        tone: 'success',
      },
      {
        icon: 'package-variant',
        label: 'Orders',
        value: summary?.orders || summary?.totalOrders || '0',
        tone: 'primary',
      },
    ];
  };

  const renderPlainHeader = () => (
    <View style={[styles.plainHeader, { paddingTop: insets.top + SPACE.sm }]}>
      <TouchableOpacity
        hitSlop={HIT_SLOP}
        onPress={() => navigation.goBack()}
        style={styles.plainBackBtn}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Image source={icons.backArrowNew} style={styles.backIconDark} />
      </TouchableOpacity>
      <Text style={styles.plainHeaderTitle} accessibilityRole="header">
        Co-Partner Dashboard
      </Text>
    </View>
  );

  const renderHero = () => (
    <ImageBackground
      source={require('../assets/images/splash/copartnerbg.png')}
      style={styles.hero}
      resizeMode="cover"
    >
      {}
      <LinearGradient
        colors={['rgba(26,12,4,0.45)', 'rgba(26,12,4,0.30)', 'rgba(26,12,4,0.72)']}
        locations={[0, 0.45, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <View style={[styles.heroTopRow, { paddingTop: insets.top + SPACE.sm }]}>
        <TouchableOpacity
          style={styles.circleBtn}
          hitSlop={HIT_SLOP}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Image source={icons.backArrowNew} style={styles.backIconLight} />
        </TouchableOpacity>
        <Text
          style={styles.heroHeaderTitle}
          numberOfLines={1}
          accessibilityRole="header"
        >
          Co-Partner Dashboard
        </Text>
      </View>

      {areas?.length > 0 && renderAreaChips()}

      <View style={styles.heroCenter}>
        <Text style={styles.heroLabel} maxFontSizeMultiplier={MAX_FONT_SCALE}>
          TOTAL AREA SALES
        </Text>
        <Text
          style={styles.heroValue}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.7}
        >
          ₹{summary?.totalAreaSales || summary?.totalSales || '0'}
        </Text>
      </View>
    </ImageBackground>
  );

  const renderAreaChips = () => (
    <View style={styles.areaChipsWrap}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.areaChipsContent}
      >
        {areas.map((area, index) => {
          const areaId = area.pincodeAreaId || area.id;
          const activeId = activeArea?.pincodeAreaId || activeArea?.id;
          const isSelected = activeId === areaId;
          return (
            <TouchableOpacity
              key={areaId || index}
              style={[styles.areaChip, isSelected && styles.areaChipActive]}
              onPress={() => setActiveArea(area)}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
            >
              <Text
                style={[
                  styles.areaChipText,
                  isSelected && styles.areaChipTextActive,
                ]}
                numberOfLines={1}
                maxFontSizeMultiplier={MAX_FONT_SCALE}
              >
                {area.areaName || area.name || `Area ${index + 1}`}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  const renderStatsCard = () => {
    const stats = getSummaryStats();
    return (
      <View style={styles.statsCard}>
        {stats.map((item, index) => {
          const isMoney = item.tone === 'success';
          return (
            <View
              key={index}
              style={[
                styles.statCell,
                index % 3 !== 2 && styles.statCellRule,
                index < 3 && styles.statCellRuleBottom,
              ]}
            >
              <MaterialCommunityIcons
                name={item.icon}
                size={wp('4.6%')}
                color={isMoney ? ACCENT.successText : ACCENT.primary}
              />
              <Text
                style={styles.statValue}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.7}
              >
                {item.value}
              </Text>
              <Text
                style={styles.statLabel}
                numberOfLines={1}
                maxFontSizeMultiplier={MAX_FONT_SCALE}
              >
                {item.label}
              </Text>
            </View>
          );
        })}
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

    for (let i = 0; i < firstDay; i++) {
      daysList.push({ key: `empty-${i}`, day: null, dateStr: null });
    }

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
    <TouchableOpacity
      style={styles.dateRangeBox}
      onPress={openFilterModal}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel={`Date range ${formatDate(fromDate)} to ${formatDate(
        toDate,
      )}. Tap to change.`}
    >
      <MaterialCommunityIcons
        name="calendar-range-outline"
        size={wp('4.6%')}
        color={ACCENT.primary}
      />
      <View style={styles.dateRangeTextWrap}>
        <Text
          style={styles.dateRangeLabel}
          maxFontSizeMultiplier={MAX_FONT_SCALE}
        >
          SHOWING
        </Text>
        <Text
          style={styles.dateRangeValue}
          numberOfLines={1}
          maxFontSizeMultiplier={MAX_FONT_SCALE}
        >
          {formatDate(fromDate)} → {formatDate(toDate)}
        </Text>
      </View>
      <View style={styles.filterBtn}>
        <Text
          style={styles.filterBtnText}
          maxFontSizeMultiplier={MAX_FONT_SCALE}
        >
          Change
        </Text>
      </View>
    </TouchableOpacity>
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
            <View style={styles.modalGrabber} />
            <Text style={styles.modalTitle}>Select Date Range</Text>

            {}
            <View style={styles.presetsRow}>
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

            {}
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
                color={INK.muted}
                style={styles.rangeArrow}
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

            {}
            <View style={styles.calendarContainer}>
              <View style={styles.calendarHeader}>
                <TouchableOpacity
                  onPress={handlePrevMonth}
                  style={styles.calendarNavBtn}
                >
                  <MaterialCommunityIcons
                    name="chevron-left"
                    size={wp('6%')}
                    color={ACCENT.primary}
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
                    color={ACCENT.primary}
                  />
                </TouchableOpacity>
              </View>

              {}
              <View style={styles.calendarWeekdays}>
                {weekdays.map(day => (
                  <Text key={day} style={styles.calendarWeekdayText}>
                    {day}
                  </Text>
                ))}
              </View>

              {}
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

            {}
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

  const renderListSection = (title, icon, items, type) => {
    if (items.length === 0 && !isLoading) return null;

    const limit = 5;
    const visibleItems = items.slice(0, limit);

    return (
      <View style={styles.listSection}>
        <View style={styles.listHeader}>
          <View style={styles.listHeaderLeft}>
            <View style={styles.listIconChip}>
              <MaterialCommunityIcons
                name={icon}
                size={wp('4.2%')}
                color={ACCENT.primary}
              />
            </View>
            <Text
              style={styles.listTitle}
              numberOfLines={1}
              accessibilityRole="header"
            >
              {title}
            </Text>
            {items.length > 0 && (
              <Text
                style={styles.listCount}
                maxFontSizeMultiplier={MAX_FONT_SCALE}
              >
                {items.length}
              </Text>
            )}
          </View>
          {items.length > 5 && (
            <TouchableOpacity
              style={styles.viewAllBtn}
              hitSlop={HIT_SLOP}
              activeOpacity={0.75}
              accessibilityRole="button"
              accessibilityLabel={`View all ${title}`}
              onPress={() =>
                navigation.navigate('CoPartnerListScreen', {
                  title,
                  icon,
                  items,
                  type,
                })
              }
            >
              <Text
                style={styles.viewAllText}
                maxFontSizeMultiplier={MAX_FONT_SCALE}
              >
                View all
              </Text>
              <MaterialCommunityIcons
                name="chevron-right"
                size={wp('4%')}
                color={ACCENT.primary}
              />
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
            <View
              key={index}
              style={[styles.listItem, index === 0 && styles.listItemFirst]}
            >
              <View style={styles.listItemLeft}>
                <Text style={styles.itemName} numberOfLines={1}>
                  {itemName}
                </Text>
                {!!itemSub && (
                  <Text
                    style={[
                      styles.itemSub,
                      type === 'payouts' && styles.itemSubSuccess,
                    ]}
                    numberOfLines={1}
                  >
                    {itemSub}
                  </Text>
                )}
              </View>
              <View style={styles.listItemRight}>
                <Text
                  style={[
                    styles.itemStatusValue,
                    type === 'copartners' && styles.itemDate,
                  ]}
                  numberOfLines={1}
                >
                  {itemStatusValue}
                </Text>
                {!!itemDate && <Text style={styles.itemDate}>{itemDate}</Text>}
              </View>
            </View>
          );
        })}

        {items.length === 0 && isLoading && (
          <ActivityIndicator
            size="small"
            color={ACCENT.primary}
            style={styles.listLoader}
          />
        )}
      </View>
    );
  };

  if (isLoading && areas.length === 0) {
    return (
      <View style={styles.container}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={CANVAS}
          translucent={false}
        />
        {renderPlainHeader()}
        <View style={styles.centerFill}>
          <ActivityIndicator size="large" color={ACCENT.primary} />
        </View>
      </View>
    );
  }

  if (!isLoading && areas.length === 0) {
    return (
      <View style={styles.container}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={CANVAS}
          translucent={false}
        />
        {renderPlainHeader()}
        <View style={styles.emptyStateContainer}>
          <Image source={icons.copartnerDash} />
          <Text style={styles.emptyStateTitle}>No Data Found</Text>
          <Text style={styles.emptyStateSubtitle}>
            You aren't a registered Co-Partner.
          </Text>
          <TouchableOpacity
            hitSlop={HIT_SLOP}
            style={styles.emptyStateBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.emptyStateBtnText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + hp('4%') },
        ]}
      >
        {renderHero()}
        {renderStatsCard()}
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
      </ScrollView>
      {renderFilterModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CANVAS,
  },
  centerFill: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    backgroundColor: CANVAS,
  },

  plainHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: GUTTER - SPACE.sm,
    paddingBottom: SPACE.md,
  },
  plainBackBtn: {
    padding: SPACE.sm,
  },
  backIconDark: {
    resizeMode: 'contain',
    tintColor: INK.strong,
  },
  plainHeaderTitle: {
    ...TYPE.heading,
    fontFamily: FONTS.gilroy.semiBold,
    color: INK.strong,
    marginLeft: SPACE.sm,
  },

  hero: {
    width: '100%',
    paddingBottom: CARD_OVERLAP + SPACE.base,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: GUTTER,
  },
  circleBtn: {
    width: wp('9.5%'),
    height: wp('9.5%'),
    borderRadius: wp('9.5%') / 2,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIconLight: {
    resizeMode: 'contain',
    tintColor: '#FFFFFF',
  },
  heroHeaderTitle: {
    ...TYPE.heading,
    fontFamily: FONTS.gilroy.semiBold,
    color: INK.onDark,
    marginLeft: SPACE.md,
    flexShrink: 1,
  },
  heroCenter: {
    paddingHorizontal: GUTTER,
    marginTop: SPACE.lg,
  },
  heroLabel: {
    ...TYPE.micro,
    fontFamily: FONTS.gilroy.semiBold,
    letterSpacing: 1.2,
    color: 'rgba(255,255,255,0.82)',
  },
  heroValue: {
    ...TYPE.display,
    fontFamily: FONTS.gilroy.bold,
    fontSize: Math.round(TYPE.display.fontSize * 1.3),
    lineHeight: Math.round(TYPE.display.fontSize * 1.6),
    color: INK.onDark,
  },

  areaChipsWrap: {
    marginTop: SPACE.base,
  },
  areaChipsContent: {
    paddingHorizontal: GUTTER,
    alignItems: 'center',
  },
  areaChip: {
    paddingVertical: SPACE.sm - 1,
    paddingHorizontal: SPACE.base,
    borderRadius: RADIUS.pill,
    backgroundColor: 'rgba(0,0,0,0.28)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    marginRight: SPACE.sm,
    maxWidth: wp('46%'),
  },
  areaChipActive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  areaChipText: {
    ...TYPE.caption,
    fontFamily: FONTS.gilroy.medium,
    color: 'rgba(255,255,255,0.92)',
  },
  areaChipTextActive: {
    color: ACCENT.primary,
    fontFamily: FONTS.gilroy.semiBold,
  },

  statsCard: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: GUTTER,
    marginTop: -CARD_OVERLAP,
    paddingVertical: SPACE.sm,
    borderRadius: RADIUS.lg,
    backgroundColor: SURFACE.base,
    ...ELEVATION.md,
  },
  statCell: {
    width: '33.33%',
    alignItems: 'center',
    paddingVertical: SPACE.md,
    paddingHorizontal: SPACE.sm,
  },
  statCellRule: {
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: HAIRLINE,
  },
  statCellRuleBottom: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: HAIRLINE,
  },
  statValue: {
    ...TYPE.heading,
    fontFamily: FONTS.gilroy.bold,
    color: INK.strong,
    marginTop: SPACE.xs + 2,
  },
  statLabel: {
    ...TYPE.micro,
    fontFamily: FONTS.gilroy.regular,
    color: INK.muted,
    marginTop: 1,
  },

  dateRangeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: GUTTER,
    marginTop: SPACE.lg,
    paddingVertical: SPACE.md,
    paddingHorizontal: SPACE.base,
    borderRadius: RADIUS.md,
    backgroundColor: SURFACE.sunken,
  },
  dateRangeTextWrap: {
    flex: 1,
    marginLeft: SPACE.md,
  },
  dateRangeLabel: {
    ...TYPE.micro,
    fontFamily: FONTS.gilroy.semiBold,
    letterSpacing: 0.6,
    color: INK.muted,
  },
  dateRangeValue: {
    ...TYPE.body,
    fontFamily: FONTS.gilroy.semiBold,
    color: INK.strong,
  },
  filterBtn: {
    paddingHorizontal: SPACE.base,
    paddingVertical: SPACE.sm,
    borderRadius: RADIUS.pill,
    backgroundColor: ACCENT.primary,
  },
  filterBtnText: {
    ...TYPE.caption,
    fontFamily: FONTS.gilroy.semiBold,
    color: INK.onDark,
  },

  listSection: {
    paddingHorizontal: GUTTER,
    paddingTop: SPACE.lg,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: SPACE.sm,
  },
  listHeaderLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: SPACE.md,
  },
  listIconChip: {
    width: wp('7.5%'),
    height: wp('7.5%'),
    borderRadius: RADIUS.pill,
    backgroundColor: SURFACE.tint,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACE.sm,
  },
  listTitle: {
    ...TYPE.heading,
    fontFamily: FONTS.gilroy.bold,
    color: INK.strong,
    flexShrink: 1,
  },
  listCount: {
    ...TYPE.caption,
    fontFamily: FONTS.gilroy.medium,
    color: INK.muted,
    marginLeft: SPACE.sm,
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    ...TYPE.label,
    fontFamily: FONTS.gilroy.semiBold,
    color: ACCENT.primary,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACE.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: HAIRLINE,
  },
  listItemFirst: {
    borderTopWidth: 0,
  },
  listItemLeft: {
    flex: 1,
    paddingRight: SPACE.md,
  },
  itemName: {
    ...TYPE.body,
    fontFamily: FONTS.gilroy.semiBold,
    color: INK.base,
  },
  itemSub: {
    ...TYPE.caption,
    fontFamily: FONTS.gilroy.regular,
    color: INK.muted,
    marginTop: 2,
  },
  itemSubSuccess: {
    color: ACCENT.successText,
    fontFamily: FONTS.gilroy.medium,
  },
  listItemRight: {
    alignItems: 'flex-end',
  },
  itemStatusValue: {
    ...TYPE.body,
    fontFamily: FONTS.gilroy.semiBold,
    color: INK.strong,
  },
  itemDate: {
    ...TYPE.caption,
    fontFamily: FONTS.gilroy.regular,
    color: INK.faint,
    marginTop: 2,
  },
  listLoader: {
    marginTop: SPACE.md,
  },

  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp('10%'),
  },
  emptyStateTitle: {
    ...TYPE.title,
    fontFamily: FONTS.gilroy.bold,
    color: INK.strong,
    marginTop: SPACE.base,
  },
  emptyStateSubtitle: {
    ...TYPE.body,
    fontFamily: FONTS.gilroy.regular,
    color: INK.muted,
    textAlign: 'center',
    marginTop: SPACE.xs,
  },
  emptyStateBtn: {
    backgroundColor: ACCENT.primary,
    paddingHorizontal: SPACE.xl,
    paddingVertical: SPACE.md,
    borderRadius: RADIUS.pill,
    marginTop: hp('6%'),
  },
  emptyStateBtnText: {
    ...TYPE.body,
    fontFamily: FONTS.gilroy.semiBold,
    color: INK.onDark,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(11,16,32,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContentLarge: {
    width: wp('90%'),
    backgroundColor: SURFACE.base,
    borderRadius: RADIUS.xl,
    padding: SPACE.lg,
    alignItems: 'center',
    shadowColor: '#0B1020',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  modalGrabber: {
    width: wp('10%'),
    height: 4,
    borderRadius: RADIUS.pill,
    backgroundColor: SURFACE.sunken,
    marginBottom: SPACE.md,
  },
  modalTitle: {
    ...TYPE.heading,
    fontFamily: FONTS.gilroy.bold,
    color: INK.strong,
    marginBottom: SPACE.md,
  },
  presetsRow: {
    height: hp('5.5%'),
    marginBottom: SPACE.md,
  },
  presetsContent: {
    alignItems: 'center',
  },
  presetPill: {
    backgroundColor: SURFACE.tint,
    paddingHorizontal: SPACE.base,
    paddingVertical: SPACE.sm,
    borderRadius: RADIUS.pill,
    marginRight: SPACE.sm,
    borderWidth: 1,
    borderColor: ACCENT.primarySoft,
  },
  presetPillText: {
    ...TYPE.caption,
    fontFamily: FONTS.gilroy.medium,
    color: ACCENT.primary,
  },
  selectedRangeDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: SPACE.base,
  },
  rangeArrow: {
    marginHorizontal: SPACE.sm,
  },
  rangeDisplayBox: {
    flex: 1,
    backgroundColor: SURFACE.sunken,
    borderWidth: 1.5,
    borderColor: 'transparent',
    borderRadius: RADIUS.sm,
    paddingVertical: SPACE.sm,
    paddingHorizontal: SPACE.md,
    alignItems: 'center',
  },
  rangeDisplayBoxActive: {
    borderColor: ACCENT.primary,
    backgroundColor: SURFACE.tint,
  },
  rangeDisplayLabel: {
    ...TYPE.micro,
    fontFamily: FONTS.gilroy.regular,
    color: INK.muted,
  },
  rangeDisplayValue: {
    ...TYPE.label,
    fontFamily: FONTS.gilroy.bold,
    color: INK.strong,
  },
  calendarContainer: {
    width: '100%',
    borderRadius: RADIUS.md,
    padding: SPACE.md,
    backgroundColor: SURFACE.sunken,
    marginBottom: SPACE.lg,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACE.md,
  },
  calendarNavBtn: {
    padding: SPACE.xs,
  },
  calendarMonthYear: {
    ...TYPE.label,
    fontFamily: FONTS.gilroy.semiBold,
    color: INK.strong,
  },
  calendarWeekdays: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: SPACE.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: HAIRLINE,
    paddingBottom: SPACE.xs,
  },
  calendarWeekdayText: {
    width: '14.28%',
    textAlign: 'center',
    ...TYPE.micro,
    fontFamily: FONTS.gilroy.medium,
    color: INK.muted,
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
    marginVertical: 1,
    borderRadius: wp('4.5%'),
  },
  calendarDayText: {
    ...TYPE.caption,
    fontFamily: FONTS.gilroy.regular,
    color: INK.base,
  },
  calendarDaySelected: {
    backgroundColor: ACCENT.primary,
    borderRadius: wp('4.5%'),
  },
  calendarDayTextSelected: {
    color: INK.onDark,
    fontFamily: FONTS.gilroy.bold,
  },
  calendarDayInRange: {
    backgroundColor: ACCENT.primarySoft,
    borderRadius: 0,
  },
  calendarDayTextInRange: {
    color: ACCENT.primary,
    fontFamily: FONTS.gilroy.medium,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: SPACE.md,
    marginRight: SPACE.sm,
    borderRadius: RADIUS.pill,
    backgroundColor: SURFACE.sunken,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelBtnText: {
    ...TYPE.label,
    fontFamily: FONTS.gilroy.semiBold,
    color: INK.muted,
  },
  modalApplyBtn: {
    flex: 1.5,
    paddingVertical: SPACE.md,
    marginLeft: SPACE.sm,
    borderRadius: RADIUS.pill,
    backgroundColor: ACCENT.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalApplyBtnDisabled: {
    backgroundColor: '#CFD3DA',
  },
  modalApplyBtnText: {
    ...TYPE.label,
    fontFamily: FONTS.gilroy.semiBold,
    color: INK.onDark,
  },
});

export default CoPartnerDashboardScreen;
