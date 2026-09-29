import React from 'react';
import HomeFloatingCart from '../screens/home/components/modern/HomeFloatingCart';

/**
 * Global Cart Pill Component
 * Renders the modern dark green floating capsule pill with product thumbnails,
 * item count, total price, savings badge, and "View Basket >" action button.
 */
const SelectedProducts = (props) => {
  return <HomeFloatingCart {...props} />;
};

export default React.memo(SelectedProducts);
