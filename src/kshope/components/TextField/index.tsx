import React, { useState } from 'react';
import { View, TextInput, Text, StyleProp, ViewStyle, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colours';
import { getStyles } from './styles';

interface CustomInputFieldProps {
    label?: string;
    error?: string;
    style?: StyleProp<ViewStyle>;
    rightIcon?: React.ReactNode;
    onPressRightIcon?: () => void;
}

type InputFieldProps = CustomInputFieldProps & React.ComponentProps<typeof TextInput>;

const InputField: React.FC<InputFieldProps> = ({ label, error, style, rightIcon, onPressRightIcon, ...rest }) => {
    const colour = colors;
    const styles = getStyles(colour);

    const [isFocused, setIsFocused] = useState(false);

    const inputStyles = [
        styles.input,
        isFocused && styles.focused,
        error && styles.error,
        style,
    ];

    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View style={[styles.inputWrapper, isFocused && styles.focused, error && styles.error]}>
                <TextInput
                    style={[styles.input]}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholderTextColor={colors.grey}
                    {...rest}
                />

                {rightIcon && (
                    <TouchableOpacity onPress={onPressRightIcon} style={styles.iconContainer}>
                        {rightIcon}
                    </TouchableOpacity>
                )}
            </View>

            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

export default InputField;
