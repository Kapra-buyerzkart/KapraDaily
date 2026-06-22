import { View, Text, TouchableOpacity } from 'react-native';
import React, { Fragment } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { styles, GRAY_500, INK } from '../styles';

export default function ListSection({ title, items }) {
  return (
    <>
      <Text style={styles.sectionHeader}>{title}</Text>
      <View style={styles.sectionCard}>
        {items.map((item, index) => (
          <Fragment key={item.key}>
            <TouchableOpacity onPress={item.onPress} style={styles.listItem}>
              <View style={styles.listItemLeft}>
                <View style={styles.listIconWrapper}>{item.icon}</View>
                <Text
                  style={[
                    styles.listItemText,
                    item.textColor && { color: item.textColor },
                  ]}
                >
                  {item.label}
                </Text>
              </View>
              <AntDesign name={'right'} color={INK} size={wp('3.5%')} />
            </TouchableOpacity>
            {index < items.length - 1 && !item.hideDividerAfter && (
              <View style={styles.divider} />
            )}
          </Fragment>
        ))}
      </View>
    </>
  );
}
