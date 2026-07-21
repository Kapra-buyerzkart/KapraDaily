import React from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import QRCode from 'react-native-qrcode-svg';
import { wp, hp } from '../../../utils/responsive';
import COLORS from '@/styles/colors';

// Full-screen enlarged QR. The offsets cancel the screen padding so the overlay
// covers the entire screen; tapping anywhere dismisses it. Animates against the
// shared `progress` value driven by useQrZoom.
const QrZoomOverlay = ({ ticket, progress, onClose }) => {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const qrZoomSize = Math.min(width * 0.72, height * 0.5);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
  }));

  const cardStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ scale: interpolate(progress.value, [0, 1], [0.6, 1]) }],
  }));

  return (
    <Animated.View
      style={[
        styles.qrZoomOverlay,
        {
          top: -(insets.top + hp(2)),
          bottom: -(insets.bottom + hp(2)),
          left: -wp(5),
          right: -wp(5),
        },
        backdropStyle,
      ]}
    >
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      <Animated.View style={[styles.qrZoomCard, cardStyle]} pointerEvents="none">
        {ticket.qrCodeUri ? (
          <Image
            source={{ uri: ticket.qrCodeUri }}
            style={{ width: qrZoomSize, height: qrZoomSize }}
            resizeMode="contain"
          />
        ) : (
          <QRCode value={ticket.qrValue || ticket.ticketId} size={qrZoomSize} />
        )}
      </Animated.View>
      <Text style={styles.qrZoomHint} pointerEvents="none">
        Tap anywhere to close
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  qrZoomOverlay: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.92)',
  },
  qrZoomCard: {
    backgroundColor: COLORS.white,
    padding: wp(6),
    borderRadius: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
  },
  qrZoomHint: {
    marginTop: hp(3),
    fontSize: 14,
    fontFamily: 'Gilroy-Medium',
    color: 'rgba(255,255,255,0.75)',
  },
});

export default QrZoomOverlay;
