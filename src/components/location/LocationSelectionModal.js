import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  StyleSheet,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from '@react-native-community/blur';
import AuthButton from '../AuthButton';
import { getFontontSize } from '../../globals/GroFunctions';
import {
  sharedLocationStyles,
  windowWidth,
  windowHeight,
} from './sharedLocationStyles';

const LocationSelectionModal = ({
  visible,
  onClose,
  listOfLocations,
  selectedLocation,
  onSelectArea,
  onSkip,
  onApply,
  applyLoading,
}) => (
  <Modal animationType="slide" visible={visible} transparent>
    <SafeAreaView style={{ flex: 1, justifyContent: 'flex-end' }}>
      <BlurView
        style={sharedLocationStyles.blurStyle}
        blurType="light"
        blurAmount={1}
        overlayColor={Platform.OS == 'ios' ? undefined : 'transparent'}
        reducedTransparencyFallbackColor="black"
      />
      <View style={[sharedLocationStyles.updateModalView1, { paddingTop: 10 }]}>
        <View style={sharedLocationStyles.modalHeader}>
          <Text style={sharedLocationStyles.fontStyle1}>Choose your area</Text>
          <TouchableOpacity style={sharedLocationStyles.iconCmnCon} onPress={onClose}>
            <Image
              source={require('../../assets/icons/close.png')}
              style={{
                height: windowWidth * 0.05,
                width: windowWidth * 0.05,
              }}
            />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <FlatList
            data={listOfLocations}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.locationCon}
                onPress={() => onSelectArea(item)}
              >
                <Text style={styles.fontStyle2}>{item?.areaName}</Text>
                {selectedLocation &&
                  selectedLocation?.pincodeAreaId == item?.pincodeAreaId && (
                    <View>
                      <Image
                        tintColor={'#FF7148'}
                        source={require('../../assets/icons/tick.png')}
                        style={{
                          height: windowWidth * 0.05,
                          width: windowWidth * 0.05,
                        }}
                      />
                    </View>
                  )}
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </ScrollView>

        {listOfLocations && listOfLocations.length > 1 && (
          <View
            style={{
              flexDirection: 'row',
              width: windowWidth * 0.9,
              justifyContent: 'space-between',
              marginTop: 5,
            }}
          >
            <AuthButton
              FirstColor={'#D71920'}
              SecondColor={'#F97C80'}
              OnPress={onSkip}
              ButtonText={'Skip'}
              ButtonWidth={44}
              ButtonHeight={5}
            />
            <AuthButton
              FirstColor={'#F04B1B'}
              SecondColor={'#FF7148'}
              OnPress={onApply}
              ButtonText={'Apply'}
              ButtonWidth={44}
              ButtonHeight={5}
              loading={applyLoading}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  </Modal>
);

const styles = StyleSheet.create({
  locationCon: {
    width: windowWidth * (90 / 100),
    height: windowHeight * (5 / 100),
    paddingHorizontal: windowWidth * (5 / 100),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FDEBE6',
    marginTop: 10,
    borderRadius: 5,
  },
  fontStyle2: {
    fontFamily: 'Gilroy-Medium',
    fontSize: getFontontSize(16),
    color: '#F04B1B',
  },
});

export default LocationSelectionModal;
