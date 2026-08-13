import { View } from 'react-native';
import React from 'react';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import ShimmerPlaceholder from '@/components/ShimmerPlaceholder';
import { SPACE } from '@/styles/homeTheme';
import { styles } from '../../styles';

const BLOCKS = [
  { key: 'title', width: wp('62%'), height: wp('3.6%'), top: 0 },
  { key: 'message', width: wp('80%'), height: wp('3%'), top: SPACE.sm },
  { key: 'meta', width: wp('34%'), height: wp('3%'), top: SPACE.sm },
];

export default function TicketCardSkeleton() {
  return (
    <View style={styles.skeletonCard}>
      <View style={styles.skeletonTopRow}>
        <ShimmerPlaceholder
          style={[
            styles.skeletonBlock,
            { width: wp('16%'), height: wp('3.2%') },
          ]}
        />
        <ShimmerPlaceholder
          style={[styles.skeletonPill, { width: wp('18%'), height: wp('4%') }]}
        />
      </View>

      {BLOCKS.map(block => (
        <ShimmerPlaceholder
          key={block.key}
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
  );
}
