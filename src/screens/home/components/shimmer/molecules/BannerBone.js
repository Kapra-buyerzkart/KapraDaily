import React from 'react';
import { StyleSheet } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Bone } from '../atoms';
import { BONE, BONE_RADIUS } from '../tokens';

const BannerBone = ({ width, height = hp('19.35%'), style }) => (
  <Bone
    width={width}
    height={height}
    radius={BONE_RADIUS.card}
    tone={BONE.well}
    style={[styles.banner, style]}
  />
);

export default React.memo(BannerBone);

const styles = StyleSheet.create({
  banner: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(17,19,26,0.06)',
  },
});
