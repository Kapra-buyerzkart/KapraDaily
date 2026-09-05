import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { useAddresses } from '../../hooks/useAddresses';
import { AppIcons } from '../../assets/icons';
import { MAX_FONT_SCALE, hitSlopTo, wp } from '../../theme/tokens';
import AddressConfirmationModal from '../../components/AddressConfirmationModal';
import styles, {
  DISCOUNT,
  ICON,
  INK_BASE,
  INK_MUTED,
  INK_STRONG,
  PRIMARY,
  SUCCESS_TEXT,
} from './styles';

const RowActions: React.FC<{
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}> = ({ onEdit, onDelete, onClose }) => (
  <View style={styles.actionsRow}>
    <TouchableOpacity
      hitSlop={hitSlopTo(ICON.action)}
      accessibilityRole="button"
      accessibilityLabel="Edit address"
      onPress={onEdit}
      style={styles.actionButton}
    >
      <MaterialCommunityIcons
        name="pencil-outline"
        size={ICON.action}
        color={INK_BASE}
      />
    </TouchableOpacity>
    <View style={styles.actionSeparator} />
    <TouchableOpacity
      hitSlop={hitSlopTo(ICON.action)}
      accessibilityRole="button"
      accessibilityLabel="Delete address"
      onPress={onDelete}
      style={styles.actionButton}
    >
      <MaterialCommunityIcons
        name="trash-can-outline"
        size={ICON.action}
        color={DISCOUNT}
      />
    </TouchableOpacity>
    <View style={styles.actionSeparator} />
    <TouchableOpacity
      hitSlop={hitSlopTo(ICON.action)}
      accessibilityRole="button"
      accessibilityLabel="Close actions"
      onPress={onClose}
      style={styles.actionButton}
    >
      <Ionicons name="close" size={ICON.action} color={INK_MUTED} />
    </TouchableOpacity>
  </View>
);

const AddressCard = React.memo<{
  item: any;
  onPress: () => void;
  onEdit: () => void;
  onMenu: () => void;
  onDelete: () => void;
  onCloseMenu: () => void;
}>(({ item, onPress, onEdit, onMenu, onDelete, onCloseMenu }) => {
  const isSelected = !!item.selected;
  const isHome = String(item.type).toLowerCase() === 'home';

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
      accessibilityLabel={`${item.type} address, ${item.address}${
        isSelected ? ', selected. Tap to edit' : '. Tap to use this address'
      }`}
      style={[styles.card, isSelected && styles.cardSelected]}
    >
      <View style={styles.cardHeader}>
        <View style={styles.typeCluster}>
          <View style={[styles.typeWell, isSelected && styles.typeWellActive]}>
            <Ionicons
              name={isHome ? 'home-outline' : 'briefcase-outline'}
              size={ICON.type}
              color={isSelected ? SUCCESS_TEXT : INK_BASE}
            />
          </View>
          <Text
            style={styles.typeText}
            maxFontSizeMultiplier={MAX_FONT_SCALE}
            numberOfLines={1}
          >
            {item.type}
          </Text>
        </View>

        {item.threeDotsClicked ? (
          <RowActions
            onEdit={onEdit}
            onDelete={onDelete}
            onClose={onCloseMenu}
          />
        ) : (
          <View style={styles.headerRight}>
            {isSelected && (
              <View style={styles.selectedPill}>
                <Ionicons
                  name="checkmark"
                  size={ICON.check}
                  color={SUCCESS_TEXT}
                />
                <Text
                  style={styles.selectedPillText}
                  maxFontSizeMultiplier={MAX_FONT_SCALE}
                >
                  Selected
                </Text>
              </View>
            )}
            <TouchableOpacity
              hitSlop={hitSlopTo(ICON.action)}
              accessibilityRole="button"
              accessibilityLabel="Address options"
              onPress={onMenu}
              style={styles.menuButton}
            >
              <Ionicons
                name="ellipsis-vertical"
                size={ICON.action}
                color={INK_MUTED}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.cardDivider} />

      <View style={styles.cardBody}>
        <Text style={styles.addressLine} maxFontSizeMultiplier={MAX_FONT_SCALE}>
          {item.address}
        </Text>

        <View style={styles.metaRow}>
          <View style={styles.metaCluster}>
            <MaterialCommunityIcons
              name="phone-outline"
              size={ICON.meta}
              color={INK_MUTED}
            />
            <Text
              style={styles.metaText}
              maxFontSizeMultiplier={MAX_FONT_SCALE}
            >
              {item.phone}
            </Text>
          </View>
          <View style={styles.metaCluster}>
            <MaterialCommunityIcons
              name="map-marker-outline"
              size={ICON.meta}
              color={INK_MUTED}
            />
            <Text
              style={styles.metaText}
              maxFontSizeMultiplier={MAX_FONT_SCALE}
            >
              {item.pin}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const SavedAddressScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const {
    addresses,
    onSelectAddress,
    onThreeDotsClicked,
    onDeleteClicked,
    onCloseThreeDots,
    isLoading,
    refreshAddresses,
    addressConfirmationData,
    setAddressConfirmationData,
  } = useAddresses();

  useFocusEffect(
    useCallback(() => {
      refreshAddresses();
    }, [refreshAddresses]),
  );

  const goToEditor = useCallback(
    (address?: any) =>
      navigation.navigate(
        'KshopeAddLocation',
        address ? { address } : undefined,
      ),
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: { item: any }) => (
      <AddressCard
        item={item}
        onPress={() =>
          item.selected ? goToEditor(item.raw) : onSelectAddress(item.id, false)
        }
        onEdit={() => goToEditor(item.raw)}
        onMenu={() => onThreeDotsClicked(item.id)}
        onDelete={() => onDeleteClicked(item.id)}
        onCloseMenu={onCloseThreeDots}
      />
    ),
    [
      goToEditor,
      onSelectAddress,
      onThreeDotsClicked,
      onDeleteClicked,
      onCloseThreeDots,
    ],
  );

  const listHeader = useCallback(
    () => (
      <TouchableOpacity
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel="Add new location"
        onPress={() => goToEditor()}
        style={styles.addRow}
      >
        <View style={styles.addIconWell}>
          <Ionicons name="add" size={ICON.plus} color={PRIMARY} />
        </View>
        <Text style={styles.addRowText} maxFontSizeMultiplier={MAX_FONT_SCALE}>
          Add new location
        </Text>
        <Ionicons name="chevron-forward" size={ICON.chevron} color={PRIMARY} />
      </TouchableOpacity>
    ),
    [goToEditor],
  );

  const listEmpty = useCallback(
    () =>
      isLoading ? null : (
        <View style={styles.emptyState}>
          <View style={styles.emptyIconWell}>
            <Ionicons
              name="location-outline"
              size={ICON.empty}
              color={INK_MUTED}
            />
          </View>
          <Text
            style={styles.emptyTitle}
            maxFontSizeMultiplier={MAX_FONT_SCALE}
          >
            No saved addresses
          </Text>
          <Text style={styles.emptyBody} maxFontSizeMultiplier={MAX_FONT_SCALE}>
            Add a delivery location to see what we can bring to your door.
          </Text>
        </View>
      ),
    [isLoading],
  );

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          hitSlop={hitSlopTo(wp('6%'))}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => navigation.goBack()}
        >
          <AppIcons.Back color={INK_STRONG} size={22} />
        </TouchableOpacity>
        <Text style={styles.headerText} maxFontSizeMultiplier={MAX_FONT_SCALE}>
          Address
        </Text>
      </View>

      <FlatList
        data={addresses}
        keyExtractor={(item: any) => String(item.id)}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refreshAddresses}
            tintColor={PRIMARY}
            colors={[PRIMARY]}
          />
        }
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={listEmpty}
      />

      <AddressConfirmationModal
        visible={!!addressConfirmationData}
        onClose={() => setAddressConfirmationData(null)}
        onConfirm={() => setAddressConfirmationData(null)}
        data={addressConfirmationData}
      />
    </SafeAreaView>
  );
};

export default SavedAddressScreen;
