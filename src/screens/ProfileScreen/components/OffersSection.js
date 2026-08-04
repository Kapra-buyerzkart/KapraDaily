import React from 'react';
import ListSection from './ListSection';
import { buildOffersItems } from '../menuItems';

export default function OffersSection({ onBCoin, onSmartPoint, onCoupons }) {
  const items = buildOffersItems({ onBCoin, onSmartPoint, onCoupons });
  return <ListSection eyebrow="Rewards" title="Offers" items={items} />;
}
