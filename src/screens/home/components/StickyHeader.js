import React from 'react';
import {
  View,
  Text,
  Image,
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
import { FONTS } from '../../../styles/typography';
import ProfileAvatarBadge from '../../../components/ProfileAvatarBadge';
import RotatingPlaceholder from '../../../components/RotatingPlaceholder';
import CachedImage from '../../../components/CachedImage';
import { HomeHeaderSkeleton } from './shimmer';
import {
  resolveHeaderPhase,
  resolveHeaderTone,
  HEADER_PHASE,
  HEADER_TONE,
} from './headerPhase';
import COLORS from '@/styles/colors';
import {
  TYPE,
  MAX_FONT_SCALE,
  ACCENT,
  INK,
  HAIRLINE,
  SURFACE,
  SPACE,
  RADIUS,
  FIELD_RULE,
  SEARCH_FIELD,
} from '@/styles/homeTheme';
import {
  BANNER_MIN_HEIGHT,
  BANNER_PARALLAX,
  SEARCH_MARGIN_START,
  SEARCH_HEIGHT,
} from '../hooks/useHomeAnimations';
import useBannerPaint from '../hooks/useBannerPaint';
import icons from '@/assets/icons';

const CHIP_INK = INK.strong;
const LEADING_ICON = wp('4.6%');
const LEADING_GAP = wp('1.2%');
const BANNER_BLEED = BANNER_PARALLAX;
const SEARCH_INSET = wp('4.7%');
const SEARCH_EXAMPLES = ['Basmati Rice', 'Milk', 'Sunflower Oil', 'Lemons'];

const UNAVAILABLE_COPY = {
  closed: {
    status: 'Closed right now',
    search: 'Search opens when the store does',
  },
  unserved: {
    status: 'Not delivering here yet',
    search: 'Search unlocks once we reach this area',
  },
};

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
  storeUnavailableReason,
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

  const {
    painted: bannerPainted,
    revealStyle: bannerRevealStyle,
    skeletonStyle,
    onLoad: onBannerLoad,
    onError: onBannerError,
  } = useBannerPaint(bannerUrl);

  const phase = resolveHeaderPhase({ bannerUrl, bannerPending, bannerPainted });
  const onSurface =
    resolveHeaderTone({ storeUnavailable: isStoreUnavailable }) ===
    HEADER_TONE.surface;
  const showSkeleton = !onSurface && phase === HEADER_PHASE.shimmer;
  const copy =
    UNAVAILABLE_COPY[storeUnavailableReason] || UNAVAILABLE_COPY.unserved;

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
              {onSurface ? (
                <View style={styles.statusPill}>
                  <View style={styles.statusDot} />
                  <Text
                    style={styles.statusText}
                    numberOfLines={1}
                    maxFontSizeMultiplier={1.2}
                  >
                    {copy.status}
                  </Text>
                </View>
              ) : (
                <View style={styles.expressIconStyle}>
                  <View style={styles.iconSlot}>
                    <Image
                      style={styles.expressIcon}
                      source={icons.expressicon}
                    />
                  </View>
                  <Text style={styles.timeText} maxFontSizeMultiplier={1.2}>
                    Express
                  </Text>
                </View>
              )}
              <TouchableOpacity
                hitSlop={40}
                style={[
                  styles.addressView,
                  { marginTop: hp(onSurface ? '0.7%' : '0.4%') },
                ]}
                onPress={onPressLocation}
                accessibilityRole="button"
                accessibilityLabel={`Delivering to ${profile.pinAddress}. Change delivery location`}
              >
                <View style={[styles.iconSlot, styles.addressPinSlot]}>
                  <Feather
                    name={'map-pin'}
                    size={wp('4%')}
                    color={onSurface ? INK.muted : '#FFFFFF'}
                    style={styles.addressPin}
                  />
                </View>
                <Text
                  style={[
                    styles.addressText,
                    onSurface && styles.addressTextOnSurface,
                  ]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  maxFontSizeMultiplier={MAX_FONT_SCALE}
                >
                  {profile.pinAddress}
                </Text>
                <Entypo
                  name={'chevron-right'}
                  size={wp('3.6%')}
                  color={onSurface ? INK.muted : '#FFFFFF'}
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
              style={[
                styles.selectLocationButton,
                onSurface && styles.selectLocationButtonOnSurface,
              ]}
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
              style={[
                styles.bcoinContainer,
                onSurface && styles.bcoinContainerOnSurface,
              ]}
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
        onPress={() => navigation.navigate('SearchScreen')}
        onPressIn={onSearchPressIn}
        onPressOut={onSearchPressOut}
        style={styles.searchTouchable}
        activeOpacity={0.85}
        accessibilityRole="search"
        accessibilityLabel="Search for products"
        accessibilityHint="Opens product search"
      >
        <Feather name="search" color={INK.primary} size={20} />
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

  const renderInertSearch = () => (
    <View
      style={styles.inertSearch}
      onLayout={onSearchLayout}
      accessible
      accessibilityRole="text"
      accessibilityLabel={copy.search}
    >
      <Feather name="search" color={INK.faint} size={20} />
      <Text
        style={styles.inertSearchText}
        numberOfLines={1}
        maxFontSizeMultiplier={MAX_FONT_SCALE}
      >
        {copy.search}
      </Text>
    </View>
  );

  if (!onSurface && phase !== HEADER_PHASE.plain) {
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
                onError={onBannerError}
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
                <HomeHeaderSkeleton top={top} />
              </Animated.View>
            )}
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  if (onSurface) {
    return (
      <Animated.View style={headerCollapseStyle}>
        <View
          style={[styles.surfaceHeader, { paddingTop: top }]}
          onLayout={onFrameLayout}
        >
          {renderCollapsibleInfo()}
          {renderInertSearch()}
          <View pointerEvents="none" style={styles.surfaceRule} />
        </View>
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
  selectLocationButtonOnSurface: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: FIELD_RULE,
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
  addressTextOnSurface: {
    ...TYPE.body,
    fontFamily: FONTS.gilroy.semiBold,
    color: INK.strong,
  },
  surfaceHeader: {
    backgroundColor: SURFACE.base,
    paddingBottom: hp('1.8%'),
  },
  surfaceRule: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: FIELD_RULE,
  },
  expressIconStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: LEADING_GAP,
  },
  iconSlot: {
    width: LEADING_ICON,
    height: LEADING_ICON,
    alignItems: 'center',
    justifyContent: 'center',
  },
  expressIcon: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  addressPinSlot: {
    marginRight: LEADING_GAP,
  },
  addressPin: {
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: SURFACE.sunken,
    borderRadius: RADIUS.pill,
    paddingVertical: hp('0.45%'),
    paddingHorizontal: wp('2.6%'),
    gap: wp('1.6%'),
  },
  statusDot: {
    width: wp('1.7%'),
    height: wp('1.7%'),
    borderRadius: wp('0.85%'),
    backgroundColor: INK.faint,
  },
  statusText: {
    ...TYPE.micro,
    fontFamily: FONTS.gilroy.semiBold,
    color: INK.muted,
    letterSpacing: 0.2,
    includeFontPadding: false,
  },
  inertSearch: {
    marginTop: SEARCH_MARGIN_START,
    height: SEARCH_HEIGHT,
    borderRadius: SEARCH_FIELD.radius,
    marginHorizontal: SEARCH_INSET,
    paddingHorizontal: SPACE.base,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SURFACE.sunken,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: HAIRLINE,
  },
  inertSearchText: {
    ...TYPE.body,
    fontFamily: FONTS.gilroy.regular,
    color: INK.faint,
    marginLeft: SPACE.md,
    flex: 1,
    includeFontPadding: false,
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
  bcoinContainerOnSurface: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: FIELD_RULE,
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
