import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import FormField from './FormField';

const PasswordField = ({ label, required, value, onChangeText, ...rest }) => {
  const [visible, setVisible] = useState(false);

  return (
    <FormField
      label={label}
      required={required}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={!visible}
      autoCapitalize="none"
      autoCorrect={false}
      accessory={
        <TouchableOpacity
          onPress={() => setVisible(current => !current)}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={visible ? 'Hide password' : 'Show password'}
        >
          <Feather
            name={visible ? 'eye' : 'eye-off'}
            size={18}
            color="rgba(255, 255, 255, 0.75)"
          />
        </TouchableOpacity>
      }
      {...rest}
    />
  );
};

export default React.memo(PasswordField);
