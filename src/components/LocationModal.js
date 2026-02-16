import React, { useContext, useState } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    FlatList,
    Image,
} from 'react-native';
import DelayInput from 'react-native-debounce-input';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { getAreasBySearch } from '../api';
import { AppContext } from '../context/appContext';

const LocationModal = ({
    visible,
    onClose,
    // getAreasBySearch,
    // onSelect,
}) => {

    const { editPincode } = useContext(AppContext)

    const [search, setSearch] = useState('');
    const [areas, setAreas] = useState([]);
    const [loading, setLoading] = useState(false);

    const onSearch = async (text) => {
        setSearch(text);

        if (text.length < 3) {
            setAreas([]);
            return;
        }

        try {
            setLoading(true);
            const res = await getAreasBySearch(text);
            setAreas(res || []);
        } catch (e) {
            setAreas([]);
        } finally {
            setLoading(false);
        }
    };

    const onSelectLocation = async (item) => {
        await editPincode(item);   // ✅ CALL CONTEXT METHOD
        onClose();                 // ✅ CLOSE MODAL
    };

    return (
        <Modal visible={visible} transparent animationType="slide">
            {/* {console.log('areas', areas.data)} */}
            <View style={styles.overlay}>
                <View style={styles.container}>

                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Change Delivery Location</Text>
                        <TouchableOpacity onPress={onClose}>
                            {/* <Text style={styles.close}>✕</Text> */}
                            <Image style={{
                                width: wp('4%'),
                                height: wp('4%')
                            }} source={require('../assets/images/close_two.png')} />
                        </TouchableOpacity>
                    </View>

                    {/* Search */}
                    <DelayInput
                        value={search}
                        delayTimeout={500}
                        minLength={3}
                        onChangeText={onSearch}
                        placeholder="Search location..."
                        style={styles.input}
                    />

                    {/* Loader */}
                    {loading && <ActivityIndicator color={'#FF7148'} size="small" />}

                    {/* List */}
                    <FlatList
                        data={areas.data}
                        keyExtractor={(_, i) => i.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.item}
                                onPress={() => {
                                    onSelectLocation(item);
                                    onClose();
                                }}
                            >
                                <Text style={styles.itemText}>{item.areaName}</Text>
                            </TouchableOpacity>
                        )}
                    />

                </View>
            </View>
        </Modal>
    );
};

export default LocationModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    container: {
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: hp('80%'),
        paddingBottom: hp('2%'),
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: wp('5%'),
        backgroundColor: '#FF7148',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        alignItems: 'center'
    },
    title: {
        fontSize: wp('4.3%'),
        // fontWeight: '600',
        fontFamily: 'Outfit-SemiBold',
        color: '#ffffff'
    },
    close: {
        fontSize: wp('5%'),
    },
    input: {
        margin: wp('5%'),
        padding: wp('3%'),
        backgroundColor: '#F2F2F2',
        borderRadius: 8,
        fontSize: wp('3.3%'),
        fontFamily: 'Poppins-Regular'
    },
    item: {
        paddingVertical: wp('4%'),
        paddingLeft: wp('7%'),
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    itemText: {
        fontSize: wp('3.3%'),
        fontFamily: 'Poppins-Regular',
        color: '#000000'
    },
});