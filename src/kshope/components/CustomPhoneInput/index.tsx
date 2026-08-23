import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';
import { styles } from './styles';
import { colors } from '../../theme/colours';

interface CustomPhoneInputProps extends TextInputProps {
    value: string;
    onChangeText: (text: string) => void;
}

const CustomPhoneInput: React.FC<CustomPhoneInputProps> = ({
    value,
    onChangeText,
    ...rest
}) => {
    return (
        <View style={styles.inputWrapper}>
            <Text style={styles.countryCode}>+91</Text>
            <View style={styles.divider} />
            <TextInput
                placeholder="9999999999"
                placeholderTextColor={colors.lightGrey}
                keyboardType="number-pad"
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                maxLength={10}
                {...rest}
            />
        </View>
    );
};

export default CustomPhoneInput;
