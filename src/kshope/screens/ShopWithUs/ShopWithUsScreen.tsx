import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from './styles';
import { colors } from '../../theme/colours';

import { topCategories, kshopeCategories, shopByCategory, shopByFashion, shopByConcern, topBrands } from './constants';


const ShopWithUsScreen = ({ navigation }: any) => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backIcon}>
                        <Icon name="arrow-back" size={24} color={colors.themeBlack} />
                    </TouchableOpacity>
                    <View style={styles.titleContainer}>
                        <Text style={styles.titleBold}>Shop</Text>
                        <Text style={styles.titleBold}>With Us</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.searchIcon}>
                    <Icon name="search" size={24} color={colors.themeBlack} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.topCategoryContainer}>
                    {topCategories.map((item) => (
                        <TouchableOpacity key={item.id} style={styles.topCategoryItem}>
                            <View style={styles.topCategoryImageContainer}>
                                <Image source={item.image} style={styles.topCategoryImage} />
                            </View>
                            <View style={styles.topCategoryTextContainer}>
                                <Text style={styles.topCategoryText} numberOfLines={1}>{item.title}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <Text style={styles.sectionTitle}>KSHOPE CATEGORY</Text>
                <View style={styles.gridContainer}>
                    {kshopeCategories.map((item) => (
                        <TouchableOpacity key={item.id} style={styles.gridItem}>
                            <View style={styles.gridImageContainer}>
                                <Image source={item.image} style={styles.gridImage} />
                            </View>
                            <Text style={styles.gridText}>{item.title}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.listContainer}>
                    {shopByCategory.map((item) => (
                        <TouchableOpacity key={item.id} style={styles.listItem}>
                            <View style={styles.listItemImageContainer}>
                                <Image source={item.image} style={styles.listItemImage} />
                            </View>
                            <Text style={styles.listItemText}>{item.title}</Text>
                            <Icon name="chevron-forward" size={16} color={colors.outlineTeal} />
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.sectionTitle}>SHOP BY FASHION</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 10 }}>
                    {shopByFashion.map((item) => (
                        <TouchableOpacity key={item.id} style={styles.fashionItem}>
                            <View style={styles.fashionImageContainer}>
                                <Image source={item.image} style={styles.fashionImage} />
                            </View>
                            <Text style={styles.fashionText}>{item.title}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <Text style={styles.sectionTitle}>SHOP BY CONCERN</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 5 }}>
                    {shopByConcern.map((item) => (
                        <TouchableOpacity key={item.id} style={styles.concernItem}>
                            <Image source={item.image} style={styles.concernImage} />
                            <View style={styles.concernFooter}>
                                <Text style={styles.concernText}>{item.title}</Text>
                                <View style={styles.concernArrowContainer}>
                                    <Icon name="chevron-forward" size={12} color={colors.outlineTeal} />
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <Text style={styles.sectionTitle}>TOP BRANDS</Text>
                <View style={styles.brandGridContainer}>
                    {topBrands.map((item) => (
                        <TouchableOpacity key={item.id} style={styles.brandItem}>
                            <View style={styles.brandImageContainer}>
                                <Image source={item.image} style={styles.brandImage} />
                            </View>
                            <Text style={styles.brandText}>{item.title}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

export default ShopWithUsScreen;
