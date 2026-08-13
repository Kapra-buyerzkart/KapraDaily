import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { SEARCH_FIELD } from '@/styles/homeTheme';
import {
  SEARCH_MARGIN_START,
  SEARCH_HEIGHT,
} from '../../../hooks/useHomeAnimations';
import { Bone, BoneCircle } from '../atoms';
import { BONE, BONE_HEIGHT, BONE_RADIUS, SPACING, SURFACE } from '../tokens';

const SEARCH_INSET = wp('4.7%');
const AVATAR_SIZE = Math.min(wp('14%'), 56);

const HomeHeaderSkeleton = ({ top }) => (
  <View style={[styles.surface, { paddingTop: top }]}>
    <View style={styles.row}>
      <View style={styles.identity}>
        <Bone width={wp('22%')} height={BONE_HEIGHT.heading} />
        <Bone
          width={wp('40%')}
          height={BONE_HEIGHT.caption}
          tone={BONE.soft}
          style={styles.address}
        />
      </View>
      <View style={styles.actions}>
        <Bone
          width={wp('16%')}
          height={hp('3.6%')}
          radius={BONE_RADIUS.pill}
          tone={BONE.soft}
        />
        <BoneCircle size={AVATAR_SIZE} tone={BONE.soft} />
      </View>
    </View>

    <Bone
      height={SEARCH_HEIGHT}
      radius={SEARCH_FIELD.radius}
      tone={BONE.well}
      style={styles.search}
    />
  </View>
);

export default React.memo(HomeHeaderSkeleton);

const styles = StyleSheet.create({
  surface: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: SURFACE.fill,
    paddingBottom: hp('1%'),
  },
  row: {
    flexDirection: 'row',
    marginLeft: wp('6.9%'),
    marginRight: SEARCH_INSET,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 0 : 5,
  },
  identity: {
    flexShrink: 1,
  },
  address: {
    marginTop: SPACING.sm,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('2%'),
  },
  search: {
    marginTop: SEARCH_MARGIN_START,
    marginHorizontal: SEARCH_INSET,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: SURFACE.edge,
  },
});
