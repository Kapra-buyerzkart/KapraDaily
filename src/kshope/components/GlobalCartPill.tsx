import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import FloatingCartButton from './FloatingCartButton';

const TABS_ROUTE = 'KshopeHome';
const CATEGORY_ROUTE = 'KshopeCategory';
const PRODUCT_ROUTE = 'KshopeProductDetails';

interface GlobalCartPillProps {
  routeName?: string;
}

const GlobalCartPill: React.FC<GlobalCartPillProps> = ({ routeName }) => {
  const insets = useSafeAreaInsets();

  if (routeName === TABS_ROUTE) {
    return <FloatingCartButton />;
  }

  if (routeName === CATEGORY_ROUTE || routeName === PRODUCT_ROUTE) {
    return <FloatingCartButton bottom={insets.bottom + hp('1.5%')} />;
  }

  return null;
};

export default GlobalCartPill;
