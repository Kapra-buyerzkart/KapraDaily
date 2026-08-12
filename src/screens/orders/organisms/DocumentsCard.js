import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { FONTS } from '@/styles/typography';
import {
  HAIRLINE,
  INK,
  SPACE,
  TYPE,
  TOUCH_MIN,
  MAX_FONT_SCALE,
} from '@/styles/homeTheme';
import AnimatedPressable from '@/components/AnimatedPressable';
import SurfaceCard from '../atoms/SurfaceCard';
import IconChip from '../atoms/IconChip';

const DocumentsCard = ({ rows = [] }) => {
  const visible = rows.filter(Boolean);
  if (!visible.length) return null;

  return (
    <SurfaceCard style={styles.card}>
      {visible.map((row, index) => (
        <AnimatedPressable
          key={row.label}
          style={[styles.row, index > 0 && styles.divided]}
          onPress={row.onPress}
          accessibilityRole="button"
          accessibilityLabel={row.label}
        >
          <IconChip name={row.icon} tone={row.tone || 'neutral'} />
          <View style={styles.copy}>
            <Text style={styles.label} maxFontSizeMultiplier={MAX_FONT_SCALE}>
              {row.label}
            </Text>
            {!!row.caption && (
              <Text
                style={styles.caption}
                maxFontSizeMultiplier={MAX_FONT_SCALE}
              >
                {row.caption}
              </Text>
            )}
          </View>
          <Ionicons
            name="chevron-forward"
            size={wp('4.4%')}
            color={INK.faint}
          />
        </AnimatedPressable>
      ))}
    </SurfaceCard>
  );
};

const styles = StyleSheet.create({
  card: {
    paddingVertical: SPACE.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: TOUCH_MIN + 6,
  },
  divided: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: HAIRLINE,
  },
  copy: {
    flex: 1,
    marginHorizontal: SPACE.md,
  },
  label: {
    ...TYPE.label,
    lineHeight: undefined,
    fontFamily: FONTS.gilroy.semiBold,
    color: INK.strong,
  },
  caption: {
    ...TYPE.micro,
    lineHeight: undefined,
    fontFamily: FONTS.gilroy.medium,
    color: INK.muted,
    marginTop: 2,
  },
});

export default React.memo(DocumentsCard);
