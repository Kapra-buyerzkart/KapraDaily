import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Animated from 'react-native-reanimated';

const AVATAR_IMAGE = require('../../../assets/images/profile/Avatar with Camera Badge.png');

const ProfileHeroCard = ({ profile, onEditProfile, onMeasure, entering }) => {
  const handleLayout = React.useCallback(
    event => {
      const { y, height } = event.nativeEvent.layout;
      onMeasure?.(y + height);
    },
    [onMeasure],
  );

  const phone = profile?.phoneNo || profile?.phone;
  const formattedPhone = phone
    ? phone.startsWith('+')
      ? phone
      : `+91 ${phone}`
    : '';

  return (
    <Animated.View
      onLayout={handleLayout}
      entering={entering}
      style={styles.container}
    >
      <TouchableOpacity
        style={styles.card}
        onPress={onEditProfile}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel="View or edit profile"
      >
        <View style={styles.avatarWrap}>
          <Image
            source={AVATAR_IMAGE}
            style={styles.avatarImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.details}>
          <Text style={styles.nameText} numberOfLines={1}>
            {profile?.custName || 'User'}
          </Text>
          {formattedPhone ? (
            <Text style={styles.phoneText} numberOfLines={1}>
              {formattedPhone}
            </Text>
          ) : null}
          {profile?.email ? (
            <Text style={styles.emailText} numberOfLines={1}>
              {profile.email}
            </Text>
          ) : null}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default React.memo(ProfileHeroCard);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginTop: 10,
    marginBottom: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ECECEC',
    paddingVertical: 14,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  avatarWrap: {
    position: 'relative',
    width: 60,
    height: 60,
  },
  avatarImage: {
    width: 60,
    height: 60,
  },
  details: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
  },
  nameText: {
    fontFamily: 'Lexend-SemiBold',
    fontSize: 16,
    color: '#12372A',
    lineHeight: 22,
  },
  phoneText: {
    fontFamily: 'Lexend-Regular',
    fontSize: 13,
    color: '#555555',
    lineHeight: 18,
    marginTop: 2,
  },
  emailText: {
    fontFamily: 'Lexend-Regular',
    fontSize: 12,
    color: '#888888',
    lineHeight: 16,
    marginTop: 1,
  },
});
