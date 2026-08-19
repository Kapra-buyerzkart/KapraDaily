import { StyleSheet } from 'react-native';
import { colors } from '../../assets/theme/colours';
import { Fonts } from '../../assets/theme/fonts';
import { wp } from '../../utils/responsive';

export const saveMoneyStyles = StyleSheet.create({
  section: {
    marginBottom: 8,
    paddingHorizontal: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: Fonts.gilroySemiBold,
    fontSize: 16,
    color: '#000',
    marginLeft: 8,
  },
  offerCardsRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    gap: 8,
  },
  offerCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 4,
    flex: 1,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  offerIconContainer: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  offerName: {
    fontFamily: Fonts.gilroyBold,
    fontSize: 12,
    color: '#000',
    textTransform: 'uppercase',
  },
  offerSub: {
    fontFamily: Fonts.gilroyMedium,
    fontSize: 10,
    color: '#999999',
    marginTop: 2,
  },
  dashedLineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 10,
  },
  notchLeft: {
    width: 6,
    height: 12,
    backgroundColor: colors.figmaTeal,
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
    position: 'absolute',
    left: -4,
  },
  notchRight: {
    width: 6,
    height: 12,
    backgroundColor: colors.figmaTeal,
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
    position: 'absolute',
    right: -4,
  },
  dashedLine: {
    flex: 1,
    height: 1,
    borderStyle: 'dashed',
    borderWidth: 0.5,
    borderColor: '#E0E0E0',
    marginHorizontal: 8,
  },
  applyBtnText: {
    fontFamily: Fonts.gilroyBold,
    fontSize: 12,
    color: '#009DFF',
  },
  appliedBtnText: {
    fontFamily: Fonts.gilroyBold,
    fontSize: 12,
    color: colors.green,
  },
});
