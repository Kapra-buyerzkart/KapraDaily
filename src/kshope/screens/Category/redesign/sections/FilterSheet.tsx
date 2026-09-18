import React, { useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  CATEGORY_PRICE_BANDS,
  CATEGORY_SORT_OPTIONS,
  DEFAULT_CATEGORY_FILTERS,
  priceBandIdFor,
} from '../../constants';
import {
  GUTTER,
  HOME_COLORS,
  HOME_FONTS,
  RADIUS,
  SPACE,
  fs,
  s,
} from '../../../Home/redesign/theme';
import { Fonts } from '../../../../theme/fonts';
import type { Filters } from '../data/useCategoryData';

type Props = {
  visible: boolean;
  filters: Filters;
  categoryName?: string;
  onClose: () => void;
  onApply: (filters: Filters) => void;
};

type OptionRowProps = {
  testID: string;
  label: string;
  selected: boolean;
  onPress: () => void;
  compact?: boolean;
};

const OptionRow: React.FC<OptionRowProps> = ({
  testID,
  label,
  selected,
  onPress,
  compact = false,
}) => (
  <TouchableOpacity
    testID={testID}
    activeOpacity={0.7}
    onPress={onPress}
    accessibilityRole="radio"
    accessibilityState={{ selected }}
    style={[
      styles.optionCard,
      compact && styles.optionCardCompact,
      selected && styles.optionCardActive,
    ]}
  >
    <View style={styles.optionContent}>
      <View style={[styles.radio, selected && styles.radioActive]}>
        {selected ? <View style={styles.radioDot} /> : null}
      </View>
      <Text
        style={[styles.rowLabel, selected && styles.rowLabelActive]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
    {selected && (
      <Ionicons name="checkmark" size={s(15)} color={HOME_COLORS.darkEmerald} />
    )}
  </TouchableOpacity>
);

const FilterSheet: React.FC<Props> = ({
  visible,
  filters,
  categoryName,
  onClose,
  onApply,
}) => {
  const { bottom } = useSafeAreaInsets();
  const [sortBy, setSortBy] = useState(filters.sortBy);
  const [bandId, setBandId] = useState(() =>
    priceBandIdFor(filters.priceMin, filters.priceMax),
  );

  useEffect(() => {
    if (visible) {
      setSortBy(filters.sortBy);
      setBandId(priceBandIdFor(filters.priceMin, filters.priceMax));
    }
  }, [visible, filters]);

  const apply = () => {
    const band =
      CATEGORY_PRICE_BANDS.find(item => item.id === bandId) ??
      CATEGORY_PRICE_BANDS[0];
    onApply({ sortBy, priceMin: band.min, priceMax: band.max });
  };

  const reset = () => {
    setSortBy(DEFAULT_CATEGORY_FILTERS.sortBy);
    setBandId('any');
  };

  const isFiltered =
    sortBy !== DEFAULT_CATEGORY_FILTERS.sortBy || bandId !== 'any';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={[styles.sheet, { paddingBottom: Math.max(bottom, s(16)) }]}>
        {/* Top Grabber Handle */}
        <View style={styles.grabber} />

        {/* Luxury Header */}
        <View style={styles.headerRow}>
          <View style={styles.headerTitles}>
            <Text style={styles.heading}>Filter & Sort</Text>
            {categoryName ? (
              <Text style={styles.headingSub} numberOfLines={1}>
                {`In ${categoryName}`}
              </Text>
            ) : (
              <Text style={styles.headingSub}>Refine your jewellery search</Text>
            )}
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onClose}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={styles.closeBtn}
          >
            <Ionicons name="close" size={s(18)} color="#1A1A1A" />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.body}
          contentContainerStyle={styles.bodyContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Section 1: Sort by */}
          <View style={styles.sectionHeader}>
            <Ionicons
              name="swap-vertical-outline"
              size={s(14)}
              color="#8E8271"
              style={styles.sectionIcon}
            />
            <Text style={styles.groupTitle}>SORT BY</Text>
          </View>
          <View style={styles.optionsList}>
            {CATEGORY_SORT_OPTIONS.map(option => (
              <OptionRow
                key={option.id}
                testID={`filter-option-${option.id}`}
                label={option.label}
                selected={sortBy === option.value}
                onPress={() => setSortBy(option.value)}
              />
            ))}
          </View>

          {/* Section 2: Price Range */}
          <View style={[styles.sectionHeader, styles.sectionHeaderSpaced]}>
            <Ionicons
              name="cash-outline"
              size={s(14)}
              color="#8E8271"
              style={styles.sectionIcon}
            />
            <Text style={styles.groupTitle}>PRICE RANGE</Text>
          </View>
          <View style={styles.optionsList}>
            {CATEGORY_PRICE_BANDS.map(band => (
              <OptionRow
                key={band.id}
                testID={`filter-option-${band.id}`}
                label={band.label}
                selected={bandId === band.id}
                onPress={() => setBandId(band.id)}
              />
            ))}
          </View>
        </ScrollView>

        {/* Luxury Footer Actions */}
        <View style={styles.footer}>
          <TouchableOpacity
            testID="filter-reset"
            style={styles.resetButton}
            activeOpacity={0.7}
            onPress={reset}
          >
            <Ionicons
              name="refresh-outline"
              size={s(15)}
              color="#1A1A1A"
              style={styles.resetIcon}
            />
            <Text style={styles.resetText}>Reset</Text>
          </TouchableOpacity>

          <TouchableOpacity
            testID="filter-apply"
            style={styles.applyButton}
            activeOpacity={0.88}
            onPress={apply}
          >
            <Text style={styles.applyText}>
              {isFiltered ? 'Apply Filters' : 'Apply'}
            </Text>
            <Ionicons
              name="arrow-forward"
              size={s(15)}
              color="#FFFFFF"
              style={styles.applyIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(8, 43, 34, 0.45)',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: s(24),
    borderTopRightRadius: s(24),
    paddingHorizontal: GUTTER,
    paddingTop: SPACE.sm,
    maxHeight: '82%',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 20,
  },
  grabber: {
    alignSelf: 'center',
    width: s(40),
    height: s(4),
    borderRadius: RADIUS.pill,
    backgroundColor: '#D8D3CA',
    marginBottom: SPACE.sm,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: SPACE.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F0ECE4',
  },
  headerTitles: {
    flex: 1,
  },
  heading: {
    fontFamily: Fonts.cormorantGaramond.semiBold || HOME_FONTS.semiBold,
    fontSize: fs(23),
    color: '#0C382E',
    letterSpacing: 0.3,
  },
  headingSub: {
    fontFamily: Fonts.lexend?.regular || HOME_FONTS.regular,
    fontSize: fs(11.5),
    color: '#767676',
    marginTop: s(2),
  },
  closeBtn: {
    width: s(32),
    height: s(32),
    borderRadius: s(16),
    backgroundColor: '#FAF7F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SPACE.md,
  },
  body: {
    marginTop: SPACE.xs,
  },
  bodyContent: {
    paddingVertical: SPACE.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACE.xs + s(2),
  },
  sectionHeaderSpaced: {
    marginTop: SPACE.lg,
  },
  sectionIcon: {
    marginRight: s(6),
  },
  groupTitle: {
    fontFamily: Fonts.lexend?.semiBold || HOME_FONTS.medium,
    fontSize: fs(11),
    color: '#8E8271',
    letterSpacing: 1.1,
  },
  optionsList: {
    gap: s(7),
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: s(10),
    paddingHorizontal: s(12),
    borderRadius: s(12),
    backgroundColor: '#FAFAF8',
    borderWidth: 1,
    borderColor: '#EDE8E0',
  },
  optionCardCompact: {
    paddingVertical: s(8),
  },
  optionCardActive: {
    backgroundColor: '#FAF6F0',
    borderColor: '#0C382E',
    borderWidth: 1.5,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: s(10),
  },
  radio: {
    width: s(18),
    height: s(18),
    borderRadius: RADIUS.pill,
    borderWidth: 1.5,
    borderColor: '#CDC7BD',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: {
    borderColor: '#0C382E',
  },
  radioDot: {
    width: s(9),
    height: s(9),
    borderRadius: RADIUS.pill,
    backgroundColor: '#0C382E',
  },
  rowLabel: {
    fontFamily: Fonts.lexend?.regular || HOME_FONTS.regular,
    fontSize: fs(13),
    color: '#2C2C2C',
    flex: 1,
  },
  rowLabelActive: {
    fontFamily: Fonts.lexend?.semiBold || HOME_FONTS.semiBold,
    color: '#0C382E',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACE.md,
    paddingTop: SPACE.sm + s(4),
    borderTopWidth: 1,
    borderTopColor: '#F0ECE4',
  },
  resetButton: {
    flex: 1,
    height: s(44),
    borderRadius: s(12),
    borderWidth: 1,
    borderColor: '#D8D3CA',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetIcon: {
    marginRight: s(5),
  },
  resetText: {
    fontFamily: Fonts.lexend?.medium || HOME_FONTS.medium,
    fontSize: fs(13),
    color: '#1A1A1A',
  },
  applyButton: {
    flex: 2,
    height: s(44),
    borderRadius: s(12),
    backgroundColor: '#0C382E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0C382E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  applyIcon: {
    marginLeft: s(6),
  },
  applyText: {
    fontFamily: Fonts.lexend?.semiBold || HOME_FONTS.semiBold,
    fontSize: fs(13),
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
});

export default FilterSheet;
