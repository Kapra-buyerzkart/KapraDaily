import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { CART_COLORS, wp } from '@/styles/cartTheme';

const RowChevron = ({ color = CART_COLORS.textFaint }) => (
  <AntDesign name="right" size={wp('3.4%')} color={color} />
);

export default React.memo(RowChevron);
