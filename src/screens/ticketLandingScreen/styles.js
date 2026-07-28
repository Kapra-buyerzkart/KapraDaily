import { StyleSheet } from 'react-native';
import COLORS from '@/styles/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  contentBg: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  hiddenBackdrop: {
    opacity: 0,
  },
  backdropGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 110,
  },
  statusBarGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
});

export default styles;
