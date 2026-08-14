import React from 'react';
import {
  FlatList,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from '@sbaiahmed1/react-native-blur';

import AuthButton from '@/components/AuthButton';

import { sheetStyles } from '../../styles';
import { COLORS, WINDOW_WIDTH } from '../../theme';
import { AreaOptionRow, SheetHeader } from '../molecules';

const keyExtractor = (item, index) => index.toString();

const AreaSelectionSheet = ({
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
    <SafeAreaView style={styles.safeArea}>
      <BlurView
        style={sheetStyles.blur}
        blurType="light"
        blurAmount={1}
        overlayColor={Platform.OS === 'ios' ? undefined : 'transparent'}
        reducedTransparencyFallbackColor="black"
      />
      <View style={[sheetStyles.sheet, styles.sheet]}>
        <SheetHeader title="Choose your area" onClose={onClose} />

        <ScrollView showsVerticalScrollIndicator={false}>
          <FlatList
            data={listOfLocations}
            renderItem={({ item }) => (
              <AreaOptionRow
                item={item}
                isSelected={
                  !!selectedLocation &&
                  selectedLocation?.pincodeAreaId == item?.pincodeAreaId
                }
                onPress={onSelectArea}
              />
            )}
            keyExtractor={keyExtractor}
          />
        </ScrollView>

        {listOfLocations && listOfLocations.length > 1 && (
          <View style={styles.actions}>
            <AuthButton
              FirstColor={'#D71920'}
              SecondColor={COLORS.dangerSoft}
              OnPress={onSkip}
              ButtonText={'Skip'}
              ButtonWidth={44}
              ButtonHeight={5}
            />
            <AuthButton
              FirstColor={COLORS.brand}
              SecondColor={COLORS.brandSoft}
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

export default React.memo(AreaSelectionSheet);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    paddingTop: 10,
  },
  actions: {
    flexDirection: 'row',
    width: WINDOW_WIDTH * 0.9,
    justifyContent: 'space-between',
    marginTop: 5,
  },
});
