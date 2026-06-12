import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../styles';

const TABS = ['Tickets', 'My Vouchers'];

const TabBar = ({ activeTab, onTabChange }) => (
  <View style={styles.tabContainer}>
    {TABS.map((tab, index) => (
      <TouchableOpacity
        key={tab}
        style={styles.tab}
        onPress={() => onTabChange(index)}
        activeOpacity={0.7}
      >
        <Text style={activeTab === index ? styles.tabTextActive : styles.tabTextInactive}>
          {tab}
        </Text>
        {activeTab === index && <View style={styles.tabDot} />}
      </TouchableOpacity>
    ))}
  </View>
);

export default TabBar;
