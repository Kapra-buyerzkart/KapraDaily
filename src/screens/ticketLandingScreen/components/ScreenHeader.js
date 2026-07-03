import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Reanimated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import styles from '../styles';

const SCROLL_RANGE = 120;

const ScreenHeader = ({ navigation, insets, scrollY }) => {
  const titleAnimStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, SCROLL_RANGE],
      [1, 0],
      Extrapolation.CLAMP,
    );
    const translateY = interpolate(
      scrollY.value,
      [0, SCROLL_RANGE],
      [0, -40],
      Extrapolation.CLAMP,
    );
    const scale = interpolate(
      scrollY.value,
      [0, SCROLL_RANGE],
      [1, 0.92],
      Extrapolation.CLAMP,
    );
    return {
      opacity,
      transform: [{ translateY }, { scale }],
    };
  });

  return (
    <View
      style={[
        styles.header,
        { paddingTop: insets.top > 0 ? insets.top + 16 : 40 },
      ]}
    >
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={[
          styles.backButton,
          { top: insets.top > 0 ? insets.top + 16 : 40 },
        ]}
        hitSlop={40}
      >
        <AntDesign name="left" size={wp('5%')} color="#FFFFFF" />
      </TouchableOpacity>
      <Reanimated.View style={titleAnimStyle}>
        <Image
          source={require('../../../assets/icons/titleText.png')}
          style={styles.titleImage}
        />
      </Reanimated.View>
    </View>
  );
};

export default ScreenHeader;
