import { StyleSheet } from 'react-native';
import { GUTTER, SPACE, divider } from '@/styles/homeTheme';
import { CARD_MARGIN } from './constants';

export default StyleSheet.create({
  divider,
  section: {
    paddingTop: SPACE.xs,
    paddingBottom: SPACE.sm,
  },
  railContent: {
    paddingLeft: GUTTER - CARD_MARGIN,
    paddingRight: GUTTER - CARD_MARGIN,
  },
});
