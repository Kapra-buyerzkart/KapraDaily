import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { CART_COLORS, CART_FONTS, fs, s } from '../screens/Cart/cartRedesignTheme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface AddressModalProps {
  visible: boolean;
  onClose: () => void;
  addresses: any[];
  onSelectAddress: (
    addressId: string | number,
    showConfirmation: boolean,
  ) => void;
}

const AddressModal: React.FC<AddressModalProps> = ({
  visible,
  onClose,
  addresses,
  onSelectAddress,
}) => {
  const navigation = useNavigation<any>();

  const renderAddressItem = (item: any) => {
    const isSelected = item.selected;
    const isHome = item.type?.toLowerCase() === 'home';
    const isOffice = item.type?.toLowerCase() === 'office' || item.type?.toLowerCase() === 'work';

    return (
      <TouchableOpacity
        key={item.id}
        activeOpacity={0.85}
        style={[styles.addressItem, isSelected && styles.addressItemActive]}
        onPress={() => {
          onSelectAddress(item.id, false);
          onClose();
        }}
      >
        <View style={styles.addressTypeHeader}>
          <View style={styles.typeRow}>
            <View
              style={[
                styles.typeIcon,
                isSelected && styles.typeIconActive,
              ]}
            >
              <Ionicons
                name={isHome ? 'home-outline' : isOffice ? 'business-outline' : 'location-outline'}
                size={s(16)}
                color={isSelected ? CART_COLORS.white : CART_COLORS.darkEmerald}
              />
            </View>
            <Text style={styles.addressTypeText}>{item.type || 'Home'}</Text>
          </View>
          <View
            style={[styles.radioOuter, isSelected && styles.radioOuterActive]}
          >
            {isSelected && <View style={styles.radioInner} />}
          </View>
        </View>
        <Text style={styles.addressText} numberOfLines={3}>
          {item.address}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.dismissArea}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={styles.content}>
          {/* Top Sheet Pull Indicator */}
          <View style={styles.pullIndicator} />

          {/* Modal Header */}
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <Text style={styles.title}>Select Delivery Address</Text>
              <TouchableOpacity
                style={styles.closeButton}
                activeOpacity={0.7}
                onPress={onClose}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="close" size={s(20)} color={CART_COLORS.textDark} />
              </TouchableOpacity>
            </View>

            {/* Add New Address Action Pill */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.addNewButton}
              onPress={() => {
                navigation.navigate('KshopeAddLocation');
                onClose();
              }}
            >
              <Ionicons name="add" size={s(17)} color={CART_COLORS.darkEmerald} />
              <Text style={styles.addNewText}>Add New Address</Text>
            </TouchableOpacity>
          </View>

          {/* Address List */}
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {addresses && addresses.length > 0 ? (
              addresses.map(renderAddressItem)
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="location-outline" size={s(36)} color="#C0B8AD" />
                <Text style={styles.emptyTitle}>No Addresses Found</Text>
                <Text style={styles.emptyText}>Add a delivery address to complete your order.</Text>
              </View>
            )}
          </ScrollView>

          {/* Footer Deliver Button */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.confirmButton}
              activeOpacity={0.88}
              onPress={onClose}
            >
              <Text style={styles.confirmButtonText}>Deliver to Selected Address</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.48)',
    justifyContent: 'flex-end',
  },
  dismissArea: {
    flex: 1,
  },
  content: {
    backgroundColor: CART_COLORS.white,
    borderTopLeftRadius: s(24),
    borderTopRightRadius: s(24),
    maxHeight: SCREEN_HEIGHT * 0.82,
    paddingBottom: Platform.OS === 'ios' ? s(34) : s(18),
    borderWidth: 1,
    borderColor: CART_COLORS.cardBorder,
  },
  pullIndicator: {
    width: s(40),
    height: s(4),
    borderRadius: s(2),
    backgroundColor: '#DCD6CE',
    alignSelf: 'center',
    marginTop: s(10),
    marginBottom: s(6),
  },
  header: {
    paddingHorizontal: s(20),
    paddingTop: s(8),
    paddingBottom: s(14),
    borderBottomWidth: 1,
    borderBottomColor: CART_COLORS.cardBorderSubtle,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: s(12),
  },
  title: {
    fontSize: fs(20),
    fontFamily: CART_FONTS.serifBold,
    color: CART_COLORS.textDark,
  },
  closeButton: {
    width: s(32),
    height: s(32),
    borderRadius: s(16),
    backgroundColor: '#FAF8F5',
    borderWidth: 1,
    borderColor: CART_COLORS.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addNewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: CART_COLORS.emeraldTint,
    paddingVertical: s(6),
    paddingHorizontal: s(12),
    borderRadius: s(20),
    borderWidth: 1,
    borderColor: '#C8DFD4',
    gap: s(4),
  },
  addNewText: {
    fontSize: fs(12.5),
    fontFamily: CART_FONTS.sansBold,
    color: CART_COLORS.darkEmerald,
  },
  scroll: {
    paddingHorizontal: s(20),
    paddingTop: s(14),
  },
  scrollContent: {
    paddingBottom: s(16),
    gap: s(10),
  },
  addressItem: {
    backgroundColor: '#FAF8F5',
    borderRadius: s(14),
    padding: s(14),
    borderWidth: 1,
    borderColor: CART_COLORS.cardBorder,
  },
  addressItemActive: {
    backgroundColor: '#F5FAF7',
    borderColor: CART_COLORS.darkEmerald,
  },
  addressTypeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: s(6),
  },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(8),
  },
  typeIcon: {
    width: s(28),
    height: s(28),
    borderRadius: s(8),
    backgroundColor: CART_COLORS.emeraldTint,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeIconActive: {
    backgroundColor: CART_COLORS.darkEmerald,
  },
  addressTypeText: {
    fontSize: fs(14),
    fontFamily: CART_FONTS.sansBold,
    color: CART_COLORS.textDark,
  },
  radioOuter: {
    width: s(18),
    height: s(18),
    borderRadius: s(9),
    borderWidth: 1.5,
    borderColor: '#CCC5BC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterActive: {
    borderColor: CART_COLORS.darkEmerald,
  },
  radioInner: {
    width: s(9),
    height: s(9),
    borderRadius: s(4.5),
    backgroundColor: CART_COLORS.darkEmerald,
  },
  addressText: {
    fontSize: fs(12),
    fontFamily: CART_FONTS.sansRegular,
    color: CART_COLORS.textMuted,
    lineHeight: fs(17),
    marginTop: s(2),
  },
  footer: {
    paddingHorizontal: s(20),
    paddingTop: s(10),
    borderTopWidth: 1,
    borderTopColor: CART_COLORS.cardBorderSubtle,
  },
  confirmButton: {
    backgroundColor: CART_COLORS.darkEmerald,
    height: s(48),
    borderRadius: s(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmButtonText: {
    color: CART_COLORS.white,
    fontSize: fs(14),
    fontFamily: CART_FONTS.sansBold,
  },
  emptyState: {
    paddingVertical: s(36),
    alignItems: 'center',
    gap: s(8),
  },
  emptyTitle: {
    fontSize: fs(16),
    fontFamily: CART_FONTS.serifBold,
    color: CART_COLORS.textDark,
  },
  emptyText: {
    color: CART_COLORS.textMuted,
    fontFamily: CART_FONTS.sansRegular,
    fontSize: fs(12.5),
    textAlign: 'center',
  },
});

export default AddressModal;
