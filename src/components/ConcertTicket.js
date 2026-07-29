import React, { useEffect } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import QRCode from 'react-native-qrcode-svg';
import { wp, hp } from '../utils/responsive';
import COLORS from '@/styles/colors';

const DASHES = Array.from({ length: 22 });
const QR_PADDING = 10;
const NOTCH = 22;
const CARD_RADIUS = 20;

const HERO_CORNERS = {
  borderTopLeftRadius: CARD_RADIUS,
  borderTopRightRadius: CARD_RADIUS,
};

const ConcertTicket = ({
  ticketImage,
  eventTitle = 'PAPON LIVE CONCERT',
  eventCategory = 'Musical concert',
  location = 'Edapally , kochi ,kerala',
  date = 'July 25, monday',
  time = '9:00 AM - 4:00 AM',
  ticketType,
  seatNo = 'S4',
  ticketId = 'SDFGDH2335BNN',
  qrCodeUri = null,
  qrValue = null,
  showScanLine = false,
  onQrPress = null,
  // The notches are punched out of the card, so they have to be painted in the
  // colour of whatever sits behind it.
  notchColor = COLORS.black,
  style,
}) => {
  const qrSize = wp(28);
  const qrBoxSize = qrSize + QR_PADDING * 2;

  // Scanner-style sweep: a bright accent line runs top→bottom across the QR
  // a couple of times shortly after the ticket has settled, evoking the code
  // being read. Replays on every mount (i.e. every time the modal reopens).
  const scan = useSharedValue(0);
  useEffect(() => {
    if (!showScanLine) return;
    scan.value = 0;
    scan.value = withDelay(
      260,
      withRepeat(
        withTiming(1, { duration: 1100, easing: Easing.inOut(Easing.ease) }),
        2,
        false,
      ),
    );
  }, [showScanLine, scan]);

  const scanStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scan.value, [0, 0.1, 0.9, 1], [0, 1, 1, 0]),
    transform: [
      { translateY: interpolate(scan.value, [0, 1], [0, qrBoxSize]) },
    ],
  }));

  return (
    <View style={[styles.wrapper, style]}>
      <View style={styles.card}>
        <View style={styles.heroWrap}>
          <Image source={ticketImage} style={styles.heroFill} blurRadius={18} />
          <View pointerEvents="none" style={styles.heroFillScrim} />
          <Image source={ticketImage} style={styles.hero} />
          <LinearGradient
            pointerEvents="none"
            colors={['transparent', 'rgba(0,0,0,0.65)']}
            style={styles.heroScrim}
          />
        </View>

        {/* Tear line between the banner and the stub */}
        <View style={styles.perforation}>
          <View
            style={[
              styles.notch,
              styles.notchLeft,
              { backgroundColor: notchColor },
            ]}
          />
          <View style={styles.dashes}>
            {DASHES.map((_, i) => (
              <View key={i} style={styles.dash} />
            ))}
          </View>
          <View
            style={[
              styles.notch,
              styles.notchRight,
              { backgroundColor: notchColor },
            ]}
          />
        </View>

        <View style={styles.body}>
          <View style={styles.leftCol}>
            <Text style={styles.eventTitle} numberOfLines={2}>
              {eventTitle}
            </Text>

            <View style={styles.fieldBlock}>
              <Text style={styles.label}>LOCATION</Text>
              <Text style={styles.value} numberOfLines={2}>
                {location}
              </Text>
            </View>

            <View style={styles.fieldBlock}>
              <Text style={styles.label}>DATE</Text>
              <Text style={styles.value}>{date}</Text>
            </View>

            <View style={styles.fieldBlock}>
              <Text style={styles.label}>TIME</Text>
              <Text style={styles.value}>{time}</Text>
            </View>

            <View style={[styles.fieldBlock, styles.lastField]}>
              <Text style={styles.label}>TICKET ID</Text>
              <Text style={[styles.value, styles.ticketId]} numberOfLines={1}>
                {ticketId}
              </Text>
            </View>
          </View>

          <View style={styles.colDivider} />

          <View style={[styles.rightCol, { width: qrBoxSize }]}>
            {/* The type block is dropped entirely when the booking has no
                category name rather than showing a placeholder. */}
            {!!ticketType && (
              <View style={styles.fieldBlock}>
                <Text style={styles.label}>TICKET TYPE</Text>
                <Text style={styles.value} numberOfLines={2}>
                  {ticketType}
                </Text>
              </View>
            )}
            <View style={styles.fieldBlock}>
              <Text style={styles.label}>SEAT NO</Text>
              <View style={styles.seatChip}>
                <Text style={styles.seatText}>{seatNo}</Text>
              </View>
            </View>

            <Pressable
              style={styles.qrWrap}
              onPress={onQrPress || undefined}
              disabled={!onQrPress}
              hitSlop={10}
              accessibilityRole={onQrPress ? 'button' : undefined}
              accessibilityLabel={onQrPress ? 'Enlarge QR code' : undefined}
            >
              <View style={styles.qrBox}>
                {qrCodeUri ? (
                  <Image
                    source={{ uri: qrCodeUri }}
                    style={{ width: qrSize, height: qrSize }}
                    resizeMode="contain"
                  />
                ) : (
                  <QRCode value={qrValue || ticketId} size={qrSize} />
                )}
              </View>
              {showScanLine && (
                <Animated.View
                  pointerEvents="none"
                  style={[styles.scanLine, scanStyle]}
                />
              )}
            </Pressable>

            {!!onQrPress && <Text style={styles.qrHint}>Tap to enlarge</Text>}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    // Shadow lives on the wrapper because the card clips its own overflow.
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 12,
  },
  // The banner bleeds to the card edges, so the padding lives on the body and
  // the rounded corners are clipped on the card itself.
  card: {
    backgroundColor: COLORS.white,
    borderRadius: CARD_RADIUS,
    overflow: 'hidden',
  },
  heroWrap: {
    width: '100%',
    height: hp(19),
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    overflow: 'hidden',
    ...HERO_CORNERS,
  },

  heroFill: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    resizeMode: 'stretch',
    ...HERO_CORNERS,
  },
  heroFillScrim: {
    ...StyleSheet.absoluteFillObject,
    ...HERO_CORNERS,
  },
  // The poster fills the banner edge to edge so it meets the card's rounded
  // corners; portrait art is cropped top/bottom rather than letterboxed.
  hero: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    ...HERO_CORNERS,
  },
  heroScrim: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: hp(9),
  },
  categoryChip: {
    position: 'absolute',
    left: wp(4.5),
    bottom: hp(1.4),
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '75%',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  categoryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
    backgroundColor: COLORS.primary,
  },
  categoryText: {
    flexShrink: 1,
    fontSize: 11,
    fontFamily: 'Gilroy-Bold',
    letterSpacing: 0.6,
    color: COLORS.white,
    textTransform: 'uppercase',
  },
  perforation: {
    height: NOTCH,
    justifyContent: 'center',
  },
  // Half-circles punched out of either edge; the card's overflow clip hides
  // the outer half.
  notch: {
    position: 'absolute',
    top: 0,
    width: NOTCH,
    height: NOTCH,
    borderRadius: NOTCH / 2,
  },
  notchLeft: {
    left: -NOTCH / 2,
  },
  notchRight: {
    right: -NOTCH / 2,
  },
  dashes: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: NOTCH / 2 + 6,
  },
  dash: {
    flex: 1,
    height: 1.5,
    marginHorizontal: 3,
    borderRadius: 1,
    backgroundColor: '#E3E3E3',
  },
  body: {
    flexDirection: 'row',
    paddingHorizontal: wp(4.5),
    paddingTop: hp(1.2),
    paddingBottom: hp(2.5),
  },
  leftCol: {
    flex: 1,
  },
  // Width is set inline from the QR size so the code sits flush in the column.
  rightCol: {
    alignItems: 'flex-start',
  },
  colDivider: {
    width: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: wp(3.5),
  },
  eventTitle: {
    fontSize: 18,
    lineHeight: 23,
    fontFamily: 'Gilroy-Bold',
    color: COLORS.textPrimary,
    letterSpacing: -0.2,
    marginBottom: hp(1.8),
  },
  fieldBlock: {
    marginBottom: hp(1.7),
  },
  lastField: {
    marginBottom: 0,
  },
  label: {
    fontSize: 10,
    fontFamily: 'Gilroy-Bold',
    color: COLORS.textFaint,
    letterSpacing: 1.1,
    marginBottom: 3,
  },
  value: {
    fontSize: 14,
    fontFamily: 'Gilroy-Bold',
    color: COLORS.textPrimary,
  },
  ticketId: {
    letterSpacing: 0.8,
    color: COLORS.textSecondary,
  },
  seatChip: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: COLORS.primaryTint,
  },
  seatText: {
    fontSize: 14,
    fontFamily: 'Gilroy-Bold',
    color: COLORS.primary,
    letterSpacing: 0.4,
  },
  // Pushed to the bottom of the right column so it lines up with the end of
  // the details stack, however tall that grows.
  qrWrap: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 14,
    marginTop: 'auto',
  },
  qrBox: {
    backgroundColor: COLORS.white,
    padding: QR_PADDING,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EDEDED',
  },
  bracket: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderColor: COLORS.primary,
  },
  bracketTL: {
    top: 0,
    left: 0,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderTopLeftRadius: 8,
  },
  bracketTR: {
    top: 0,
    right: 0,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderTopRightRadius: 8,
  },
  bracketBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderBottomLeftRadius: 8,
  },
  bracketBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderBottomRightRadius: 8,
  },
  qrHint: {
    alignSelf: 'center',
    marginTop: 6,
    fontSize: 10,
    fontFamily: 'Gilroy-Medium',
    color: COLORS.textFaint,
    letterSpacing: 0.3,
  },
  scanLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
    elevation: 4,
  },
});

export default ConcertTicket;
