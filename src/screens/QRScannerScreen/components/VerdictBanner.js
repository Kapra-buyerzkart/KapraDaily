import React from 'react';
import { Animated, Image, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import images from '@/assets/images';
import COLORS from '@/styles/colors';
import { styles } from '../styles';

const VerdictBanner = ({
  resultStyle,
  iconAnim,
  progressAnim,
  showProgress,
}) => (
  <View style={[styles.verdictBanner, { backgroundColor: resultStyle.color }]}>
    {/* Rendered first so it stays behind the verdict text: the white wordmark
        reads as a faint stamp on the solid green/red/amber band. */}
    <View style={styles.verdictWatermarkWrap} pointerEvents="none">
      <Image source={images.kapraLogo} style={styles.verdictWatermark} />
    </View>

    <Animated.View
      style={[styles.verdictIconWrap, { transform: [{ scale: iconAnim }] }]}
    >
      <Ionicons
        name={resultStyle.icon}
        size={wp('5.5%')}
        color={COLORS.white}
      />
    </Animated.View>

    <Text style={styles.verdictTitle}>{resultStyle.title}</Text>

    {showProgress ? (
      <View style={styles.progressTrack}>
        <Animated.View
          style={[
            styles.progressBar,
            { transform: [{ scaleX: progressAnim }] },
          ]}
        />
      </View>
    ) : null}
  </View>
);

export default React.memo(VerdictBanner);
