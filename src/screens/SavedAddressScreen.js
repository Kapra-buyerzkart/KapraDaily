import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  RefreshControl,
  Image,
} from 'react-native';
import React, { useState, useCallback } from 'react';
import LocationModal from '../components/LocationModal';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { FONTS } from '../styles/typography';
import { useAddresses } from '../hooks/useAddresses';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import icons from '@/assets/icons';
import AddressConfirmationModal from '../components/AddressConfirmationModal';
import {
  INK,
  SURFACE,
  HAIRLINE,
  ACCENT,
  RADIUS,
  SPACE,
  TYPE,
  GUTTER,
  MAX_FONT_SCALE,
  hitSlopTo,
} from '@/styles/homeTheme';

const ICON = {
  type: wp('4.4%'),
  meta: wp('3.6%'),
  action: wp('4.4%'),
};

const RowActions = ({ onEdit, onDelete, onClose }) => (
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
        color={INK.base}
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
        color={ACCENT.discount}
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
      <Ionicons name="close" size={ICON.action} color={INK.muted} />
    </TouchableOpacity>
  </View>
);

const AddressCard = React.memo(
  ({ item, onPress, onEdit, onMenu, onDelete, onCloseMenu }) => {
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
            <View
              style={[styles.typeWell, isSelected && styles.typeWellActive]}
            >
              <Ionicons
                name={isHome ? 'home-outline' : 'briefcase-outline'}
                size={ICON.type}
                color={isSelected ? ACCENT.successText : INK.base}
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
                    size={wp('3.2%')}
                    color={ACCENT.successText}
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
                  color={INK.muted}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.cardDivider} />

        <View style={styles.cardBody}>
          <Text
            style={styles.addressLine}
            maxFontSizeMultiplier={MAX_FONT_SCALE}
          >
            {item.address}
          </Text>

          <View style={styles.metaRow}>
            <View style={styles.metaCluster}>
              <MaterialCommunityIcons
                name="phone-outline"
                size={ICON.meta}
                color={INK.muted}
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
                color={INK.muted}
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
  },
);

const SavedAddressScreen = () => {
  const navigation = useNavigation();
  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);
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
    React.useCallback(() => {
      refreshAddresses();
    }, [refreshAddresses]),
  );

  const goToEditor = useCallback(
    address =>
      navigation.navigate(
        'AddLocationScreen',
        address ? { address } : undefined,
      ),
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }) => (
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
          <Ionicons name="add" size={wp('4.6%')} color={ACCENT.primary} />
        </View>
        <Text style={styles.addRowText} maxFontSizeMultiplier={MAX_FONT_SCALE}>
          Add new location
        </Text>
        <Ionicons
          name="chevron-forward"
          size={wp('4%')}
          color={ACCENT.primary}
        />
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
              size={wp('8%')}
              color={INK.muted}
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
          <Image source={icons.backArrowNew} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerText} maxFontSizeMultiplier={MAX_FONT_SCALE}>
          Address
        </Text>
      </View>

      <FlatList
        data={addresses}
        keyExtractor={item => String(item.id)}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refreshAddresses}
            tintColor={ACCENT.primary}
            colors={[ACCENT.primary]}
          />
        }
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={listEmpty}
      />

      <LocationModal
        visible={isLocationModalVisible}
        onClose={() => setIsLocationModalVisible(false)}
      />
      {}
      <AddressConfirmationModal
        visible={!!addressConfirmationData}
        pincode={addressConfirmationData?.pincode}
        areaName={addressConfirmationData?.areaName}
        onClose={() => setAddressConfirmationData(null)}
      />
    </SafeAreaView>
  );
};

export default SavedAddressScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: SURFACE.base,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: GUTTER,
    paddingTop: hp('1.5%'),
    paddingBottom: hp('1.5%'),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: HAIRLINE,
  },
  backIcon: {
    resizeMode: 'contain',
    tintColor: INK.strong,
  },
  headerText: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('4.65%'),
    color: INK.strong,
    marginLeft: wp('3%'),
    letterSpacing: -0.3,
  },
  listContent: {
    paddingHorizontal: GUTTER,
    paddingTop: SPACE.base,
    paddingBottom: hp('6%'),
  },

  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SURFACE.tint,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACE.md,
    paddingVertical: SPACE.md,
    marginBottom: SPACE.base,
  },
  addIconWell: {
    width: wp('8%'),
    height: wp('8%'),
    borderRadius: RADIUS.pill,
    backgroundColor: ACCENT.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addRowText: {
    flex: 1,
    marginLeft: SPACE.md,
    ...TYPE.body,
    fontFamily: FONTS.gilroy.semiBold,
    color: ACCENT.primary,
  },

  card: {
    borderRadius: RADIUS.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(17,19,26,0.12)',
    backgroundColor: SURFACE.base,
    marginBottom: SPACE.md,
    overflow: 'hidden',
  },
  cardSelected: {
    borderWidth: 1.5,
    borderColor: ACCENT.success,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACE.md,
    paddingVertical: SPACE.sm,
    minHeight: hp('5.6%'),
  },
  typeCluster: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    marginRight: SPACE.sm,
  },
  typeWell: {
    width: wp('8%'),
    height: wp('8%'),
    borderRadius: RADIUS.pill,
    backgroundColor: SURFACE.sunken,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeWellActive: {
    backgroundColor: ACCENT.successSoft,
  },
  typeText: {
    marginLeft: SPACE.sm,
    ...TYPE.body,
    fontFamily: FONTS.gilroy.semiBold,
    color: INK.strong,
    flexShrink: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ACCENT.successSoft,
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACE.sm,
    paddingVertical: 3,
  },
  selectedPillText: {
    marginLeft: 3,
    ...TYPE.micro,
    fontFamily: FONTS.gilroy.semiBold,
    color: ACCENT.successText,
  },
  menuButton: {
    paddingLeft: SPACE.sm,
    paddingVertical: SPACE.xs,
  },

  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SURFACE.sunken,
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACE.xs,
  },
  actionButton: {
    paddingHorizontal: SPACE.sm,
    paddingVertical: SPACE.xs,
  },
  actionSeparator: {
    width: StyleSheet.hairlineWidth,
    alignSelf: 'stretch',
    marginVertical: SPACE.xs,
    backgroundColor: 'rgba(17,19,26,0.12)',
  },

  cardDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: HAIRLINE,
  },
  cardBody: {
    paddingHorizontal: SPACE.md,
    paddingTop: SPACE.sm,
    paddingBottom: SPACE.md,
  },
  addressLine: {
    ...TYPE.label,
    fontFamily: FONTS.gilroy.regular,
    color: INK.base,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACE.md,
  },
  metaCluster: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  metaText: {
    marginLeft: SPACE.xs,
    ...TYPE.caption,
    fontFamily: FONTS.gilroy.medium,
    color: INK.muted,
  },

  emptyState: {
    alignItems: 'center',
    paddingTop: hp('6%'),
    paddingHorizontal: wp('8%'),
  },
  emptyIconWell: {
    width: wp('16%'),
    height: wp('16%'),
    borderRadius: RADIUS.pill,
    backgroundColor: SURFACE.sunken,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    marginTop: SPACE.base,
    ...TYPE.heading,
    fontFamily: FONTS.gilroy.semiBold,
    color: INK.strong,
  },
  emptyBody: {
    marginTop: SPACE.xs,
    ...TYPE.label,
    fontFamily: FONTS.gilroy.regular,
    color: INK.muted,
    textAlign: 'center',
  },
});
