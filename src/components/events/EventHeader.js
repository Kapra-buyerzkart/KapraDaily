import React, { useMemo } from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import icons from '@/assets/icons';
import ProfileAvatarBadge from '@/components/ProfileAvatarBadge';
import { getGreeting } from '@/utils/greeting';
import { wp } from '../../utils/responsive';
import { hp } from '@/styles/cartTheme';

const getFirstName = fullName => {
  if (!fullName) return 'Guest';
  return fullName.trim().split(/\s+/)[0];
};

const EventHeader = ({ navigation, insets, profile }) => {
  const paddingTop = insets?.top > 0 ? insets.top + 16 : 40;
  const greeting = useMemo(() => getGreeting(), []);
  const firstName = useMemo(
    () => getFirstName(profile?.custName),
    [profile?.custName],
  );

  const handleAvatarPress = () => {
    navigation.navigate('MainTabs', {
      screen: 'Home',
      params: { screen: 'ProfileScreen' },
    });
  };

  return (
    <View style={[styles.header, { paddingTop }]}>
      <View style={styles.left}>
        <Image
          style={styles.udenticketconimage}
          source={icons.udenticketconimage}
        />
      </View>

      <TouchableOpacity
        style={styles.right}
        activeOpacity={0.8}
        onPress={handleAvatarPress}
        hitSlop={8}
      >
        <View style={styles.greetingBlock}>
          <Text style={styles.greetingText}>{greeting}</Text>
          <Text style={styles.nameText} numberOfLines={1}>
            {firstName}
          </Text>
        </View>
        <ProfileAvatarBadge size={40} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  greetingBlock: {
    gap: 5,
    alignItems: 'flex-end',
  },
  greetingText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    fontFamily: 'Gilroy-Medium',
  },
  nameText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontFamily: 'Gilroy-Bold',
    maxWidth: wp('32%'),
  },
  udenticketconimage: {
    resizeMode: 'contain',
    width: wp('16%'),
    height: hp('5%'),
    tintColor: '#ffffff',
  },
});

export default React.memo(EventHeader);
