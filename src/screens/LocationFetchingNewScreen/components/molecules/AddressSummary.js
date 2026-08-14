import React from 'react';
import { StyleSheet, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { getLocalityLine, getStatePinLine } from '@/utils/addressFormat';

import { ADDRESS_PIN_SIZE, BEACON_ICON_NAME } from '../../constants';
import { COLORS, WINDOW_HEIGHT } from '../../theme';
import { LocText } from '../atoms';

const AddressSummary = ({ geocodeResult }) => (
  <>
    <Ionicons
      name={BEACON_ICON_NAME}
      size={ADDRESS_PIN_SIZE}
      color={COLORS.brand}
    />
    <View style={styles.wrap}>
      <LocText variant="heading" tone="brandDeep" style={styles.heading}>
        Your location
      </LocText>
      <LocText variant="body" tone="secondary">
        {getLocalityLine(geocodeResult)}
      </LocText>
      <LocText variant="body" tone="secondary">
        {getStatePinLine(geocodeResult)}
      </LocText>
    </View>
  </>
);

export default React.memo(AddressSummary);

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
  },
  heading: {
    marginTop: WINDOW_HEIGHT * 0.032,
    marginBottom: WINDOW_HEIGHT * 0.01,
  },
});
