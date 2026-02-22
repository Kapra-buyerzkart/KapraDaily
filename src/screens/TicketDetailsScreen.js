import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { useNavigation, useRoute } from '@react-navigation/native'
import { FONTS } from '../styles/typography'
import { getTicketDetailsApi } from '../api/supportService'
import { LoaderContext } from '../context/loaderContext'
import StatusModal from '../components/StatusModal'

const TicketDetailsScreen = () => {
    const navigation = useNavigation()
    const route = useRoute()
    const { ticketId } = route.params
    const { showLoader } = useContext(LoaderContext)
    const [ticket, setTicket] = useState(null)
    const [statusModal, setStatusModal] = useState({
        visible: false,
        title: '',
        message: ''
    })

    const fetchDetails = async () => {
        try {
            showLoader(true)
            const response = await getTicketDetailsApi(ticketId)

            if (response && response.success && response.data) {
                const header = response.data.header;
                if (header && header.status === "NOT_FOUND") {
                    setStatusModal({
                        visible: true,
                        title: 'Ticket Not Found',
                        message: 'The requested support ticket could not be located.'
                    })
                } else {
                    setTicket(header)
                }
            } else {
                setStatusModal({
                    visible: true,
                    title: 'Error',
                    message: 'Failed to fetch ticket details. Please try again.'
                })
            }
        } catch (error) {
            console.error('Error fetching ticket details:', error)
            setStatusModal({
                visible: true,
                title: 'Error',
                message: 'Something went wrong while fetching ticket details.'
            })
        } finally {
            showLoader(false)
        }
    }

    useEffect(() => {
        fetchDetails()
    }, [ticketId])

    const getPriorityStyle = (priority) => {
        switch (priority?.toLowerCase()) {
            case 'high': return { color: '#EB5757', bg: '#EB575715' };
            case 'medium': return { color: '#F2994A', bg: '#F2994A15' };
            case 'low': return { color: '#27AE60', bg: '#27AE6015' };
            default: return { color: '#F2994A', bg: '#F2994A15' };
        }
    }

    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case 'open': return { color: '#2F80ED', bg: '#2F80ED15' };
            case 'closed': return { color: '#27AE60', bg: '#27AE6015' };
            case 'pending': return { color: '#F2C94C', bg: '#F2C94C15' };
            default: return { color: '#6B7280', bg: '#6B728015' };
        }
    }

    if (!ticket) return null

    const priorityStyle = getPriorityStyle(ticket.priority)
    const statusStyle = getStatusStyle(ticket.status)

    return (
        <SafeAreaView style={styles.mainContainer}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <AntDesign name="left" size={wp('6%')} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Ticket Details</Text>
                <View style={{ width: wp('6%') }} />
            </View>

            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.topCard}>
                    <View style={styles.row}>
                        <Text style={styles.idText}>Ticket #{ticket.supportId}</Text>
                        <View style={[styles.badge, { backgroundColor: statusStyle.bg }]}>
                            <Text style={[styles.badgeText, { color: statusStyle.color }]}>{ticket.status || 'Open'}</Text>
                        </View>
                    </View>
                    <Text style={styles.titleText}>{ticket.title}</Text>
                    <View style={styles.row}>
                        <View style={styles.metaItem}>
                            <Text style={styles.metaLabel}>Priority</Text>
                            <View style={[styles.badge, { backgroundColor: priorityStyle.bg }]}>
                                <Text style={[styles.badgeText, { color: priorityStyle.color }]}>
                                    {ticket.priority?.charAt(0).toUpperCase() + ticket.priority?.slice(1)}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.metaItem}>
                            <Text style={styles.metaLabel}>Submitted on</Text>
                            <Text style={styles.dateText}>{new Date(ticket.createdOn || ticket.createdAt).toLocaleDateString()}</Text>
                        </View>
                    </View>
                </View>

                {ticket.orderId > 0 && (
                    <View style={styles.orderCard}>
                        <AntDesign name="shoppingcart" size={wp('5%')} color="#F25000" />
                        <Text style={styles.orderText}>Related to Order Number: <Text style={{ fontFamily: FONTS.poppins.semiBold }}>#{ticket.orderNumber || ticket.orderId}</Text></Text>
                    </View>
                )}

                <View style={styles.contentCard}>
                    <Text style={styles.sectionTitle}>Message</Text>
                    <Text style={styles.messageText}>{ticket.message}</Text>
                </View>

                {ticket.adminReply && (
                    <View style={[styles.contentCard, { backgroundColor: '#F2F2F2' }]}>
                        <Text style={styles.sectionTitle}>Admin Reply</Text>
                        <Text style={styles.messageText}>{ticket.adminReply}</Text>
                        <Text style={styles.replyDate}>{new Date(ticket.replyOn).toLocaleDateString()}</Text>
                    </View>
                )}
            </ScrollView>

            <StatusModal
                visible={statusModal.visible}
                type="error"
                title={statusModal.title}
                message={statusModal.message}
                onOk={() => {
                    setStatusModal({ ...statusModal, visible: false })
                    navigation.goBack()
                }}
            />
        </SafeAreaView>
    )
}

export default TicketDetailsScreen

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#F8F9FA'
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: wp('5%'),
        paddingVertical: hp('2%'),
        backgroundColor: '#FFF'
    },
    headerTitle: {
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('5%'),
        color: '#000'
    },
    backButton: {
        padding: wp('1%')
    },
    container: {
        padding: wp('5%'),
    },
    topCard: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: wp('4%'),
        marginBottom: hp('2%'),
        elevation: 2,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: hp('1.5%')
    },
    idText: {
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('3.5%'),
        color: '#7D7D7D'
    },
    badge: {
        width: wp('20%'),
        paddingHorizontal: wp('1%'),
        paddingVertical: hp('0.5%'),
        borderRadius: 20,
        alignItems: 'center',
    },
    badgeText: {
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('3%'),
    },
    titleText: {
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('4.5%'),
        color: '#000',
        marginBottom: hp('2%')
    },
    metaItem: {
        flex: 1
    },
    metaLabel: {
        fontFamily: FONTS.poppins.regular,
        fontSize: wp('3%'),
        color: '#9E9E9E',
        marginBottom: hp('0.5%')
    },
    dateText: {
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('3.5%'),
        color: '#4F4F4F'
    },
    orderCard: {
        backgroundColor: '#FFF',
        flexDirection: 'row',
        alignItems: 'center',
        padding: wp('4%'),
        borderRadius: 12,
        marginBottom: hp('2%'),
        borderLeftWidth: 4,
        borderLeftColor: '#F25000'
    },
    orderText: {
        fontFamily: FONTS.poppins.regular,
        fontSize: wp('3.5%'),
        color: '#4F4F4F',
        marginLeft: wp('3%')
    },
    contentCard: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: wp('4%'),
        marginBottom: hp('2%'),
    },
    sectionTitle: {
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('3.8%'),
        color: '#7D7D7D',
        marginBottom: hp('1%'),
        textTransform: 'uppercase'
    },
    messageText: {
        fontFamily: FONTS.poppins.regular,
        fontSize: wp('3.8%'),
        color: '#4F4F4F',
        lineHeight: hp('2.5%')
    },
    replyDate: {
        fontFamily: FONTS.poppins.italic,
        fontSize: wp('3%'),
        color: '#9E9E9E',
        alignSelf: 'flex-end',
        marginTop: hp('1%')
    }
})
