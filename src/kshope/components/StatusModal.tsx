import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { CART_COLORS, CART_FONTS, fs, s } from '../screens/Cart/cartRedesignTheme';

interface StatusModalProps {
  visible: boolean;
  onClose: () => void;
  type: 'success' | 'error' | 'warning' | any;
  title: string;
  message: string;
}

const StatusModal: React.FC<StatusModalProps> = ({
  visible,
  onClose,
  type = 'success',
  title,
  message,
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();
    } else {
      scaleAnim.setValue(0);
    }
  }, [scaleAnim, visible]);

  const getIconConfig = () => {
    switch (type) {
      case 'error':
        return {
          icon: 'close',
          color: CART_COLORS.orange,
          bg: '#FFF4EC',
          border: '#FCDCC8',
        };
      case 'warning':
        return {
          icon: 'alert-outline',
          color: CART_COLORS.gold,
          bg: '#FEF8EA',
          border: '#FCE8B2',
        };
      default:
        return {
          icon: 'checkmark',
          color: CART_COLORS.darkEmerald,
          bg: CART_COLORS.emeraldTint,
          border: '#D1E6DD',
        };
    }
  };

  const { icon, color, bg, border } = getIconConfig();

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
        <Animated.View
          style={[styles.content, { transform: [{ scale: scaleAnim }] }]}
        >
          {/* Circular Luxury Status Icon */}
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: bg, borderColor: border },
            ]}
          >
            <Ionicons name={icon} color={color} size={s(28)} />
          </View>

          {/* Title */}
          <Text style={styles.title}>{title}</Text>

          {/* Message */}
          <Text style={styles.message}>{message}</Text>

          {/* Primary Action Button */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.88}
          >
            <Text style={styles.closeButtonText}>OK</Text>
          </TouchableOpacity>
        </Animated.View>
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
    paddingVertical: s(24),
    paddingHorizontal: s(22),
    width: '100%',
    maxWidth: s(340),
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
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: s(14),
  },
  title: {
    fontSize: fs(20),
    fontFamily: CART_FONTS.serifBold,
    color: CART_COLORS.textDark,
    marginBottom: s(8),
    textAlign: 'center',
  },
  message: {
    fontSize: fs(13),
    fontFamily: CART_FONTS.sansRegular,
    color: CART_COLORS.textMuted,
    textAlign: 'center',
    marginBottom: s(22),
    lineHeight: fs(18),
    paddingHorizontal: s(6),
  },
  closeButton: {
    backgroundColor: CART_COLORS.darkEmerald,
    height: s(48),
    borderRadius: s(12),
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: CART_COLORS.white,
    fontFamily: CART_FONTS.sansBold,
    fontSize: fs(14),
  },
});

export default StatusModal;
