import React, { useContext, useMemo } from 'react';
import HomeFloatingCart from '../screens/home/components/modern/HomeFloatingCart';
import { AppContext } from '@/context/appContext';
import useResolvedAreaId from '@/queries/useResolvedAreaId';
import useHomepageDataQuery from '@/queries/useHomepageDataQuery';

/**
 * Global Cart Pill Component
 * Renders the modern dark green floating capsule pill with product thumbnails,
 * item count, total price, savings badge, and "View Basket >" action button.
 */
const SelectedProducts = (props) => {
  const { profile } = useContext(AppContext) || {};
  const { areaId } = useResolvedAreaId(profile?.pincode);
  const { data } = useHomepageDataQuery(areaId);

  const colorScheme = useMemo(() => data?.colorScheme || null, [data]);

  return (
    <HomeFloatingCart
      {...props}
      colorScheme={props.colorScheme || colorScheme}
    />
  );
};

export default React.memo(SelectedProducts);
