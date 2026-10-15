import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { useFocusEffect } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  MAX_FONT_SCALE,
  UI_COLORS,
  UI_RADIUS,
  UI_SPACING,
  wp,
} from '../../../../theme/tokens';
import { HOME_FONTS } from '../theme';

export interface NetworkInterruptionSheetProps {
  visible: boolean;
  onRetry: () => void;
  isRetrying: boolean;
  errorMessage?: string | null;
}

export const NetworkInterruptionSheet: React.FC<NetworkInterruptionSheetProps> = ({
  visible,
  onRetry,
  isRetrying,
  errorMessage,
}) => {
  const sheetRef = useRef<BottomSheetModal>(null);
  const insets = useSafeAreaInsets();
  const snapPoints = useMemo(() => ['44%'], []);

  useEffect(() => {
    if (visible) {
      sheetRef.current?.present();
    } else {
      sheetRef.current?.dismiss();
    }
  }, [visible]);

  useFocusEffect(
    useCallback(() => {
      if (visible) {
        sheetRef.current?.present();
      }
    }, [visible]),
  );

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.5}
        pressBehavior="none"
      />
    ),
    [],
  );

  return (
    <BottomSheetModal
      ref={sheetRef}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose={false}
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.background}
      handleIndicatorStyle={styles.handleIndicator}
    >
      <BottomSheetView
        style={[
          styles.content,
          {
            paddingBottom: Math.max(
              insets.bottom + UI_SPACING.md,
              UI_SPACING.xl,
            ),
          },
        ]}
      >
        <View style={styles.iconDisc}>
          <MaterialIcons
            name="wifi-off"
            size={wp('8%')}
            color={UI_COLORS.primary}
          />
        </View>

        <Text
          maxFontSizeMultiplier={MAX_FONT_SCALE}
          style={styles.title}
        >
          Internet connection interrupted
        </Text>

        <Text
          maxFontSizeMultiplier={MAX_FONT_SCALE}
          style={styles.message}
        >
          {errorMessage ||
            "We're having trouble connecting. Please check your internet connection and try again."}
        </Text>

        <TouchableOpacity
          activeOpacity={0.85}
          style={[styles.retryButton, isRetrying && styles.retryButtonDisabled]}
          onPress={onRetry}
          disabled={isRetrying}
        >
          {isRetrying ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text
              maxFontSizeMultiplier={MAX_FONT_SCALE}
              style={styles.retryButtonText}
            >
              Retry
            </Text>
          )}
        </TouchableOpacity>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: UI_COLORS.card,
    borderTopLeftRadius: UI_RADIUS.card,
    borderTopRightRadius: UI_RADIUS.card,
  },
  handleIndicator: {
    backgroundColor: UI_COLORS.borderStrong,
    width: wp('12%'),
  },
  content: {
    paddingHorizontal: wp('6%'),
    paddingTop: UI_SPACING.md,
    alignItems: 'center',
  },
  iconDisc: {
    width: wp('15%'),
    height: wp('15%'),
    borderRadius: wp('7.5%'),
    backgroundColor: UI_COLORS.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: UI_SPACING.md,
  },
  title: {
    fontFamily: HOME_FONTS.bold,
    fontSize: wp('4.6%'),
    color: UI_COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: UI_SPACING.xs,
  },
  message: {
    fontFamily: HOME_FONTS.regular,
    fontSize: wp('3.6%'),
    color: UI_COLORS.textMuted,
    textAlign: 'center',
    lineHeight: wp('5.2%'),
    marginBottom: UI_SPACING.lg,
  },
  retryButton: {
    backgroundColor: UI_COLORS.primary,
    borderRadius: UI_RADIUS.button,
    height: 48,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryButtonDisabled: {
    opacity: 0.8,
  },
  retryButtonText: {
    fontFamily: HOME_FONTS.semiBold,
    fontSize: wp('4%'),
    color: '#FFFFFF',
  },
});

export default NetworkInterruptionSheet;
