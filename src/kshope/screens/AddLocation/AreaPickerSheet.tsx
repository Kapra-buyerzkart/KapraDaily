import React, { memo, useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { UI_COLORS, UI_SPACING, MAX_FONT_SCALE, hitSlopTo, wp } from '../../theme/tokens';
import { AppText } from '../../components/atoms';
import styles from './styles';

export type AreaItem = { label: string; value: number };

type Props = {
  visible: boolean;
  onClose: () => void;
  items: AreaItem[];
  value: number | null;
  onSelect: (value: number) => void;
  pincode: string;
  loading?: boolean;
};

const SEARCH_THRESHOLD = 6;

const keyExtractor = (item: AreaItem) => String(item.value);

const AreaRow = memo<{
  item: AreaItem;
  selected: boolean;
  onPress: (value: number) => void;
}>(({ item, selected, onPress }) => (
  <TouchableOpacity
    activeOpacity={0.85}
    onPress={() => onPress(item.value)}
    accessibilityRole="radio"
    accessibilityState={{ selected }}
    accessibilityLabel={item.label}
    style={[styles.areaRow, selected && styles.areaRowSelected]}
  >
    <AppText
      variant={selected ? 'bodyStrong' : 'body'}
      tone={selected ? 'primary' : 'secondary'}
      numberOfLines={2}
      style={styles.areaRowLabel}
    >
      {item.label}
    </AppText>
    {selected ? (
      <Ionicons
        name="checkmark-circle"
        size={wp('5.6%')}
        color={UI_COLORS.primary}
      />
    ) : null}
  </TouchableOpacity>
));

const AreaPickerSheet: React.FC<Props> = ({
  visible,
  onClose,
  items,
  value,
  onSelect,
  pincode,
  loading,
}) => {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');

  const showSearch = items.length > SEARCH_THRESHOLD;

  const data = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return items;
    return items.filter(item => item.label?.toLowerCase().includes(term));
  }, [items, query]);

  const handleSelect = useCallback(
    (next: number) => {
      onSelect(next);
      onClose();
    },
    [onSelect, onClose],
  );

  const handleClose = useCallback(() => {
    setQuery('');
    onClose();
  }, [onClose]);

  const renderItem = useCallback(
    ({ item }: { item: AreaItem }) => (
      <AreaRow item={item} selected={item.value === value} onPress={handleSelect} />
    ),
    [value, handleSelect],
  );

  const context = loading
    ? `Looking up ${pincode || 'your PIN code'}`
    : items.length
    ? `${items.length} ${items.length === 1 ? 'area' : 'areas'} in ${pincode}`
    : `PIN code ${pincode}`;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <View style={styles.areaSheetOverlay}>
        <TouchableOpacity
          style={styles.areaSheetDismiss}
          activeOpacity={1}
          onPress={handleClose}
          accessibilityRole="button"
          accessibilityLabel="Close area picker"
        />

        <View
          style={[
            styles.areaSheet,
            { paddingBottom: Math.max(insets.bottom, UI_SPACING.lg) },
          ]}
        >
          <View style={styles.areaSheetGrab} />

          <View style={styles.areaSheetHeader}>
            <View style={styles.areaSheetHeadline}>
              <AppText variant="title" numberOfLines={1}>
                Delivery area
              </AppText>
              <AppText variant="caption" tone="muted" style={styles.areaSheetContext}>
                {context}
              </AppText>
            </View>

            <TouchableOpacity
              onPress={handleClose}
              hitSlop={hitSlopTo(24)}
              accessibilityRole="button"
              accessibilityLabel="Close"
              style={styles.areaSheetClose}
            >
              <Ionicons name="close" size={wp('5%')} color={UI_COLORS.textPrimary} />
            </TouchableOpacity>
          </View>

          {showSearch ? (
            <View style={styles.areaSearch}>
              <Ionicons name="search" size={wp('4.2%')} color={UI_COLORS.textFaint} />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search areas"
                placeholderTextColor={UI_COLORS.textFaint}
                maxFontSizeMultiplier={MAX_FONT_SCALE}
                underlineColorAndroid="transparent"
                autoCorrect={false}
                style={styles.areaSearchInput}
              />
            </View>
          ) : null}

          {loading ? (
            <View style={styles.areaSheetState}>
              <ActivityIndicator color={UI_COLORS.primary} />
              <AppText variant="label" tone="muted" style={styles.areaSheetStateText}>
                Finding areas in {pincode}
              </AppText>
            </View>
          ) : (
            <FlatList
              data={data}
              keyExtractor={keyExtractor}
              renderItem={renderItem}
              style={styles.areaList}
              contentContainerStyle={styles.areaListContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              ListEmptyComponent={
                <View style={styles.areaSheetState}>
                  <AppText variant="bodyStrong" tone="secondary">
                    {query ? 'No match' : 'No areas for this PIN code'}
                  </AppText>
                  <AppText
                    variant="label"
                    tone="muted"
                    style={styles.areaSheetStateText}
                  >
                    {query
                      ? 'Try a shorter search term.'
                      : 'Check the PIN code and try again.'}
                  </AppText>
                </View>
              }
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

export default memo(AreaPickerSheet);
