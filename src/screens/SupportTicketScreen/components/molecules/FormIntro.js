import { View, Text } from 'react-native';
import React from 'react';
import Animated from 'react-native-reanimated';
import { MAX_FONT_SCALE } from '@/styles/homeTheme';
import { styles } from '../../styles';
import { entrance } from '../../motion';

function FormIntro() {
  return (
    <Animated.View entering={entrance(0)}>
      <View style={styles.intro}>
        <Text style={styles.introTitle} maxFontSizeMultiplier={MAX_FONT_SCALE}>
          How can we help?
        </Text>
        <Text
          style={styles.introSubtitle}
          maxFontSizeMultiplier={MAX_FONT_SCALE}
        >
          Share a few details about the issue and our support team will get back
          to you soon.
        </Text>
      </View>
    </Animated.View>
  );
}

export default React.memo(FormIntro);
