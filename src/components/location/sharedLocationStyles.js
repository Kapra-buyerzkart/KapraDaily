import { StyleSheet, Dimensions } from 'react-native';
import { getFontontSize } from '../../globals/GroFunctions';

export const windowWidth = Dimensions.get('window').width;
export const windowHeight = Dimensions.get('window').height;

// Styles shared by the location-fetching header actions and its modals.
export const sharedLocationStyles = StyleSheet.create({
  iconCmnCon: {
    width: windowHeight * (5 / 100),
    height: windowHeight * (5 / 100),
    backgroundColor: '#FFFFFF',
    marginLeft: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    // iOS Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 3,

    // Android Shadow
    elevation: 5,
  },
  blurStyle: {
    width: windowWidth,
    height: windowHeight,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: null,
    overflow: 'hidden',
  },
  updateModalView1: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 20,
    elevation: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalHeader: {
    width: windowWidth,
    height: windowHeight * (7 / 100),
    paddingHorizontal: windowWidth * (5 / 100),
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    backgroundColor: '#F04B1B',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  fontStyle1: {
    fontFamily: 'Gilroy-Bold',
    fontSize: getFontontSize(18),
    color: '#ffffff',
  },
});
