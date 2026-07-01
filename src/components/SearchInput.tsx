import React, { forwardRef } from 'react';
import { TextInput, TouchableOpacity, View, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FONTS } from '../styles/typography';

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
  placeholder?: string;
}

const SearchInput = forwardRef<TextInput, SearchInputProps>(
  ({ value, onChangeText, onClear, placeholder = 'Search products' }, ref) => {
    return (
      <View style={styles.container}>
        <Feather name="search" size={wp('4.5%')} color="#767676" />
        <TextInput
          ref={ref}
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#A0A0A0"
          keyboardType="default"
          returnKeyType="search"
          autoCorrect={false}
          autoCapitalize="none"
          accessibilityLabel="Search products"
          accessibilityHint="Type to search for products"
        />
        {value.length > 0 && (
          <TouchableOpacity
            onPress={onClear}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityLabel="Clear search"
            accessibilityRole="button"
          >
            <Ionicons name="close-circle" size={wp('4.5%')} color="#CCCCCC" />
          </TouchableOpacity>
        )}
      </View>
    );
  },
);

SearchInput.displayName = 'SearchInput';
export default SearchInput;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: wp('2%'),
    paddingHorizontal: wp('3%'),
    gap: wp('2%'),
  },
  input: {
    flex: 1,
    fontSize: wp('3.5%'),
    color: '#000000',
    fontFamily: FONTS.outfit.regular,
    paddingVertical: 0,
  },
});
