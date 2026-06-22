import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import React from 'react';
import { styles, GRAY_300 } from '../styles';

export default function RequestProductSection({
  requestText,
  setRequestText,
  isSubmittingRequest,
  onSubmit,
}) {
  return (
    <View style={styles.sendContainer}>
      <Text style={styles.sendContainerTextOne}>Didnt Find Your Product!</Text>
      <Text style={styles.sendContainerTextTwo}>
        Tell us which product you want in our app
      </Text>
      <View style={styles.sendContainerInnerView}>
        <TextInput
          placeholderTextColor={GRAY_300}
          placeholder="eg: biscuit, caske, fruits ..."
          style={styles.sendTextInput}
          value={requestText}
          onChangeText={setRequestText}
        />
        <TouchableOpacity
          onPress={onSubmit}
          disabled={isSubmittingRequest}
          style={styles.sendButton}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
