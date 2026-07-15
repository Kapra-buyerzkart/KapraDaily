import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  imageBg: {
    flex: 1,
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
