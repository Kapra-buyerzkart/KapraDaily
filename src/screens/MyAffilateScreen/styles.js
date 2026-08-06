import { StyleSheet } from 'react-native';
import { FONTS } from '../../styles/typography';

const INK = '#1A1A1A';
const ORANGE = '#FF6A00';
const GRAY_50 = '#F5F4F0';
const GRAY_300 = '#D8D6CE';
const GRAY_500 = '#9A9A92';
const GRAY_600 = '#6B6B6B';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  centered: { alignItems: 'center', justifyContent: 'center' },
  errorText: { fontSize: 13, fontFamily: FONTS.gilroy.regular, color: GRAY_600 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 8,
    gap: 12,
  },
  afliatTextStyle: {
    fontSize: 20,
    fontFamily: FONTS.gilroy.bold,
    padding: 10,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: GRAY_50,
  },
  headerTextWrap: { flex: 1 },
  headerTitle: { fontSize: 20, fontFamily: FONTS.gilroy.bold, color: INK },
  headerSub: {
    fontSize: 12,
    fontFamily: FONTS.gilroy.regular,
    color: GRAY_600,
    marginTop: 2,
  },

  summaryStrip: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  sumCard: {
    flex: 1,
    backgroundColor: INK,
    borderRadius: 16,
    padding: 14,
  },
  sumCardAccent: { backgroundColor: ORANGE },
  sumLabel: {
    fontSize: 11,
    fontFamily: FONTS.gilroy.medium,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 6,
  },
  sumVal: { fontSize: 18, fontFamily: FONTS.gilroy.bold, color: '#FFFFFF' },

  listContent: { paddingHorizontal: 16, gap: 10 },

  levelRow: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 0,
  },
  levelRowFilled: { backgroundColor: INK },
  levelRowEmpty: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: GRAY_300,
    borderStyle: 'dashed',
  },

  levelMain: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },

  levelBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelBadgeFilled: { backgroundColor: ORANGE },
  levelBadgeFilledText: {
    fontSize: 12,
    fontFamily: FONTS.gilroy.bold,
    color: '#FFFFFF',
  },
  levelBadgeEmpty: { backgroundColor: GRAY_50 },
  levelBadgeEmptyText: {
    fontSize: 12,
    fontFamily: FONTS.gilroy.bold,
    color: GRAY_500,
  },

  levelInfo: { flex: 1, minWidth: 0 },
  levelName: {
    fontSize: 14,
    fontFamily: FONTS.gilroy.semiBold,
    color: '#FFFFFF',
  },
  levelNameEmpty: {
    fontSize: 14,
    fontFamily: FONTS.gilroy.semiBold,
    color: GRAY_500,
  },
  levelDesc: {
    fontSize: 12,
    fontFamily: FONTS.gilroy.regular,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 2,
  },
  levelDescEmpty: {
    fontSize: 12,
    fontFamily: FONTS.gilroy.regular,
    color: GRAY_600,
    marginTop: 2,
  },

  levelRight: { alignItems: 'flex-end' },
  levelCount: { fontSize: 14, fontFamily: FONTS.gilroy.bold, color: '#FFFFFF' },
  levelCountUnit: {
    fontFamily: FONTS.gilroy.regular,
    color: 'rgba(255,255,255,0.6)',
  },
  levelCountEmpty: {
    fontSize: 13,
    fontFamily: FONTS.gilroy.regular,
    color: GRAY_500,
  },
  levelBt: {
    fontSize: 12,
    fontFamily: FONTS.gilroy.semiBold,
    color: ORANGE,
    marginTop: 2,
  },
});

export default styles;
