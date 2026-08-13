import { View, Text } from 'react-native';
import React from 'react';
import { MAX_FONT_SCALE } from '@/styles/homeTheme';
import { styles } from '../../styles';
import { statusMeta } from '../../constants';

function StatusPill({ status }) {
  const meta = statusMeta(status);

  return (
    <View style={[styles.statusPill, { backgroundColor: meta.bg }]}>
      <View style={[styles.statusDot, { backgroundColor: meta.fg }]} />
      <Text
        style={[styles.statusText, { color: meta.fg }]}
        numberOfLines={1}
        maxFontSizeMultiplier={MAX_FONT_SCALE}
      >
        {meta.label}
      </Text>
    </View>
  );
}

export default React.memo(StatusPill);
