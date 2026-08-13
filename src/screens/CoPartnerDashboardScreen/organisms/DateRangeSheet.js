import React from 'react';
import {
  View,
  Modal,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CartText from '@/screens/cart/components/atoms/CartText';
import {
  CART_COLORS,
  CART_RADIUS,
  CART_SPACING,
  hp,
  wp,
} from '@/styles/cartTheme';
import PresetPill from '../atoms/PresetPill';
import RangeBox from '../atoms/RangeBox';
import CalendarGrid from '../molecules/CalendarGrid';
import { RANGE_PRESETS } from '../constants';
import { formatDate } from '../utils';

const DateRangeSheet = ({ sheet }) => (
  <Modal
    visible={sheet.visible}
    transparent
    animationType="fade"
    onRequestClose={sheet.close}
  >
    <TouchableOpacity
      style={styles.overlay}
      activeOpacity={1}
      onPress={sheet.close}
    >
      <TouchableOpacity style={styles.sheet} activeOpacity={1}>
        <View style={styles.grabber} />

        <CartText variant="heading" style={styles.title}>
          Select date range
        </CartText>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.presets}
          contentContainerStyle={styles.presetsContent}
        >
          {RANGE_PRESETS.map(preset => (
            <PresetPill
              key={preset.key}
              label={preset.label}
              onPress={() => sheet.selectPreset(preset.days)}
            />
          ))}
        </ScrollView>

        <View style={styles.rangeRow}>
          <RangeBox
            label="START DATE"
            value={sheet.tempFromDate ? formatDate(sheet.tempFromDate) : ''}
            placeholder="Select start"
            active={sheet.selectingField === 'from'}
            onPress={() => sheet.setSelectingField('from')}
          />

          <MaterialCommunityIcons
            name="arrow-right"
            size={wp('4.6%')}
            color={CART_COLORS.textMuted}
          />

          <RangeBox
            label="END DATE"
            value={sheet.tempToDate ? formatDate(sheet.tempToDate) : ''}
            placeholder="Select end"
            active={sheet.selectingField === 'to'}
            onPress={() => sheet.setSelectingField('to')}
          />
        </View>

        <CalendarGrid
          month={sheet.currentMonth}
          year={sheet.currentYear}
          days={sheet.days}
          getDayState={sheet.getDayState}
          onPrevMonth={sheet.goToPrevMonth}
          onNextMonth={sheet.goToNextMonth}
          onSelectDay={sheet.selectDay}
        />

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={sheet.close}
            activeOpacity={0.85}
            accessibilityRole="button"
          >
            <CartText variant="labelStrong" tone="secondary">
              Cancel
            </CartText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.applyBtn, !sheet.canApply && styles.applyBtnDisabled]}
            onPress={sheet.applyCustomRange}
            disabled={!sheet.canApply}
            activeOpacity={0.9}
            accessibilityRole="button"
            accessibilityState={{ disabled: !sheet.canApply }}
          >
            <CartText
              variant="cta"
              tone={sheet.canApply ? 'onDark' : 'faint'}
              numberOfLines={1}
            >
              Apply range
            </CartText>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </TouchableOpacity>
  </Modal>
);

export default React.memo(DateRangeSheet);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(11,16,32,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheet: {
    width: wp('90%'),
    alignItems: 'center',
    gap: CART_SPACING.md,
    backgroundColor: CART_COLORS.card,
    borderRadius: CART_RADIUS.card,
    padding: CART_SPACING.lg,
    ...Platform.select({
      ios: {
        shadowColor: '#0B1020',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
      },
      android: { elevation: 6 },
    }),
  },
  grabber: {
    width: wp('10%'),
    height: 4,
    borderRadius: CART_RADIUS.pill,
    backgroundColor: CART_COLORS.border,
  },
  title: {
    alignSelf: 'flex-start',
  },
  presets: {
    alignSelf: 'stretch',
    flexGrow: 0,
  },
  presetsContent: {
    alignItems: 'center',
  },
  rangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    gap: CART_SPACING.sm,
  },
  actions: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    gap: CART_SPACING.sm,
  },
  cancelBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp('1.6%'),
    borderRadius: CART_RADIUS.button,
    backgroundColor: CART_COLORS.well,
  },
  applyBtn: {
    flex: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp('1.6%'),
    borderRadius: CART_RADIUS.button,
    backgroundColor: CART_COLORS.primary,
  },
  applyBtnDisabled: {
    backgroundColor: CART_COLORS.well,
  },
});
