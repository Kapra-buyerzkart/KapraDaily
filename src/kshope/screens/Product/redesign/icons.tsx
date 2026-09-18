import React from 'react';
import IconBack from '../../../assets/images/product/redesign/icon_back.svg';
import IconHeart from '../../../assets/images/product/redesign/icon_heart.svg';
import IconHeartSolid from '../../../assets/images/product/redesign/icon_heart_solid.svg';
import IconHeartOutline from '../../../assets/images/product/redesign/icon_heart_outline.svg';
import IconShare from '../../../assets/images/product/redesign/icon_share.svg';
import IconCart from '../../../assets/images/product/redesign/icon_cart.svg';
import IconChevron from '../../../assets/images/product/redesign/icon_chevron.svg';
import IconGold from '../../../assets/images/product/redesign/icon_gold.svg';
import IconDiamond from '../../../assets/images/product/redesign/icon_diamond.svg';
import IconStarSpec from '../../../assets/images/product/redesign/icon_star_spec.svg';
import IconDimensions from '../../../assets/images/product/redesign/icon_dimensions.svg';
import IconCopy from '../../../assets/images/product/redesign/icon_copy.svg';
import IconInfo from '../../../assets/images/product/redesign/icon_info.svg';
import { s } from '../../Home/redesign/theme';
import { PDP_COLORS } from './theme';

type IconProps = {
  width: number;
  height: number;
  color?: string;
  style?: any;
};

const scaled = (Glyph: React.ComponentType<any>) => {
  const Icon: React.FC<IconProps> = ({
    width,
    height,
    color = PDP_COLORS.black,
    style,
  }) => (
    <Glyph width={s(width)} height={s(height)} color={color} style={style} />
  );
  return Icon;
};

export const BackIcon = scaled(IconBack);
export const HeartIcon = scaled(IconHeart);
export const HeartSolidIcon = scaled(IconHeartSolid);
export const HeartOutlineIcon = scaled(IconHeartOutline);
export const ShareIcon = scaled(IconShare);
export const CartIcon = scaled(IconCart);
export const ChevronIcon = scaled(IconChevron);
export const GoldIcon = scaled(IconGold);
export const DiamondIcon = scaled(IconDiamond);
export const StarSpecIcon = scaled(IconStarSpec);
export const DimensionsIcon = scaled(IconDimensions);
export const CopyIcon = scaled(IconCopy);
export const InfoIcon = scaled(IconInfo);

