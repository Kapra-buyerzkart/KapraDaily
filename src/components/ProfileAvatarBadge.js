import React from 'react';
import { View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const ORANGE = '#FF6A00';
const GOLD_LIGHT = '#FFE08A';
const GOLD_DARK = '#D89B1B';
const NEUTRAL_RING = '#E3DFD6';

export default function ProfileAvatarBadge({
  size = 40,
  isPrivileged = false,
}) {
  const badgeSize = size * 0.42;
  const crownHeadroom = isPrivileged ? badgeSize * 0.62 : 0;
  const ringSize = size - crownHeadroom;
  const ringWidth = isPrivileged ? ringSize * 0.09 : ringSize * 0.05;
  const avatarSize = ringSize - ringWidth * 2;
  const Ring = isPrivileged ? LinearGradient : View;
  const ringProps = isPrivileged
    ? {
        colors: [GOLD_LIGHT, GOLD_DARK],
        start: { x: 0, y: 0 },
        end: { x: 1, y: 1 },
      }
    : {};

  return (
    <View style={{ width: size, height: size, alignItems: 'center' }}>
      <Ring
        {...ringProps}
        style={[
          {
            width: ringSize,
            height: ringSize,
            marginTop: crownHeadroom,
            borderRadius: ringSize / 2,
            justifyContent: 'center',
            alignItems: 'center',
          },
          isPrivileged
            ? {
                shadowColor: GOLD_DARK,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.5,
                shadowRadius: 4,
                elevation: 4,
              }
            : { borderWidth: ringWidth, borderColor: NEUTRAL_RING },
        ]}
      >
        <View
          style={{
            width: avatarSize,
            height: avatarSize,
            borderRadius: avatarSize / 2,
            backgroundColor: '#FFFFFF',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Ionicons name="person" size={avatarSize * 0.55} color={ORANGE} />
        </View>
      </Ring>

      {isPrivileged && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            width: badgeSize,
            height: badgeSize,
            borderRadius: badgeSize / 2,
            backgroundColor: '#FFFFFF',
            borderWidth: 1,
            borderColor: GOLD_LIGHT,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.2,
            shadowRadius: 2,
            elevation: 5,
          }}
        >
          <MaterialCommunityIcons
            name="crown"
            size={size * 0.24}
            color={GOLD_DARK}
          />
        </View>
      )}
    </View>
  );
}
