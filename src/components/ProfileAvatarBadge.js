import React from 'react';
import { StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const ORANGE = '#FF6A00';
const GOLD_LIGHT = '#FFE08A';
const GOLD_DARK = '#D89B1B';
const NEUTRAL_RING = '#E3DFD6';

function createStyles({
  containerHeight,
  badgeSize,
  ringSize,
  ringMarginTop,
  ringWidth,
  avatarSize,
}) {
  return StyleSheet.create({
    // The box hugs the ring horizontally — reserving the full `size` width left
    // transparent padding on both sides, which read as the avatar being inset
    // from the edge it was meant to sit against. Only the crown needs extra
    // room, and only vertically.
    container: {
      width: ringSize,
      height: containerHeight,
      alignItems: 'center',
    },
    ring: {
      width: ringSize,
      height: ringSize,
      marginTop: ringMarginTop,
      borderRadius: ringSize / 2,
      justifyContent: 'center',
      alignItems: 'center',
    },
    ringPrivileged: {
      shadowColor: GOLD_DARK,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.5,
      shadowRadius: 4,
      elevation: 4,
    },
    ringPlain: {
      borderWidth: ringWidth,
      borderColor: NEUTRAL_RING,
    },
    avatar: {
      width: avatarSize,
      height: avatarSize,
      borderRadius: avatarSize / 2,
      backgroundColor: '#FFFFFF',
      justifyContent: 'center',
      alignItems: 'center',
    },
    badge: {
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
    },
  });
}

export default function ProfileAvatarBadge({
  size = 40,
  isPrivileged = false,
}) {
  const badgeSize = size * 0.42;
  const crownHeadroom = badgeSize * 0.62;
  const ringSize = size - crownHeadroom;
  const ringMarginTop = isPrivileged ? crownHeadroom : 0;
  const containerHeight = ringSize + ringMarginTop;
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

  const styles = createStyles({
    containerHeight,
    badgeSize,
    ringSize,
    ringMarginTop,
    ringWidth,
    avatarSize,
  });

  return (
    <View style={styles.container}>
      <Ring
        {...ringProps}
        style={[
          styles.ring,
          isPrivileged ? styles.ringPrivileged : styles.ringPlain,
        ]}
      >
        <View style={styles.avatar}>
          <Ionicons name="person" size={avatarSize * 0.55} color={'black'} />
        </View>
      </Ring>

      {isPrivileged && (
        <View style={styles.badge}>
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
