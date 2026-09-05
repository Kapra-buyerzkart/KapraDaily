import { StyleSheet } from 'react-native';
import {
  UI_COLORS,
  UI_GUTTER,
  UI_RADIUS,
  UI_SPACING,
  UI_TYPE,
  hp,
  wp,
} from '../../theme/tokens';

export const MAP_HEIGHT = hp('48%');
export const SHEET_TOP = hp('38%');
export const PIN_HEIGHT = wp('11%');
export const FIELD_HEIGHT = hp('6.2%');

const HAIRLINE = StyleSheet.hairlineWidth;

export default StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: UI_COLORS.canvas,
  },
  flex: {
    flex: 1,
  },

  mapContainer: {
    position: 'absolute',
    top: 0,
    width: wp('100%'),
    height: MAP_HEIGHT,
  },
  map: {
    flex: 1,
  },

  pinWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    top: MAP_HEIGHT / 2 - (PIN_HEIGHT + 2),
    zIndex: 10,
  },
  pinCallout: {
    position: 'absolute',
    bottom: PIN_HEIGHT + UI_SPACING.md,
    alignItems: 'center',
    paddingVertical: UI_SPACING.sm,
    paddingHorizontal: UI_SPACING.lg,
    borderRadius: UI_RADIUS.button,
    borderWidth: HAIRLINE,
    borderColor: UI_COLORS.border,
    backgroundColor: UI_COLORS.card,
  },
  pinCalloutHidden: {
    opacity: 0,
  },
  pinCalloutTail: {
    position: 'absolute',
    bottom: -4,
    width: 10,
    height: 10,
    borderRadius: 2,
    backgroundColor: UI_COLORS.card,
    transform: [{ rotate: '45deg' }],
  },
  pinIcon: {
    height: PIN_HEIGHT,
  },
  pinIconLifted: {
    transform: [{ translateY: -8 }],
  },

  recenterButton: {
    position: 'absolute',
    bottom: MAP_HEIGHT - SHEET_TOP + UI_SPACING.lg,
    right: UI_GUTTER,
    flexDirection: 'row',
    alignItems: 'center',
    gap: UI_SPACING.xs,
    paddingVertical: UI_SPACING.sm,
    paddingHorizontal: UI_SPACING.md,
    borderRadius: UI_RADIUS.button,
    borderWidth: HAIRLINE,
    borderColor: UI_COLORS.border,
    backgroundColor: UI_COLORS.card,
  },

  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingHorizontal: UI_GUTTER,
    zIndex: 999,
  },
  overlayRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  floatingButton: {
    width: wp('11%'),
    height: wp('11%'),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: UI_RADIUS.button,
    borderWidth: HAIRLINE,
    borderColor: UI_COLORS.border,
    backgroundColor: UI_COLORS.card,
  },
  searchLayer: {
    flex: 1,
    marginLeft: UI_SPACING.md,
    zIndex: 999,
  },
  searchIcon: {
    marginRight: UI_SPACING.sm,
  },
  geocodingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: UI_SPACING.sm,
    marginTop: UI_SPACING.sm,
    paddingVertical: UI_SPACING.xs,
    paddingHorizontal: UI_SPACING.md,
    borderRadius: UI_RADIUS.sm,
    borderWidth: HAIRLINE,
    borderColor: UI_COLORS.border,
    backgroundColor: UI_COLORS.card,
  },

  sheet: {
    flex: 1,
    marginTop: SHEET_TOP,
    borderTopWidth: HAIRLINE,
    borderTopColor: UI_COLORS.border,
    paddingTop: UI_SPACING.md,
    backgroundColor: UI_COLORS.card,
    borderTopLeftRadius: UI_RADIUS.productCard,
    borderTopRightRadius: UI_RADIUS.productCard,
  },
  grabHandle: {
    width: wp('10%'),
    height: 5,
    borderRadius: UI_RADIUS.pill,
    backgroundColor: UI_COLORS.borderStrong,
    alignSelf: 'center',
  },
  sheetHeader: {
    paddingHorizontal: UI_GUTTER,
    paddingTop: UI_SPACING.md,
    paddingBottom: UI_SPACING.md,
    borderBottomWidth: HAIRLINE,
    borderBottomColor: UI_COLORS.border,
  },
  sheetSubtitle: {
    marginTop: 2,
  },
  scroll: {
    flex: 1,
    paddingHorizontal: UI_GUTTER,
    backgroundColor: UI_COLORS.canvas,
  },
  scrollContent: {
    paddingBottom: UI_SPACING.xl,
  },

  resolvedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: UI_SPACING.md,
    padding: UI_SPACING.md,
    marginTop: UI_SPACING.lg,
    borderRadius: UI_RADIUS.productCard,
    borderWidth: HAIRLINE,
    borderColor: UI_COLORS.border,
    backgroundColor: UI_COLORS.card,
  },
  resolvedCopy: {
    flex: 1,
  },
  resolvedEyebrow: {
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  resolvedLine2: {
    marginTop: 2,
  },

  sectionCard: {
    marginTop: UI_SPACING.md,
    paddingTop: UI_SPACING.lg,
    paddingBottom: UI_SPACING.sm,
    paddingHorizontal: UI_SPACING.lg,
    borderRadius: UI_RADIUS.productCard,
    borderWidth: HAIRLINE,
    borderColor: UI_COLORS.border,
    backgroundColor: UI_COLORS.card,
  },
  sectionTitleWrap: {
    marginBottom: UI_SPACING.lg,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitleBar: {
    width: 3,
    height: 14,
    borderRadius: UI_RADIUS.xs,
    backgroundColor: UI_COLORS.textPrimary,
    marginRight: UI_SPACING.sm,
  },
  sectionTitleHint: {
    marginTop: 2,
    marginLeft: UI_SPACING.md,
  },

  typeRow: {
    flexDirection: 'row',
    gap: UI_SPACING.sm,
    marginBottom: UI_SPACING.md,
  },
  typeChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: UI_SPACING.xs,
    minHeight: hp('5.4%'),
    paddingHorizontal: UI_SPACING.sm,
    paddingVertical: UI_SPACING.sm,
    borderRadius: UI_RADIUS.xs,
    borderWidth: HAIRLINE,
    borderColor: UI_COLORS.border,
    backgroundColor: UI_COLORS.well,
  },
  typeChipActive: {
    borderWidth: 1.2,
    borderColor: UI_COLORS.borderStrong,
    backgroundColor: 'rgba(17,19,26,0.06)',
  },

  fieldWrapper: {
    marginBottom: UI_SPACING.lg,
    position: 'relative',
  },
  fieldLabel: {
    position: 'absolute',
    top: -hp('0.95%'),
    left: UI_SPACING.md,
    zIndex: 1,
    paddingHorizontal: UI_SPACING.xs,
    backgroundColor: UI_COLORS.card,
    ...UI_TYPE.micro,
    color: UI_COLORS.textMuted,
  },
  fieldLabelActive: {
    color: UI_COLORS.textPrimary,
  },
  fieldLabelError: {
    color: UI_COLORS.danger,
  },
  fieldRequired: {
    color: UI_COLORS.danger,
  },
  input: {
    minHeight: FIELD_HEIGHT,
    borderWidth: HAIRLINE,
    borderColor: UI_COLORS.border,
    borderRadius: UI_RADIUS.input,
    backgroundColor: UI_COLORS.well,
    paddingHorizontal: UI_SPACING.lg,
    paddingVertical: UI_SPACING.sm,
    ...UI_TYPE.label,
    color: UI_COLORS.textPrimary,
  },
  inputFocused: {
    borderWidth: 1.2,
    borderColor: UI_COLORS.borderStrong,
    backgroundColor: UI_COLORS.card,
  },
  landmarkInput: {
    minHeight: hp('8%'),
    textAlignVertical: 'top',
  },

  pincodeRow: {
    flexDirection: 'row',
    gap: UI_SPACING.md,
    zIndex: 10,
  },
  pincodeField: {
    flex: 1,
  },
  areaWrap: {
    flex: 1,
    marginBottom: UI_SPACING.lg,
    position: 'relative',
  },
  areaLabel: {
    zIndex: 7000,
  },
  dropdown: {
    minHeight: FIELD_HEIGHT,
    borderWidth: HAIRLINE,
    borderColor: UI_COLORS.border,
    borderRadius: UI_RADIUS.input,
    paddingHorizontal: UI_SPACING.lg,
    backgroundColor: UI_COLORS.well,
  },
  dropdownOpen: {
    borderWidth: 1.2,
    borderColor: UI_COLORS.borderStrong,
    backgroundColor: UI_COLORS.card,
  },
  dropdownContainer: {
    borderWidth: HAIRLINE,
    borderColor: UI_COLORS.border,
    borderRadius: UI_RADIUS.input,
    backgroundColor: UI_COLORS.card,
  },
  dropdownText: {
    ...UI_TYPE.label,
    color: UI_COLORS.textPrimary,
  },
  dropdownSelectedText: {
    ...UI_TYPE.labelStrong,
    color: UI_COLORS.textPrimary,
  },
  dropdownPlaceholder: {
    ...UI_TYPE.label,
    color: UI_COLORS.textFaint,
  },

  deliveryNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: UI_SPACING.md,
    paddingVertical: UI_SPACING.sm,
    paddingHorizontal: UI_SPACING.md,
    marginTop: UI_SPACING.md,
    marginBottom: UI_SPACING.md,
    borderRadius: UI_RADIUS.productCard,
    borderWidth: HAIRLINE,
    borderColor: UI_COLORS.border,
    backgroundColor: UI_COLORS.well,
  },
  deliveryCopy: {
    flex: 1,
  },

  footer: {
    paddingHorizontal: UI_GUTTER,
    paddingTop: UI_SPACING.md,
    borderTopWidth: HAIRLINE,
    borderTopColor: UI_COLORS.border,
    backgroundColor: UI_COLORS.card,
  },
  saveButton: {
    height: hp('6.4%'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: UI_SPACING.sm,
    borderRadius: UI_RADIUS.button,
    backgroundColor: UI_COLORS.primary,
  },
  saveButtonBusy: {
    opacity: 0.7,
  },
});

export const placesStyles = {
  container: { flex: 0 },
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: FIELD_HEIGHT,
    paddingHorizontal: UI_SPACING.lg,
    borderRadius: UI_RADIUS.button,
    borderWidth: HAIRLINE,
    borderColor: UI_COLORS.border,
    backgroundColor: UI_COLORS.card,
  },
  textInput: {
    ...UI_TYPE.label,
    color: UI_COLORS.textPrimary,
    height: FIELD_HEIGHT,
    flex: 1,
    paddingVertical: 0,
    paddingHorizontal: 0,
    backgroundColor: 'transparent',
  },
  description: {
    ...UI_TYPE.label,
    color: UI_COLORS.textSecondary,
  },
  listView: {
    position: 'absolute',
    top: FIELD_HEIGHT,
    width: '100%',
    zIndex: 100,
    marginTop: UI_SPACING.sm,
    borderRadius: UI_RADIUS.productCard,
    borderWidth: HAIRLINE,
    borderColor: UI_COLORS.border,
    backgroundColor: UI_COLORS.card,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: hp('6%'),
    paddingHorizontal: UI_SPACING.lg,
    paddingVertical: UI_SPACING.md,
    backgroundColor: UI_COLORS.card,
  },
  separator: {
    height: HAIRLINE,
    backgroundColor: UI_COLORS.border,
  },
  loader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    height: 20,
  },
};
