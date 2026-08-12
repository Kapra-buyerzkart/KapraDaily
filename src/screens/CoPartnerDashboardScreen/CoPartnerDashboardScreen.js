import React from 'react';
import { View, ScrollView, StatusBar, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated from 'react-native-reanimated';
import { CART_COLORS } from '@/styles/cartTheme';
import { entrance } from '@/styles/motion';
import { useCoPartnerDashboard } from './useCoPartnerDashboard';
import { useDateRangeSheet } from './useDateRangeSheet';
import { styles } from './styles';
import DashboardHeader from './organisms/DashboardHeader';
import AreaSalesCard from './organisms/AreaSalesCard';
import ActivityCard from './organisms/ActivityCard';
import DateRangeSheet from './organisms/DateRangeSheet';
import DashboardEmptyState from './organisms/DashboardEmptyState';
import DateRangeBar from './molecules/DateRangeBar';

const SECTIONS = [
  { key: 'customers', title: 'Customers', icon: 'account-multiple' },
  { key: 'orders', title: 'Orders', icon: 'cart-outline' },
  { key: 'copartners', title: 'Co-partners in area', icon: 'handshake-outline' },
  { key: 'payouts', title: 'Payouts', icon: 'wallet-outline' },
];

const CoPartnerDashboardScreen = () => {
  const insets = useSafeAreaInsets();
  const {
    navigation,
    areas,
    activeArea,
    setActiveArea,
    isLoading,
    summary,
    copartners,
    customers,
    orders,
    payouts,
    fromDate,
    toDate,
    applyRange,
  } = useCoPartnerDashboard();

  const sheet = useDateRangeSheet({ fromDate, toDate, onApply: applyRange });

  const listsByKey = { customers, orders, copartners, payouts };

  const renderShell = children => (
    <View style={styles.mainContainer}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      <View style={[styles.topBar, { paddingTop: insets.top }]}>
        <DashboardHeader
          onBack={() => navigation.goBack()}
          areas={areas}
          activeArea={activeArea}
          onSelectArea={setActiveArea}
        />
      </View>

      {children}
    </View>
  );

  if (isLoading && areas.length === 0) {
    return renderShell(
      <View style={styles.centerFill}>
        <ActivityIndicator size="large" color={CART_COLORS.textSecondary} />
      </View>,
    );
  }

  if (!isLoading && areas.length === 0) {
    return renderShell(
      <DashboardEmptyState onGoBack={() => navigation.goBack()} />,
    );
  }

  return renderShell(
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 32 },
        ]}
      >
        <Animated.View entering={entrance(0)}>
          <AreaSalesCard
            summary={summary}
            areaName={activeArea?.areaName || activeArea?.name}
          />
        </Animated.View>

        <Animated.View entering={entrance(1)}>
          <DateRangeBar
            fromDate={fromDate}
            toDate={toDate}
            onPress={sheet.open}
          />
        </Animated.View>

        {SECTIONS.map((section, index) => (
          <Animated.View key={section.key} entering={entrance(index + 2)}>
            <ActivityCard
              title={section.title}
              icon={section.icon}
              items={listsByKey[section.key]}
              type={section.key}
              isLoading={isLoading}
              onViewAll={() =>
                navigation.navigate('CoPartnerListScreen', {
                  title: section.title,
                  icon: section.icon,
                  items: listsByKey[section.key],
                  type: section.key,
                })
              }
            />
          </Animated.View>
        ))}
      </ScrollView>

      <DateRangeSheet sheet={sheet} />
    </>,
  );
};

export default CoPartnerDashboardScreen;
