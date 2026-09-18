import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { CART_COLORS, CART_FONTS, fs, s } from '../screens/Cart/cartRedesignTheme';

interface AddressConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  data: {
    pincode: string;
    areaName: string;
    isServiceable: boolean;
    unavailableMessage?: string;
    isPlacingOrder?: boolean;
  } | null;
}

const AddressConfirmationModal: React.FC<AddressConfirmationModalProps> = ({
  visible,
  onClose,
  onConfirm,
  data,
}) => {
  if (!data) return null;

  const { pincode, areaName, isServiceable, unavailableMessage } = data;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdropTouch}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={styles.content}>
          {/* Circular Luxury Status Icon */}
          <View
            style={[
              styles.iconContainer,
              !isServiceable && styles.iconContainerError,
            ]}
          >
            <Ionicons
              name={isServiceable ? 'checkmark' : 'close'}
              size={s(28)}
              color={isServiceable ? CART_COLORS.darkEmerald : CART_COLORS.orange}
            />
          </View>

          {/* Title in Serif Bold */}
          <Text style={styles.title}>
            {isServiceable ? 'Confirm Address' : 'Service Unavailable'}
          </Text>

          {/* Address Details Card */}
          <View style={styles.addressBox}>
            <View style={styles.addressRow}>
              <Text style={styles.label}>Pincode</Text>
              <Text style={styles.value}>{pincode}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.addressRow}>
              <Text style={styles.label}>Area</Text>
              <Text style={styles.value} numberOfLines={2}>
                {areaName}
              </Text>
            </View>
          </View>

          {/* Contextual Notice Message */}
          {isServiceable ? (
            <Text style={styles.message}>
              Is this the correct delivery address for your jewellery order?
            </Text>
          ) : (
            <Text style={[styles.message, styles.messageError]}>
              {unavailableMessage ||
                'Delivery is currently not available in this area.'}
            </Text>
          )}

          {/* Actions */}
          <View style={styles.buttonContainer}>
            {isServiceable ? (
              <>
                <TouchableOpacity
                  style={[styles.button, styles.confirmButton]}
                  activeOpacity={0.88}
                  onPress={onConfirm}
                >
                  <Text style={styles.confirmButtonText}>
                    Confirm & Place Order
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  activeOpacity={0.8}
                  onPress={onClose}
                >
                  <Text style={styles.cancelButtonText}>Change Address</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                style={[styles.button, styles.confirmButton]}
                activeOpacity={0.88}
                onPress={onClose}
              >
                <Text style={styles.confirmButtonText}>Change Address</Text>
              </TouchableOpacity>
            )}
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: s(24),
  },
  backdropTouch: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    backgroundColor: CART_COLORS.white,
    borderRadius: s(22),
    width: '100%',
    maxWidth: s(340),
    paddingVertical: s(24),
    paddingHorizontal: s(20),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: CART_COLORS.cardBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 8,
  },
  iconContainer: {
    width: s(54),
    height: s(54),
    borderRadius: s(27),
    backgroundColor: CART_COLORS.emeraldTint,
    borderWidth: 1,
    borderColor: '#D1E6DD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: s(14),
  },
  iconContainerError: {
    backgroundColor: '#FFF4EC',
    borderColor: '#FCDCC8',
  },
  title: {
    fontSize: fs(20),
    fontFamily: CART_FONTS.serifBold,
    color: CART_COLORS.textDark,
    marginBottom: s(14),
    textAlign: 'center',
  },
  addressBox: {
    backgroundColor: '#FAF8F5',
    borderRadius: s(14),
    padding: s(14),
    width: '100%',
    marginBottom: s(14),
    borderWidth: 1,
    borderColor: CART_COLORS.cardBorder,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: CART_COLORS.cardBorderSubtle,
    marginVertical: s(8),
  },
  label: {
    width: s(72),
    fontSize: fs(12),
    fontFamily: CART_FONTS.sansRegular,
    color: CART_COLORS.textMuted,
  },
  value: {
    flex: 1,
    fontSize: fs(13),
    fontFamily: CART_FONTS.sansBold,
    color: CART_COLORS.textDark,
  },
  message: {
    fontSize: fs(13),
    fontFamily: CART_FONTS.sansRegular,
    color: CART_COLORS.textMuted,
    textAlign: 'center',
    marginBottom: s(20),
    lineHeight: fs(18),
    paddingHorizontal: s(6),
  },
  messageError: {
    color: CART_COLORS.orange,
  },
  buttonContainer: {
    width: '100%',
    gap: s(10),
  },
  button: {
    height: s(48),
    borderRadius: s(12),
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  confirmButton: {
    backgroundColor: CART_COLORS.darkEmerald,
  },
  confirmButtonText: {
    color: CART_COLORS.white,
    fontSize: fs(13.5),
    fontFamily: CART_FONTS.sansBold,
  },
  cancelButton: {
    backgroundColor: '#FAF8F5',
    borderWidth: 1,
    borderColor: CART_COLORS.cardBorder,
  },
  cancelButtonText: {
    color: CART_COLORS.textDark,
    fontSize: fs(13.5),
    fontFamily: CART_FONTS.sansMedium,
  },
});

export default AddressConfirmationModal;
