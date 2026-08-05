import React from 'react';
import { Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import ProfileAvatarBadge from '@/components/ProfileAvatarBadge';
import { styles } from '../styles';
import { MAX_FONT_SCALE } from '@/styles/homeTheme';

// Profile's identity row, redrawn at the top of the screen it pushes to. Same
// avatar at the same size on the same gutter, so the transition between the two
// pages reads as the form arriving underneath a block that never moved.
//
// The name is the live field value rather than the saved one: an edit to the
// Full Name field shows up here, in the place the user already reads their name
// from, which is a better confirmation that the edit registered than any
// message under the input could be.
type EditProfileHeroProps = {
  name: string;
  phone?: string;
  isPrivileged?: boolean;
  onMeasure?: (bottom: number) => void;
  entering?: any;
};

const EditProfileHero = ({
  name,
  phone,
  isPrivileged,
  onMeasure,
  entering,
}: EditProfileHeroProps) => {
  const handleLayout = React.useCallback(
    (event: any) => {
      const { y, height } = event.nativeEvent.layout;
      onMeasure?.(y + height);
    },
    [onMeasure],
  );

  const trimmed = name.trim();

  return (
    <Animated.View
      style={styles.identityRow}
      onLayout={handleLayout}
      entering={entering}
    >
      <ProfileAvatarBadge size={wp('18%')} isPrivileged={isPrivileged} />

      <View style={styles.identityText}>
        <Text
          style={[styles.userNameText, !trimmed && styles.userNamePlaceholder]}
          numberOfLines={1}
          maxFontSizeMultiplier={MAX_FONT_SCALE}
        >
          {trimmed || 'Your name'}
        </Text>
        {!!phone && (
          <Text
            style={styles.phoneNumberStyle}
            numberOfLines={1}
            maxFontSizeMultiplier={MAX_FONT_SCALE}
          >
            {phone}
          </Text>
        )}
      </View>
    </Animated.View>
  );
};

export default EditProfileHero;
