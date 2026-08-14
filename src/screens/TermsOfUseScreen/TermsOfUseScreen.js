import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import icons from '@/assets/icons';
import { FONTS } from '../../styles/typography';
import TERMS_OF_USE from './termsContent';

const TermsOfUseScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const title = route.params?.title || 'Terms Of Use';

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.header}>
        <TouchableOpacity
          hitSlop={40}
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Image source={icons.backArrowNew} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={{ width: wp('5%') }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {TERMS_OF_USE.map(section => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>

            {section.paragraphs?.map(paragraph => (
              <Text key={paragraph} style={styles.paragraph}>
                {paragraph}
              </Text>
            ))}

            {section.bullets?.map(bullet => (
              <View key={bullet} style={styles.bulletRow}>
                <Text style={styles.bulletDot}>{'•'}</Text>
                <Text style={styles.bulletText}>{bullet}</Text>
              </View>
            ))}

            {section.footer?.map(paragraph => (
              <Text key={paragraph} style={styles.paragraph}>
                {paragraph}
              </Text>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default TermsOfUseScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('2%'),
    backgroundColor: '#FFF',
  },
  headerTitle: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('5%'),
    color: '#000',
  },
  backButton: {
    padding: wp('1%'),
  },
  backIcon: {
    resizeMode: 'contain',
    tintColor: '#000',
  },
  container: {
    paddingHorizontal: wp('5%'),
    paddingBottom: hp('5%'),
  },
  section: {
    marginBottom: hp('3%'),
  },
  sectionTitle: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('4.2%'),
    color: '#111111',
    marginBottom: hp('1%'),
  },
  paragraph: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('3.6%'),
    color: '#444444',
    lineHeight: wp('5.5%'),
    marginBottom: hp('1%'),
  },
  bulletRow: {
    flexDirection: 'row',
    paddingLeft: wp('2%'),
    marginBottom: hp('0.6%'),
  },
  bulletDot: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('3.6%'),
    color: '#444444',
    lineHeight: wp('5.5%'),
    marginRight: wp('2%'),
  },
  bulletText: {
    flex: 1,
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('3.6%'),
    color: '#444444',
    lineHeight: wp('5.5%'),
  },
});
