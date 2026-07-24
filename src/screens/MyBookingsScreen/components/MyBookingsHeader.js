import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const MyBookingsHeader = ({ topInset = 20, onBack }) => (
  <View style={[styles.header, { paddingTop: topInset }]}>
    <TouchableOpacity onPress={onBack} hitSlop={16} style={styles.backButton}>
      <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
    </TouchableOpacity>
    <Text style={styles.title}>My bookings</Text>
  </View>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  backButton: {
    marginRight: 12,
  },
  title: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'Gilroy-Bold',
  },
});

export default React.memo(MyBookingsHeader);
