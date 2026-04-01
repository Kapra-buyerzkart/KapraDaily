import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { FONTS } from '../styles/typography';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';

const NotificationScreen = () => {
    const navigation = useNavigation();
    const [notiData, setNotiData] = useState(null);
    const [loading, setLoading] = useState(true);

    const _getNotifications = async () => {
        const axiosInstance = axios.create({
            baseURL: 'https://onesignal.com/api/v1/',
            headers: {
                'Authorization': 'Basic YTZjZDU0MDgtZjU0Zi00MWQ1LWEyMTktYWEyMDQ5MDY1ZTRk',
            },
        });
        try {
            let result = await axiosInstance.get(
                `notifications?app_id=d6148736-6459-4778-abec-95105ff68939&limit=10&offset=0&kind=0`,
                {
                    timeout: 15000,
                    timeoutErrorMessage: 'Server is not responding',
                },
            );
            setNotiData(result.data.notifications);
        } catch (error) {
            console.log('Notification fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        _getNotifications();
    }, []);

    const renderNotificationItem = ({ item }) => (
        <View style={styles.notificationCard}>
            <View style={styles.iconContainer}>
                <Ionicons name="notifications" size={wp('6%')} color="#F25000" />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.titleText} numberOfLines={2}>
                    {item.headings?.en || 'Notification'}
                </Text>
                <Text style={styles.contentText} numberOfLines={4}>
                    {item.contents?.en || ''}
                </Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.mainContainer}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={wp('6%')} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Notifications</Text>
                <View style={{ width: wp('6%') }} />
            </View>

            {loading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#F25000" />
                </View>
            ) : notiData && notiData.length > 0 ? (
                <FlatList
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContainer}
                    data={notiData}
                    renderItem={renderNotificationItem}
                    keyExtractor={(item, i) => i.toString()}
                />
            ) : (
                <View style={styles.centerContainer}>
                    <Ionicons name="notifications-off-outline" size={wp('20%')} color="#ccc" />
                    <Text style={styles.emptyTitle}>No Notifications</Text>
                    <Text style={styles.emptySubtitle}>You're all caught up!</Text>
                </View>
            )}
        </SafeAreaView>
    );
};

export default NotificationScreen;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: wp('4%'),
        paddingVertical: hp('1.5%'),
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
    },
    backButton: {
        padding: wp('1%'),
    },
    headerText: {
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('4.5%'),
        color: '#000000',
    },
    listContainer: {
        paddingHorizontal: wp('4%'),
        paddingTop: hp('1%'),
        paddingBottom: hp('3%'),
    },
    notificationCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#FFFFFF',
        borderRadius: wp('3%'),
        padding: wp('4%'),
        marginTop: hp('1%'),
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    iconContainer: {
        width: wp('12%'),
        height: wp('12%'),
        borderRadius: wp('6%'),
        backgroundColor: '#FFF0E8',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: wp('3%'),
    },
    textContainer: {
        flex: 1,
    },
    titleText: {
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('3.7%'),
        color: '#000000',
        marginBottom: hp('0.3%'),
    },
    contentText: {
        fontFamily: FONTS.poppins.regular,
        fontSize: wp('3.2%'),
        color: '#616161',
        lineHeight: wp('4.5%'),
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyTitle: {
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('4.5%'),
        color: '#333',
        marginTop: hp('2%'),
    },
    emptySubtitle: {
        fontFamily: FONTS.poppins.regular,
        fontSize: wp('3.5%'),
        color: '#999',
        marginTop: hp('0.5%'),
    },
});
