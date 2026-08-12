import { View } from 'react-native';
import React from 'react';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import ShimmerPlaceholder from '@/components/ShimmerPlaceholder';
import { SPACE } from '@/styles/homeTheme';
import { styles } from '../../styles';

const BLOCKS = [
  { width: wp('26%'), height: wp('3.4%'), top: 0 },
  { width: wp('58%'), height: wp('3%'), top: SPACE.sm },
  { width: wp('40%'), height: wp('3%'), top: SPACE.xs + 2 },
];

export default function AddressCardSkeleton() {
  return (
    <View style={styles.skeletonCard}>
      <View style={styles.skeletonRow}>
        <ShimmerPlaceholder style={styles.skeletonAvatar} />
        <View style={{ marginLeft: SPACE.md }}>
          {BLOCKS.map(block => (
            <ShimmerPlaceholder
              key={block.width}
              style={[
                styles.skeletonBlock,
                {
                  width: block.width,
                  height: block.height,
                  marginTop: block.top,
                },
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );
}
