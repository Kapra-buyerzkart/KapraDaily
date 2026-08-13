import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Fonts } from '../assets/theme/fonts';
import { colors } from '../assets/theme/colours';

const NotYetPortedScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Coming soon</Text>
      <Text style={styles.body}>
        This part of 48hrs Deals is still being moved over.
      </Text>
      <Text style={styles.route}>{route.name}</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonLabel}>Go back</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: colors.background,
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: 20,
    color: colors.black,
    marginBottom: 8,
  },
  body: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: colors.black,
    textAlign: 'center',
    marginBottom: 4,
  },
  route: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    opacity: 0.5,
    color: colors.black,
    marginBottom: 24,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: colors.themeTeal,
  },
  buttonLabel: {
    fontFamily: Fonts.semiBold,
    fontSize: 14,
    color: colors.white,
  },
});

export default NotYetPortedScreen;
