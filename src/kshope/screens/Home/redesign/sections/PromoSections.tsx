import React from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { HOME_ART } from '../assets';
import { PillButton, SectionTitle, imageSource } from '../parts';

import type { ProductTile } from '../content';
import type { BrandTile } from '../data/mappers';
import {
  CARD_GAP,
  GUTTER,
  HOME_COLORS,
  RADIUS,
  SECTION_GAP,
  SPACE,
  TITLE_GAP,
  colWidth,
  s,
} from '../theme';

const splitAccent = (value: string) => {
  const words = value.trim().split(/\s+/);
  if (words.length < 2) {
    return { text: value, accent: undefined };
  }
  return {
    text: words.slice(0, -1).join(' '),
    accent: words[words.length - 1],
  };
};

type PressHandlers = {
  brands?: BrandTile[];
  dealTitle?: string;
  deals?: ProductTile[];
  onPressDeal?: (item: ProductTile) => void;
  onPressBrandItem?: (brand: BrandTile) => void;
  onShopNow?: () => void;
  onViewAll?: () => void;
  onPressBrand?: (id: string) => void;
};

export const BestForYou: React.FC<PressHandlers> = ({
  onShopNow,
  onViewAll,
}) => (
  <View style={styles.wrap}>
    <SectionTitle text="The Best" accent="For you" style={styles.title} />

    <View style={styles.bannerWrap}>
      <Image
        source={HOME_ART.bannerEarbuds}
        resizeMode="cover"
        style={styles.banner}
      />
      <PillButton
        label="Shop Now"
        onPress={onShopNow}
        style={styles.bannerCta}
      />
    </View>

    <PillButton
      label="View All"
      filled={false}
      width={405}
      onPress={onViewAll}
      style={styles.viewAll}
    />
  </View>
);

export const BrandsSpotlight: React.FC<PressHandlers> = ({
  brands = [],
  onPressBrandItem,
}) => (
  <View style={styles.wrap}>
    <SectionTitle text="Brands In" accent="Spotlight" style={styles.title} />
    <FlatList
      data={brands}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.brandList}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.brandCard}
          onPress={() => onPressBrandItem?.(item)}
        >
          <Image
            source={imageSource(item.image)}
            resizeMode="contain"
            style={styles.brandImage}
          />
        </TouchableOpacity>
      )}
    />
  </View>
);

// export const TopDeals: React.FC<PressHandlers> = ({
//   dealTitle,
//   deals = [],
//   onShopNow,
//   onPressDeal,
// }) => {
//   const tiles = deals.slice(0, 2);
//   const tileArt = [HOME_ART.dealTile1, HOME_ART.dealTile2];

//   return (
//     <View style={styles.wrap}>
//       <SectionTitle
//         text={splitAccent(dealTitle || 'Top Deals For You').text}
//         accent={splitAccent(dealTitle || 'Top Deals For You').accent}
//         style={styles.title}
//       />

//       {/* <View style={styles.bannerWrap}>
//         <Image
//           source={HOME_ART.bannerTopDeals}
//           resizeMode="cover"
//           style={styles.banner}
//         />
//         <PillButton
//           label="Shop Now"
//           onPress={onShopNow}
//           style={styles.bannerCta}
//         />
//       </View> */}

//       <View style={styles.tileRow}>
//         {tiles.length > 0
//           ? tiles.map((item, index) => (
//               <TouchableOpacity
//                 key={item.id}
//                 activeOpacity={0.9}
//                 style={styles.dealTile}
//                 onPress={() => onPressDeal?.(item)}
//               >
//                 <Image
//                   source={imageSource(item.image) ?? tileArt[index]}
//                   resizeMode="contain"
//                   style={styles.dealTileImage}
//                 />
//               </TouchableOpacity>
//             ))
//           : tileArt.map((art, index) => (
//               <Image
//                 key={`deal-art-${index}`}
//                 source={art}
//                 resizeMode="contain"
//                 style={styles.dealTile}
//               />
//             ))}
//       </View>
//     </View>
//   );
// };

export const MoreDeals: React.FC = () => (
  <View style={styles.wrap}>
    <SectionTitle text="More Deals" accent="You’ll Love" style={styles.title} />
    <Image
      source={HOME_ART.bannerMoreDeals}
      resizeMode="cover"
      style={styles.wideBanner}
    />
  </View>
);

const BRAND_W = colWidth(4, SPACE.md);
const DEAL_W = colWidth(2, CARD_GAP);

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: HOME_COLORS.white,
  },
  title: {
    paddingHorizontal: GUTTER,
    marginTop: SECTION_GAP,
  },
  bannerWrap: {
    marginTop: TITLE_GAP,
    paddingHorizontal: GUTTER,
  },
  banner: {
    width: '100%',
    height: s(184),
    borderRadius: RADIUS.lg,
  },
  bannerCta: {
    position: 'absolute',
    left: GUTTER + SPACE.lg,
    bottom: SPACE.lg,
  },
  viewAll: {
    alignSelf: 'center',
    marginTop: SPACE.xl,
  },
  brandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: GUTTER,
    marginTop: TITLE_GAP,
  },
  brandList: {
    paddingHorizontal: GUTTER,
    paddingTop: TITLE_GAP,
    paddingBottom: SPACE.sm,
    gap: SPACE.md,
  },
  brandCard: {
    width: BRAND_W,
    height: BRAND_W,
    borderRadius: RADIUS.lg,
    backgroundColor: HOME_COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFE8DC',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  brandImage: {
    width: '72%',
    height: '66%',
  },
  tileRow: {
    flexDirection: 'row',
    marginTop: TITLE_GAP,
    paddingHorizontal: GUTTER,
    gap: CARD_GAP,
  },
  dealTile: {
    width: DEAL_W,
    height: DEAL_W * 0.5,
  },
  dealTileImage: {
    width: '100%',
    height: '100%',
    borderRadius: RADIUS.md,
  },
  wideBanner: {
    width: '100%',
    height: s(99),
    marginTop: TITLE_GAP,
  },
});

export { styles as promoStyles };
