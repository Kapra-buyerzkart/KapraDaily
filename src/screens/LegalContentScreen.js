import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { FONTS } from '../styles/typography';
import { useNavigation, useRoute } from '@react-navigation/native';
import icons from '@/assets/icons';
import SafeRenderHtml from '../components/SafeRenderHtml';
import { getGeneralSettingsApi } from '../api/userService';
import logger from '../utils/logger';
import BallPulse from '@/components/BallPulse';

const { width } = Dimensions.get('window');

const LegalContentScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { settingKey, title } = route.params || {};

  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const response = await getGeneralSettingsApi();
        const items = response?.data?.items || [];
        const item = items.find(i => i.stName === settingKey);
        setContent(item?.stValue || '');
      } catch (error) {
        logger.error(`Failed to fetch ${settingKey}:`, error?.message);
        setContent('');
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [settingKey]);

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.header}>
        <TouchableOpacity
          hitSlop={40}
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Image
            source={icons.backArrowNew}
            style={{
              resizeMode: 'contain',
              tintColor: '#000',
            }}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={{ width: wp('5%') }} />
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <BallPulse size="large" color="#F25000" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.container}>
          {content ? (
            <SafeRenderHtml
              contentWidth={width - wp('10%')}
              source={{ html: content }}
              baseStyle={styles.baseHtml}
            />
          ) : (
            <Text style={styles.emptyText}>No content available.</Text>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default LegalContentScreen;

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
  container: {
    padding: wp('5%'),
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  baseHtml: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('3.6%'),
    color: '#444444',
    lineHeight: wp('5.5%'),
  },
  emptyText: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('3.8%'),
    color: '#888888',
    textAlign: 'center',
    marginTop: hp('5%'),
  },
});
