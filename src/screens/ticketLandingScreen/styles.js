import { StyleSheet } from 'react-native';
import { COLORS } from './theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.canvas,
  },
  contentBg: {
    flex: 1,
    backgroundColor: COLORS.canvas,
  },
  backdrop: {
    flex: 1,
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
