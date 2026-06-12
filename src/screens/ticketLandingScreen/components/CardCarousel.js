import React, { useRef, useState, useCallback } from 'react';
import { View, Image, Text, Animated, TouchableOpacity, Platform } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { hp } from '../../../utils/responsive';
import styles from '../styles';
import { INFINITE_CARDS, SNAP_INTERVAL, INITIAL_INDEX } from '../constants';

const AnimatedCard = ({ item, index, scrollX }) => {
  const inputRange = [
    (index - 1) * SNAP_INTERVAL,
    index * SNAP_INTERVAL,
    (index + 1) * SNAP_INTERVAL,
  ];

  const scale = scrollX.interpolate({ inputRange, outputRange: [0.85, 1, 0.85], extrapolate: 'clamp' });
  const opacity = scrollX.interpolate({ inputRange, outputRange: [0.5, 1, 0.5], extrapolate: 'clamp' });
  const glowOpacity = scrollX.interpolate({ inputRange, outputRange: [0, 1, 0], extrapolate: 'clamp' });

  return (
    <Animated.View style={[styles.cardContainer, { transform: [{ scale }], opacity }]}>
      <Animated.View style={[styles.cardGlow, { opacity: glowOpacity }]} />
      {item.image ? (
        <Image source={item.image} style={styles.cardImage} resizeMode="cover" />
      ) : (
        <View style={styles.cardPlaceholder}>
          <Text style={styles.cardPlaceholderText}>Gift Card Image</Text>
        </View>
      )}
    </Animated.View>
  );
};

const CardCarousel = ({ fadeAnim, onClaim }) => {
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(INITIAL_INDEX * SNAP_INTERVAL)).current;
  const [activeCardIndex, setActiveCardIndex] = useState(INITIAL_INDEX);

  const scrollToIndex = useCallback(index => {
    if (index >= 0 && index < INFINITE_CARDS.length) {
      flatListRef.current?.scrollToIndex({ index, animated: true });
      setActiveCardIndex(index);
    }
  }, []);

  const handlePrev = useCallback(() => scrollToIndex(activeCardIndex - 1), [activeCardIndex, scrollToIndex]);
  const handleNext = useCallback(() => scrollToIndex(activeCardIndex + 1), [activeCardIndex, scrollToIndex]);

  const handleScrollEnd = useCallback(event => {
    const index = Math.round(event.nativeEvent.contentOffset.x / SNAP_INTERVAL);
    if (index >= 0 && index < INFINITE_CARDS.length) setActiveCardIndex(index);
  }, []);

  const getItemLayout = useCallback((_, index) => ({
    length: SNAP_INTERVAL,
    offset: SNAP_INTERVAL * index,
    index,
  }), []);

  const renderCard = useCallback(
    ({ item, index }) => <AnimatedCard item={item} index={index} scrollX={scrollX} />,
    [scrollX],
  );

  return (
    <>
      <Animated.View style={[styles.carouselWrapper, { opacity: fadeAnim }]}>
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

      <View style={[styles.arrowContainer, { marginTop: Platform.OS === 'ios' ? hp(14) : hp(17) }]}>
        <View style={styles.arrowPill}>
          <TouchableOpacity style={styles.arrowButton} onPress={handlePrev} activeOpacity={0.6}>
            <MaterialIcons name="keyboard-arrow-left" size={28} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.arrowDivider} />
          <TouchableOpacity style={styles.arrowButton} onPress={handleNext} activeOpacity={0.6}>
            <MaterialIcons name="keyboard-arrow-right" size={28} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <Image
        source={require('../../../assets/images/movieTicket/Subtract.png')}
        style={styles.subtractImage}
        resizeMode="contain"
      />

      <View style={styles.claimWrapper}>
        <TouchableOpacity activeOpacity={0.8} onPress={onClaim}>
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
    </>
  );
};

export default CardCarousel;
