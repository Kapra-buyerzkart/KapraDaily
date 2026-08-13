import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TYPE } from '@/styles/homeTheme';
import { BoneText, Bone } from '../atoms';
import { BONE, BONE_RADIUS, SPACING } from '../tokens';

const LABEL_LINE = TYPE.micro.lineHeight * 2;

const CategoryTileBone = ({ tile }) => (
  <View style={tile.item}>
    <Bone radius={BONE_RADIUS.card} tone={BONE.well} style={styles.well} />
    <BoneText
      variant="micro"
      width={'76%'}
      line={LABEL_LINE}
      tone={BONE.soft}
      style={styles.label}
    />
  </View>
);

export default React.memo(CategoryTileBone);

const styles = StyleSheet.create({
  well: {
    width: '100%',
    aspectRatio: 1,
  },
  label: {
    width: '100%',
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
});
