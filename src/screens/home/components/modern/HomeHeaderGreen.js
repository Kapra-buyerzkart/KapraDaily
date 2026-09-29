import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import icons from '@/assets/icons';
import { FONTS } from '@/styles/typography';

const HEADER_GRADIENT = ['#97A965', '#91A45F', '#889C54'];

const HomeHeaderGreen = ({
  topInset = 0,
  profile,
  dashboardData,
  navigation,
  onPressLocation,
  onSearchPress,
}) => {
  // Parse area name (before first comma) and secondary location details (city/pincode)
  const pinAddress =
    profile?.pinAddress || profile?.address || 'Select Location';
  const pincode = profile?.pincode;

  const { title, subtitle } = React.useMemo(() => {
    if (!profile?.pinAddress && !profile?.address) {
      return { title: 'Select Location', subtitle: '' };
    }
    const parts = pinAddress
      .split(',')
      .map(p => p.trim())
      .filter(Boolean);

    // Resolve genuine 6-digit postal pincode:
    // Check 6-digit match in address strings, or postalPincode, or profile.pincode if 6 digits
    let detectedPincode = '';
    const pinMatch = (pinAddress + ' ' + (profile?.address || '')).match(/\b\d{6}\b/);
    if (pinMatch) {
      detectedPincode = pinMatch[0];
    } else if (profile?.postalPincode && String(profile.postalPincode).length === 6) {
      detectedPincode = String(profile.postalPincode);
    } else if (pincode && String(pincode).length === 6) {
      detectedPincode = String(pincode);
    }

    // Clean primary title: remove pincode, parentheses/brackets, and trailing delimiters
    let primaryTitle = parts[0] || pinAddress;
    primaryTitle = primaryTitle
      .replace(/[\[\(\{\]\)\}]+/g, '')
      .replace(/\b\d{6}\b/g, '')
      .replace(/[-–—,]\s*$/, '')
      .trim();

    // Clean city part: strip pincode and brackets
    let city = (parts[1] || 'Kochi')
      .replace(/[\[\(\{\]\)\}]+/g, '')
      .replace(/\b\d{6}\b/g, '')
      .trim();
    if (!city) city = 'Kochi';

    const sub = detectedPincode
      ? `${city} • ${detectedPincode}`
      : city;

    return { title: primaryTitle || 'Select Location', subtitle: sub };
  }, [pinAddress, pincode, profile]);

  const coins = dashboardData?.wallet?.bCoins ?? 0;

  const handleProfilePress = () => {
    navigation.navigate('ProfileScreen', { type: 'login' });
  };

  const handleCoinsPress = () => {
    navigation.navigate('BCoinScreen');
  };

  const handleSearchPress = () => {
    if (onSearchPress) {
      onSearchPress();
    } else {
      navigation.navigate('SearchScreen');
    }
  };

  return (
    <View
      style={[
        styles.headerContainer,
        { paddingTop: topInset + (Platform.OS === 'ios' ? 6 : 10) },
      ]}
    >
      <LinearGradient
        colors={HEADER_GRADIENT}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Top Header Row */}
      <View style={styles.topRow}>
        {/* Left: Location & Sub-row */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onPressLocation}
          style={styles.locationContainer}
          accessibilityRole="button"
          accessibilityLabel={`Delivering to ${title}. Tap to change location`}
        >
          {/* Main Title Row: e.g. "Chakkaraparambu ⌵" */}
          <View style={styles.titleRow}>
            <Text style={styles.locationTitle} numberOfLines={1}>
              {title}
            </Text>
            <Feather
              name="chevron-down"
              size={wp('5.2%')}
              color="#FFFFFF"
              style={styles.chevron}
            />
          </View>

          {/* Sub Row: [⏱ Express] Kochi • 682032 */}
          <View style={styles.subRow}>
            <View style={styles.expressBadge}>
              <MaterialCommunityIcons
                name="timer-outline"
                size={13}
                color="#FF5722"
                style={styles.expressIcon}
              />
              <Text style={styles.expressText}>Express</Text>
            </View>

            {!!subtitle && (
              <Text style={styles.locationSubtitle} numberOfLines={1}>
                {subtitle}
              </Text>
            )}
          </View>
        </TouchableOpacity>

        {/* Right: Coins Chip & Profile Avatar */}
        <View style={styles.rightGroup}>
          {/* 👛 8 coins pill */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleCoinsPress}
            style={styles.coinsPill}
            accessibilityRole="button"
            accessibilityLabel={`${coins} coins. View wallet`}
          >
            <MaterialCommunityIcons
              name="wallet-outline"
              size={wp('4.6%')}
              color="#FF5722"
              style={styles.walletIcon}
            />
            <Text style={styles.coinsText}>{coins} coins</Text>
          </TouchableOpacity>

          {/* Profile Circle with orange/coral icon */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleProfilePress}
            style={styles.profileCircle}
            accessibilityRole="button"
            accessibilityLabel="Your profile"
          >
            <Feather name="user" size={wp('5.2%')} color="#FF5722" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar Row */}
      <TouchableOpacity
        activeOpacity={0.92}
        onPress={handleSearchPress}
        style={styles.searchBar}
        accessibilityRole="search"
        accessibilityLabel="Search products and categories"
      >
        <Feather
          name="search"
          size={wp('5%')}
          color="#889C54"
          style={styles.searchIcon}
        />
        <Text style={styles.searchPlaceholder} numberOfLines={1}>
          Search for fresh vegetables, fruits...
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: wp('4%'),
    paddingBottom: hp('1.4%'),
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: hp('1.4%'),
  },
  locationContainer: {
    flex: 1,
    marginRight: wp('1.5%'),
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationTitle: {
    fontSize: wp('4.9%'),
    fontFamily: FONTS.gilroy.bold,
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  chevron: {
    marginLeft: 3,
    marginTop: 1,
  },
  subRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('0.4%'),
  },
  expressBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: 12,
    marginRight: 7,
    flexShrink: 0,
  },
  expressIcon: {
    marginRight: 3,
  },
  expressText: {
    fontSize: wp('2.8%'),
    fontFamily: FONTS.gilroy.semiBold,
    color: '#FF5722',
  },
  locationSubtitle: {
    fontSize: wp('3.3%'),
    fontFamily: FONTS.gilroy.medium,
    color: '#FFFFFF',
    opacity: 0.95,
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('1.8%'),
    flexShrink: 0,
  },
  coinsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: hp('0.55%'),
    paddingHorizontal: wp('2.4%'),
    borderRadius: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  walletIcon: {
    marginRight: 4,
  },
  coinsText: {
    fontSize: wp('3.2%'),
    fontFamily: FONTS.gilroy.bold,
    color: '#E65100',
  },
  profileCircle: {
    width: wp('9.6%'),
    height: wp('9.6%'),
    borderRadius: wp('4.8%'),
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    height: Math.max(hp('5.2%'), 44),
    borderRadius: 22,
    paddingHorizontal: wp('3.6%'),
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  searchIcon: {
    marginRight: wp('2.5%'),
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: wp('3.6%'),
    fontFamily: FONTS.gilroy.medium,
    color: '#8E949E',
  },
});

export default React.memo(HomeHeaderGreen);
