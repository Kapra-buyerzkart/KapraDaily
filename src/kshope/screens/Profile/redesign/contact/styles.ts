import { StyleSheet } from 'react-native';
import { UI_COLORS, UI_SPACING, hp } from '../../../../theme/tokens';

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: UI_COLORS.canvas,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  topBar: {
    backgroundColor: UI_COLORS.card,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: UI_COLORS.border,
    zIndex: 5,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: UI_SPACING.lg,
    paddingBottom: hp('3%'),
  },
});
