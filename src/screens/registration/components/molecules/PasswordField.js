import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FormField from './FormField';
import { CART_COLORS, hitSlopTo, wp } from '../../../../styles/cartTheme';

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
          hitSlop={hitSlopTo(wp('5%'))}
          accessibilityRole="button"
          accessibilityLabel={visible ? 'Hide password' : 'Show password'}
        >
          <Ionicons
            name={visible ? 'eye-outline' : 'eye-off-outline'}
            size={wp('5%')}
            color={visible ? CART_COLORS.primary : CART_COLORS.textMuted}
          />
        </TouchableOpacity>
      }
      {...rest}
    />
  );
};

export default React.memo(PasswordField);
