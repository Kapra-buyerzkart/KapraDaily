import React, { useCallback } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { SectionLabel } from '../atoms';
import AccessorizeTab from '../molecules/AccessorizeTab';
import MediaTile from '../molecules/MediaTile';
import { GUTTER, styles as shared } from '../styles';
import { tabIdOf } from '../useKshopeScreen';
import { CART_COLORS, CART_SPACING, hp, wp } from '@/styles/cartTheme';

interface AccessorizeSectionProps {
  tabs: any[];
  items: any[];
  selected: string | null;
  onSelect: (id: string) => void;
  onOpenItem: (item: any) => void;
}

const AccessorizeSection: React.FC<AccessorizeSectionProps> = ({
  tabs,
  items,
  selected,
  onSelect,
  onOpenItem,
}) => {
  const renderTab = useCallback(
    ({ item }: { item: any }) => {
      const id = tabIdOf(item);
      return (
        <AccessorizeTab
          item={item}
          active={String(id) === String(selected)}
          onPress={() => onSelect(id)}
        />
      );
    },
    [selected, onSelect],
  );

  const renderItem = useCallback(
    ({ item }: { item: any }) => (
      <MediaTile
        source={item.imageUrl || item.ImageUrl || item.image || item.Image}
        onPress={() => onOpenItem(item)}
        style={styles.card}
        resizeMode="contain"
        a11y={item.displayTitle || item.name || 'Category'}
      />
    ),
    [onOpenItem],
  );

  return (
    <View style={shared.section}>
      <SectionLabel>Accessorize</SectionLabel>

      <FlatList
        data={tabs}
        renderItem={renderTab}
        keyExtractor={(item, i) => `acc_${tabIdOf(item) || i}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabs}
      />

      {items.length > 0 && (
        <View style={styles.tray}>
          <FlatList
            data={items}
            renderItem={renderItem}
            keyExtractor={(item, i) => `accItem_${item.catId || i}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.trayContent}
          />
        </View>
      )}
    </View>
  );
};

export default React.memo(AccessorizeSection);

const styles = StyleSheet.create({
  tabs: {
    paddingHorizontal: GUTTER,
    gap: CART_SPACING.sm,
  },
  tray: {
    marginTop: CART_SPACING.lg,
    paddingVertical: CART_SPACING.lg,
    backgroundColor: CART_COLORS.primaryTint,
  },
  trayContent: {
    paddingHorizontal: GUTTER,
    gap: CART_SPACING.md,
  },
  card: {
    width: wp('42%'),
    height: hp('28%'),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: CART_COLORS.primaryEdge,
  },
});
