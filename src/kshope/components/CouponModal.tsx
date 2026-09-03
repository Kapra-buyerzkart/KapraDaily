import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
  Dimensions,
} from 'react-native';
import { colors } from '../theme/colours';
import { Fonts } from '../theme/fonts';
import { AppIcons } from '../assets/icons';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface CouponModalProps {
  visible: boolean;
  onClose: () => void;
  isGiftCard: boolean;
  availableCoupons: any[];
  availableGiftCards: any[];
  onCouponClick: (coupon: any) => void;
  profile?: 'user' | 'cart';
}

const CouponModal: React.FC<CouponModalProps> = ({
  visible,
  onClose,
  isGiftCard,
  availableCoupons,
  availableGiftCards,
  onCouponClick,
  profile = 'cart',
}) => {
  const [manualCode, setManualCode] = useState('');
  const offers = isGiftCard ? availableGiftCards : availableCoupons;
  const title = isGiftCard ? 'Available Gift Cards' : 'Available Coupons';
  const placeholder = isGiftCard ? 'Enter gift card code' : 'Enter coupon code';

  const renderOfferItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.offerItem}
      onPress={() => onCouponClick(item)}
      activeOpacity={0.7}
    >
      <View style={styles.offerIconContainer}>
        <AppIcons.ShoppingCart color={colors.themeTeal} size={24} />
      </View>
      <View style={styles.offerInfo}>
        <View style={styles.codeRow}>
          <Text style={styles.offerCode}>{item.couponCode || item.code}</Text>
          <Text style={styles.applyLabel}>
            {profile == 'user' ? 'COPY' : 'APPLY'}
          </Text>
        </View>
        <Text style={styles.offerTitle}>{item.title || item.couponName}</Text>
        <Text style={styles.offerDescription} numberOfLines={2}>
          {item.description || 'Get amazing discounts on your order'}
        </Text>
      </View>
    </TouchableOpacity>
  );

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
          onPress={onClose}
          activeOpacity={1}
        />
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.headerIndicator} />
            <View style={styles.headerTitleRow}>
              <Text style={styles.title}>
                {isGiftCard ? 'Gift Cards' : 'Coupons & Offers'}
              </Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <AppIcons.Close color={colors.black} size={24} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.manualEntryContainer}>
            <TextInput
              style={styles.input}
              placeholder={placeholder}
              placeholderTextColor="#999"
              value={manualCode}
              onChangeText={setManualCode}
              autoCapitalize="characters"
            />
            <TouchableOpacity
              onPress={() => onCouponClick({ code: manualCode })}
              disabled={!manualCode}
            >
              <Text
                style={[
                  styles.applyAction,
                  !manualCode && styles.applyActionDisabled,
                ]}
              >
                {profile === 'user' ? 'COPY' : 'APPLY'}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>{title}</Text>

          <FlatList
            data={offers}
            renderItem={renderOfferItem}
            keyExtractor={(item, index) => String(item.id || index)}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <View style={styles.emptyIconCircle}>
                  {isGiftCard ? (
                    <AppIcons.GiftCard size={44} color={colors.themeDarkGray} />
                  ) : (
                    <AppIcons.CouponTicket size={44} color={colors.themeDarkGray} />
                  )}
                </View>
                <Text style={styles.emptyText}>
                  {isGiftCard
                    ? 'No gift cards available right now'
                    : 'No coupons available right now'}
                </Text>
              </View>
            }
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  dismissArea: {
    flex: 1,
  },
  content: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    maxHeight: SCREEN_HEIGHT * 0.8,
    minHeight: SCREEN_HEIGHT * 0.5,
  },
  header: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 20,
  },
  headerIndicator: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    marginBottom: 16,
  },
  headerTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: colors.black,
  },
  closeButton: {
    padding: 4,
  },
  manualEntryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7F9',
    marginHorizontal: 24,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E8F0F5',
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: colors.black,
    padding: 0,
  },
  applyAction: {
    color: colors.themeTeal,
    fontFamily: Fonts.bold,
    fontSize: 14,
    marginLeft: 12,
  },
  applyActionDisabled: {
    color: '#CCC',
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: colors.black,
    marginHorizontal: 24,
    marginBottom: 16,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  offerItem: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E8F8FA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  offerIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.figmaTeal,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  offerInfo: {
    flex: 1,
  },
  codeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  offerCode: {
    fontSize: 14,
    fontFamily: Fonts.bold,
    color: colors.themeTeal,
    backgroundColor: colors.figmaTeal,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  applyLabel: {
    fontSize: 12,
    fontFamily: Fonts.bold,
    color: colors.themeTeal,
  },
  offerTitle: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: colors.black,
    marginBottom: 2,
  },
  offerDescription: {
    fontSize: 12,
    fontFamily: Fonts.gilroyMedium,
    color: '#666',
    lineHeight: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F3F5',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: Fonts.gilroyMedium,
    color: '#999',
    marginTop: 16,
  },
});

export default CouponModal;
