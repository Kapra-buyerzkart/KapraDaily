import React from 'react';
import { Text, TextInput, View } from 'react-native';
import { styles } from '../styles';

type ProfileTextFieldProps = {
  label: string;
  value: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  editable?: boolean;
};

const ProfileTextField = ({
  label,
  value,
  onChangeText,
  placeholder,
  editable = true,
}: ProfileTextFieldProps) => (
  <View style={[styles.inputContainer, !editable && styles.inputContainerDisabled]}>
    <Text style={styles.label}>{label}</Text>
    <View style={[styles.inputWrapper, !editable && styles.inputWrapperDisabled]}>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#DADADA"
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        editable={editable}
      />
    </View>
  </View>
);

export default ProfileTextField;
