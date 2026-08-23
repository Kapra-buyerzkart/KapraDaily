import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { Fonts } from '../theme/fonts';
import { colors } from '../theme/colours';
import { AppIcons } from '../assets/icons';

interface ClickForMoreButtonProps {
  onPress: () => void;
  title: string;
}

const ClickForMoreButton: React.FC<ClickForMoreButtonProps> = ({ onPress, title }) => {
  return (
    <TouchableOpacity style={styles.buttonContainer} onPress={onPress}>
      <View style={styles.contentRow}>
        <Text style={styles.buttonText}>{title}</Text>
        <View style={{ flexDirection: 'row' }}>
          <View>
            <AppIcons.RightArrow size={18} color={colors.outlineTeal} />
          </View>
          <View style={{ marginLeft: -8 }}>
            <AppIcons.RightArrow size={18} color={colors.outlineTeal} />
          </View>
          <View style={{ marginLeft: -8 }}>
            <AppIcons.RightArrow size={18} color={colors.outlineTeal} />
          </View>
        </View>

      </View>
    </TouchableOpacity>
  );
};

const figmaTeal = '#F25000';

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: figmaTeal,
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    height: 50
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: Fonts.regular,
    fontSize: 17,
    color: colors.darkFontOne,
    fontWeight: '300',
    marginRight: 6,
  },
  chevronText: {
    fontSize: 16,
    color: figmaTeal,
    fontFamily: 'Gilroy-Bold',
    letterSpacing: 2,
  }
});

export default ClickForMoreButton;
