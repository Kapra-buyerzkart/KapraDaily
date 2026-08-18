import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  CART_COLORS,
  CART_RADIUS,
  CART_SPACING,
  CART_TYPE,
  MAX_FONT_SCALE,
  hitSlopTo,
  wp,
  hp,
} from '../styles/cartTheme';

const HELPLINE_PHONE = '+91 9048801110';
const HELPLINE_EMAIL = 'support@udendeal.com';

const HelpOption = ({ icon, iconColor, tint, label, value, onPress }) => (
  <TouchableOpacity
    activeOpacity={0.75}
    style={styles.optionCard}
    onPress={onPress}
    hitSlop={hitSlopTo(44)}
  >
    <View style={[styles.iconDisc, { backgroundColor: tint }]}>{icon}</View>

    <View style={styles.optionDetails}>
      <Text maxFontSizeMultiplier={MAX_FONT_SCALE} style={styles.optionLabel}>
        {label}
      </Text>
      <Text
        maxFontSizeMultiplier={MAX_FONT_SCALE}
        style={styles.optionValue}
        numberOfLines={1}
      >
        {value}
      </Text>
    </View>

    <MaterialIcons
      name="chevron-right"
      size={wp('5%')}
      color={CART_COLORS.textFaint}
    />
  </TouchableOpacity>
);

const HelpSupportModal = forwardRef((_props, ref) => {
  const sheetRef = useRef(null);
  const snapPoints = useMemo(() => ['46%'], []);

  useImperativeHandle(ref, () => ({
    open: () => sheetRef.current?.present(),
    close: () => sheetRef.current?.dismiss(),
  }));

  const renderBackdrop = useCallback(
    backdropProps => (
      <BottomSheetBackdrop
        {...backdropProps}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.5}
        pressBehavior="close"
      />
    ),
    [],
  );

  const callNumber = () => {
    Linking.openURL(`tel:${HELPLINE_PHONE}`).catch(() => {});
  };

  const openWhatsApp = () => {
    const phone = HELPLINE_PHONE.replace('+', '');
    Linking.openURL(`whatsapp://send?phone=${phone}`).catch(() => {
      Linking.openURL(`https://wa.me/${phone}`).catch(() => {});
    });
  };

  const sendEmail = () => {
    Linking.openURL(`mailto:${HELPLINE_EMAIL}`).catch(() => {});
  };

  return (
    <BottomSheetModal
      ref={sheetRef}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.background}
      handleIndicatorStyle={styles.handleIndicator}
    >
      <BottomSheetView style={styles.content}>
        <View style={styles.headingRow}>
          <Text maxFontSizeMultiplier={MAX_FONT_SCALE} style={styles.title}>
            Need Help?
          </Text>
          <Text maxFontSizeMultiplier={MAX_FONT_SCALE} style={styles.subtitle}>
            Reach out to us anytime
          </Text>
        </View>

        <HelpOption
          tint={CART_COLORS.primaryTint}
          icon={
            <MaterialIcons
              name="call"
              size={wp('5%')}
              color={CART_COLORS.primary}
            />
          }
          label="Call us"
          value={HELPLINE_PHONE}
          onPress={callNumber}
        />

        <HelpOption
          tint={CART_COLORS.successTint}
          icon={
            <MaterialCommunityIcons
              name="whatsapp"
              size={wp('5%')}
              color={CART_COLORS.successDeep}
            />
          }
          label="WhatsApp us"
          value={HELPLINE_PHONE}
          onPress={openWhatsApp}
        />

        <HelpOption
          tint={CART_COLORS.tokenTint}
          icon={
            <MaterialIcons
              name="email"
              size={wp('5%')}
              color={CART_COLORS.token}
            />
          }
          label="Email us"
          value={HELPLINE_EMAIL}
          onPress={sendEmail}
        />
      </BottomSheetView>
    </BottomSheetModal>
  );
});

HelpSupportModal.displayName = 'HelpSupportModal';

const styles = StyleSheet.create({
  background: {
    backgroundColor: CART_COLORS.card,
    borderTopLeftRadius: CART_RADIUS.card,
    borderTopRightRadius: CART_RADIUS.card,
  },
  handleIndicator: {
    backgroundColor: CART_COLORS.graySoftColor,
    width: wp('12%'),
  },
  content: {
    paddingHorizontal: CART_SPACING.lg,
    paddingTop: CART_SPACING.xs,
  },
  headingRow: {
    marginBottom: CART_SPACING.md,
    gap: 2,
  },
  title: {
    ...CART_TYPE.heading,
    color: CART_COLORS.textPrimary,
  },
  subtitle: {
    ...CART_TYPE.micro,
    color: CART_COLORS.textMuted,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CART_SPACING.md,
    borderWidth: 1,
    borderColor: CART_COLORS.border,
    borderRadius: CART_RADIUS.card,
    backgroundColor: CART_COLORS.card,
    paddingVertical: hp('1.4%'),
    paddingHorizontal: CART_SPACING.md,
    marginBottom: CART_SPACING.md,
  },
  iconDisc: {
    width: wp('9.5%'),
    height: wp('9.5%'),
    borderRadius: CART_RADIUS.icon,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionDetails: {
    flex: 1,
    gap: 2,
  },
  optionLabel: {
    ...CART_TYPE.labelStrong,
    color: CART_COLORS.textPrimary,
  },
  optionValue: {
    ...CART_TYPE.micro,
    color: CART_COLORS.textMuted,
  },
});

export default HelpSupportModal;
