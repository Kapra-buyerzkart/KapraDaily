import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../styles';

const GENDER_OPTIONS = ['Male', 'Female', 'Other'];

type GenderSelectorProps = {
  value: string;
  onChange: (gender: string) => void;
};

const GenderSelector = ({ value, onChange }: GenderSelectorProps) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>Gender</Text>
    <View style={styles.genderContainer}>
      {GENDER_OPTIONS.map(item => (
        <TouchableOpacity
          key={item}
          onPress={() => onChange(item)}
          style={[styles.genderButton, value === item && styles.genderButtonActive]}
        >
          <Text
            style={[
              styles.genderButtonText,
              value === item && styles.genderButtonTextActive,
            ]}
          >
            {item}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

export default GenderSelector;
