import {
  View,
  Text,
  Image,
  Animated,
  Easing,
  Platform,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
  Vibration,
} from 'react-native';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { openSettings } from 'react-native-permissions';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import icons from '@/assets/icons';
import COLORS from '@/styles/colors';
import { useTicketValidation } from '../../hooks/useTicketValidation';
import logger from '../../utils/logger';
import { styles } from './styles';

const FIELD_KEYS = {
  event: ['eventName', 'event', 'eventTitle'],
  attendee: ['attendeeName', 'customerName', 'custName', 'userName'],
  category: ['ticketCategory', 'ticketCategoryName', 'ticketType', 'category'],
  ticketNo: ['ticketNumber', 'ticketNo', 'ticketId'],
  quantity: ['quantity', 'qty'],
  checkedInAt: ['checkedInAt', 'checkInTime', 'validatedAt'],
};

// The validate response shape varies by ticket type, so each field takes the
// first key the backend actually sent.
const pickField = (ticket, keys) => {
  if (!ticket || typeof ticket !== 'object') return null;
  const key = keys.find(
    k => ticket[k] !== undefined && ticket[k] !== null && ticket[k] !== '',
  );
  return key ? String(ticket[key]) : null;
};

// Only the clock time earns space in the meta strip - the date is almost always
// today, and staff are reading this at a gate.
const formatClock = value => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// 'invalid' is the server's verdict on a real ticket; 'error' means we never
// got a verdict at all. They must not look the same at the gate.
const RESULT_STYLES = {
  valid: {
    icon: 'checkmark-circle',
    title: 'Ticket Valid',
    color: COLORS.success,
    tint: COLORS.successTint,
  },
  invalid: {
    icon: 'close-circle',
    title: 'Ticket Rejected',
    color: COLORS.danger,
    tint: COLORS.errorTint,
  },
  error: {
    icon: 'alert-circle',
    title: 'Could Not Verify',
    color: COLORS.warning,
    tint: COLORS.warningTint,
  },
};

const VALID_DISMISS_MS = 2000;

// One pulse for a clean check-in, two for anything that needs reading. iOS
// plays a fixed-length pulse and reads a pattern's numbers as the gaps between
// pulses; Android reads them as alternating gap and pulse - so the same two
// buzzes need different arrays.
const notifyVerdict = status => {
  if (status === 'valid') {
    Vibration.vibrate(45);
    return;
  }
  Vibration.vibrate(Platform.OS === 'ios' ? [0, 240] : [0, 180, 120, 180]);
};

const buildTicketInfo = ticket => ({
  attendee: pickField(ticket, FIELD_KEYS.attendee),
  eventName: pickField(ticket, FIELD_KEYS.event),
  category: pickField(ticket, FIELD_KEYS.category),
  meta: [
    { label: 'Ticket No', value: pickField(ticket, FIELD_KEYS.ticketNo) },
    { label: 'Qty', value: pickField(ticket, FIELD_KEYS.quantity) },
    {
      label: 'Time',
      value: formatClock(pickField(ticket, FIELD_KEYS.checkedInAt)),
    },
  ].filter(cell => cell.value),
});

export default function QRScannerScreen() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const device = useCameraDevice('back');
  const { hasPermission, requestPermission } = useCameraPermission();
  const [permissionAsked, setPermissionAsked] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [scannedValue, setScannedValue] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const scanLockRef = useRef(false);
  const notifiedResultRef = useRef(null);
  const cardAnim = useRef(new Animated.Value(0)).current;
  const iconAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(1)).current;

  const { validateTicket, validating, result, resetResult } =
    useTicketValidation();

  useEffect(() => {
    if (hasPermission) return;
    requestPermission().finally(() => setPermissionAsked(true));
  }, [hasPermission, requestPermission]);

  const handleCodeScanned = useCallback(
    codes => {
      const value = codes?.[0]?.value;
      if (!value || scanLockRef.current) return;
      scanLockRef.current = true;
      setScannedValue(value);
      validateTicket(value);
    },
    [validateTicket],
  );

  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: handleCodeScanned,
  });

  const scanAgain = useCallback(() => {
    resetResult();
    setScannedValue(null);
    scanLockRef.current = false;
  }, [resetResult]);

  const retryValidation = useCallback(() => {
    if (scannedValue) validateTicket(scannedValue);
  }, [scannedValue, validateTicket]);

  // Keyed on the result object, not its status, so a retry that fails the same
  // way still buzzes.
  useEffect(() => {
    if (validating || !result || notifiedResultRef.current === result) return;
    notifiedResultRef.current = result;
    notifyVerdict(result.status);
  }, [result, validating]);

  // Only a clean check-in clears itself; rejections and errors wait to be
  // dismissed by hand, because those are the ones someone has to read.
  useEffect(() => {
    if (validating || result?.status !== 'valid') return;
    const timer = setTimeout(scanAgain, VALID_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [result?.status, validating, scanAgain]);

  const resultStyle = RESULT_STYLES[result?.status] ?? RESULT_STYLES.error;
  // Without this the fallback style above would flash amber behind the spinner.
  const showVerdict = Boolean(result) && !validating;
  const ticketInfo = useMemo(
    () => buildTicketInfo(result?.ticket),
    [result?.ticket],
  );

  // The card rises as soon as a code is caught, so the spinner and the verdict
  // that replaces it read as one sheet rather than two.
  useEffect(() => {
    if (!scannedValue) {
      cardAnim.setValue(0);
      return;
    }
    Animated.spring(cardAnim, {
      toValue: 1,
      friction: 8,
      tension: 70,
      useNativeDriver: true,
    }).start();
  }, [scannedValue, cardAnim]);

  // The icon pops on arrival - it is the moment staff are waiting for.
  useEffect(() => {
    if (!showVerdict) {
      iconAnim.setValue(0);
      return;
    }
    Animated.spring(iconAnim, {
      toValue: 1,
      friction: 4,
      tension: 90,
      useNativeDriver: true,
    }).start();
  }, [showVerdict, iconAnim]);

  // Drains in step with the auto-dismiss timer, so the card visibly says how
  // long is left rather than vanishing unannounced.
  useEffect(() => {
    if (validating || result?.status !== 'valid') return;
    progressAnim.setValue(1);
    Animated.timing(progressAnim, {
      toValue: 0,
      duration: VALID_DISMISS_MS,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }, [result?.status, validating, progressAnim]);

  const handleCameraError = useCallback(error => {
    // Without this the session just dies behind a black screen.
    logger.error(
      '[QRScannerScreen] camera error:',
      error?.code,
      error?.message,
    );
    setCameraError(error?.message || 'The camera stopped unexpectedly.');
  }, []);

  const header = useMemo(
    () => (
      <View style={styles.header}>
        <TouchableOpacity
          hitSlop={20}
          onPress={() => navigation.goBack()}
          style={styles.iconButton}
        >
          <Image source={icons.backArrowNew} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan Ticket</Text>
        {device?.hasTorch ? (
          <TouchableOpacity
            hitSlop={20}
            onPress={() => setTorchOn(prev => !prev)}
            style={styles.iconButton}
          >
            <Ionicons
              name={torchOn ? 'flash' : 'flash-off'}
              color={COLORS.white}
              size={wp('5%')}
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.iconButton} />
        )}
      </View>
    ),
    [device?.hasTorch, navigation, torchOn],
  );

  const renderMessage = (title, message, actionLabel, onAction) => (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.black} />
      {header}
      <View style={styles.messageContainer}>
        <Ionicons name="camera-outline" color={COLORS.white} size={wp('14%')} />
        <Text style={styles.messageTitle}>{title}</Text>
        <Text style={styles.messageText}>{message}</Text>
        {actionLabel ? (
          <TouchableOpacity style={styles.messageButton} onPress={onAction}>
            <Text style={styles.primaryButtonText}>{actionLabel}</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </SafeAreaView>
  );

  if (!hasPermission) {
    // Until the OS dialog has been answered there is nothing useful to show.
    if (!permissionAsked) return <View style={styles.container} />;
    return renderMessage(
      'Camera access needed',
      'Allow camera access to scan QR codes. You can turn it on from your device settings.',
      'Open Settings',
      () => openSettings(),
    );
  }

  if (!device) {
    return renderMessage(
      'No camera found',
      'This device does not have a camera we can use for scanning.',
    );
  }

  if (cameraError) {
    return renderMessage('Camera unavailable', cameraError, 'Try Again', () =>
      setCameraError(null),
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.black} />
      <Camera
        style={styles.fill}
        device={device}
        // Stop the camera while the screen is in the background or while a
        // result is on screen.
        isActive={isFocused && !scannedValue}
        torch={torchOn ? 'on' : 'off'}
        codeScanner={codeScanner}
        onError={handleCameraError}
      />

      <View style={styles.overlay} pointerEvents="none">
        <View style={styles.scrimFill} />
        <View style={styles.overlayMiddleRow}>
          <View style={styles.scrimFill} />
          <View style={styles.frame}>
            <View style={[styles.corner, styles.cornerTopLeft]} />
            <View style={[styles.corner, styles.cornerTopRight]} />
            <View style={[styles.corner, styles.cornerBottomLeft]} />
            <View style={[styles.corner, styles.cornerBottomRight]} />
          </View>
          <View style={styles.scrimFill} />
        </View>
        <View style={styles.scrimFill}>
          {!scannedValue && (
            <Text style={styles.hintText}>
              Point your camera at a ticket QR code to check it in
            </Text>
          )}
        </View>
      </View>

      <SafeAreaView edges={['top']} style={styles.headerOverlay}>
        {header}
      </SafeAreaView>

      {scannedValue ? (
        <Animated.View
          style={[
            styles.resultWrap,
            {
              opacity: cardAnim,
              transform: [
                {
                  translateY: cardAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [28, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.resultCard}>
            {/* No result yet also means "still working" - never fall through to
              the result branch with an empty verdict. */}
            {validating || !result ? (
              <View style={styles.validatingRow}>
                <ActivityIndicator color={COLORS.primary} />
                <Text style={styles.validatingText}>Validating ticket…</Text>
              </View>
            ) : (
              <>
                <View
                  style={[
                    styles.verdictBanner,
                    { backgroundColor: resultStyle.color },
                  ]}
                >
                  <Animated.View
                    style={[
                      styles.verdictIconWrap,
                      { transform: [{ scale: iconAnim }] },
                    ]}
                  >
                    <Ionicons
                      name={resultStyle.icon}
                      size={wp('5.5%')}
                      color={COLORS.white}
                    />
                  </Animated.View>
                  <Text style={styles.verdictTitle}>{resultStyle.title}</Text>

                  {/* Rides the bottom edge of the banner in white - drawn in
                      the verdict colour it vanished into the band behind it. */}
                  {result.status === 'valid' ? (
                    <View style={styles.progressTrack}>
                      <Animated.View
                        style={[
                          styles.progressBar,
                          { transform: [{ scaleX: progressAnim }] },
                        ]}
                      />
                    </View>
                  ) : null}
                </View>

                <View style={styles.cardBody}>
                  {/* A clean check-in only needs a nod; a rejection has to lead
                    with the reason, so the same string is weighted per verdict. */}
                  <Text
                    style={
                      result.status === 'valid'
                        ? styles.confirmText
                        : styles.reasonText
                    }
                    numberOfLines={3}
                  >
                    {result.message}
                  </Text>

                  {ticketInfo.attendee ? (
                    <View style={styles.attendeeRow}>
                      <View style={styles.attendeeCol}>
                        <Text style={styles.attendeeName} numberOfLines={1}>
                          {ticketInfo.attendee}
                        </Text>
                        {ticketInfo.eventName ? (
                          <Text style={styles.eventName} numberOfLines={1}>
                            {ticketInfo.eventName}
                          </Text>
                        ) : null}
                      </View>
                      {ticketInfo.category ? (
                        <View
                          style={[
                            styles.categoryPill,
                            { borderColor: resultStyle.color },
                          ]}
                        >
                          <Text
                            style={[
                              styles.categoryPillText,
                              { color: resultStyle.color },
                            ]}
                            numberOfLines={1}
                          >
                            {ticketInfo.category.toUpperCase()}
                          </Text>
                        </View>
                      ) : null}
                    </View>
                  ) : null}

                  {ticketInfo.meta.length ? (
                    <View
                      style={[
                        styles.metaRow,
                        { backgroundColor: resultStyle.tint },
                      ]}
                    >
                      {ticketInfo.meta.map(cell => (
                        <View key={cell.label} style={styles.metaCell}>
                          <Text style={styles.metaLabel}>{cell.label}</Text>
                          <Text style={styles.metaValue} numberOfLines={1}>
                            {cell.value}
                          </Text>
                        </View>
                      ))}
                    </View>
                  ) : null}

                  <View style={styles.resultActions}>
                    {/* Retry re-sends the same code, so it is only offered when
                      we never got an answer - not when the server said no. */}
                    {result.status === 'error' ? (
                      <TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={retryValidation}
                      >
                        <Text style={styles.secondaryButtonText}>Retry</Text>
                      </TouchableOpacity>
                    ) : null}
                    <TouchableOpacity
                      style={styles.primaryButton}
                      onPress={scanAgain}
                    >
                      <Text style={styles.primaryButtonText}>Scan Next</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}
          </View>
        </Animated.View>
      ) : null}
    </View>
  );
}
