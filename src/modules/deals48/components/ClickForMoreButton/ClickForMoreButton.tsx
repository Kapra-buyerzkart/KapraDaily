import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import styles from './styles';
import { colors } from '../../assets/theme/colours';
import { AppIcons } from '../../assets/icons';

interface ClickForMoreButtonProps {
  onPress: () => void;
  title: string;
}

const ClickForMoreButton: React.FC<ClickForMoreButtonProps> = ({ onPress, title }) => {
  return (
    <TouchableOpacity style={styles.buttonContainer} onPress={onPress}>
      <View style={styles.contentRow}>
        <Text style={styles.buttonText}>{title}</Text>
        {/* <Text style={styles.chevronText}>&gt;&gt;&gt;</Text> */}
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

export default ClickForMoreButton;
