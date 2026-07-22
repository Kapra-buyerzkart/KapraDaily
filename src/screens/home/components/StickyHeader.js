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
              <Text style={styles.timeText}>20 mins</Text>
              <TouchableOpacity
                hitSlop={40}
                style={[styles.addressView, { marginTop: hp('0.4%') }]}
                onPress={onPressLocation}
              >
                <Feather
                  name={'map-pin'}
                  size={wp('4%')}
                  color={'#FFFFFF'}
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
                  name={'chevron-right'}
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
      style={[
        {
          backgroundColor: COLORS.white,
          marginHorizontal: wp('4.7%'),
          paddingHorizontal: wp('4%'),
          flexDirection: 'row',
          alignItems: 'center',
          overflow: 'hidden',
        },
        searchWrapperAnimStyle,
      ]}
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
        <Feather name="search" color={'black'} size={wp('6%')} />
        <View style={styles.searchProductContainer}>
          <RotatingPlaceholder
            examples={SEARCH_EXAMPLES}
            prefix="Search for "
            suffix='"'
            style={styles.searchProductText}
          />
        </View>
        <Feather
          name="clipboard"
          color={'black'}
          size={wp('5%')}
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
  timeText: {
    fontFamily: FONTS.gilroy.bold,
    color: '#FFFFFF',
    fontSize: wp('5.5%'),
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
    color: '#FFFFFF',
    fontSize: wp('3%'),
    fontFamily: FONTS.gilroy.medium,
    maxWidth: wp('53%'),
  },
  bcoinContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: hp('0.6%'),
    paddingHorizontal: wp('2.5%'),
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
  searchProductContainer: {
    borderRightColor: '#8F8F8F',
    height: hp('3.65%'),
    justifyContent: 'center',
    marginLeft: wp('2%'),
    width: wp('65%'),
    top: Platform.OS == 'ios' ? 0 : 2,
    overflow: 'hidden',
  },
  searchProductText: {
    fontFamily: FONTS.gilroy.light,
    fontSize: wp('3.72%'),
    color: '#3A3A3A',
  },
  clipboardIcon: {
    marginLeft: wp('4%'),
  },
});

export default StickyHeader;
