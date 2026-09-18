import { Dimensions, StyleSheet } from 'react-native';
import { Fonts } from '../../theme/fonts';

const DESIGN_WIDTH = 440;
const { width: SCREEN_WIDTH } = Dimensions.get('window');
export const s = (n: number) => (n / DESIGN_WIDTH) * SCREEN_WIDTH;
const TYPE_RATIO = Math.min(Math.max(SCREEN_WIDTH / DESIGN_WIDTH, 0.92), 1.1);
export const fs = (n: number) => Math.round(n * TYPE_RATIO * 10) / 10;

// Kapra Gold & Diamonds Luxury Palette
export const DARK_EMERALD = '#0C382E';
export const DEEP_EMERALD = '#082B22';
export const EMERALD_TINT = '#E8F2EE';
export const EMERALD_FAINT = '#F4F8F6';
export const GOLD = '#B68D40';
export const GOLD_METALLIC = '#C5A869';

export const SURFACE_BASE = '#FFFFFF';
export const CANVAS = '#FAF9F6';
export const SURFACE_SUNKEN = '#F7F5F0';
export const SURFACE_TINT = '#F7FAF8';
export const RULE = '#F0ECE4';
export const EDGE = '#ECE7DE';

export const INK_STRONG = '#1A1A1A';
export const INK_BASE = '#2C2D30';
export const INK_MUTED = '#686868';
export const INK_FAINT = '#9E9E9E';

export const PRIMARY = DARK_EMERALD;
export const PRIMARY_SOFT = EMERALD_TINT;
export const SUCCESS = DARK_EMERALD;
export const SUCCESS_SOFT = EMERALD_TINT;
export const SUCCESS_TEXT = DARK_EMERALD;
export const DISCOUNT = '#C45A5A'; // Luxury crimson for destructive actions

export const GUTTER = s(16);

export const ICON = {
  type: s(16),
  meta: s(14),
  action: s(16),
  plus: s(18),
  chevron: s(16),
  empty: s(28),
  check: s(12),
};

export default StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: CANVAS,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: GUTTER,
    paddingTop: s(10),
    paddingBottom: s(12),
    backgroundColor: SURFACE_BASE,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EBE1',
  },
  backButton: {
    width: s(36),
    height: s(36),
    borderRadius: s(18),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: SURFACE_SUNKEN,
  },
  headerText: {
    fontFamily: Fonts.cormorantGaramond.bold,
    fontSize: fs(21),
    color: INK_STRONG,
    marginLeft: s(12),
    letterSpacing: 0.3,
  },
  listContent: {
    paddingHorizontal: GUTTER,
    paddingTop: s(16),
    paddingBottom: s(40),
  },
  listContentWithBar: {
    paddingBottom: s(110),
  },

  confirmBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: GUTTER,
    paddingTop: s(12),
    paddingBottom: s(16),
    backgroundColor: SURFACE_BASE,
    borderTopWidth: 1,
    borderTopColor: '#F0EBE1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 6,
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: DARK_EMERALD,
    borderRadius: s(12),
    paddingVertical: s(13),
    gap: s(8),
  },
  confirmButtonText: {
    fontFamily: Fonts.lexend.bold,
    fontSize: fs(13.5),
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  confirmHint: {
    marginBottom: s(8),
    fontFamily: Fonts.lexend.regular,
    fontSize: fs(11.5),
    color: INK_MUTED,
    textAlign: 'center',
  },

  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SURFACE_BASE,
    borderRadius: s(14),
    borderWidth: 1,
    borderColor: '#D8E5DF',
    paddingHorizontal: s(14),
    paddingVertical: s(12),
    marginBottom: s(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  addIconWell: {
    width: s(36),
    height: s(36),
    borderRadius: s(18),
    backgroundColor: EMERALD_TINT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addRowTextCol: {
    flex: 1,
    marginLeft: s(12),
  },
  addRowText: {
    fontFamily: Fonts.lexend.bold,
    fontSize: fs(13),
    color: DARK_EMERALD,
  },
  addRowSubtext: {
    fontFamily: Fonts.lexend.regular,
    fontSize: fs(10.8),
    color: INK_MUTED,
    marginTop: 2,
  },

  card: {
    borderRadius: s(16),
    borderWidth: 1,
    borderColor: EDGE,
    backgroundColor: SURFACE_BASE,
    marginBottom: s(12),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  cardSelected: {
    borderWidth: 1.5,
    borderColor: DARK_EMERALD,
    backgroundColor: '#FCFDFD',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: s(14),
    paddingTop: s(12),
    paddingBottom: s(10),
  },
  typeCluster: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  typeWell: {
    width: s(32),
    height: s(32),
    borderRadius: s(16),
    backgroundColor: SURFACE_SUNKEN,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeWellActive: {
    backgroundColor: EMERALD_TINT,
  },
  typeText: {
    marginLeft: s(8),
    fontFamily: Fonts.lexend.bold,
    fontSize: fs(13),
    color: INK_STRONG,
    letterSpacing: 0.2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(8),
  },
  selectedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DARK_EMERALD,
    borderRadius: s(12),
    paddingHorizontal: s(8),
    paddingVertical: s(4),
    gap: s(4),
  },
  selectedPillText: {
    fontFamily: Fonts.lexend.bold,
    fontSize: fs(10),
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  menuButton: {
    width: s(28),
    height: s(28),
    borderRadius: s(14),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: SURFACE_SUNKEN,
  },

  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SURFACE_SUNKEN,
    borderRadius: s(16),
    paddingHorizontal: s(4),
    paddingVertical: s(2),
  },
  actionButton: {
    paddingHorizontal: s(8),
    paddingVertical: s(6),
  },
  actionSeparator: {
    width: 1,
    height: s(14),
    backgroundColor: '#E0DDD8',
  },

  cardDivider: {
    height: 1,
    backgroundColor: '#F3EFE8',
    marginHorizontal: s(14),
  },
  cardBody: {
    paddingHorizontal: s(14),
    paddingTop: s(10),
    paddingBottom: s(14),
  },
  addressLine: {
    fontFamily: Fonts.lexend.regular,
    fontSize: fs(12.8),
    lineHeight: fs(18.5),
    color: INK_BASE,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: s(8),
    marginTop: s(10),
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SURFACE_SUNKEN,
    paddingHorizontal: s(8),
    paddingVertical: s(4),
    borderRadius: s(6),
    gap: s(4),
  },
  metaText: {
    fontFamily: Fonts.lexend.medium,
    fontSize: fs(11),
    color: INK_MUTED,
  },

  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: s(50),
    paddingHorizontal: s(24),
  },
  emptyIconWell: {
    width: s(64),
    height: s(64),
    borderRadius: s(32),
    backgroundColor: EMERALD_TINT,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: s(16),
  },
  emptyTitle: {
    fontFamily: Fonts.cormorantGaramond.bold,
    fontSize: fs(22),
    color: INK_STRONG,
    marginBottom: s(6),
    textAlign: 'center',
  },
  emptyBody: {
    fontFamily: Fonts.lexend.regular,
    fontSize: fs(12.5),
    lineHeight: fs(18),
    color: INK_MUTED,
    textAlign: 'center',
  },
});
