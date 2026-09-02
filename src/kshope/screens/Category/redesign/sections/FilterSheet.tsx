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
};

const OptionRow: React.FC<OptionRowProps> = ({
  testID,
  label,
  selected,
  onPress,
}) => (
  <TouchableOpacity
    testID={testID}
    activeOpacity={0.7}
    onPress={onPress}
    accessibilityRole="radio"
    accessibilityState={{ selected }}
    style={styles.row}
  >
    <View style={[styles.radio, selected && styles.radioActive]}>
      {selected ? <View style={styles.radioDot} /> : null}
    </View>
    <Text style={[styles.rowLabel, selected && styles.rowLabelActive]}>
      {label}
    </Text>
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

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={[styles.sheet, { paddingBottom: bottom + SPACE.lg }]}>
        <View style={styles.grabber} />

        <View style={styles.headerRow}>
          <Text style={styles.heading}>Filter & Sort</Text>
          {categoryName ? (
            <Text style={styles.headingSub} numberOfLines={1}>
              {categoryName}
            </Text>
          ) : null}
        </View>

        <ScrollView
          style={styles.body}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <Text style={styles.groupTitle}>Sort by</Text>
          {CATEGORY_SORT_OPTIONS.map(option => (
            <OptionRow
              key={option.id}
              testID={`filter-option-${option.id}`}
              label={option.label}
              selected={sortBy === option.value}
              onPress={() => setSortBy(option.value)}
            />
          ))}

          <Text style={[styles.groupTitle, styles.groupTitleSpaced]}>Price</Text>
          {CATEGORY_PRICE_BANDS.map(band => (
            <OptionRow
              key={band.id}
              testID={`filter-option-${band.id}`}
              label={band.label}
              selected={bandId === band.id}
              onPress={() => setBandId(band.id)}
            />
          ))}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            testID="filter-reset"
            style={styles.resetButton}
            activeOpacity={0.7}
            onPress={reset}
          >
            <Text style={styles.resetText}>Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity
            testID="filter-apply"
            style={styles.applyButton}
            activeOpacity={0.85}
            onPress={apply}
          >
            <Text style={styles.applyText}>Apply</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  sheet: {
    backgroundColor: HOME_COLORS.white,
    borderTopLeftRadius: RADIUS.lg,
    borderTopRightRadius: RADIUS.lg,
    paddingHorizontal: GUTTER,
    paddingTop: SPACE.sm,
    maxHeight: '78%',
  },
  grabber: {
    alignSelf: 'center',
    width: s(44),
    height: s(4),
    borderRadius: RADIUS.pill,
    backgroundColor: HOME_COLORS.cardBorder,
    marginBottom: SPACE.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  heading: {
    fontFamily: HOME_FONTS.semiBold,
    fontSize: fs(15),
    color: HOME_COLORS.heading,
  },
  headingSub: {
    flexShrink: 1,
    marginLeft: SPACE.md,
    fontFamily: HOME_FONTS.regular,
    fontSize: fs(11),
    color: HOME_COLORS.muted,
  },
  body: {
    marginTop: SPACE.md,
  },
  groupTitle: {
    fontFamily: HOME_FONTS.medium,
    fontSize: fs(12),
    color: HOME_COLORS.muted,
    marginBottom: SPACE.xs,
  },
  groupTitleSpaced: {
    marginTop: SPACE.xl,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACE.sm,
    gap: SPACE.md,
  },
  radio: {
    width: s(18),
    height: s(18),
    borderRadius: RADIUS.pill,
    borderWidth: s(1.5),
    borderColor: HOME_COLORS.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: {
    borderColor: HOME_COLORS.orange,
  },
  radioDot: {
    width: s(9),
    height: s(9),
    borderRadius: RADIUS.pill,
    backgroundColor: HOME_COLORS.orange,
  },
  rowLabel: {
    fontFamily: HOME_FONTS.regular,
    fontSize: fs(13),
    color: HOME_COLORS.heading,
  },
  rowLabelActive: {
    fontFamily: HOME_FONTS.medium,
    color: HOME_COLORS.orange,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACE.md,
    paddingTop: SPACE.lg,
  },
  resetButton: {
    flex: 1,
    height: s(44),
    borderRadius: RADIUS.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: HOME_COLORS.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetText: {
    fontFamily: HOME_FONTS.medium,
    fontSize: fs(13),
    color: HOME_COLORS.heading,
  },
  applyButton: {
    flex: 2,
    height: s(44),
    borderRadius: RADIUS.md,
    backgroundColor: HOME_COLORS.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyText: {
    fontFamily: HOME_FONTS.semiBold,
    fontSize: fs(13),
    color: HOME_COLORS.white,
  },
});

export default FilterSheet;
