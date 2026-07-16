import React from 'react';
import { View, Text, Image } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import icons from '@/assets/icons';
import styles from '../styles';

const MoreToKnow = ({ ageLimit, language }) => {
  if (!ageLimit && !language) return null;

  return (
    <Animated.View
      entering={FadeInUp.delay(160).duration(400)}
      style={styles.section}
    >
      <Text style={styles.sectionTitle}>More to know</Text>

      {!!ageLimit && (
        <View style={styles.metaRow}>
          <View style={styles.infoIconTile}>
            <Image
              source={icons.people}
              style={styles.infoIcon}
              resizeMode="contain"
            />
          </View>
          <View>
            <Text style={styles.metaLabel}>Age limit :</Text>
            <Text style={styles.metaValue}>
              {typeof ageLimit === 'number' ? `${ageLimit} years` : ageLimit}
            </Text>
          </View>
        </View>
      )}

      {!!language && (
        <View style={styles.metaRow}>
          <View style={styles.infoIconTile}>
            <Image
              source={icons.language}
              style={styles.infoIcon}
              resizeMode="contain"
            />
          </View>
          <View>
            <Text style={styles.metaLabel}>Language :</Text>
            <Text style={styles.metaValue}>
              {Array.isArray(language) ? language.join(', ') : language}
            </Text>
          </View>
        </View>
      )}
    </Animated.View>
  );
};

export default React.memo(MoreToKnow);
