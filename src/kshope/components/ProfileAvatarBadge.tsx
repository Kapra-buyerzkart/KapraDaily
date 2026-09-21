import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  ImageSourcePropType,
  StyleProp,
  ViewStyle,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const GOLD_LIGHT = '#FFE08A';
const GOLD_DARK = '#D89B1B';
const DEFAULT_AVATAR = require('../assets/images/profile/Avatar with Camera Badge.png');

interface Props {
  size?: number;
  isPrivileged?: boolean;
  source?: ImageSourcePropType;
  style?: StyleProp<ViewStyle>;
}

const ProfileAvatarBadge: React.FC<Props> = ({
  size = 40,
  isPrivileged = false,
  source,
  style,
}) => {
  const badgeSize = size * 0.42;
  const crownHeadroom = isPrivileged ? badgeSize * 0.62 : 0;
  const avatarSize = size - crownHeadroom;
  const imageSource = source || DEFAULT_AVATAR;

  return (
    <View
      style={[
        styles.container,
        { width: size, height: size },
        style,
      ]}
    >
      <Image
        source={imageSource}
        style={{
          width: avatarSize,
          height: avatarSize,
          marginTop: crownHeadroom,
        }}
        resizeMode="contain"
      />

      {isPrivileged && (
        <View
          style={[
            styles.badge,
            {
              width: badgeSize,
              height: badgeSize,
              borderRadius: badgeSize / 2,
            },
          ]}
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
};

export default React.memo(ProfileAvatarBadge);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 0,
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
