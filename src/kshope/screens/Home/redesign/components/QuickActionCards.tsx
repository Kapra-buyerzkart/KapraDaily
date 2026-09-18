import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { KAPRA_ART } from '../kapraAssets';
import { HOME_FONTS, s, fs } from '../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GUTTER = s(16);
const CARD_GAP = s(8);
const CARD_WIDTH = (SCREEN_WIDTH - GUTTER * 2 - CARD_GAP * 2) / 3;

interface QuickActionCardsProps {
  onGoldRatePress?: () => void;
  onGoldCoinsPress?: () => void;
  onFindStorePress?: () => void;
}

const QuickActionCards: React.FC<QuickActionCardsProps> = ({
  onGoldRatePress,
  onGoldCoinsPress,
  onFindStorePress,
}) => {
  return (
    <View style={styles.container}>
      {/* Card 1: Today's Gold Rate */}
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.85}
        onPress={onGoldRatePress}
      >
        <Image
          source={KAPRA_ART.goldRateBars}
          style={styles.cardImage}
          resizeMode="cover"
        />
        <View style={styles.cardContent}>
          <Text style={styles.eyebrow}>Today's</Text>
          <Text style={styles.title} numberOfLines={1}>
            Gold Rate
          </Text>
          <Text style={styles.linkText} numberOfLines={1}>
            Check latest rate →
          </Text>
        </View>
      </TouchableOpacity>

      {/* Card 2: Gold Coins */}
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.85}
        onPress={onGoldCoinsPress}
      >
        <Image
          source={KAPRA_ART.goldCoins}
          style={styles.cardImage}
          resizeMode="cover"
        />
        <View style={styles.cardContent}>
          <Text style={styles.title} numberOfLines={1}>
            Gold Coins
          </Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            A lasting value
          </Text>
          <Text style={styles.linkText} numberOfLines={1}>
            Explore →
          </Text>
        </View>
      </TouchableOpacity>

      {/* Card 3: Find a Store */}
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.85}
        onPress={onFindStorePress}
      >
        <Image
          source={KAPRA_ART.storeFront}
          style={styles.cardImage}
          resizeMode="cover"
        />
        <View style={styles.cardContent}>
          <Text style={styles.title} numberOfLines={1}>
            Find a Store
          </Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            Visit our showroom
          </Text>
          <Text style={styles.linkText} numberOfLines={1}>
            Locate now →
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: GUTTER,
    paddingVertical: s(10),
    gap: CARD_GAP,
    backgroundColor: '#FFFFFF',
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#FAF7F2',
    borderWidth: 1,
    borderColor: '#EFE8DE',
    borderRadius: s(8),
    overflow: 'hidden',
    padding: s(6),
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: s(66),
  },
  cardImage: {
    width: s(36),
    height: s(36),
    borderRadius: s(6),
    marginRight: s(5),
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  eyebrow: {
    fontSize: fs(7.5),
    fontFamily: HOME_FONTS.regular,
    color: '#767676',
    lineHeight: fs(9),
  },
  title: {
    fontSize: fs(9.5),
    fontFamily: HOME_FONTS.bold,
    color: '#1A1A1A',
    lineHeight: fs(12),
  },
  subtitle: {
    fontSize: fs(7.2),
    fontFamily: HOME_FONTS.regular,
    color: '#767676',
    lineHeight: fs(9),
  },
  linkText: {
    fontSize: fs(7.2),
    fontFamily: HOME_FONTS.semiBold,
    color: '#B68D40',
    marginTop: s(2),
  },
});

export default QuickActionCards;
