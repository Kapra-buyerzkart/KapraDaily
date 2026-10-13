import { StyleSheet } from 'react-native';
import { hp } from '../../../styles/cartTheme';

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  emptyContainer: {
    backgroundColor: '#FFFFFF',
  },
  topBar: {
    backgroundColor: '#FFFFFF',
    zIndex: 5,
  },
  listContent: {
    backgroundColor: '#FFFFFF',
    paddingBottom: hp('2%'),
  },
  itemCardWrap: {
    paddingHorizontal: 0,
    backgroundColor: '#FFFFFF',
  },
  itemSeparator: {
    height: 8,
    backgroundColor: 'transparent',
  },
});
