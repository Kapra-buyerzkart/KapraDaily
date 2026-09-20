import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import AreaOption from '../molecules/AreaOption';

const AreaSelectCard = ({ areas, selectedArea, onSelect }) => (
  <View style={styles.card}>
    <View style={styles.header}>
      <View style={styles.iconCircle}>
        <Feather name="map-pin" size={16} color="#FFFFFF" />
      </View>
      <View style={styles.copy}>
        <Text style={styles.title}>Select your area</Text>
        <Text style={styles.subtitle}>Please select your Pincode area</Text>
      </View>
    </View>

    <View style={styles.options}>
      {areas.map((area, index) => (
        <AreaOption
          key={area?.pincodeAreaId ?? index}
          label={area.areaName}
          selected={selectedArea?.areaName === area?.areaName}
          onPress={() => onSelect(area)}
        />
      ))}
    </View>
  </View>
);

export default React.memo(AreaSelectCard);

const styles = StyleSheet.create({
  card: {
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#0A2A20',
    backgroundColor: '#FFFFFF',
    marginTop: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0A2A20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
  },
  title: {
    fontFamily: 'Lexend-SemiBold',
    fontSize: 14,
    color: '#12372A',
  },
  subtitle: {
    fontFamily: 'Lexend-Regular',
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  options: {
    gap: 8,
  },
});
