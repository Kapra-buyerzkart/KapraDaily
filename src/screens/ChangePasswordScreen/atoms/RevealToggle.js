import React from 'react';
import { TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { PWD_COLORS } from '../theme';

const RevealToggle = ({ revealed, active, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    activeOpacity={0.7}
    accessibilityRole="button"
    accessibilityLabel={revealed ? 'Hide password' : 'Show password'}
  >
    <MaterialCommunityIcons
      name={revealed ? 'eye-off-outline' : 'eye-outline'}
      size={wp('4.8%')}
      color={active ? PWD_COLORS.emerald : PWD_COLORS.textMuted}
    />
  </TouchableOpacity>
);

export default React.memo(RevealToggle);
