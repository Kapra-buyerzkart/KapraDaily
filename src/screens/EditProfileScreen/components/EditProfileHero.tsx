import React from 'react';
import { Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import ProfileAvatarBadge from '@/components/ProfileAvatarBadge';
import { styles } from '../styles';
import { MAX_FONT_SCALE } from '@/styles/homeTheme';

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
