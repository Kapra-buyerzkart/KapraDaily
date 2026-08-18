import React from 'react';
import { StyleSheet, View } from 'react-native';

import { COLORS, RADIUS, wp } from '../../theme';

const GrabHandle = () => <View style={styles.handle} />;

export default React.memo(GrabHandle);

const styles = StyleSheet.create({
  handle: {
    width: wp('10%'),
    height: 5,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.lineStrong,
    alignSelf: 'center',
  },
});
