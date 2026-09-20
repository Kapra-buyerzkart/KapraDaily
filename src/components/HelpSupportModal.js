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
import Feather from 'react-native-vector-icons/Feather';

const HELPLINE_PHONE = '+91 9048801110';
const HELPLINE_EMAIL = 'support@kapragoldndiamond.com';

const HelpOption = ({ icon, tint, label, value, onPress }) => (
  <TouchableOpacity
    activeOpacity={0.75}
    style={styles.optionCard}
    onPress={onPress}
  >
    <View style={[styles.iconDisc, { backgroundColor: tint }]}>{icon}</View>

    <View style={styles.optionDetails}>
      <Text style={styles.optionLabel}>{label}</Text>
      <Text style={styles.optionValue} numberOfLines={1}>
        {value}
      </Text>
    </View>

    <Feather name="chevron-right" size={18} color="#9CA3AF" />
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
    const phone = HELPLINE_PHONE.replace(/[^0-9]/g, '');
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
          <Text style={styles.title}>Need Assistance?</Text>
          <Text style={styles.subtitle}>
            Reach out to our jewellery specialists anytime
          </Text>
        </View>

        <HelpOption
          tint="#EDF5F0"
          icon={<MaterialIcons name="call" size={20} color="#12372A" />}
          label="Call our specialists"
          value={HELPLINE_PHONE}
          onPress={callNumber}
        />

        <HelpOption
          tint="#E8F6EE"
          icon={
            <MaterialCommunityIcons
              name="whatsapp"
              size={20}
              color="#1B7C4B"
            />
          }
          label="Chat on WhatsApp"
          value={HELPLINE_PHONE}
          onPress={openWhatsApp}
        />

        <HelpOption
          tint="#F7F4EB"
          icon={<MaterialIcons name="email" size={20} color="#A6823E" />}
          label="Write to us"
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
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  handleIndicator: {
    backgroundColor: '#D8D4CC',
    width: 44,
    height: 4,
    borderRadius: 2,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  headingRow: {
    marginBottom: 16,
  },
  title: {
    fontFamily: 'CormorantGaramond-SemiBold',
    fontSize: 23,
    lineHeight: 28,
    color: '#12372A',
    letterSpacing: -0.2,
  },
  subtitle: {
    fontFamily: 'Lexend-Regular',
    fontSize: 12,
    lineHeight: 16,
    color: '#6B7280',
    marginTop: 3,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    borderColor: '#ECE7DE',
    borderRadius: 16,
    backgroundColor: '#FAF9F6',
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  iconDisc: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionDetails: {
    flex: 1,
    gap: 2,
  },
  optionLabel: {
    fontFamily: 'Lexend-Medium',
    fontSize: 13.5,
    color: '#12372A',
  },
  optionValue: {
    fontFamily: 'Lexend-Regular',
    fontSize: 11.5,
    color: '#6B7280',
  },
});

export default HelpSupportModal;
