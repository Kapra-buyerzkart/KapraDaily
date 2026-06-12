import React, { useState, useRef, useCallback } from 'react';
import {
  Image,
  Animated,
  StatusBar,
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { wp, hp } from '../../utils/responsive';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles from './styles';

const { width } = Dimensions.get('window');

const AnimatedImageBackground =
  Animated.createAnimatedComponent(ImageBackground);

const CARD_WIDTH = wp(72);
const CARD_SPACING = 16;
const SNAP_INTERVAL = CARD_WIDTH + CARD_SPACING;

const ORIGINAL_CARDS = [
  { id: '1', image: require('../../assets/images/movieTicket/voucher.png') },
  { id: '2', image: require('../../assets/images/movieTicket/voucher.png') },
  { id: '3', image: require('../../assets/images/movieTicket/voucher.png') },
];

const LOOP_COUNT = 100;
const INFINITE_CARDS = Array.from(
  { length: ORIGINAL_CARDS.length * LOOP_COUNT },
  (_, i) => ({
    ...ORIGINAL_CARDS[i % ORIGINAL_CARDS.length],
    id: String(i),
  }),
);
const INITIAL_INDEX = Math.floor(INFINITE_CARDS.length / 2);

const AnimatedCard = ({ item, index, scrollX }) => {
  const inputRange = [
    (index - 1) * SNAP_INTERVAL,
    index * SNAP_INTERVAL,
    (index + 1) * SNAP_INTERVAL,
  ];

  const scale = scrollX.interpolate({
    inputRange,
    outputRange: [0.85, 1, 0.85],
    extrapolate: 'clamp',
  });

  const opacity = scrollX.interpolate({
    inputRange,
    outputRange: [0.5, 1, 0.5],
    extrapolate: 'clamp',
  });

  const glowOpacity = scrollX.interpolate({
    inputRange,
    outputRange: [0, 1, 0],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View
      style={[
        styles.cardContainer,
        {
          transform: [{ scale }],
          opacity,
        },
      ]}
    >
      <Animated.View style={[styles.cardGlow, { opacity: glowOpacity }]} />
      {item.image ? (
        <Image
          source={item.image}
          style={styles.cardImage}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.cardPlaceholder}>
          <Text style={styles.cardPlaceholderText}>Gift Card Image</Text>
        </View>
      )}
    </Animated.View>
  );
};

const TicketLandingScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [fadeAnim] = useState(() => new Animated.Value(0));
  const [imageOpacity] = useState(() => new Animated.Value(0));
  const [activeTab, setActiveTab] = useState(0);
  const [activeCardIndex, setActiveCardIndex] = useState(INITIAL_INDEX);
  const flatListRef = useRef(null);
  const scrollX = useRef(
    new Animated.Value(INITIAL_INDEX * SNAP_INTERVAL),
  ).current;

  const handleImageLoad = () => {
    Animated.timing(imageOpacity, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    });
  };

  const scrollToIndex = useCallback(index => {
    if (index >= 0 && index < INFINITE_CARDS.length) {
      flatListRef.current?.scrollToIndex({ index, animated: true });
      setActiveCardIndex(index);
    }
  }, []);

  const handlePrev = useCallback(() => {
    scrollToIndex(activeCardIndex - 1);
  }, [activeCardIndex, scrollToIndex]);

  const handleNext = useCallback(() => {
    scrollToIndex(activeCardIndex + 1);
  }, [activeCardIndex, scrollToIndex]);

  const handleScrollEnd = useCallback(event => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / SNAP_INTERVAL);
    if (index >= 0 && index < INFINITE_CARDS.length) {
      setActiveCardIndex(index);
    }
  }, []);

  const getItemLayout = useCallback(
    (_, index) => ({
      length: SNAP_INTERVAL,
      offset: SNAP_INTERVAL * index,
      index,
    }),
    [],
  );

  const renderCard = useCallback(
    ({ item, index }) => (
      <AnimatedCard item={item} index={index} scrollX={scrollX} />
    ),
    [scrollX],
  );

  const tabs = ['Tickets', 'My Vouchers'];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <AnimatedImageBackground
        source={require('../../assets/images/movieTicket/ticketLandingBg.png')}
        style={[styles.imageBg, { opacity: imageOpacity }]}
        onLoad={handleImageLoad}
        resizeMode="cover"
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View
            style={[
              styles.header,
              { paddingTop: insets.top > 0 ? insets.top + 16 : 40 },
            ]}
          >
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={[
                styles.backButton,
                { top: insets.top > 0 ? insets.top + 16 : 40 },
              ]}
            >
              <Image source={require('../../assets/icons/backArrow.png')} />
            </TouchableOpacity>
            <Image
              source={require('../../assets/icons/titleText.png')}
              style={styles.titleImage}
            />
          </View>

          {/* ── Title underline ── */}

          {/* ── Coin bar ── */}
          <View style={styles.coinBar}>
            <Text style={styles.coinBarText}>
              Use UD-Coins to Book Your Tickets
            </Text>
            <View style={styles.coinBadge}>
              <Image
                source={require('../../assets/images/coin.png')}
                style={styles.coinIcon}
                resizeMode="contain"
              />
              <Text style={styles.coinAmount}>10.0 B</Text>
            </View>
          </View>

          <View style={styles.tabSeparator} />

          {/* ── Tabs ── */}
          <View style={styles.tabContainer}>
            {tabs.map((tab, index) => (
              <TouchableOpacity
                key={tab}
                style={styles.tab}
                onPress={() => setActiveTab(index)}
                activeOpacity={0.7}
              >
                <Text
                  style={
                    activeTab === index
                      ? styles.tabTextActive
                      : styles.tabTextInactive
                  }
                >
                  {tab}
                </Text>
                {activeTab === index && <View style={styles.tabDot} />}
              </TouchableOpacity>
            ))}
          </View>

          {/* ── Card Carousel (infinite) ── */}
          <Animated.View
            style={[styles.carouselWrapper, { opacity: fadeAnim }]}
          >
            <Animated.FlatList
              ref={flatListRef}
              data={INFINITE_CARDS}
              keyExtractor={item => item.id}
              renderItem={renderCard}
              horizontal
              pagingEnabled={false}
              snapToInterval={SNAP_INTERVAL}
              snapToAlignment="center"
              decelerationRate="fast"
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.carouselList}
              onMomentumScrollEnd={handleScrollEnd}
              onScrollEndDrag={handleScrollEnd}
              getItemLayout={getItemLayout}
              initialScrollIndex={INITIAL_INDEX}
              windowSize={5}
              maxToRenderPerBatch={5}
              removeClippedSubviews
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                { useNativeDriver: true },
              )}
              scrollEventThrottle={16}
            />
          </Animated.View>

          {/* ── Carousel Arrows ── */}
          <View
            style={[
              styles.arrowContainer,
              { marginTop: Platform.OS == 'ios' ? hp(14) : hp(17) },
            ]}
          >
            <View style={styles.arrowPill}>
              <TouchableOpacity
                style={styles.arrowButton}
                onPress={handlePrev}
                activeOpacity={0.6}
              >
                <MaterialIcons
                  name="keyboard-arrow-left"
                  size={28}
                  color="#FFFFFF"
                />
              </TouchableOpacity>
              <View style={styles.arrowDivider} />
              <TouchableOpacity
                style={styles.arrowButton}
                onPress={handleNext}
                activeOpacity={0.6}
              >
                <MaterialIcons
                  name="keyboard-arrow-right"
                  size={28}
                  color="#FFFFFF"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* ── Subtract Image Divider ── */}
          <Image
            source={require('../../assets/images/movieTicket/Subtract.png')}
            style={styles.subtractImage}
            resizeMode="contain"
          />

          {/* ── Claim Button ── */}
          <View style={styles.claimWrapper}>
            <TouchableOpacity activeOpacity={0.8}>
              <LinearGradient
                colors={['#F5D680', '#D4A843', '#C49A38']}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={styles.claimButton}
              >
                <Text style={styles.claimText}>Claim</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </AnimatedImageBackground>
    </View>
  );
};

export default TicketLandingScreen;
