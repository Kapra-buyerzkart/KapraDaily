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

// Matches the reworked product search: typing settles for this long before an
// automatic ("live fallback") search fires; pressing return / search fires now.
const SEARCH_DEBOUNCE_MS = 1200;
const MIN_SEARCH_LENGTH = 3;

const LocationModal = forwardRef(({ onClose }, ref) => {
  const { editPincode } = useContext(AppContext);

  const sheetRef = useRef(null);
  const inputRef = useRef(null);
  const focusRafRef = useRef(null);

  // Imperative open/close so the parent controls visibility through this
  // ref instead of a `visible` boolean. The sheet stays mounted; a tap just
  // presents it, avoiding a Home re-render + full remount on every open.
  useImperativeHandle(
    ref,
    () => ({
      open: () => sheetRef.current?.open(),
      close: () => sheetRef.current?.close(),
    }),
    [],
  );

  const [search, setSearch] = useState('');
  // The term actually handed to getAreasBySearch. Unlike `search` (which updates
  // on every keystroke) this only advances when the user submits, or — as a
  // fallback — after they've stopped typing for a while. That's what keeps
  // partial words from each firing their own request.
  const [effectiveTerm, setEffectiveTerm] = useState('');
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(false);

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

  // Live fallback: once typing has settled for this long, search automatically
  // even if the user never pressed the return key / tapped the search icon.
  const debouncedSearch = useDebounce(search, SEARCH_DEBOUNCE_MS);
  useEffect(() => {
    const settled = debouncedSearch.trim();
    if (settled.length >= MIN_SEARCH_LENGTH) setEffectiveTerm(settled);
  }, [debouncedSearch]);

  // Backspacing/clearing below the searchable length instantly drops the
  // results instead of lingering on the last search.
  useEffect(() => {
    if (trimmedRawTerm.length < MIN_SEARCH_LENGTH) setEffectiveTerm('');
  }, [trimmedRawTerm]);

  // Fire a search right now for the current (or an explicitly provided) term,
  // bypassing the debounce — used by the return key / search submit.
  const submitSearch = useCallback(
    term => {
      const next = (typeof term === 'string' ? term : search).trim();
      if (next.length >= MIN_SEARCH_LENGTH) setEffectiveTerm(next);
    },
    [search],
  );

  // The only place a request is actually issued: whenever the effective
  // (settled or submitted) term changes. An empty term clears the list.
  useEffect(() => {
    if (effectiveTerm.length >= MIN_SEARCH_LENGTH) {
      runSearch(effectiveTerm);
    } else {
      setAreas([]);
    }
  }, [effectiveTerm, runSearch]);

  const onSelectLocation = useCallback(
    async item => {
      Keyboard.dismiss();
      await editPincode(item);
      sheetRef.current?.close();
    },
    [editPincode],
  );

  // Fired by CustomBottomModal on backdrop tap / pan-down-to-close / Android
  // back. Resets the search state and lets the parent react if it passed an
  // optional onClose (no longer required now that visibility is ref-driven).
  const handleSheetClose = useCallback(() => {
    setSearch('');
    setEffectiveTerm('');
    setAreas([]);
    onClose?.();
  }, [onClose]);

  // Based on the term a search actually ran for, not on keystrokes — so the
  // empty state never flashes while the user is still typing.
  const noResults =
    effectiveTerm.length >= MIN_SEARCH_LENGTH &&
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
          ref={inputRef}
          value={search}
          onChangeText={setSearch}
          placeholder="Search location (Please enter at least 3 characters)"
          style={styles.input}
          placeholderTextColor={'#9CA3AF'}
          returnKeyType="search"
          onSubmitEditing={() => submitSearch()}
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
    [search, areas, loading, noResults, submitSearch, onSelectLocation],
  );

  // Defer the keyboard until the sheet has actually settled open (index >= 0),
  // so the focus/keyboard animation doesn't fight the slide-in and cause the
  // open to feel janky. Replaces the old autoFocus on the input. The extra
  // requestAnimationFrame nudges focus to the next frame after settle —
  // Android is sensitive to focusing mid-animation and can otherwise drop or
  // delay the keyboard.
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
    fontSize: wp('3.3%'),
    fontFamily: FONTS.gilroy.regular,
    color: '#000000',
  },
});
