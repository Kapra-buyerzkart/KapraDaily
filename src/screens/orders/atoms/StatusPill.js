import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { FONTS } from '@/styles/typography';
import { RADIUS, SPACE, TYPE, MAX_FONT_SCALE } from '@/styles/homeTheme';
import LivePulse from './LivePulse';

const StatusPill = ({ status, live = false, style }) => {
  if (!status) return null;

  return (
    <View
      style={[
        styles.pill,
        { backgroundColor: status.tone.bg, borderColor: status.tone.border },
        style,
      ]}
    >
      {live ? (
        <LivePulse color={status.tone.fg} />
      ) : (
        <Ionicons name={status.icon} size={wp('3.4%')} color={status.tone.fg} />
      )}
      <Text
        style={[styles.label, { color: status.tone.fg }]}
        numberOfLines={1}
        maxFontSizeMultiplier={MAX_FONT_SCALE}
      >
        {status.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: RADIUS.pill,
    paddingVertical: 4,
    paddingHorizontal: SPACE.sm,
    maxWidth: '62%',
  },
  label: {
    ...TYPE.micro,
    lineHeight: undefined,
    fontFamily: FONTS.gilroy.bold,
    letterSpacing: 0.2,
    marginLeft: 5,
    textTransform: 'capitalize',
  },
});

export default React.memo(StatusPill);
