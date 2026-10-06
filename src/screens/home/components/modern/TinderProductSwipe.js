import React, { useRef, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  PanResponder,
  Image,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Feather from 'react-native-vector-icons/Feather';
import { FONTS } from '@/styles/typography';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;
const CARD_WIDTH = SCREEN_WIDTH * 0.9;
const CARD_HEIGHT = CARD_WIDTH * 1.35;

const DUMMY_PRODUCTS = [
  {
    id: '1',
    name: 'Fresh Strawberries',
    price: '₹ 150',
    weight: '500g',
    image:
      'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: '2',
    name: 'Organic Avocados',
    price: '₹ 220',
    weight: '3 Pcs',
    image:
      'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: '3',
    name: 'Almond Milk',
    price: '₹ 180',
    weight: '1L',
    image:
      'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: '4',
    name: 'Artisan Sourdough',
    price: '₹ 120',
    weight: '1 Loaf',
    image:
      'https://images.unsplash.com/photo-1585478259715-876a6a81fa08?auto=format&fit=crop&q=80&w=800',
  },
];

const TinderProductSwipe = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const position = useRef(new Animated.ValueXY()).current;

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (event, gesture) => {
          position.setValue({ x: gesture.dx, y: gesture.dy });
        },
        onPanResponderRelease: (event, gesture) => {
          if (gesture.dx > SWIPE_THRESHOLD) {
            forceSwipe('right');
          } else if (gesture.dx < -SWIPE_THRESHOLD) {
            forceSwipe('left');
          } else {
            resetPosition();
          }
        },
      }),
    [currentIndex],
  );

  const forceSwipe = direction => {
    const x = direction === 'right' ? SCREEN_WIDTH * 1.5 : -SCREEN_WIDTH * 1.5;
    Animated.timing(position, {
      toValue: { x, y: direction === 'right' ? 100 : -100 },
      duration: SWIPE_OUT_DURATION,
      useNativeDriver: false,
    }).start(() => onSwipeComplete());
  };

  const onSwipeComplete = () => {
    position.setValue({ x: 0, y: 0 });
    setCurrentIndex(prevIndex => (prevIndex + 1) % DUMMY_PRODUCTS.length);
  };

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      friction: 5,
      useNativeDriver: false,
    }).start();
  };

  const getCardStyle = () => {
    const rotate = position.x.interpolate({
      inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
      outputRange: ['-30deg', '0deg', '30deg'],
    });
    return {
      ...position.getLayout(),
      transform: [{ rotate }],
    };
  };

  const likeOpacity = position.x.interpolate({
    inputRange: [0, SCREEN_WIDTH / 4],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const nopeOpacity = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 4, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const renderCardContent = (item, isTopCard) => (
    <View style={styles.cardContent}>
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.9)']}
        style={styles.gradient}
      />
      <View style={styles.textContainer}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productDetails}>
          {item.price} • {item.weight}
        </Text>
      </View>

      {/* LIKE / NOPE Stamps (only applied to the top card) */}
      {isTopCard && (
        <>
          <Animated.View
            style={[
              styles.stampContainer,
              styles.likeStampContainer,
              { opacity: likeOpacity },
            ]}
          >
            <Text style={[styles.stampText, styles.likeText]}>LIKE</Text>
          </Animated.View>
          <Animated.View
            style={[
              styles.stampContainer,
              styles.nopeStampContainer,
              { opacity: nopeOpacity },
            ]}
          >
            <Text style={[styles.stampText, styles.nopeText]}>NOPE</Text>
          </Animated.View>
        </>
      )}
    </View>
  );

  const renderCards = () => {
    // Top 3 cards we want to render
    const itemsToRender = [
      {
        item: DUMMY_PRODUCTS[(currentIndex + 2) % DUMMY_PRODUCTS.length],
        offset: 2,
      },
      {
        item: DUMMY_PRODUCTS[(currentIndex + 1) % DUMMY_PRODUCTS.length],
        offset: 1,
      },
      { item: DUMMY_PRODUCTS[currentIndex], offset: 0 },
    ];

    return itemsToRender.map(({ item, offset }) => {
      if (offset === 0) {
        return (
          <Animated.View
            key={`${item.id}-${currentIndex}`}
            style={[getCardStyle(), styles.cardContainer, { zIndex: 99 }]}
            {...panResponder.panHandlers}
          >
            {renderCardContent(item, true)}
          </Animated.View>
        );
      }

      // Next cards shrink slightly in the background
      const scale = offset === 1 ? 0.95 : 0.9;
      return (
        <Animated.View
          key={`${item.id}-${currentIndex}-${offset}`}
          style={[
            styles.cardContainer,
            {
              zIndex: 99 - offset,
              transform: [{ scale }],
              opacity: 1 - 0.1 * offset,
            },
          ]}
          pointerEvents="none"
        >
          {renderCardContent(item, false)}
        </Animated.View>
      );
    });
  };

  return (
    <View style={styles.container}>
      {/* Title */}
      {/* <View style={styles.header}>
        <Text style={styles.title}>Discover Daily Matches</Text>
      </View> */}

      {/* Card Stack */}
      <View style={styles.cardStackWrapper}>{renderCards()}</View>

      {/* Bottom Controls */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={[styles.controlButton, styles.nopeButton]}
          onPress={() => forceSwipe('left')}
          activeOpacity={0.8}
        >
          <Feather name="x" size={32} color="#FF3B30" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, styles.superLikeButton]}
          onPress={() => forceSwipe('right')} // Dummy action
          activeOpacity={0.8}
        >
          <Feather name="star" size={24} color="#007AFF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, styles.likeButton]}
          onPress={() => forceSwipe('right')}
          activeOpacity={0.8}
        >
          <Feather name="heart" size={32} color="#34C759" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  header: {
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontFamily: FONTS.gilroy.heavy,
    fontSize: 24,
    color: '#111827',
  },
  cardStackWrapper: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    position: 'absolute',
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    backgroundColor: '#FFF',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  cardContent: {
    flex: 1,
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  textContainer: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
  },
  productName: {
    fontFamily: FONTS.gilroy.heavy,
    fontSize: 32,
    color: '#FFFFFF',
    marginBottom: 5,
  },
  productDetails: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: 20,
    color: '#E5E5EA',
  },
  stampContainer: {
    position: 'absolute',
    top: 50,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderWidth: 4,
    borderRadius: 10,
  },
  stampText: {
    fontFamily: FONTS.gilroy.heavy,
    fontSize: 32,
    textTransform: 'uppercase',
  },
  likeStampContainer: {
    left: 40,
    borderColor: '#34C759',
    transform: [{ rotate: '-20deg' }],
  },
  likeText: {
    color: '#34C759',
  },
  nopeStampContainer: {
    right: 40,
    borderColor: '#FF3B30',
    transform: [{ rotate: '20deg' }],
  },
  nopeText: {
    color: '#FF3B30',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: CARD_WIDTH,
    marginTop: 30,
  },
  controlButton: {
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  nopeButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  superLikeButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  likeButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
});

export default React.memo(TinderProductSwipe);
