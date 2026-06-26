import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import {
  BottomSheetTextInput,
  BottomSheetFlatList,
} from '@gorhom/bottom-sheet';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { getAreasBySearch } from '../api';
import { AppContext } from '../context/appContext';
import { FONTS } from '../styles/typography';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CustomBottomModal from './CustomBottomModal';

const SEARCH_DEBOUNCE_MS = 500;
const MIN_SEARCH_LENGTH = 3;

const LocationModal = ({
  visible,
  onClose,
  // getAreasBySearch,
  // onSelect,
}) => {
  const { editPincode } = useContext(AppContext);

  const sheetRef = useRef(null);
  const debounceTimer = useRef(null);

  const [search, setSearch] = useState('');
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(false);

  // Keeps the boolean prop contract every screen already relies on while
  // visibility is actually driven by the BottomSheetModal ref underneath.
  useEffect(() => {
    if (visible) {
      sheetRef.current?.open();
    } else {
      sheetRef.current?.close();
    }
  }, [visible]);

  const runSearch = useCallback(async text => {
    try {
      setLoading(true);
      const res = await getAreasBySearch(text);
      setAreas(res || []);
    } catch (e) {
      setAreas([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const onSearch = useCallback(
    text => {
      setSearch(text);

      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      if (text.length < MIN_SEARCH_LENGTH) {
        setAreas([]);
        return;
      }

      debounceTimer.current = setTimeout(
        () => runSearch(text),
        SEARCH_DEBOUNCE_MS,
      );
    },
    [runSearch],
  );

  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  const onSelectLocation = useCallback(
    async item => {
      Keyboard.dismiss();
      await editPincode(item);
      sheetRef.current?.close();
    },
    [editPincode],
  );

  // Fired by CustomBottomModal on backdrop tap / pan-down-to-close / Android
  // back, so the parent's `visible` boolean stays in sync either way.
  const handleSheetClose = useCallback(() => {
    setSearch('');
    setAreas([]);
    onClose();
  }, [onClose]);

  const noResults =
    search.length >= MIN_SEARCH_LENGTH &&
    !loading &&
    (!areas?.data || areas.data.length === 0);

  const renderContent = useCallback(
    () => (
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>Change Delivery Location</Text>
          </View>
          <TouchableOpacity onPress={() => sheetRef.current?.close()}>
            <MaterialIcons name="close" size={wp('5%')} color="#6f6f6fff" />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <BottomSheetTextInput
          value={search}
          onChangeText={onSearch}
          placeholder="Search location (Please enter at least 3 characters)"
          style={styles.input}
          placeholderTextColor={'#9CA3AF'}
          autoFocus
        />

        {/* Loader */}
        {loading && <ActivityIndicator color={'#FF7148'} size="small" />}

        {/* Empty state */}
        {!loading && noResults ? (
          <View style={styles.emptyState}>
            <MaterialIcons
              name="location-off"
              size={wp('10%')}
              color="#ff4d1cff"
            />
            <Text style={styles.emptyTitle}>No delivery here yet</Text>
            <Text style={styles.emptySubtitle}>
              We couldn't find a serviceable area matching "{search}".
            </Text>
          </View>
        ) : (
          /* List */
          <BottomSheetFlatList
            data={areas.data}
            keyExtractor={(_, i) => i.toString()}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() => onSelectLocation(item)}
              >
                <Text style={styles.itemText}>
                  {item.areaName} {item.pincode ? `(${item.pincode})` : ''}
                </Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    ),
    [search, areas, loading, noResults, onSearch, onSelectLocation],
  );

  return (
    <CustomBottomModal
      ref={sheetRef}
      snapPoints={['50%', '50%']}
      onClose={handleSheetClose}
      renderContent={renderContent}
    />
  );
};

export default LocationModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: wp('2%'),
    paddingBottom: wp('2%'),
    paddingHorizontal: wp('5%'),
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: wp('4.3%'),
    fontFamily: FONTS.outfit.semiBold,
    color: '#FF7148',
    flexShrink: 1,
  },
  input: {
    margin: wp('5%'),
    padding: wp('3%'),
    backgroundColor: '#F2F2F7',
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
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp('10%'),
  },
  emptyImage: {
    width: wp('40%'),
    height: wp('40%'),
    marginBottom: wp('4%'),
  },
  emptyTitle: {
    fontSize: wp('4%'),
    fontFamily: FONTS.outfit.semiBold,
    color: '#1A1A1A',
    marginBottom: wp('1.5%'),
  },
  emptySubtitle: {
    fontSize: wp('3.2%'),
    fontFamily: FONTS.poppins.regular,
    color: '#757575',
    textAlign: 'center',
  },
  itemText: {
    fontSize: wp('3.3%'),
    fontFamily: FONTS.poppins.regular,
    color: '#000000',
  },
});
