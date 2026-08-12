import { View, Text } from 'react-native';
import React from 'react';
import { MAX_FONT_SCALE } from '@/styles/homeTheme';
import { styles } from '../../styles';

function TicketIdTag({ id }) {
  if (!id && id !== 0) return null;

  return (
    <View style={styles.idTag}>
      <Text
        style={styles.idTagText}
        numberOfLines={1}
        maxFontSizeMultiplier={MAX_FONT_SCALE}
      >
        #{id}
      </Text>
    </View>
  );
}

export default React.memo(TicketIdTag);
