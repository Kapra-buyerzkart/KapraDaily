import React from 'react';
import { View, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { TYPE } from '@/styles/homeTheme';
import { Bone, BoneText } from '../atoms';
import { BONE, BONE_RADIUS, GUTTER, SPACING } from '../tokens';

const TITLE_LINE = Math.round(TYPE.title.fontSize * 1.5);
const ACTION_HEIGHT = SPACING.xl + SPACING.md;

const HeadingBones = ({
  eyebrow = true,
  subtitle = false,
  action = false,
  titleWidth = wp('44%'),
  style,
}) => (
  <View style={[styles.row, style]}>
    <View style={styles.column}>
      {eyebrow && (
        <BoneText
          variant="micro"
          width={wp('26%')}
          tone={BONE.soft}
          radius={BONE_RADIUS.pill}
          style={styles.eyebrow}
        />
      )}
      <BoneText variant="title" width={titleWidth} line={TITLE_LINE} />
      {subtitle && (
        <BoneText variant="caption" width={wp('34%')} tone={BONE.soft} />
      )}
    </View>

    {action && (
      <Bone
        width={wp('19%')}
        height={ACTION_HEIGHT}
        radius={BONE_RADIUS.pill}
        tone={BONE.soft}
      />
    )}
  </View>
);

export default React.memo(HeadingBones);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: GUTTER,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  column: {
    flex: 1,
    paddingRight: SPACING.md,
  },
  eyebrow: {
    marginBottom: 2,
  },
});
