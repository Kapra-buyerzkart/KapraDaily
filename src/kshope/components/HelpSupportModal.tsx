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
  MAX_FONT_SCALE,
  UI_COLORS,
  UI_RADIUS,
  UI_SPACING,
  UI_TYPE,
  hitSlopTo,
  hp,
  wp,
} from '../theme/tokens';

const HELPLINE_PHONE = '+91 9048801110';
const HELPLINE_EMAIL = 'support@udendeal.com';

export interface HelpSupportModalRef {
  open: () => void;
  close: () => void;
}

interface HelpOptionProps {
  icon: React.ReactNode;
  tint: string;
  label: string;
  value: string;
  onPress: () => void;
}

const HelpOption: React.FC<HelpOptionProps> = ({
  icon,
  tint,
  label,
  value,
  onPress,
}) => (
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
      color={UI_COLORS.textFaint}
    />
  </TouchableOpacity>
);

const HelpSupportModal = forwardRef<HelpSupportModalRef>((_props, ref) => {
  const sheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['46%'], []);

  useImperativeHandle(ref, () => ({
    open: () => sheetRef.current?.present(),
    close: () => sheetRef.current?.dismiss(),
  }));

  const renderBackdrop = useCallback(
    (backdropProps: any) => (
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
          tint={UI_COLORS.primaryTint}
          icon={
            <MaterialIcons
              name="call"
              size={wp('5%')}
              color={UI_COLORS.primary}
            />
          }
          label="Call us"
          value={HELPLINE_PHONE}
          onPress={callNumber}
        />

        <HelpOption
          tint={UI_COLORS.successTint}
          icon={
            <MaterialCommunityIcons
              name="whatsapp"
              size={wp('5%')}
              color={UI_COLORS.successDeep}
            />
          }
          label="WhatsApp us"
          value={HELPLINE_PHONE}
          onPress={openWhatsApp}
        />

        <HelpOption
          tint={UI_COLORS.tokenTint}
          icon={
            <MaterialIcons
              name="email"
              size={wp('5%')}
              color={UI_COLORS.token}
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
    backgroundColor: UI_COLORS.card,
    borderTopLeftRadius: UI_RADIUS.card,
    borderTopRightRadius: UI_RADIUS.card,
  },
  handleIndicator: {
    backgroundColor: UI_COLORS.borderStrong,
    width: wp('12%'),
  },
  content: {
    paddingHorizontal: UI_SPACING.lg,
    paddingTop: UI_SPACING.xs,
  },
  headingRow: {
    marginBottom: UI_SPACING.md,
    gap: 2,
  },
  title: {
    ...UI_TYPE.heading,
    color: UI_COLORS.textPrimary,
  },
  subtitle: {
    ...UI_TYPE.micro,
    color: UI_COLORS.textMuted,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: UI_SPACING.md,
    borderWidth: 1,
    borderColor: UI_COLORS.border,
    borderRadius: UI_RADIUS.card,
    backgroundColor: UI_COLORS.card,
    paddingVertical: hp('1.4%'),
    paddingHorizontal: UI_SPACING.md,
    marginBottom: UI_SPACING.md,
  },
  iconDisc: {
    width: wp('9.5%'),
    height: wp('9.5%'),
    borderRadius: UI_RADIUS.icon,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionDetails: {
    flex: 1,
    gap: 2,
  },
  optionLabel: {
    ...UI_TYPE.labelStrong,
    color: UI_COLORS.textPrimary,
  },
  optionValue: {
    ...UI_TYPE.micro,
    color: UI_COLORS.textMuted,
  },
});

export default HelpSupportModal;
