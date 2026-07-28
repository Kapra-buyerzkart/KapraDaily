import {
  View,
  Text,
  Image,
  Linking,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'react-native-simple-toast';
import { openSettings } from 'react-native-permissions';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import icons from '@/assets/icons';
import COLORS from '@/styles/colors';
import logger from '../../utils/logger';
import { styles } from './styles';

const isLink = value => /^https?:\/\//i.test(value?.trim() ?? '');

export default function QRScannerScreen() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const device = useCameraDevice('back');
  const { hasPermission, requestPermission } = useCameraPermission();
  const [permissionAsked, setPermissionAsked] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [scannedValue, setScannedValue] = useState(null);

  useEffect(() => {
    if (hasPermission) return;
    // Ask once on mount; if the user says no we fall back to the settings prompt.
    requestPermission().finally(() => setPermissionAsked(true));
  }, [hasPermission, requestPermission]);

  const handleCodeScanned = useCallback(codes => {
    const value = codes?.[0]?.value;
    if (!value) return;
    // Freeze on the first readable code - the camera keeps firing this callback
    // several times a second otherwise.
    setScannedValue(prev => prev ?? value);
  }, []);

  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: handleCodeScanned,
  });

  const openScannedLink = useCallback(async () => {
    try {
      await Linking.openURL(scannedValue);
    } catch (error) {
      logger.error('Failed to open scanned link:', error?.message);
      Toast.show('Could not open this link', Toast.SHORT);
    }
  }, [scannedValue]);

  const copyScannedValue = useCallback(() => {
    Clipboard.setString(scannedValue);
    Toast.show('Copied', Toast.SHORT);
  }, [scannedValue]);

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
        <Text style={styles.headerTitle}>Scan QR Code</Text>
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
              Point your camera at a QR code to scan it
            </Text>
          )}
        </View>
      </View>

      <SafeAreaView edges={['top']} style={styles.headerOverlay}>
        {header}
      </SafeAreaView>

      {scannedValue ? (
        <View style={styles.resultCard}>
          <Text style={styles.resultLabel}>Scanned result</Text>
          <Text style={styles.resultValue} numberOfLines={3}>
            {scannedValue}
          </Text>
          <View style={styles.resultActions}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => {
                setScannedValue(null);
              }}
            >
              <Text style={styles.secondaryButtonText}>Scan Again</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={
                isLink(scannedValue) ? openScannedLink : copyScannedValue
              }
            >
              <Text style={styles.primaryButtonText}>
                {isLink(scannedValue) ? 'Open Link' : 'Copy'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}
    </View>
  );
}
