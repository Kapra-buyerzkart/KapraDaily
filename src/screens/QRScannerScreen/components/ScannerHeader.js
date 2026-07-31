import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import icons from '@/assets/icons';
import COLORS from '@/styles/colors';
import { styles } from '../styles';

const ScannerHeader = ({ onBack, hasTorch, torchOn, onToggleTorch }) => (
  <View style={styles.header}>
    <TouchableOpacity hitSlop={20} onPress={onBack} style={styles.iconButton}>
      <Image source={icons.backArrowNew} style={styles.backIcon} />
    </TouchableOpacity>

    {/* No title here on purpose: the brand lockup below the header names the
        screen, and a second line of text would compete with it. */}
    <View style={styles.headerSpacer} />

    {hasTorch ? (
      <TouchableOpacity
        hitSlop={20}
        onPress={onToggleTorch}
        style={styles.iconButton}
      >
        <Ionicons
          name={torchOn ? 'flash' : 'flash-off'}
          color={COLORS.white}
          size={wp('5%')}
        />
      </TouchableOpacity>
    ) : (
      <View style={styles.iconButton} />
    )}
  </View>
);

export default React.memo(ScannerHeader);
