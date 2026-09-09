import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView from 'react-native-maps';

import { MapPin } from '../atoms';
import { RecenterButton } from '../molecules';
import { MAP_HEIGHT } from '../../constants';
import { wp } from '../../theme';

const LocationMap = ({
  mapRef,
  region,
  isDragging,
  onRegionChange,
  onRegionChangeComplete,
  onRecenter,
  isHidden,
}) => (
  <View style={styles.container}>
    <MapView
      ref={mapRef}
      style={styles.map}
      initialRegion={region}
      onRegionChange={onRegionChange}
      onRegionChangeComplete={onRegionChangeComplete}
      showsUserLocation
      showsMyLocationButton={false}
    />

    <MapPin isLifted={isDragging} isHidden={isHidden} />
    <RecenterButton onPress={onRecenter} isHidden={isHidden} />
  </View>
);

export default React.memo(LocationMap);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    width: wp('100%'),
    height: MAP_HEIGHT,
  },
  map: {
    flex: 1,
  },
});
