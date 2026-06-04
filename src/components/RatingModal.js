import {useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    TextInput,
    Image,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { FONTS } from '../styles/typography';
import LinearGradient from 'react-native-linear-gradient';

const RatingModal = ({ visible, onClose, onSubmit, rating, title, placeholder = "Tell us about your experience..." }) => {
    const [review, setReview] = useState('');

    const handleSubmit = () => {
        onSubmit(review);
        setReview('');
    };

    return (
        <Modal
            transparent={true}
            visible={visible}
            animationType="slide"
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.overlay}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.modalContainer}>
                        <View style={styles.header}>
                            <Text style={styles.title}>{title}</Text>
                            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                <Image
                                    style={styles.closeIcon}
                                    source={require('../assets/images/close_two.png')}
                                />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.ratingContainer}>
                            <Text style={styles.ratingLabel}>Your Rating</Text>
                            <View style={styles.starContainer}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Image
                                        key={star}
                                        style={[styles.starIcon, { tintColor: star <= rating ? '#F2C94C' : '#DADADA' }]}
                                        source={require('../assets/images/star.png')}
                                    />
                                ))}
                            </View>
                        </View>

                        <View style={styles.inputWrapper}>
                            <Text style={styles.label}>Write a Review</Text>
                            <TextInput
                                style={styles.input}
                                placeholder={placeholder}
                                placeholderTextColor="#999999"
                                multiline
                                value={review}
                                onChangeText={setReview}
                                textAlignVertical="top"
                            />
                        </View>

                        <TouchableOpacity onPress={handleSubmit}>
                            <LinearGradient
                                colors={['#F25000', '#FF7B3A']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.submitButton}
                            >
                                <Text style={styles.submitText}>Submit Rating</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: wp('8%'),
        borderTopRightRadius: wp('8%'),
        paddingHorizontal: wp('6%'),
        paddingTop: hp('2.5%'),
        paddingBottom: hp('4.5%'),
        width: '100%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: hp('2.5%'),
    },
    title: {
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('4.8%'),
        color: '#000000',
    },
    closeButton: {
        padding: wp('2%'),
    },
    closeIcon: {
        width: wp('4%'),
        height: wp('4%'),
        tintColor: '#000000',
    },
    ratingContainer: {
        alignItems: 'center',
        marginBottom: hp('3%'),
    },
    ratingLabel: {
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('3.8%'),
        color: '#616161',
        marginBottom: hp('1%'),
    },
    starContainer: {
        flexDirection: 'row',
    },
    starIcon: {
        width: wp('8%'),
        height: wp('8%'),
        marginHorizontal: wp('1%'),
    },
    inputWrapper: {
        marginBottom: hp('3.5%'),
    },
    label: {
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('3.8%'),
        color: '#000000',
        marginBottom: hp('1%'),
    },
    input: {
        height: hp('15%'),
        backgroundColor: '#F9F9F9',
        borderRadius: wp('3%'),
        borderWidth: 1,
        borderColor: '#EEEEEE',
        padding: wp('4%'),
        fontFamily: FONTS.poppins.regular,
        fontSize: wp('3.5%'),
        color: '#000000',
    },
    submitButton: {
        height: hp('6%'),
        borderRadius: wp('3%'),
        justifyContent: 'center',
        alignItems: 'center',
    },
    submitText: {
        fontFamily: FONTS.poppins.bold,
        fontSize: wp('4.1%'),
        color: '#FFFFFF',
    },
});

export default RatingModal;
