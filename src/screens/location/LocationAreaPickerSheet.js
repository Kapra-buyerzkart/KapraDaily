import React, { forwardRef, memo } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import CustomBottomModal from '../../components/CustomBottomModal';
import AnimatedPressable from '../../components/AnimatedPressable';
import { LOCATION_COLORS, LOCATION_FONTS, RADII } from './locationTheme';

const CheckBadge = () => (
  <View style={styles.checkBadge}>
    <Svg width={10} height={8} viewBox="0 0 10 8">
      <Path
        d="M1 4L3.5 6.5L9 1"
        stroke={LOCATION_COLORS.background}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  </View>
);

const AreaRow = memo(({ item, isSelected, onPress }) => (
  <AnimatedPressable
    style={[styles.areaRow, isSelected && styles.areaRowSelected]}
    onPress={onPress}
  >
    <Text
      style={[styles.areaRowLabel, isSelected && styles.areaRowLabelSelected]}
    >
      {item?.areaName}
    </Text>
    {isSelected && <CheckBadge />}
  </AnimatedPressable>
));

// Restyled replacement for the old inline "Choose your area" Modal — same
// multi-area selection logic (owned by useLocationOnboarding), premium
// white/orange chrome instead of the previous red/orange gradient rows.
const LocationAreaPickerSheet = forwardRef(
  ({ locations, selected, onSelect, onSkip, onApply, onClose }, ref) => (
    <CustomBottomModal
      ref={ref}
      snapPoints={['62%']}
      onClose={onClose}
      backgroundStyle={styles.sheetBackground}
      renderContent={() => (
        <View style={styles.content}>
          <Text style={styles.title}>Choose your area</Text>
          <FlatList
            data={locations}
            keyExtractor={(item, index) =>
              String(item?.pincodeAreaId ?? index)
            }
            renderItem={({ item }) => (
              <AreaRow
                item={item}
                isSelected={selected?.pincodeAreaId === item?.pincodeAreaId}
                onPress={() => onSelect?.(item)}
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
          <View style={styles.footer}>
            <AnimatedPressable
              style={styles.skipButton}
              onPress={onSkip}
            >
              <Text style={styles.skipButtonText}>Skip</Text>
            </AnimatedPressable>
            <AnimatedPressable
              style={styles.applyButton}
              onPress={onApply}
            >
              <Text style={styles.applyButtonText}>Apply</Text>
            </AnimatedPressable>
          </View>
        </View>
      )}
    />
  ),
);

LocationAreaPickerSheet.displayName = 'LocationAreaPickerSheet';

const styles = StyleSheet.create({
  sheetBackground: {
    borderTopLeftRadius: RADII.sheet,
    borderTopRightRadius: RADII.sheet,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  title: {
    fontFamily: LOCATION_FONTS.bold,
    fontSize: 18,
    color: LOCATION_COLORS.textPrimary,
    marginBottom: 14,
  },
  listContent: {
    paddingBottom: 12,
  },
  areaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: LOCATION_COLORS.border,
    backgroundColor: LOCATION_COLORS.secondaryBackground,
    marginBottom: 10,
  },
  areaRowSelected: {
    backgroundColor: LOCATION_COLORS.accentLight,
    borderColor: LOCATION_COLORS.primary,
  },
  areaRowLabel: {
    fontFamily: LOCATION_FONTS.medium,
    fontSize: 15,
    color: LOCATION_COLORS.textPrimary,
  },
  areaRowLabelSelected: {
    fontFamily: LOCATION_FONTS.semiBold,
    color: LOCATION_COLORS.primary,
  },
  checkBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: LOCATION_COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 8,
    paddingBottom: 16,
  },
  skipButton: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: LOCATION_COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipButtonText: {
    fontFamily: LOCATION_FONTS.semiBold,
    fontSize: 15,
    color: LOCATION_COLORS.textSecondary,
  },
  applyButton: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    backgroundColor: LOCATION_COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButtonText: {
    fontFamily: LOCATION_FONTS.semiBold,
    fontSize: 15,
    color: LOCATION_COLORS.background,
  },
});

export default memo(LocationAreaPickerSheet);
