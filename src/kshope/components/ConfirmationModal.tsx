import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { CART_COLORS, CART_FONTS, fs, s } from '../screens/Cart/cartRedesignTheme';

interface ConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  iconName?: string;
  themeColor?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  visible,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  iconName,
  themeColor,
}) => {
  const isDestructive =
    !themeColor ||
    themeColor === CART_COLORS.darkEmerald ||
    themeColor.toLowerCase().includes('red') ||
    confirmText.toLowerCase().includes('remove') ||
    confirmText.toLowerCase().includes('delete');

  const resolvedIcon =
    iconName === 'trash' || confirmText.toLowerCase().includes('remove')
      ? 'trash-outline'
      : iconName === 'warning'
      ? 'alert-circle-outline'
      : 'help-circle-outline';

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdropTouch}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={styles.modalContainer}>
          {/* Circular Luxury Icon Badge */}
          <View
            style={[
              styles.iconCircle,
              {
                backgroundColor: isDestructive ? '#FFF4EC' : CART_COLORS.emeraldTint,
                borderColor: isDestructive ? '#FCDCC8' : '#D1E6DD',
              },
            ]}
          >
            <Ionicons
              name={resolvedIcon}
              size={s(26)}
              color={themeColor || (isDestructive ? CART_COLORS.orange : CART_COLORS.darkEmerald)}
            />
          </View>

          {/* Title with Serif Luxury Typography */}
          <Text style={styles.title}>{title}</Text>

          {/* Descriptive Message */}
          <Text style={styles.message}>{message}</Text>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              activeOpacity={0.8}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText} numberOfLines={1}>
                {cancelText}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.confirmButton,
                themeColor ? { backgroundColor: themeColor } : {},
              ]}
              activeOpacity={0.85}
              onPress={() => {
                onClose();
                onConfirm();
              }}
            >
              <Text style={styles.confirmButtonText} numberOfLines={1}>
                {confirmText}
              </Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: s(24),
  },
  backdropTouch: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContainer: {
    width: '100%',
    maxWidth: s(340),
    backgroundColor: CART_COLORS.white,
    borderRadius: s(20),
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
  iconCircle: {
    width: s(54),
    height: s(54),
    borderRadius: s(27),
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: s(14),
  },
  title: {
    fontFamily: CART_FONTS.serifBold,
    fontSize: fs(20),
    color: CART_COLORS.textDark,
    marginBottom: s(8),
    textAlign: 'center',
    lineHeight: fs(24),
  },
  message: {
    fontFamily: CART_FONTS.sansRegular,
    fontSize: fs(13),
    color: CART_COLORS.textMuted,
    textAlign: 'center',
    marginBottom: s(22),
    lineHeight: fs(19),
    paddingHorizontal: s(6),
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: s(10),
  },
  cancelButton: {
    flex: 1,
    paddingVertical: s(12),
    borderRadius: s(12),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAF8F5',
    borderWidth: 1,
    borderColor: CART_COLORS.cardBorder,
  },
  confirmButton: {
    flex: 1,
    paddingVertical: s(12),
    borderRadius: s(12),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: CART_COLORS.darkEmerald,
  },
  cancelButtonText: {
    fontFamily: CART_FONTS.sansMedium,
    fontSize: fs(13.5),
    color: CART_COLORS.textDark,
  },
  confirmButtonText: {
    fontFamily: CART_FONTS.sansBold,
    fontSize: fs(13.5),
    color: CART_COLORS.white,
  },
});

export default ConfirmationModal;
