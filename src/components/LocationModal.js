import React, {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
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
import { useDebounce } from '../hooks/useDebounce';
import { FONTS } from '../styles/typography';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CustomBottomModal from './CustomBottomModal';
const SEARCH_DEBOUNCE_MS = 1200;
const MIN_SEARCH_LENGTH = 3;

const LocationModal = forwardRef(({ onClose }, ref) => {
  const { editPincode } = useContext(AppContext);

  const sheetRef = useRef(null);
  const inputRef = useRef(null);
  const focusRafRef = useRef(null);
  useImperativeHandle(
    ref,
    () => ({
      open: () => sheetRef.current?.open(),
      close: () => sheetRef.current?.close(),
    }),
    [],
  );

  const [search, setSearch] = useState('');
  const [effectiveTerm, setEffectiveTerm] = useState('');
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(false);
  // The row the user just tapped, held while editPincode persists it. Gives
  // immediate feedback (spinner on that row) during the write, which can lag
  // on slower devices, and blocks a second tap until it settles.
  const [selectingItem, setSelectingItem] = useState(null);

  const trimmedRawTerm = search.trim();

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

  const debouncedSearch = useDebounce(search, SEARCH_DEBOUNCE_MS);
  useEffect(() => {
    const settled = debouncedSearch.trim();
    if (settled.length >= MIN_SEARCH_LENGTH) setEffectiveTerm(settled);
  }, [debouncedSearch]);

  useEffect(() => {
    if (trimmedRawTerm.length < MIN_SEARCH_LENGTH) setEffectiveTerm('');
  }, [trimmedRawTerm]);

  const submitSearch = useCallback(
    term => {
      const next = (typeof term === 'string' ? term : search).trim();
      if (next.length >= MIN_SEARCH_LENGTH) setEffectiveTerm(next);
    },
    [search],
  );

  useEffect(() => {
    if (effectiveTerm.length >= MIN_SEARCH_LENGTH) {
      runSearch(effectiveTerm);
    } else {
      setAreas([]);
    }
  }, [effectiveTerm, runSearch]);

  const onSelectLocation = useCallback(
    async item => {
      if (selectingItem) return;
      Keyboard.dismiss();
      setSelectingItem(item);
      try {
        await editPincode(item);
        sheetRef.current?.close();
      } finally {
        setSelectingItem(null);
      }
    },
    [editPincode, selectingItem],
  );

  const handleSheetClose = useCallback(() => {
    setSearch('');
    setEffectiveTerm('');
    setAreas([]);
    setSelectingItem(null);
    onClose?.();
  }, [onClose]);

  const isAwaitingDebounce =
    trimmedRawTerm.length >= MIN_SEARCH_LENGTH &&
    trimmedRawTerm !== effectiveTerm;
  const searching = loading || isAwaitingDebounce;

  const noResults =
    effectiveTerm.length >= MIN_SEARCH_LENGTH &&
    !searching &&
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
          ref={inputRef}
          value={search}
          onChangeText={setSearch}
          placeholder="Search location (Please enter at least 3 characters)"
          style={styles.input}
          placeholderTextColor={'#9CA3AF'}
          returnKeyType="search"
          onSubmitEditing={() => submitSearch()}
        />

        {searching ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator color={'#FF7148'} size="large" />
          </View>
        ) : noResults ? (
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
            renderItem={({ item }) => {
              const isSelecting = selectingItem === item;
              return (
                <TouchableOpacity
                  style={styles.item}
                  disabled={!!selectingItem}
                  onPress={() => onSelectLocation(item)}
                >
                  <Text
                    style={[
                      styles.itemText,
                      isSelecting && styles.itemTextActive,
                    ]}
                    numberOfLines={1}
                  >
                    {item.areaName} {item.pincode ? `(${item.pincode})` : ''}
                  </Text>
                  {isSelecting && (
                    <ActivityIndicator
                      size="small"
                      color="#FF7148"
                      style={styles.itemSpinner}
                    />
                  )}
                </TouchableOpacity>
              );
            }}
          />
        )}
      </View>
    ),
    [
      search,
      areas,
      searching,
      noResults,
      submitSearch,
      onSelectLocation,
      selectingItem,
    ],
  );

  const handleSheetSettle = useCallback(index => {
    if (focusRafRef.current != null) {
      cancelAnimationFrame(focusRafRef.current);
      focusRafRef.current = null;
    }
    if (index >= 0) {
      focusRafRef.current = requestAnimationFrame(() => {
        inputRef.current?.focus();
        focusRafRef.current = null;
      });
    }
  }, []);

  // Cancel a pending focus frame if the sheet unmounts before it runs.
  useEffect(
    () => () => {
      if (focusRafRef.current != null) {
        cancelAnimationFrame(focusRafRef.current);
      }
    },
    [],
  );

  return (
    <CustomBottomModal
      ref={sheetRef}
      snapPoints={['50%', '50%']}
      onClose={handleSheetClose}
      onChange={handleSheetSettle}
      renderContent={renderContent}
    />
  );
});

LocationModal.displayName = 'LocationModal';

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
    fontFamily: FONTS.gilroy.semiBold,
    color: '#FF7148',
    flexShrink: 1,
  },
  input: {
    margin: wp('5%'),
    padding: wp('3%'),
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    fontSize: wp('3.2%'),
    fontFamily: FONTS.gilroy.regular,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: wp('4%'),
    paddingLeft: wp('7%'),
    paddingRight: wp('5%'),
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp('10%'),
  },
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: wp('10%'),
  },
  emptyImage: {
    width: wp('40%'),
    height: wp('40%'),
    marginBottom: wp('4%'),
  },
  emptyTitle: {
    fontSize: wp('4%'),
    fontFamily: FONTS.gilroy.semiBold,
    color: '#1A1A1A',
    marginBottom: wp('1.5%'),
  },
  emptySubtitle: {
    fontSize: wp('3.2%'),
    fontFamily: FONTS.gilroy.regular,
    color: '#757575',
    textAlign: 'center',
  },
  itemText: {
    flex: 1,
    fontSize: wp('3.3%'),
    fontFamily: FONTS.gilroy.regular,
    color: '#000000',
  },
  itemTextActive: {
    color: '#FF7148',
    fontFamily: FONTS.gilroy.semiBold,
  },
  itemSpinner: {
    marginLeft: wp('3%'),
  },
});
