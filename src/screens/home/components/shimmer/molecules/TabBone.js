import React from 'react';
import { StyleSheet } from 'react-native';
import { Bone } from '../atoms';
import { BONE, BONE_RADIUS } from '../tokens';

const TAB_HEIGHT = 34;

const TabBone = ({ width, tone = BONE.soft }) => (
  <Bone width={width} height={TAB_HEIGHT} tone={tone} style={styles.tab} />
);

export default React.memo(TabBone);

const styles = StyleSheet.create({
  tab: {
    borderTopLeftRadius: BONE_RADIUS.block,
    borderTopRightRadius: BONE_RADIUS.block,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
});
