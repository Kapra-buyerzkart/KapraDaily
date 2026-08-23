import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import { styles } from './styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../../theme/colours';
import { filterOptions } from './constants';
import LinearGradient from 'react-native-linear-gradient';
import { AppIcons } from '../../assets/icons';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (selectedFilters: Record<string, string[]>) => void;
  categoryName?: string;
  categoryImage?: any;
}

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  onApply,
  categoryName,
  categoryImage,
}) => {
  const tabs = Object.keys(filterOptions);
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({});
  const toggleFilter = (category: string, option: string) => {
    setSelectedFilters(prev => {
      const currentSelected = prev[category] || [];

      if (category === 'Prize' || category === 'Sort by') {
        return {
          ...prev,
          [category]: currentSelected.includes(option) ? [] : [option],
        };
      }

      if (currentSelected.includes(option)) {
        return {
          ...prev,
          [category]: currentSelected.filter(item => item !== option),
        };
      } else {
        return { ...prev, [category]: [...currentSelected, option] };
      }
    });
  };

  const handleReset = () => {
    setSelectedFilters({});
  };

  const handleSave = () => {
    onApply(selectedFilters);
    onClose();
  };

  const renderOption = ({ item }: { item: string }) => {
    const isSelected = selectedFilters[activeTab]?.includes(item);

    return (
      <TouchableOpacity
        style={styles.checkboxRow}
        onPress={() => toggleFilter(activeTab, item)}
        activeOpacity={0.7}
      >
        {isSelected ? (
          <LinearGradient
            colors={[colors.themeTeal, '#FF6A00']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.checkboxGradient}
          >
            <Ionicons name="checkmark" size={16} color={colors.themeWhite} />
          </LinearGradient>
        ) : (
          <View style={styles.checkbox} />
        )}
        <Text
          style={[
            styles.checkboxLabel,
            isSelected && styles.checkboxLabelActive,
          ]}
        >
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <View style={styles.modalTopHeader}>
                <TouchableOpacity onPress={onClose}>
                  <Ionicons
                    name="arrow-back"
                    size={28}
                    color={colors.themeBlack}
                  />
                </TouchableOpacity>
                <Text style={styles.modalTopTitle}>Fashion</Text>
              </View>

              <View style={styles.modalCategoryProfile}>
                {categoryImage && (
                  <Image
                    source={categoryImage}
                    style={styles.modalCategoryImage}
                  />
                )}
                <Text style={styles.modalCategoryName}>{categoryName}</Text>
              </View>

              <View style={styles.modalHeader}>
                <View style={styles.modalHeaderLeft}>
                  <Ionicons
                    name="options-outline"
                    size={20}
                    color={colors.themeBlack}
                    onPress={onClose}
                  />
                  <Text style={styles.modalTitle}>Filter</Text>
                </View>
                <Ionicons
                  name="funnel-outline"
                  size={20}
                  color={colors.themeBlack}
                />
              </View>

              <View style={styles.modalBody}>
                <View style={styles.modalSidebar}>
                  {tabs.map(tab => {
                    const isActive = activeTab === tab;
                    const count = selectedFilters[tab]?.length || 0;
                    return (
                      <TouchableOpacity
                        key={tab}
                        style={styles.modalTab}
                        onPress={() => setActiveTab(tab)}
                      >
                        {isActive ? (
                          <LinearGradient
                            colors={[
                              colors.themeTeal,
                              '#FFB28C',
                            ]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.modalTabGradient}
                          >
                            <Text style={styles.modalTabTextActive}>{tab}</Text>
                          </LinearGradient>
                        ) : (
                          <View style={styles.modalTabInner}>
                            <Text style={styles.modalTabText}>{tab}</Text>
                            {count > 0 && (
                              <View style={styles.modalTabBadge}>
                                <Text style={styles.modalTabBadgeText}>
                                  {count}
                                </Text>
                              </View>
                            )}
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <View style={styles.modalContent}>
                  <FlatList
                    data={
                      filterOptions[activeTab as keyof typeof filterOptions] ||
                      []
                    }
                    keyExtractor={item => item}
                    renderItem={renderOption}
                    showsVerticalScrollIndicator={false}
                  />
                </View>
              </View>

              <View style={styles.modalFooter}>
                <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
                  <Ionicons
                    name="refresh-outline"
                    size={20}
                    color={colors.themeBlack}
                  />
                  <Text style={styles.resetBtnText}>Reset</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveBtnTouchable}
                  onPress={handleSave}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={[colors.themeTeal, '#FF6A00']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.saveBtnGradient}
                  >
                    <AppIcons.ArrowUpBold color={colors.white} size={20} />
                    <Text style={styles.saveBtnText}>Save</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default FilterModal;
