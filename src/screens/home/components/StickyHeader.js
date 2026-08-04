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
import COLORS from '@/styles/colors';
import { TYPE, MAX_FONT_SCALE, ACCENT } from '@/styles/homeTheme';
import {
  BANNER_MIN_HEIGHT,
  BANNER_PARALLAX,
  SEARCH_MARGIN_START,
  SEARCH_HEIGHT,
} from '../hooks/useHomeAnimations';

const INK = '#1A1A1A';
const BANNER_BLEED = BANNER_PARALLAX;
const SEARCH_INSET = wp('4.7%');
const SEARCH_EXAMPLES = ['Basmati Rice', 'Milk', 'Sunflower Oil', 'Lemons'];

// Banner URLs this session has already decoded at least once. Module-level for
// the same reason `lastKnownBanner` is: it has to outlive the screen, because
// every entry into Home is a fresh mount and the reveal below is a cold-start
// treatment that must not run again on a bitmap the image cache already holds.
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

  // Keyed off the URL string, not the object. `transformHomepageResponse`
  // rebuilds `{ uri }` from scratch every time it runs, so each refetch (the
  // homepage query refetches on every mount) handed <Image> a source it had to
  // treat as new and re-request — dropping the artwork for the frames it took
  // to come back, which is exactly when the orange hold behind it shows. Same
  // URL now means the same object, so the image is never re-issued.
  const bannerUrl = topSectionBanner?.[0]?.uri?.uri;
  const bannerSource = React.useMemo(
    () => (bannerUrl ? { uri: bannerUrl } : null),
    [bannerUrl],
  );

  // The artwork cannot be there on the frame the header mounts, and every
  // entry into Home is a fresh mount, so *something* is always visible first.
  // Cutting straight to the image the instant it decodes is what makes that
  // hand-off register as a blink. Revealing it over ~220ms instead turns the
  // same hand-off into the banner settling in — the hold underneath is already
  // the tone the scrim gives any artwork, so most of the fade is imperceptible.
  //
  // Reset on URL change, not on mount: a refetch that returns different
  // artwork should fade the new image in rather than swap it under the user.
  //
  // And only for artwork this session has never painted. Holding at 0 until JS
  // hears back from `onLoad` is what was putting the orange up on *every*
  // Android entry into Home: a remounted Fresco view re-requests its bitmap and
  // reports back a few frames later even on a warm cache, so the hold plus the
  // 220ms fade ran again each time. iOS returns a memory-cached image inside
  // the first commit, which is why only its cold start ever showed this. Once
  // the URL is in `paintedBanners` the image starts opaque and the hold behind
  // it is never seen.
  const seen = !!bannerUrl && paintedBanners.has(bannerUrl);
  const bannerReveal = useSharedValue(seen ? 1 : 0);
  React.useEffect(() => {
    bannerReveal.value = bannerUrl && paintedBanners.has(bannerUrl) ? 1 : 0;
  }, [bannerUrl, bannerReveal]);
  const onBannerLoad = React.useCallback(() => {
    if (bannerUrl) {
      paintedBanners.add(bannerUrl);
    }
    // Already opaque on a cache hit — animating from 1 to 1 is a no-op, but
    // skip it so a re-entry never schedules a UI-thread animation at all.
    if (bannerReveal.value !== 1) {
      bannerReveal.value = withTiming(1, { duration: 220 });
    }
  }, [bannerReveal, bannerUrl]);
  const bannerRevealStyle = useAnimatedStyle(() => ({
    opacity: bannerReveal.value,
  }));

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
            // Home has not resolved the stored address yet. Showing "Select
            // Location" here is a claim we cannot back — for anyone who has a
            // saved address it is wrong, and it is withdrawn a moment later.
            // Hold the same footprint instead so the real content drops into
            // place without the block resizing.
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

  // `bannerPending` covers the cold-start case the sticky hold can't: nothing
  // has been painted this session, so the frame is rendered banner-shaped and
  // empty (the orange hold is what it is *for*) and the artwork mounts into it
  // when the URL lands. Without it the first paint used the bannerless branch
  // and then replaced the whole subtree, which both remounted the image and
  // resized the header.
  if (bannerSource || bannerPending) {
    return (
      // The collapse is a translate on the outermost node: everything above the
      // search bar is carried off the top of the screen, so nothing resizes.
      <Animated.View style={headerCollapseStyle}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handleBannerPress}
          // Nothing to route to until the artwork is known.
          disabled={!bannerSource}
          style={styles.bannerShadow}
        >
          {/* Layered rather than an ImageBackground: the artwork needs to move
              independently of the chrome for the parallax, and it has to sit
              under the white sheet that the content in turn sits on top of. */}
          <View
            style={[
              styles.bannerFrame,
              { paddingTop: top, paddingBottom: hp('1%') },
            ]}
            onLayout={onFrameLayout}
          >
            <Animated.Image
              source={bannerSource}
              style={[
                styles.bannerImage,
                bannerParallaxStyle,
                bannerRevealStyle,
              ]}
              accessible={false}
              onLoad={onBannerLoad}
              // Android's own 300ms cross-fade is off because the reveal above
              // replaces it: that one is uncancellable, runs on the UI thread's
              // draw pass, and is not shared with iOS, which got a hard cut.
              fadeDuration={0}
            />

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
    // A static floor, not an animated one — the frame keeps this box for the
    // whole scroll.
    minHeight: BANNER_MIN_HEIGHT,
    // Clips the overhanging artwork — without this the bleed and the parallax
    // scale would paint over the content below the header.
    overflow: 'hidden',
    // What shows for the handful of frames before the artwork paints, and for
    // as long as there is no banner at all (no location selected yet). Every
    // entry into Home is a fresh mount (the tab root is reset, and back exits
    // the app), so the banner Image is a new native view each time and has to
    // re-request its bitmap even on a warm disk cache — measured at ~5 frames
    // / 165ms on an emulator, longer on a cold cache.
    //
    // Brand orange, matching the bannerless header in `fallbackHeaderBgStyle`
    // so the two states are the same surface. It also keeps the white header
    // text and icons legible while it is up, which a white hold would not.
    backgroundColor: ACCENT.primary,
  },
  // The banner used to end on a hard horizontal line straight into
  // TopShowcase's own full-bleed artwork — two unrelated photographs meeting
  // edge to edge. A soft cast separates them by reading the header as a plane
  // above the page, which it genuinely is, rather than drawing a rule between
  // them. Downward-only, and the one place the flat theme's "lift only what is
  // actually above the page" clause applies on this screen.
  //
  // It lives on the wrapper, not on bannerFrame: `overflow: 'hidden'` there
  // (which the parallax bleed requires) sets masksToBounds on iOS, and that
  // clips the view's own shadow along with its children.
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
    // Overhang top and bottom so the parallax drift always has cover to spare.
    top: -BANNER_BLEED,
    bottom: -BANNER_BLEED,
    resizeMode: 'cover',
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
    // Hug the content so the chevron sits right after the address instead of
    // being pushed to the far edge of a full-width row.
    alignSelf: 'flex-start',
    // The row itself must be allowed to shrink, or a long address makes it
    // overflow the header rather than truncate inside it.
    flexShrink: 1,
    maxWidth: '100%',
  },
  // Same box as the resolved ETA + address block, invisible: it is a spacer,
  // not a skeleton — the wait is a couple of frames, so a shimmer here would
  // itself be the flicker.
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
    color: INK,
    fontFamily: FONTS.gilroy.semiBold,
    marginRight: wp('1%'),
  },
  addressText: {
    ...TYPE.caption,
    color: '#FFFFFF',
    fontFamily: FONTS.gilroy.medium,
    // Gilroy's declared ascent/descent are tight, and Android sizes a Text's
    // line box straight from those metrics — so without a generous lineHeight
    // the taller glyphs get shaved off top and bottom. iOS is more forgiving,
    // which is why this only showed up on Android. TYPE.caption carries a
    // 1.33 ratio, which clears the descenders; don't tighten it here.
    includeFontPadding: false,
    textAlignVertical: 'center',
    // Shrink to fit the space left by the pin and chevron rather than being
    // capped at a fixed width — the old maxWidth truncated short addresses
    // that had room to spare on wider screens.
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
    color: INK,
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
    marginHorizontal: SEARCH_INSET,
    paddingHorizontal: wp('4%'),
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    // Lifts the bar off whatever is behind it — the banner artwork at rest, the
    // white header once scrolled — so it reads as a control rather than a
    // painted rectangle. The press-scale animation in HomeScreen rides on top.
    //
    // Spelled out locally rather than spread from ELEVATION.sm: that token is
    // commented out in homeTheme (the flat-page redesign), so the spread was
    // resolving to nothing and this bar has had no shadow at all. Restoring the
    // token would also restyle TokenProductCard's three call sites on another
    // screen, which isn't this change's business.
    shadowColor: '#0B1020',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
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
    marginLeft: wp('2%'),
    flex: 1,
    top: Platform.OS == 'ios' ? 0 : 2,
    overflow: 'hidden',
  },
  searchProductText: {
    ...TYPE.body,
    fontFamily: FONTS.gilroy.regular,
    // #3A3A3A on white is 10.9:1, but the placeholder is set in Gilroy Light at
    // small size where thin strokes read far lighter than the ratio suggests.
    // Regular weight is what actually makes it legible outdoors.
    color: '#3A3A3A',
  },
  clipboardIcon: {
    marginLeft: wp('4%'),
  },
});

// Memoised: the header sits above the scroll view and its content only depends
// on profile/dashboard/banner data, but it was re-rendering on every HomeScreen
// render — including the scroll-driven ones. Its animated styles are shared
// values, so the collapse/fade animations keep running on the UI thread
// regardless of whether this component re-renders.
export default React.memo(StickyHeader);
