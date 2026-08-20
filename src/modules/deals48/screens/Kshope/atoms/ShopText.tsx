import React from 'react';
import { StyleProp, TextProps, TextStyle } from 'react-native';
import CartText from '@/screens/cart/components/atoms/CartText';

const Base = CartText as unknown as React.ComponentType<
  TextProps & {
    variant?: string;
    tone?: string;
    style?: StyleProp<TextStyle>;
    children?: React.ReactNode;
  }
>;

export default Base;
