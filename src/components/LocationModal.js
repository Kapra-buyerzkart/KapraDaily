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
import BallPulse from './BallPulse';
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
        {}
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>Change Delivery Location</Text>
          </View>
          <TouchableOpacity onPress={() => sheetRef.current?.close()}>
            <MaterialIcons name="close" size={wp('5%')} color="#6f6f6fff" />
          </TouchableOpacity>
        </View>

        {}
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
            <BallPulse color={'#0C382E'} size="large" />
          </View>
        ) : noResults ? (
          <View style={styles.emptyState}>
            <MaterialIcons
              name="location-off"
              size={wp('10%')}
              color="#B83A3A"
            />
            <Text style={styles.emptyTitle}>No delivery here yet</Text>
            <Text style={styles.emptySubtitle}>
              We couldn't find a serviceable area matching "{search}".
            </Text>
          </View>
        ) : (
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
                    <BallPulse
                      size="small"
                      color="#0C382E"
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
        focusRafRef.current = null;
        inputRef.current?.focus();
      });
    }
  }, []);

  const handleSheetChange = useCallback(
    index => {
      handleSheetSettle(index);
      if (index === -1) onClose?.();
    },
    [handleSheetSettle, onClose],
  );

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
      snapPoints={['70%']}
      enablePanDownToClose
      onClose={onClose}
      onChange={handleSheetChange}
      renderContent={renderContent}
    />
  );
});

LocationModal.displayName = 'LocationModal';

export default LocationModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: wp('2%'),
    paddingBottom: wp('2%'),
    paddingHorizontal: wp('5%'),
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ECE7DE',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: wp('5.2%'),
    fontFamily: 'CormorantGaramond-SemiBold',
    color: '#12372A',
    flexShrink: 1,
    letterSpacing: -0.2,
  },
  input: {
    margin: wp('5%'),
    padding: wp('3.5%'),
    backgroundColor: '#FAF8F5',
    borderWidth: 1,
    borderColor: '#ECE7DE',
    borderRadius: 14,
    fontSize: wp('3.4%'),
    fontFamily: 'Lexend-Regular',
    color: '#12372A',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: wp('3.5%'),
    paddingLeft: wp('6%'),
    paddingRight: wp('5%'),
    borderBottomWidth: 1,
    borderBottomColor: '#ECE7DE',
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
  emptyTitle: {
    fontSize: wp('4.8%'),
    fontFamily: 'CormorantGaramond-SemiBold',
    color: '#12372A',
    marginTop: wp('2%'),
    marginBottom: wp('1%'),
  },
  emptySubtitle: {
    fontSize: wp('3.2%'),
    fontFamily: 'Lexend-Regular',
    color: '#666666',
    textAlign: 'center',
  },
  itemText: {
    flex: 1,
    fontSize: wp('3.4%'),
    fontFamily: 'Lexend-Regular',
    color: '#12372A',
  },
  itemTextActive: {
    color: '#0C382E',
    fontFamily: 'Lexend-Medium',
  },
  itemSpinner: {
    marginLeft: wp('3%'),
  },
});
