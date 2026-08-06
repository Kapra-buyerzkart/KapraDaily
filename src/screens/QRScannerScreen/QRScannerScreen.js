import React, { useCallback } from 'react';
import { StatusBar, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Camera } from 'react-native-vision-camera';
import { openSettings } from 'react-native-permissions';
import COLORS from '@/styles/colors';
import { styles } from './styles';
import ScannerHeader from './components/ScannerHeader';
import ScannerFrame from './components/ScannerFrame';
import MessageView from './components/MessageView';
import ResultSheet from './components/ResultSheet';
import useScannerCamera from './hooks/useScannerCamera';
import useTicketScanner from './hooks/useTicketScanner';
import useResultAnimations from './hooks/useResultAnimations';

export default function QRScannerScreen() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const {
    device,
    hasPermission,
    permissionAsked,
    torchOn,
    toggleTorch,
    cameraError,
    handleCameraError,
    clearCameraError,
  } = useScannerCamera();

  const {
    scannedValue,
    codeScanner,
    validating,
    result,
    resultStyle,
    showVerdict,
    ticketInfo,
    scanAgain,
    retryValidation,
  } = useTicketScanner();

  const { cardAnim, iconAnim, progressAnim } = useResultAnimations({
    scannedValue,
    showVerdict,
    isValid: showVerdict && result?.status === 'valid',
  });

  const goBack = useCallback(() => navigation.goBack(), [navigation]);

  const isCameraActive = isFocused && !scannedValue;

  const header = (
    <ScannerHeader
      onBack={goBack}
      hasTorch={Boolean(device?.hasTorch)}
      torchOn={torchOn}
      onToggleTorch={toggleTorch}
    />
  );

  if (!hasPermission) {
    if (!permissionAsked) return <View style={styles.container} />;
    return (
      <MessageView
        header={header}
        title="Camera access needed"
        message="Allow camera access to scan QR codes. You can turn it on from your device settings."
        actionLabel="Open Settings"
        onAction={() => openSettings()}
      />
    );
  }

  if (!device) {
    return (
      <MessageView
        header={header}
        title="No camera found"
        message="This device does not have a camera we can use for scanning."
      />
    );
  }

  if (cameraError) {
    return (
      <MessageView
        header={header}
        title="Camera unavailable"
        message={cameraError}
        actionLabel="Try Again"
        onAction={clearCameraError}
      />
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.black} />

      <Camera
        style={styles.fill}
        device={device}
        isActive={isCameraActive}
        torch={torchOn && isCameraActive ? 'on' : 'off'}
        codeScanner={codeScanner}
        onError={handleCameraError}
      />

      <ScannerFrame showHint={!scannedValue} />

      <SafeAreaView edges={['top']} style={styles.headerOverlay}>
        {header}
      </SafeAreaView>

      {scannedValue ? (
        <ResultSheet
          validating={validating}
          result={result}
          resultStyle={resultStyle}
          ticketInfo={ticketInfo}
          cardAnim={cardAnim}
          iconAnim={iconAnim}
          progressAnim={progressAnim}
          onRetry={retryValidation}
          onScanAgain={scanAgain}
        />
      ) : null}
    </View>
  );
}
