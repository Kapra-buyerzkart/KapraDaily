import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import { FONTS } from '../../../styles/typography';
import ProfileAvatarBadge from '../../../components/ProfileAvatarBadge';
import RotatingPlaceholder from '../../../components/RotatingPlaceholder';
import CachedImage from '../../../components/CachedImage';
import HeaderSkeleton from './HeaderSkeleton';
import { resolveHeaderPhase, HEADER_PHASE } from './headerPhase';
import COLORS from '@/styles/colors';
import {
  TYPE,
  MAX_FONT_SCALE,
  ACCENT,
  INK,
  HAIRLINE,
  SPACE,
  FIELD_RULE,
  SEARCH_FIELD,
} from '@/styles/homeTheme';
import {
  BANNER_MIN_HEIGHT,
  BANNER_PARALLAX,
  SEARCH_MARGIN_START,
  SEARCH_HEIGHT,
} from '../hooks/useHomeAnimations';

const CHIP_INK = INK.strong;
const BANNER_BLEED = BANNER_PARALLAX;
const SEARCH_INSET = wp('4.7%');
const SEARCH_EXAMPLES = ['Basmati Rice', 'Milk', 'Sunflower Oil', 'Lemons'];

const paintedBanners = new Set();
const StickyHeader = ({
  top,
  topSectionBanner,
  bannerPending,
  onBannerPress,
  bannerSheetStyle,
  bannerParallaxStyle,
  headerCollapseStyle,
  etaAnimStyle,
  searchWrapperAnimStyle,
  fallbackHeaderBgStyle,
  stickyBorderAnimStyle,
  onHeaderMetrics,
  profile,
  dashboardData,
  navigation,
  isStoreUnavailable,
  isLocationPending,
  profileAvatarSize,
  onSearchPressIn,
  onSearchPressOut,
  onPressLocation,
}) => {
  const onFrameLayout = React.useCallback(
    e => onHeaderMetrics({ height: e.nativeEvent.layout.height }),
    [onHeaderMetrics],
  );
  const onSearchLayout = React.useCallback(
    e => onHeaderMetrics({ searchY: e.nativeEvent.layout.y }),
    [onHeaderMetrics],
  );

  const bannerUrl = topSectionBanner?.[0]?.uri?.uri;
  const bannerSource = React.useMemo(
    () => (bannerUrl ? { uri: bannerUrl } : null),
    [bannerUrl],
  );

  const seen = !!bannerUrl && paintedBanners.has(bannerUrl);
  const bannerReveal = useSharedValue(seen ? 1 : 0);
  const [bannerPainted, setBannerPainted] = React.useState(seen);
  React.useEffect(() => {
    const alreadyPainted = !!bannerUrl && paintedBanners.has(bannerUrl);
    bannerReveal.value = alreadyPainted ? 1 : 0;
    setBannerPainted(alreadyPainted);
  }, [bannerUrl, bannerReveal]);
  const onBannerLoad = React.useCallback(() => {
    if (bannerUrl) {
      paintedBanners.add(bannerUrl);
    }
    if (bannerReveal.value !== 1) {
      bannerReveal.value = withTiming(1, { duration: 220 }, finished => {
        if (finished) runOnJS(setBannerPainted)(true);
      });
      return;
    }
    setBannerPainted(true);
  }, [bannerReveal, bannerUrl]);
  const bannerRevealStyle = useAnimatedStyle(() => ({
    opacity: bannerReveal.value,
  }));
  const skeletonStyle = useAnimatedStyle(() => ({
    opacity: 1 - bannerReveal.value,
  }));

  const phase = resolveHeaderPhase({ bannerUrl, bannerPending, bannerPainted });
  const showSkeleton = phase === HEADER_PHASE.shimmer;

  const handleBannerPress = React.useCallback(
    () => onBannerPress(topSectionBanner?.[0]),
    [onBannerPress, topSectionBanner],
  );

  const hasLocation = !!profile?.pinAddress;

  const renderCollapsibleInfo = () => (
    <View>
      <View style={styles.headerViewOne}>
        <Animated.View style={etaAnimStyle}>
          {hasLocation ? (
            <>
              <Text style={styles.timeText} maxFontSizeMultiplier={1.2}>
                20 mins
              </Text>
              <TouchableOpacity
                hitSlop={40}
                style={[styles.addressView, { marginTop: hp('0.4%') }]}
                onPress={onPressLocation}
                accessibilityRole="button"
                accessibilityLabel={`Delivering to ${profile.pinAddress}. Change delivery location`}
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
                  maxFontSizeMultiplier={MAX_FONT_SCALE}
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
          ) : isLocationPending ? (
            <View
              style={styles.locationPending}
              pointerEvents="none"
              accessible={false}
              importantForAccessibility="no-hide-descendants"
            >
              <Text style={styles.timeText} maxFontSizeMultiplier={1.2}>
                {' '}
              </Text>
              <View style={[styles.addressView, { marginTop: hp('0.4%') }]}>
                <Text
                  style={styles.addressText}
                  numberOfLines={1}
                  maxFontSizeMultiplier={MAX_FONT_SCALE}
                >
                  {' '}
                </Text>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              hitSlop={20}
              style={styles.selectLocationButton}
              onPress={onPressLocation}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Select your delivery location"
            >
              <Feather
                name={'map-pin'}
                size={wp('4.4%')}
                color={CHIP_INK}
                style={{ marginRight: wp('1.5%') }}
              />
              <Text style={styles.selectLocationText}>Select Location</Text>
              <Entypo
                name={'chevron-down'}
                size={wp('4.4%')}
                color={CHIP_INK}
              />
            </TouchableOpacity>
          )}
        </Animated.View>
        <View style={styles.headerRightWrapper}>
          <Animated.View style={etaAnimStyle}>
            <TouchableOpacity
              onPress={() => navigation.navigate('BCoinScreen')}
              style={styles.bcoinContainer}
              accessibilityRole="button"
              accessibilityLabel={`${
                dashboardData?.wallet?.bCoins || '0'
              } UD coins. View your wallet`}
            >
              <Image
                source={require('../../../assets/icons/udcoin.png')}
                style={styles.bcoinIcon}
                accessible={false}
              />
              <Text
                style={styles.tokenText}
                maxFontSizeMultiplier={MAX_FONT_SCALE}
              >
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
                accessibilityRole="button"
                accessibilityLabel="Your profile and account"
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
    </View>
  );

  const renderSearchBar = () => (
    <Animated.View
      style={[styles.searchWrapper, searchWrapperAnimStyle]}
      onLayout={onSearchLayout}
    >
      <TouchableOpacity
        onPress={() =>
          !isStoreUnavailable && navigation.navigate('SearchScreen')
        }
        onPressIn={onSearchPressIn}
        onPressOut={onSearchPressOut}
        style={[
          styles.searchTouchable,
          isStoreUnavailable && styles.searchDisabled,
        ]}
        activeOpacity={isStoreUnavailable ? 1 : 0.85}
        accessibilityRole="search"
        accessibilityLabel="Search for products"
        accessibilityHint={
          isStoreUnavailable
            ? 'Unavailable while the store is closed'
            : 'Opens product search'
        }
        accessibilityState={{ disabled: !!isStoreUnavailable }}
      >
        <Feather name="search" color={ACCENT.primary} size={20} />
        <View style={styles.searchProductContainer}>
          <RotatingPlaceholder
            examples={SEARCH_EXAMPLES}
            prefix="Search for "
            suffix='"'
            style={styles.searchProductText}
          />
        </View>
        {}
        <View style={styles.fieldRule} />
        <Feather
          name="clipboard"
          color={INK.muted}
          size={18}
          style={styles.clipboardIcon}
        />
      </TouchableOpacity>
    </Animated.View>
  );

  if (phase !== HEADER_PHASE.plain) {
    return (
      <Animated.View style={headerCollapseStyle}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handleBannerPress}
          disabled={!bannerSource}
          style={styles.bannerShadow}
        >
          {}
          <View
            style={[
              styles.bannerFrame,
              { paddingTop: top, paddingBottom: hp('1%') },
            ]}
            onLayout={onFrameLayout}
          >
            {}
            <Animated.View
              pointerEvents="none"
              style={[
                styles.bannerImage,
                bannerParallaxStyle,
                bannerRevealStyle,
              ]}
            >
              <CachedImage
                source={bannerSource}
                style={styles.bannerFill}
                resizeMode="cover"
                priority="high"
                transitionDuration={0}
                accessible={false}
                onLoad={onBannerLoad}
              />
            </Animated.View>

            <Animated.View
              pointerEvents="none"
              style={[
                StyleSheet.absoluteFill,
                styles.bannerSheet,
                bannerSheetStyle,
              ]}
            />

            {renderCollapsibleInfo()}
            {renderSearchBar()}

            {showSkeleton && (
              <Animated.View
                style={[StyleSheet.absoluteFill, skeletonStyle]}
                pointerEvents="auto"
              >
                <HeaderSkeleton top={top} />
              </Animated.View>
            )}
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={headerCollapseStyle}>
      <Animated.View
        style={[
          { paddingTop: top, paddingBottom: hp('1%') },
          fallbackHeaderBgStyle,
        ]}
        onLayout={onFrameLayout}
      >
        {renderCollapsibleInfo()}
        {renderSearchBar()}

        <Animated.View
          pointerEvents="none"
          style={[styles.fallbackBorder, stickyBorderAnimStyle]}
        />
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  bannerFrame: {
    width: wp('100%'),
    minHeight: BANNER_MIN_HEIGHT,
    overflow: 'hidden',
    backgroundColor: ACCENT.primary,
  },
  bannerShadow: {
    shadowColor: '#0B1020',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 5,
  },
  bannerSheet: {
    backgroundColor: '#FFFFFF',
  },
  bannerImage: {
    ...StyleSheet.absoluteFillObject,
    top: -BANNER_BLEED,
    bottom: -BANNER_BLEED,
  },
  bannerFill: {
    flex: 1,
  },
  headerViewOne: {
    flexDirection: 'row',
    marginLeft: wp('6.9%'),
    marginRight: SEARCH_INSET,
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 0 : 5,
    alignItems: 'center',
  },
  timeText: {
    ...TYPE.title,
    fontFamily: FONTS.gilroy.bold,
    color: '#FFFFFF',
  },
  addressView: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    flexShrink: 1,
    maxWidth: '100%',
  },
  locationPending: {
    opacity: 0,
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
    ...TYPE.label,
    color: CHIP_INK,
    fontFamily: FONTS.gilroy.semiBold,
    marginRight: wp('1%'),
  },
  addressText: {
    ...TYPE.caption,
    color: '#FFFFFF',
    fontFamily: FONTS.gilroy.medium,
    includeFontPadding: false,
    textAlignVertical: 'center',
    flexShrink: 1,
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
    ...TYPE.label,
    fontFamily: FONTS.gilroy.bold,
    color: CHIP_INK,
  },
  fallbackBorder: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginTop: hp('0.5%'),
  },
  searchWrapper: {
    backgroundColor: COLORS.white,
    marginTop: SEARCH_MARGIN_START,
    height: SEARCH_HEIGHT,
    borderRadius: SEARCH_FIELD.radius,
    marginHorizontal: SEARCH_INSET,
    paddingHorizontal: SPACE.base,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: HAIRLINE,
    shadowColor: '#0B1020',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  searchTouchable: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchDisabled: {
    opacity: 0.6,
  },
  searchProductContainer: {
    height: hp('3.65%'),
    justifyContent: 'center',
    marginLeft: SPACE.md,
    flex: 1,
    top: Platform.OS == 'ios' ? 0 : 2,
    overflow: 'hidden',
  },
  searchProductText: {
    ...TYPE.body,
    fontFamily: FONTS.gilroy.regular,
    color: '#3A3A3A',
  },
  fieldRule: {
    width: 1,
    height: 20,
    backgroundColor: FIELD_RULE,
    marginLeft: SPACE.md,
  },
  clipboardIcon: {
    marginLeft: SPACE.md,
  },
});

export default React.memo(StickyHeader);
