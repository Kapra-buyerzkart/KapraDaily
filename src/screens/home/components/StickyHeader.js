import React from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import Animated from 'react-native-reanimated';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { FONTS } from '../../../styles/typography';
import ProfileAvatarBadge from '../../../components/ProfileAvatarBadge';
import RotatingPlaceholder from '../../../components/RotatingPlaceholder';
import COLORS from '@/styles/colors';

const INK = '#1A1A1A';
const SEARCH_EXAMPLES = ['Basmati Rice', 'Milk', 'Sunflower Oil', 'Lemons'];

// The sticky header has two visual variants depending on whether a
// `topSectionBanner` is configured: an ImageBackground-backed version with a
// dark glass overlay that fades in on scroll, or a plain animated-background
// fallback. Both share the same collapsible ETA/location/coins/profile row
// and search bar — kept here as render helpers instead of duplicated JSX.
const StickyHeader = ({
  top,
  topSectionBanner,
  onBannerPress,
  glassOverlayAnimStyle,
  collapsibleHeaderStyle,
  etaAnimStyle,
  coinAnimStyle,
  profileAnimStyle,
  searchWrapperAnimStyle,
  fallbackHeaderBgStyle,
  stickyBorderAnimStyle,
  headerInfoMaxH,
  profile,
  dashboardData,
  navigation,
  isStoreUnavailable,
  profileAvatarSize,
  onSearchPressIn,
  onSearchPressOut,
  onPressLocation,
}) => {
  const onHeaderInfoLayout = e => {
    const h = e.nativeEvent.layout.height;
    if (headerInfoMaxH.value <= 0 && h > 0) {
      headerInfoMaxH.value = h;
    }
  };

  const hasLocation = !!profile?.pinAddress;

  const renderCollapsibleInfo = () => (
    <Animated.View style={collapsibleHeaderStyle} onLayout={onHeaderInfoLayout}>
      <View style={styles.headerViewOne}>
        <Animated.View style={etaAnimStyle}>
          {hasLocation ? (
            <>
              {/* Delivery promise is the header's headline, so it reads as a
                  labelled claim ("Delivery in / 20 mins") rather than a bare
                  number floating above the address. */}
              <View style={styles.etaRow}>
                <View style={styles.etaBolt}>
                  <MaterialIcons
                    name="bolt"
                    size={wp('4.4%')}
                    color={'#F25000'}
                  />
                </View>
                <View>
                  <Text style={styles.etaLabel}>Delivery in</Text>
                  <Text style={styles.timeText}>20 mins</Text>
                </View>
              </View>
              <TouchableOpacity
                hitSlop={40}
                style={[styles.addressView, { marginTop: hp('0.5%') }]}
                onPress={onPressLocation}
              >
                <Feather
                  name={'map-pin'}
                  size={wp('3.6%')}
                  color={'rgba(255,255,255,0.9)'}
                  style={{ marginRight: wp('1%') }}
                />
                <Text
                  style={styles.addressText}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {profile.pinAddress}
                </Text>
                <Entypo
                  name={'chevron-down'}
                  size={wp('3.6%')}
                  color={'#FFFFFF'}
                />
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              hitSlop={20}
              style={styles.selectLocationButton}
              onPress={onPressLocation}
              activeOpacity={0.85}
            >
              <Feather
                name={'map-pin'}
                size={wp('4.4%')}
                color={INK}
                style={{ marginRight: wp('1.5%') }}
              />
              <Text style={styles.selectLocationText}>Select Location</Text>
              <Entypo name={'chevron-down'} size={wp('4.4%')} color={INK} />
            </TouchableOpacity>
          )}
        </Animated.View>
        <View style={styles.headerRightWrapper}>
          <Animated.View style={etaAnimStyle}>
            <TouchableOpacity
              onPress={() => navigation.navigate('BCoinScreen')}
              style={styles.bcoinContainer}
            >
              <Image
                source={require('../../../assets/icons/udcoin.png')}
                style={styles.bcoinIcon}
              />
              <Text style={styles.tokenText}>
                {dashboardData?.wallet?.bCoins || '0'}
              </Text>
            </TouchableOpacity>
          </Animated.View>
          <Animated.View style={etaAnimStyle}>
            <View style={{ overflow: 'visible' }}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('ProfileScreen', { type: 'login' })
                }
                activeOpacity={0.85}
              >
                <ProfileAvatarBadge
                  size={profileAvatarSize}
                  isPrivileged={profile?.isPrivileged}
                />
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </View>
    </Animated.View>
  );

  const renderSearchBar = () => (
    <Animated.View
      style={[styles.searchWrapper, searchWrapperAnimStyle]}
    >
      <TouchableOpacity
        onPress={() =>
          !isStoreUnavailable && navigation.navigate('SearchScreen')
        }
        onPressIn={onSearchPressIn}
        onPressOut={onSearchPressOut}
        style={[
          { flex: 1, flexDirection: 'row', alignItems: 'center' },
          isStoreUnavailable && { opacity: 0.6 },
        ]}
        activeOpacity={isStoreUnavailable ? 1 : 0.85}
      >
        <Feather name="search" color={INK} size={wp('5.2%')} />
        <View style={styles.searchProductContainer}>
          <RotatingPlaceholder
            examples={SEARCH_EXAMPLES}
            prefix="Search for "
            suffix='"'
            style={styles.searchProductText}
          />
        </View>
        <View style={styles.searchDivider} />
        <Feather
          name="clipboard"
          color={'#F25000'}
          size={wp('4.8%')}
          style={styles.clipboardIcon}
        />
      </TouchableOpacity>
    </Animated.View>
  );

  if (topSectionBanner && topSectionBanner.length > 0) {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => onBannerPress(topSectionBanner[0])}
      >
        <ImageBackground
          source={topSectionBanner[0].uri}
          style={{
            width: wp('100%'),
            paddingTop: top,
            paddingBottom: hp('1%'),
          }}
          imageStyle={{ resizeMode: 'cover' }}
        >
          <Animated.View
            pointerEvents="none"
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: '#FFFFFF' },
              glassOverlayAnimStyle,
            ]}
          />

          {renderCollapsibleInfo()}
          {renderSearchBar()}

          <Animated.View
            pointerEvents="none"
            style={[
              {
                height: 1,
                backgroundColor: 'rgba(0,0,0,0.08)',
                marginTop: hp('0.5%'),
              },
              stickyBorderAnimStyle,
            ]}
          />
        </ImageBackground>
      </TouchableOpacity>
    );
  }

  return (
    <Animated.View
      style={[
        { paddingTop: top, paddingBottom: hp('1%') },
        fallbackHeaderBgStyle,
      ]}
    >
      {renderCollapsibleInfo()}
      {renderSearchBar()}

      <Animated.View
        pointerEvents="none"
        style={[
          {
            height: 1,
            backgroundColor: 'rgba(255,255,255,0.08)',
            marginTop: hp('0.5%'),
          },
          stickyBorderAnimStyle,
        ]}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  headerViewOne: {
    flexDirection: 'row',
    marginHorizontal: wp('6.9%'),
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 0 : 5,
    alignItems: 'center',
  },
  etaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  etaBolt: {
    width: wp('6.6%'),
    height: wp('6.6%'),
    borderRadius: wp('3.3%'),
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp('2%'),
  },
  etaLabel: {
    fontFamily: FONTS.gilroy.medium,
    color: 'rgba(255,255,255,0.85)',
    fontSize: wp('2.9%'),
    letterSpacing: 0.2,
  },
  timeText: {
    fontFamily: FONTS.gilroy.bold,
    color: '#FFFFFF',
    fontSize: wp('5.2%'),
    letterSpacing: -0.4,
    marginTop: -hp('0.2%'),
  },
  addressView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: hp('0.9%'),
    paddingHorizontal: wp('3.5%'),
  },
  selectLocationText: {
    color: INK,
    fontSize: wp('3.8%'),
    fontFamily: FONTS.gilroy.semiBold,
    marginRight: wp('1%'),
  },
  addressText: {
    color: 'rgba(255,255,255,0.92)',
    fontSize: wp('3.1%'),
    fontFamily: FONTS.gilroy.medium,
    maxWidth: wp('50%'),
  },
  bcoinContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    paddingVertical: hp('0.7%'),
    paddingHorizontal: wp('2.8%'),
    gap: wp('1.5%'),
  },
  bcoinIcon: {
    width: wp('5%'),
    height: wp('5%'),
    resizeMode: 'contain',
  },
  headerRightWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('1%'),
  },
  tokenText: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('3.2%'),
    color: INK,
  },
  // A hairline border (no shadow) is what keeps the field legible against the
  // white collapsed header, where a borderless white pill would disappear.
  searchWrapper: {
    backgroundColor: COLORS.white,
    marginHorizontal: wp('4.7%'),
    paddingHorizontal: wp('4%'),
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(17,19,26,0.10)',
  },
  searchProductContainer: {
    height: hp('3.65%'),
    justifyContent: 'center',
    marginLeft: wp('2.5%'),
    flex: 1,
    top: Platform.OS == 'ios' ? 0 : 2,
    overflow: 'hidden',
  },
  searchProductText: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('3.6%'),
    color: '#6B7280',
  },
  searchDivider: {
    width: 1,
    height: hp('2.2%'),
    backgroundColor: 'rgba(17,19,26,0.12)',
    marginLeft: wp('2%'),
  },
  clipboardIcon: {
    marginLeft: wp('3%'),
  },
});

// Memoised: the header sits above the scroll view and its content only depends
// on profile/dashboard/banner data, but it was re-rendering on every HomeScreen
// render — including the scroll-driven ones. Its animated styles are shared
// values, so the collapse/fade animations keep running on the UI thread
// regardless of whether this component re-renders.
export default React.memo(StickyHeader);
