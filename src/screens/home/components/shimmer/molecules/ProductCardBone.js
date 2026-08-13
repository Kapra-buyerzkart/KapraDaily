import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  ADD_SIZE,
  DOCK_OVERHANG,
  NAME_LINES,
} from '@/components/TokenProductCard/constants';
import { TYPE } from '@/styles/homeTheme';
import { Bone, BoneText } from '../atoms';
import { BONE, BONE_HEIGHT, BONE_RADIUS, SPACING, SURFACE } from '../tokens';

const PRICE_HEIGHT = BONE_HEIGHT.label + SPACING.sm;
const NAME_LINE = TYPE.label.lineHeight;

const ProductCardBone = ({ style }) => (
  <View style={[styles.card, style]}>
    <View style={styles.mediaWrap}>
      <Bone
        radius={BONE_RADIUS.media}
        tone={BONE.well}
        style={styles.mediaWell}
      />
      <View style={styles.dock}>
        <Bone width={ADD_SIZE} height={ADD_SIZE} radius={BONE_RADIUS.block} />
      </View>
    </View>

    <View style={styles.info}>
      <Bone
        width={wp('16%')}
        height={PRICE_HEIGHT}
        radius={BONE_RADIUS.bar}
        style={styles.price}
      />
      <BoneText
        variant="label"
        width={'100%'}
        line={NAME_LINE}
        tone={BONE.soft}
      />
      <BoneText
        variant="label"
        width={'68%'}
        line={NAME_LINE * (NAME_LINES - 1)}
        tone={BONE.soft}
      />
      <BoneText variant="caption" width={'44%'} tone={BONE.soft} />
    </View>
  </View>
);

export default React.memo(ProductCardBone);

const styles = StyleSheet.create({
  card: {
    width: wp('35%'),
    marginVertical: hp('1%'),
    marginHorizontal: wp('1%'),
    padding: SPACING.sm,
    borderRadius: SURFACE.radius,
    backgroundColor: SURFACE.fill,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: SURFACE.edge,
  },
  mediaWrap: {
    width: '100%',
    position: 'relative',
  },
  mediaWell: {
    width: '100%',
    aspectRatio: 1,
  },
  dock: {
    position: 'absolute',
    right: SPACING.sm,
    bottom: -DOCK_OVERHANG,
  },
  info: {
    paddingTop: DOCK_OVERHANG + SPACING.sm,
  },
  price: {
    marginBottom: SPACING.xs + 2,
  },
});
