import React from 'react';
import { View, Image, Text, ImageBackground, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import icons from '@/assets/icons';
import Shimmer from '@/components/events/Shimmer';
import COLORS from '@/styles/colors';

const RewardsCard = ({ bCoins, loading, onPress }) => (
  <View style={styles.card}>
    <View style={styles.left}>
      <Image
        source={require('../../assets/icons/udcoin.png')}
        style={styles.icon}
        resizeMode="contain"
      />
      <View>
        <Text style={styles.label}>UDEN REWARDS</Text>
        {loading ? (
          <Shimmer style={styles.amountShimmer} />
        ) : (
          <Text style={styles.amount}>
            {(bCoins || 0).toLocaleString('en-IN')}
          </Text>
        )}
      </View>
    </View>

    <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
      <ImageBackground
        source={icons.selectionPillTwo}
        style={styles.pillButton}
        imageStyle={styles.pillImage}
        resizeMode="stretch"
      >
        <Text style={styles.pillText}>View Wallet</Text>
        <MaterialIcons name="open-in-new" size={14} color="#FFFFFF" />
      </ImageBackground>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 14,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  icon: {
    width: 34,
    height: 34,
  },
  label: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 10,
    fontFamily: 'Gilroy-SemiBold',
    letterSpacing: 0.5,
  },
  amount: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Gilroy-Bold',
    marginTop: 2,
  },
  amountShimmer: {
    width: 72,
    height: 20,
    borderRadius: 6,
    marginTop: 4,
  },
  pillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  pillImage: {},
  pillText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Gilroy-Bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
});

export default React.memo(RewardsCard);
