import React, { memo, useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { UI_SPACING, MAX_FONT_SCALE, hitSlopTo, wp } from '../../theme/tokens';
import styles, { LUXURY_COLORS } from './styles';

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

const SEARCH_THRESHOLD = 5;

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
    <Text
      maxFontSizeMultiplier={MAX_FONT_SCALE}
      numberOfLines={2}
      style={[styles.areaRowLabel, selected && styles.areaRowLabelSelected]}
    >
      {item.label}
    </Text>
    {selected ? (
      <Ionicons
        name="checkmark-circle"
        size={wp('5.4%')}
        color={LUXURY_COLORS.emerald}
      />
    ) : (
      <Ionicons
        name="ellipse-outline"
        size={wp('5%')}
        color={LUXURY_COLORS.borderStrong}
      />
    )}
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
      <AreaRow
        item={item}
        selected={item.value === value}
        onPress={handleSelect}
      />
    ),
    [value, handleSelect],
  );

  const context = loading
    ? `Looking up areas for PIN ${pincode || 'code'}…`
    : items.length
    ? `${items.length} ${items.length === 1 ? 'area' : 'areas'} found for PIN ${pincode}`
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
              <Text
                maxFontSizeMultiplier={MAX_FONT_SCALE}
                numberOfLines={1}
                style={styles.areaSheetTitle}
              >
                Select Delivery Area
              </Text>
              <Text
                maxFontSizeMultiplier={MAX_FONT_SCALE}
                numberOfLines={1}
                style={styles.areaSheetContext}
              >
                {context}
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleClose}
              hitSlop={hitSlopTo(24)}
              accessibilityRole="button"
              accessibilityLabel="Close"
              style={styles.areaSheetClose}
            >
              <Ionicons
                name="close"
                size={wp('5%')}
                color={LUXURY_COLORS.textPrimary}
              />
            </TouchableOpacity>
          </View>

          {showSearch ? (
            <View style={styles.areaSearch}>
              <Ionicons
                name="search"
                size={wp('4.2%')}
                color={LUXURY_COLORS.textMuted}
              />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search area by name…"
                placeholderTextColor={LUXURY_COLORS.textFaint}
                maxFontSizeMultiplier={MAX_FONT_SCALE}
                underlineColorAndroid="transparent"
                autoCorrect={false}
                style={styles.areaSearchInput}
              />
              {query.length > 0 ? (
                <TouchableOpacity
                  onPress={() => setQuery('')}
                  hitSlop={hitSlopTo(20)}
                >
                  <Ionicons
                    name="close-circle"
                    size={wp('4.5%')}
                    color={LUXURY_COLORS.textMuted}
                  />
                </TouchableOpacity>
              ) : null}
            </View>
          ) : null}

          {loading ? (
            <View style={styles.areaSheetState}>
              <ActivityIndicator size="small" color={LUXURY_COLORS.emerald} />
              <Text
                maxFontSizeMultiplier={MAX_FONT_SCALE}
                style={styles.areaSheetStateText}
              >
                Finding areas in {pincode}…
              </Text>
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
                  <Ionicons
                    name="location-outline"
                    size={36}
                    color={LUXURY_COLORS.textFaint}
                  />
                  <Text
                    maxFontSizeMultiplier={MAX_FONT_SCALE}
                    style={styles.areaSheetStateTitle}
                  >
                    {query ? 'No matching area found' : 'No areas for this PIN code'}
                  </Text>
                  <Text
                    maxFontSizeMultiplier={MAX_FONT_SCALE}
                    style={styles.areaSheetStateText}
                  >
                    {query
                      ? 'Try typing a different keyword.'
                      : 'Please verify the PIN code and try again.'}
                  </Text>
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
