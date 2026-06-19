import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import DelayInput from 'react-native-debounce-input';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { getAreasBySearch } from '../api';
import { AppContext } from '../context/appContext';
import { FONTS } from '../styles/typography';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const LocationModal = ({
  visible,
  onClose,
  // getAreasBySearch,
  // onSelect,
}) => {
  const { editPincode } = useContext(AppContext);

  const [search, setSearch] = useState('');
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(false);

  const inputRef = useRef(null);

  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [visible]);

  const onSearch = async text => {
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

  const onSelectLocation = async item => {
    Keyboard.dismiss();
    await editPincode(item);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      {/* {console.log('areas', areas.data)} */}
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Change Delivery Location</Text>
            <TouchableOpacity onPress={onClose}>
              {/* <Text style={styles.close}>✕</Text> */}
              <MaterialIcons name="close" size={wp('5%')} color="#ffffff" />
            </TouchableOpacity>
          </View>

          {/* Search */}
          <DelayInput
            inputRef={inputRef}
            value={search}
            delayTimeout={500}
            minLength={3}
            onChangeText={onSearch}
            placeholder="Search location (Please enter at least 3 characters)"
            style={styles.input}
            placeholderTextColor={'black'}
            autoFocus={true}
          />

          {/* Loader */}
          {loading && <ActivityIndicator color={'#FF7148'} size="small" />}

          {/* List */}
          <FlatList
            data={areas.data}
            keyExtractor={(_, i) => i.toString()}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() => {
                  onSelectLocation(item);
                  onClose();
                }}
              >
                <Text style={styles.itemText}>
                  {item.areaName} {item.pincode ? `(${item.pincode})` : ''}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </KeyboardAvoidingView>
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
    alignItems: 'center',
  },
  title: {
    fontSize: wp('4.3%'),
    // fontWeight: '600',
    fontFamily: FONTS.outfit.semiBold,
    color: '#ffffff',
  },
  close: {
    fontSize: wp('5%'),
  },
  input: {
    margin: wp('5%'),
    padding: wp('3%'),
    backgroundColor: '#F2F2F2',
    borderRadius: 8,
    fontSize: wp('3.2%'),
    fontFamily: FONTS.poppins.regular,
  },
  item: {
    paddingVertical: wp('4%'),
    paddingLeft: wp('7%'),
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  itemText: {
    fontSize: wp('3.3%'),
    fontFamily: FONTS.poppins.regular,
    color: '#000000',
  },
});
