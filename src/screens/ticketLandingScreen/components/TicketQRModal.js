import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import QRCode from 'react-native-qrcode-svg';
import CustomModal, {
  MODAL_POSITION,
  MODAL_ANIMATION_PRESET,
} from '../../../components/modal/CustomModal';
import { wp, hp } from '../../../utils/responsive';
import ConcertTicket from '../../../components/ConcertTicket';
import icons from '@/assets/icons';
import COLORS from '@/styles/colors';

// Dummy ticket used until this is wired to real booking data.
const DUMMY_TICKET = {
  eventTitle: 'PAPON LIVE CONCERT',
  eventCategory: 'Musical concert',
  location: 'Edappally , kochi ,kerala',
  date: 'July 25, monday',
  time: '5:30 pm',
  ticketType: 'Gold Chair',
  seatNo: 'S4',
  ticketId: 'SDFGDH2335BNN',
};

const TicketQRModal = forwardRef(
  (
    { onClose, ticket = DUMMY_TICKET, tickets = null, coinBalance = '10.0 B' },
    ref,
  ) => {
    const modalRef = useRef(null);
    const openRef = useRef(false);
    const listRef = useRef(null);
    const { width, height } = useWindowDimensions();
    const insets = useSafeAreaInsets();

    // Normalize to a list so single- and multi-ticket bookings share one path.
    const list = useMemo(
      () => (Array.isArray(tickets) && tickets.length ? tickets : [ticket]),
      [tickets, ticket],
    );
    const isCarousel = list.length > 1;

    // Which card is centered (drives the scan line + counter) and which card's
    // QR the zoom overlay shows.
    const [activeIndex, setActiveIndex] = useState(0);
    const [zoomIndex, setZoomIndex] = useState(0);

    // 0 = ticket hidden, 1 = fully revealed. Layers a scale + upward drift on
    // top of CustomModal's backdrop/content fade so the ticket feels lifted
    // into view rather than just appearing.
    const ticketAnim = useSharedValue(0);

    // Full-screen enlarged QR overlay. `qrZoomed` gates whether the overlay is
    // mounted; `qrZoom` (0→1) drives its backdrop fade + card scale so it can
    // still play a close animation before unmounting.
    const [qrZoomed, setQrZoomed] = useState(false);
    const qrZoom = useSharedValue(0);

    // The enlarged QR fills most of the shorter screen axis so it stays square
    // and comfortably scannable regardless of orientation.
    const qrZoomSize = Math.min(width * 0.72, height * 0.5);

    const openQrZoom = useCallback(
      index => {
        setZoomIndex(typeof index === 'number' ? index : activeIndex);
        setQrZoomed(true);
        qrZoom.value = withTiming(1, {
          duration: 260,
          easing: Easing.out(Easing.cubic),
        });
      },
      [qrZoom, activeIndex],
    );

    const onMomentumScrollEnd = useCallback(
      e => {
        const idx = Math.round(e.nativeEvent.contentOffset.x / width);
        setActiveIndex(Math.max(0, Math.min(idx, list.length - 1)));
      },
      [width, list.length],
    );

    const closeQrZoom = useCallback(() => {
      qrZoom.value = withTiming(
        0,
        { duration: 200, easing: Easing.in(Easing.cubic) },
        finished => {
          if (finished) runOnJS(setQrZoomed)(false);
        },
      );
    }, [qrZoom]);

    const open = useCallback(() => {
      openRef.current = true;
      ticketAnim.value = 0;
      setActiveIndex(0);
      modalRef.current?.open();
      // Small delay so the ticket only starts easing once the portal node has
      // mounted, then scales/drifts up as the backdrop blur fades in.
      ticketAnim.value = withDelay(
        40,
        withTiming(1, { duration: 360, easing: Easing.out(Easing.cubic) }),
      );
    }, [ticketAnim]);

    const close = useCallback(() => modalRef.current?.close(), []);

    const handleClose = useCallback(() => {
      openRef.current = false;
      // Drop the zoom overlay so it never lingers into the next open.
      setQrZoomed(false);
      qrZoom.value = 0;
      onClose?.();
    }, [onClose, qrZoom]);

    useImperativeHandle(
      ref,
      () => ({
        open,
        close,
        toggle: () => (openRef.current ? close() : open()),
      }),
      [open, close],
    );

    const ticketAnimatedStyle = useAnimatedStyle(() => ({
      opacity: ticketAnim.value,
      transform: [
        { translateY: interpolate(ticketAnim.value, [0, 1], [24, 0]) },
        { scale: interpolate(ticketAnim.value, [0, 1], [0.9, 1]) },
      ],
    }));

    const qrZoomBackdropStyle = useAnimatedStyle(() => ({
      opacity: qrZoom.value,
    }));

    const qrZoomCardStyle = useAnimatedStyle(() => ({
      opacity: qrZoom.value,
      transform: [{ scale: interpolate(qrZoom.value, [0, 1], [0.6, 1]) }],
    }));

    return (
      <CustomModal
        ref={modalRef}
        position={MODAL_POSITION.CENTER}
        animationPreset={MODAL_ANIMATION_PRESET.FADE}
        animationDuration={320}
        width={width}
        maxHeight={height}
        backdropOpacity={1}
        gestureEnabled={false}
        scrollable={false}
        onClose={handleClose}
        containerStyle={styles.surface}
        contentStyle={[
          styles.content,
          {
            minHeight: height,
            paddingTop: insets.top + hp(2),
            paddingBottom: insets.bottom + hp(2),
          },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={close}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            activeOpacity={0.7}
          >
            <Image
              source={icons.backArrow}
              style={styles.backIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <Image
            source={icons.udenticketconimage}
            style={styles.titleImage}
            resizeMode="contain"
          />

          {/* Spacer keeps the title optically centered against the back button */}
          <View style={styles.backBtn} />
        </View>

        {/* Sub header: hint + coin balance chip */}
        <View style={styles.subHeader}>
          <Text style={styles.hintText}>Use UD-Coins to Book Your Tickets</Text>
          <View style={styles.coinChip}>
            <Image
              source={icons.udcoin}
              style={styles.coinIcon}
              resizeMode="contain"
            />
            <Text style={styles.coinText}>{coinBalance}</Text>
          </View>
        </View>

        {/* Ticket + QR card(s) — a plain paging FlatList: each ticket is one
            full-width page that swipes left/right reliably. */}
        <Animated.View style={[styles.ticketArea, ticketAnimatedStyle]}>
          <FlatList
            ref={listRef}
            data={list}
            keyExtractor={(item, i) => item.id ?? item.ticketId ?? String(i)}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={onMomentumScrollEnd}
            style={styles.carousel}
            renderItem={({ item, index }) => (
              <View style={[styles.page, { width }]}>
                <ConcertTicket
                  {...item}
                  showScanLine={index === activeIndex}
                  onQrPress={() => openQrZoom(index)}
                />
              </View>
            )}
          />
        </Animated.View>

        {/* Pager: dot indicators + position counter */}
        {isCarousel && (
          <View style={styles.pager}>
            <View style={styles.dots}>
              {list.map((item, i) => (
                <View
                  key={item.id ?? item.ticketId ?? i}
                  style={[styles.dot, i === activeIndex && styles.dotActive]}
                />
              ))}
            </View>
            <Text style={styles.counter}>
              {activeIndex + 1} of {list.length}
            </Text>
          </View>
        )}

        {/* Close button */}
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={close}
          activeOpacity={0.85}
        >
          <Text style={styles.closeBtnText}>✕</Text>
        </TouchableOpacity>

        {/* Full-screen enlarged QR. Offsets cancel the content padding so the
            overlay covers the entire screen; tapping anywhere dismisses it. */}
        {qrZoomed && (
          <Animated.View
            style={[
              styles.qrZoomOverlay,
              {
                top: -(insets.top + hp(2)),
                bottom: -(insets.bottom + hp(2)),
                left: -wp(5),
                right: -wp(5),
              },
              qrZoomBackdropStyle,
            ]}
          >
            <Pressable style={StyleSheet.absoluteFill} onPress={closeQrZoom} />
            <Animated.View
              style={[styles.qrZoomCard, qrZoomCardStyle]}
              pointerEvents="none"
            >
              {(list[zoomIndex] || list[0]).qrCodeUri ? (
                <Image
                  source={{ uri: (list[zoomIndex] || list[0]).qrCodeUri }}
                  style={{ width: qrZoomSize, height: qrZoomSize }}
                  resizeMode="contain"
                />
              ) : (
                <QRCode
                  value={
                    (list[zoomIndex] || list[0]).qrValue ||
                    (list[zoomIndex] || list[0]).ticketId
                  }
                  size={qrZoomSize}
                />
              )}
            </Animated.View>
            <Text style={styles.qrZoomHint} pointerEvents="none">
              Tap anywhere to close
            </Text>
          </Animated.View>
        )}
      </CustomModal>
    );
  },
);

TicketQRModal.displayName = 'TicketQRModal';

const styles = StyleSheet.create({
  // Full-bleed transparent surface so the dark backdrop shows through
  // instead of CustomModal's default white centered card.
  surface: {
    backgroundColor: 'transparent',
    borderRadius: 0,
  },
  content: {
    paddingHorizontal: wp(5),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: hp(2),
  },
  backBtn: {
    width: 34,
    height: 34,
    justifyContent: 'center',
  },
  backIcon: {
    width: 22,
    height: 22,
    tintColor: COLORS.white,
  },
  titleImage: {
    width: wp(48),
    height: hp(5),
  },
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: hp(2.5),
  },
  hintText: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Gilroy-Medium',
    color: COLORS.white,
  },
  coinChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.6),
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderWidth: 1,
    borderColor: 'rgba(242,80,0,0.6)',
  },
  coinIcon: {
    width: 20,
    height: 20,
  },
  coinText: {
    fontSize: 14,
    fontFamily: 'Gilroy-Bold',
    color: COLORS.white,
  },
  ticketArea: {
    flex: 1,
    justifyContent: 'center',
  },
  // Fill the ticket area so the horizontal list has a definite height and a
  // large touch target. The negative margins cancel the modal content's
  // horizontal padding so each page spans the full window width (what
  // pagingEnabled snaps to); the padding is re-applied per page below.
  carousel: {
    flex: 1,
    marginHorizontal: -wp(5),
  },
  // One full-width page per ticket; re-apply the content padding and center
  // the card vertically within the page.
  page: {
    justifyContent: 'center',
    paddingHorizontal: wp(5),
  },
  pager: {
    alignItems: 'center',
    marginTop: hp(1.5),
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  dotActive: {
    width: 20,
    backgroundColor: '#F25000',
  },
  counter: {
    marginTop: hp(1),
    fontSize: 13,
    fontFamily: 'Gilroy-Medium',
    color: 'rgba(255,255,255,0.75)',
  },
  closeBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: hp(2),
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  closeBtnText: {
    fontSize: 20,
    color: '#333333',
    fontFamily: 'Gilroy-Medium',
    lineHeight: 24,
  },
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

export default TicketQRModal;
