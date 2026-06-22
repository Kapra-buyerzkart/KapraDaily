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
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { FONTS } from '../styles/typography';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const HELPLINE_PHONE = '+91 9048801110';
const HELPLINE_EMAIL = 'support@udendeal.in';

const HelpSupportModal = forwardRef((_props, ref) => {
  const sheetRef = useRef(null);
  const snapPoints = useMemo(() => ['38%'], []);

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
        <Text style={styles.title}>Need Help?</Text>
        <Text style={styles.subtitle}>Reach out to us anytime</Text>

        <TouchableOpacity style={styles.optionRow} onPress={callNumber}>
          <View style={[styles.iconCircle, { backgroundColor: '#FFE9DD' }]}>
            <MaterialIcons name="call" size={wp('5.5%')} color="#F25000" />
          </View>
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionLabel}>Call us</Text>
            <Text style={styles.optionValue}>{HELPLINE_PHONE}</Text>
          </View>
          <MaterialIcons name="chevron-right" size={wp('6%')} color="#BDBDBD" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionRow} onPress={openWhatsApp}>
          <View style={[styles.iconCircle, { backgroundColor: '#DDF5E4' }]}>
            <MaterialCommunityIcons
              name="whatsapp"
              size={wp('5.5%')}
              color="#25D366"
            />
          </View>
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionLabel}>WhatsApp us</Text>
            <Text style={styles.optionValue}>{HELPLINE_PHONE}</Text>
          </View>
          <MaterialIcons name="chevron-right" size={wp('6%')} color="#BDBDBD" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionRow} onPress={sendEmail}>
          <View style={[styles.iconCircle, { backgroundColor: '#DDEAFF' }]}>
            <MaterialIcons name="email" size={wp('5.5%')} color="#1E6FE0" />
          </View>
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionLabel}>Email us</Text>
            <Text style={styles.optionValue}>{HELPLINE_EMAIL}</Text>
          </View>
          <MaterialIcons name="chevron-right" size={wp('6%')} color="#BDBDBD" />
        </TouchableOpacity>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  background: {
    borderTopLeftRadius: wp('6%'),
    borderTopRightRadius: wp('6%'),
  },
  handleIndicator: {
    backgroundColor: '#DADADA',
    width: wp('12%'),
  },
  content: {
    paddingHorizontal: wp('5.8%'),
    paddingTop: hp('0.5%'),
  },
  title: {
    fontFamily: FONTS.poppins.semiBold,
    fontSize: wp('4.65%'),
    color: '#000000',
  },
  subtitle: {
    fontFamily: FONTS.poppins.regular,
    fontSize: wp('3.25%'),
    color: '#616161',
    marginBottom: hp('2.5%'),
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp('1.5%'),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  iconCircle: {
    width: wp('11%'),
    height: wp('11%'),
    borderRadius: wp('5.5%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp('3.5%'),
  },
  optionTextContainer: {
    flex: 1,
  },
  optionLabel: {
    fontFamily: FONTS.poppins.medium,
    fontSize: wp('3.72%'),
    color: '#000000',
  },
  optionValue: {
    fontFamily: FONTS.poppins.regular,
    fontSize: wp('3.25%'),
    color: '#616161',
    marginTop: 2,
  },
});

export default HelpSupportModal;
