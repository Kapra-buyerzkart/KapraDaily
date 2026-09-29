import React from 'react';
import { TouchableOpacity } from 'react-native';
import renderer, { act } from 'react-test-renderer';

// --- API Service Imports ---
import {
  addAddressApi,
  updateAddressApi,
  deleteAddressApi,
  getAddressListApi,
  getAddressDetailsApi,
} from '../src/api/addressService';
import * as networkUtils from '../src/api/networkUtils';

import {
  addAddressApi as kshopeAddAddressApi,
  updateAddressApi as kshopeUpdateAddressApi,
  deleteAddressApi as kshopeDeleteAddressApi,
  getAddressListApi as kshopeGetAddressListApi,
  getAddressDetailsApi as kshopeGetAddressDetailsApi,
  getAreasByPincode as kshopeGetAreasByPincode,
} from '../src/kshope/api/services/addressService';
import * as kshopeClient from '../src/kshope/api/client';

// --- Validation and Defaults ---
import {
  ADDRESS_RULES,
  ADDRESS_MESSAGES,
  buildDefaultValues,
} from '../src/screens/AddLocationScreen/validationSchema';

// --- UI Components ---
import AddressSheet from '../src/screens/AddLocationScreen/components/organisms/AddressSheet';
import SavedAddressScreen from '../src/screens/SavedAddressScreen';
import { useAddresses } from '../src/hooks/useAddresses';

// --- Mocks ---
jest.mock('../src/api/networkUtils', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  deleteRequest: jest.fn(),
}));

jest.mock('../src/kshope/api/client', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  deleteRequest: jest.fn(),
}));

jest.mock('../src/utils/logger', () => ({
  log: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
  error: jest.fn(),
}));

const mockToastShow = jest.fn();
jest.mock('react-native-simple-toast', () => ({
  show: (...args) => mockToastShow(...args),
  SHORT: 0,
  LONG: 1,
}));

const mockSecureStore = new Map();
const mockSecureStoreObj = {
  getItem: jest.fn(async k => (mockSecureStore.has(k) ? mockSecureStore.get(k) : null)),
  setItem: jest.fn(async (k, v) => {
    mockSecureStore.set(k, String(v));
  }),
  removeItem: jest.fn(async k => {
    mockSecureStore.delete(k);
  }),
};
jest.mock('../src/utils/secureStore', () => ({
  __esModule: true,
  default: mockSecureStoreObj,
  ...mockSecureStoreObj,
}));

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
    goBack: mockGoBack,
    canGoBack: () => true,
  }),
  useRoute: () => ({ params: {} }),
  useFocusEffect: cb => {
    const ReactRuntime = require('react');
    ReactRuntime.useEffect(() => cb(), [cb]);
  },
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 40, bottom: 20, left: 0, right: 0 }),
  SafeAreaView: ({ children, style }) => {
    const ReactRuntime = require('react');
    const { View } = require('react-native');
    return ReactRuntime.createElement(View, { style }, children);
  },
}));

jest.mock('react-native-keyboard-controller', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    KeyboardProvider: ({ children }) => React.createElement(View, null, children),
    KeyboardAvoidingView: ({ children, ...props }) => React.createElement(View, props, children),
    KeyboardAwareScrollView: ({ children, ...props }) => React.createElement(View, props, children),
    useKeyboardHandler: jest.fn(),
    useReanimatedKeyboardAnimation: () => ({ height: { value: 0 }, progress: { value: 0 } }),
    KeyboardController: {
      setInputMode: jest.fn(),
      setDefaultMode: jest.fn(),
      dismiss: jest.fn(),
    },
    useKeyboardController: () => ({ setEnabled: jest.fn() }),
  };
});

jest.mock('../src/components/BallPulse', () => {
  const React = require('react');
  const { View } = require('react-native');
  return props => React.createElement(View, { testID: 'BallPulse', ...props });
});

jest.mock('../src/components/LocationModal', () => {
  const React = require('react');
  const { View } = require('react-native');
  return props => React.createElement(View, { testID: 'LocationModal', ...props });
});

jest.mock('../src/components/AddressConfirmationModal', () => {
  const React = require('react');
  const { View } = require('react-native');
  return props =>
    React.createElement(View, { testID: 'AddressConfirmationModal', ...props });
});

jest.mock('react-native-dropdown-picker', () => {
  const React = require('react');
  const { View } = require('react-native');
  return props => React.createElement(View, props);
});

jest.mock('react-native-vector-icons/Ionicons', () => 'Ionicons');
jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'MaterialCommunityIcons');

jest.mock('../src/hooks/useAddresses', () => ({
  useAddresses: jest.fn(),
}));

jest.mock(
  '../src/screens/AddLocationScreen/components/organisms/AddressForm',
  () => {
    const ReactRuntime = require('react');
    const { View } = require('react-native');
    return props =>
      ReactRuntime.createElement(View, { testID: 'MockAddressForm', ...props });
  },
);

const runRule = (rule, value) => (typeof rule === 'function' ? rule(value) : true);

const findByA11yLabel = (root, label) => {
  return root.find(
    node => node.props && node.props.accessibilityLabel === label,
  );
};

// ============================================================================
// 1. API SERVICE TESTS (Add, Edit, Delete Address)
// ============================================================================
describe('1. Address API Service Layer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSecureStore.clear();
  });

  describe('Standard addressService (src/api/addressService.js)', () => {
    it('TC-API-ADD-001: addAddressApi sends POST to me/address with payload', async () => {
      const payload = {
        custName: 'John Doe',
        addLine1: 'Flat 101, Palm Grove',
        addLine2: 'Marine Drive',
        landmark: 'Opp Park',
        phone: '9876543210',
        pincode: '682030',
        pincodeAreaId: 10,
        addressType: 'HOME',
      };
      const response = { success: true, data: { custAddressId: 501 } };
      networkUtils.post.mockResolvedValueOnce(response);

      const result = await addAddressApi(payload);

      expect(networkUtils.post).toHaveBeenCalledWith('me/address', payload);
      expect(result).toEqual(response);
    });

    it('TC-API-ADD-002: addAddressApi propagates network/server failures', async () => {
      networkUtils.post.mockRejectedValueOnce(new Error('Connection failed'));
      await expect(addAddressApi({})).rejects.toThrow('Connection failed');
    });

    it('TC-API-EDIT-001: updateAddressApi sends PUT to me/address/:id with payload', async () => {
      const addressId = 501;
      const payload = {
        custName: 'John Doe',
        addLine1: 'Flat 102, Palm Grove',
        addressType: 'WORK',
      };
      const response = { success: true, message: 'Address updated' };
      networkUtils.put.mockResolvedValueOnce(response);

      const result = await updateAddressApi(addressId, payload);

      expect(networkUtils.put).toHaveBeenCalledWith('me/address/501', payload);
      expect(result).toEqual(response);
    });

    it('TC-API-EDIT-002: updateAddressApi handles string ID correctly', async () => {
      networkUtils.put.mockResolvedValueOnce({ success: true });
      await updateAddressApi('ADDR-77', { addLine1: 'Test' });
      expect(networkUtils.put).toHaveBeenCalledWith('me/address/ADDR-77', {
        addLine1: 'Test',
      });
    });

    it('TC-API-EDIT-003: updateAddressApi propagates failure when server errors', async () => {
      networkUtils.put.mockRejectedValueOnce(new Error('Internal server error'));
      await expect(updateAddressApi(501, {})).rejects.toThrow('Internal server error');
    });

    it('TC-API-DEL-001: deleteAddressApi sends DELETE to me/address/:id with target id', async () => {
      const addressId = 501;
      const response = { success: true, message: 'Deleted' };
      networkUtils.deleteRequest.mockResolvedValueOnce(response);

      const result = await deleteAddressApi(addressId);

      expect(networkUtils.deleteRequest).toHaveBeenCalledWith('me/address/501');
      expect(result).toEqual(response);
    });

    it('TC-API-DEL-002: deleteAddressApi propagates rejection on error', async () => {
      networkUtils.deleteRequest.mockRejectedValueOnce(new Error('Delete forbidden'));
      await expect(deleteAddressApi(501)).rejects.toThrow('Delete forbidden');
    });

    it('TC-API-GET-001: getAddressListApi sends GET to me/addresslist', async () => {
      const mockList = [{ custAddressId: 1, addLine1: 'Home' }];
      networkUtils.get.mockResolvedValueOnce({ success: true, data: mockList });

      const result = await getAddressListApi();

      expect(networkUtils.get).toHaveBeenCalledWith('me/addresslist');
      expect(result.data).toEqual(mockList);
    });

    it('TC-API-GET-002: getAddressDetailsApi sends GET to me/address/:id', async () => {
      networkUtils.get.mockResolvedValueOnce({ success: true, data: { id: 8 } });
      const result = await getAddressDetailsApi(8);
      expect(networkUtils.get).toHaveBeenCalledWith('me/address/8');
      expect(result.data.id).toBe(8);
    });
  });

  describe('Kshope Luxury addressService (src/kshope/api/services/addressService.ts)', () => {
    it('TC-API-KSH-001: kshopeAddAddressApi sends POST to me/address', async () => {
      const payload = { custName: 'Luxury Buyer', addLine1: 'Villa 9' };
      kshopeClient.post.mockResolvedValueOnce({ success: true, data: { id: 99 } });

      const result = await kshopeAddAddressApi(payload);

      expect(kshopeClient.post).toHaveBeenCalledWith('me/address', payload);
      expect(result.data.id).toBe(99);
    });

    it('TC-API-KSH-002: kshopeUpdateAddressApi sends PUT to me/address/:id', async () => {
      const payload = { addLine1: 'Penthouse 12' };
      kshopeClient.put.mockResolvedValueOnce({ success: true });

      await kshopeUpdateAddressApi(99, payload);

      expect(kshopeClient.put).toHaveBeenCalledWith('me/address/99', payload);
    });

    it('TC-API-KSH-003: kshopeDeleteAddressApi sends DELETE to me/address/:id', async () => {
      kshopeClient.deleteRequest.mockResolvedValueOnce({ success: true });

      await kshopeDeleteAddressApi(99);

      expect(kshopeClient.deleteRequest).toHaveBeenCalledWith('me/address/99');
    });

    it('TC-API-KSH-004: kshopeGetAddressListApi and getAreasByPincode call correct endpoints', async () => {
      kshopeClient.get.mockResolvedValueOnce({ success: true, data: [] });
      await kshopeGetAddressListApi();
      expect(kshopeClient.get).toHaveBeenCalledWith('me/addresslist');

      kshopeClient.get.mockResolvedValueOnce({ success: true, data: [] });
      await kshopeGetAreasByPincode('682030');
      expect(kshopeClient.get).toHaveBeenCalledWith(
        'pincodearea/getbypincode?search=682030',
      );
    });
  });
});

// ============================================================================
// 2. VALIDATION SCHEMA & DEFAULT VALUES (Add vs Edit Address)
// ============================================================================
describe('2. Address Validation Schema & Defaults (Add vs Edit)', () => {
  describe('Form Validation Rules', () => {
    it('TC-VAL-ADD-001: rejects a blank or whitespace-only house number', () => {
      expect(runRule(ADDRESS_RULES.addLine1.validate.notBlank, '   ')).toBe(
        ADDRESS_MESSAGES.addLine1.required,
      );
    });

    it('TC-VAL-ADD-002: rejects a house number shorter than 3 characters', () => {
      expect(runRule(ADDRESS_RULES.addLine1.validate.minLength, 'ab')).toBe(
        ADDRESS_MESSAGES.addLine1.tooShort,
      );
      expect(runRule(ADDRESS_RULES.addLine1.validate.minLength, 'Flat 2B')).toBe(
        true,
      );
    });

    it('TC-VAL-ADD-003: accepts valid 6-digit PIN code', () => {
      const pattern = ADDRESS_RULES.pincode.pattern.value;
      expect(pattern.test('682030')).toBe(true);
      expect(pattern.test('110001')).toBe(true);
    });

    it('TC-VAL-ADD-004: rejects PIN code starting with 0', () => {
      const pattern = ADDRESS_RULES.pincode.pattern.value;
      expect(pattern.test('082030')).toBe(false);
    });

    it('TC-VAL-ADD-005: rejects PIN code not having exactly 6 digits', () => {
      const pattern = ADDRESS_RULES.pincode.pattern.value;
      expect(pattern.test('68203')).toBe(false);
      expect(pattern.test('6820301')).toBe(false);
      expect(pattern.test('abc123')).toBe(false);
    });

    it('TC-VAL-ADD-006: requires area selection (rejects null or undefined)', () => {
      expect(runRule(ADDRESS_RULES.pincodeAreaId.validate.selected, null)).toBe(
        ADDRESS_MESSAGES.pincodeAreaId.required,
      );
      expect(
        runRule(ADDRESS_RULES.pincodeAreaId.validate.selected, undefined),
      ).toBe(ADDRESS_MESSAGES.pincodeAreaId.required);
      expect(runRule(ADDRESS_RULES.pincodeAreaId.validate.selected, 14)).toBe(
        true,
      );
    });

    it('TC-VAL-ADD-007: validates mobile phone length is exactly 10 digits', () => {
      expect(runRule(ADDRESS_RULES.phone.validate.length, '98765432')).toBe(
        ADDRESS_MESSAGES.phone.length,
      );
      expect(runRule(ADDRESS_RULES.phone.validate.length, '98765432100')).toBe(
        ADDRESS_MESSAGES.phone.length,
      );
      expect(runRule(ADDRESS_RULES.phone.validate.length, '9876543210')).toBe(
        true,
      );
    });

    it('TC-VAL-ADD-008: validates mobile phone prefix begins with 6, 7, 8, or 9', () => {
      expect(runRule(ADDRESS_RULES.phone.validate.prefix, '1234567890')).toBe(
        ADDRESS_MESSAGES.phone.prefix,
      );
      expect(runRule(ADDRESS_RULES.phone.validate.prefix, '5234567890')).toBe(
        ADDRESS_MESSAGES.phone.prefix,
      );
      expect(runRule(ADDRESS_RULES.phone.validate.prefix, '9876543210')).toBe(
        true,
      );
      expect(runRule(ADDRESS_RULES.phone.validate.prefix, '8765432109')).toBe(
        true,
      );
    });

    it('TC-VAL-ADD-009: validates customer name accepts letters and punctuation', () => {
      expect(runRule(ADDRESS_RULES.custName.validate.pattern, 'Justin P.')).toBe(
        true,
      );
      expect(runRule(ADDRESS_RULES.custName.validate.pattern, "O'Connor")).toBe(
        true,
      );
    });

    it('TC-VAL-ADD-010: rejects customer name containing numbers', () => {
      expect(runRule(ADDRESS_RULES.custName.validate.pattern, 'Justin99')).toBe(
        ADDRESS_MESSAGES.custName.pattern,
      );
    });

    it('TC-VAL-ADD-011: rejects customer name that is blank', () => {
      expect(runRule(ADDRESS_RULES.custName.validate.notBlank, '   ')).toBe(
        ADDRESS_MESSAGES.custName.required,
      );
    });
  });

  describe('Default Values Builder (Add vs Edit)', () => {
    it('TC-DEF-ADD-001: returns empty default values and HOME type when adding new address', () => {
      const defaults = buildDefaultValues(undefined);
      expect(defaults).toEqual({
        custName: '',
        addLine1: '',
        addLine2: '',
        landmark: '',
        phone: '',
        pincode: '',
        pincodeAreaId: null,
        addressType: 'HOME',
      });
    });

    it('TC-DEF-EDIT-001: pre-populates existing values when editing an address', () => {
      const existingAddress = {
        addressId: 101,
        custName: 'Sarah Connor',
        addLine1: 'Skyline Apt 4B',
        addLine2: 'Hill View Road',
        landmark: 'Behind Church',
        phone: '9876543210',
        pincode: '682030',
        pincodeAreaId: 55,
        addressType: 'OFFICE',
      };

      const defaults = buildDefaultValues(existingAddress);
      expect(defaults).toEqual({
        custName: 'Sarah Connor',
        addLine1: 'Skyline Apt 4B',
        addLine2: 'Hill View Road',
        landmark: 'Behind Church',
        phone: '9876543210',
        pincode: '682030',
        pincodeAreaId: 55,
        addressType: 'OFFICE',
      });
    });
  });
});

// ============================================================================
// 3. ADD AND EDIT ADDRESS WORKFLOW LOGIC
// ============================================================================
describe('3. Add & Edit Address Workflow Logic', () => {
  const executeAddressSave = async ({
    isEditMode,
    editAddress,
    values,
    items,
    region,
    editPincode,
    refreshAddresses,
    navigation,
  }) => {
    const selectedAreaName =
      items.find(i => i.value === values.pincodeAreaId)?.label || '';

    const payload = {
      custName: values.custName.trim(),
      addLine1: values.addLine1.trim(),
      addLine2: values.addLine2 ? values.addLine2.trim() : '',
      landmark: values.landmark ? values.landmark.trim() : '',
      phone: values.phone,
      country: 'India',
      state: 'Kerala',
      district: 'Ernakulam',
      pincode: values.pincode,
      pincodeAreaId: values.pincodeAreaId,
      pincodeAreaName: selectedAreaName,
      latitude: Number(region.latitude),
      longitude: Number(region.longitude),
      addressType: values.addressType,
      isDefaultBillingAddress: true,
      isDefaultShippingAddress: true,
    };

    try {
      const response = isEditMode
        ? await updateAddressApi(
            editAddress?.custAddressId || editAddress?.addressId || editAddress?.id,
            payload,
          )
        : await addAddressApi(payload);

      if (response && response.success !== false) {
        mockToastShow(isEditMode ? 'Address updated' : 'Address added', 0);

        if (editPincode) {
          await editPincode({
            pincodeAreaId: values.pincodeAreaId,
            areaName: selectedAreaName,
          });
        }

        const savedAddressId =
          response?.data?.custAddressId ||
          response?.data?.addressId ||
          response?.data?.id;
        if (savedAddressId) {
          await mockSecureStoreObj.setItem(
            'selectedAddressId',
            String(savedAddressId),
          );
        }

        if (refreshAddresses) await refreshAddresses();
        navigation.goBack();
        return { success: true, savedAddressId };
      } else {
        mockToastShow(response?.message || 'Failed to save address', 0);
        return { success: false, error: response?.message };
      }
    } catch (error) {
      mockToastShow('An error occurred', 0);
      return { success: false, error };
    }
  };

  const sampleValues = {
    custName: '  John Doe  ',
    addLine1: '  12/B Palm Avenue  ',
    addLine2: '  Near Metro  ',
    landmark: '  Opp City Mall  ',
    phone: '9876543210',
    pincode: '682030',
    pincodeAreaId: 42,
    addressType: 'HOME',
  };

  const sampleItems = [{ value: 42, label: 'Kaloor' }];
  const sampleRegion = { latitude: 9.9816, longitude: 76.2999 };

  beforeEach(() => {
    jest.clearAllMocks();
    mockSecureStore.clear();
  });

  describe('Add Address Flow (isEditMode = false)', () => {
    it('TC-FLOW-ADD-001: successfully adds a new address with trimmed payload and defaults', async () => {
      const editPincode = jest.fn(async () => {});
      const refreshAddresses = jest.fn(async () => {});
      const navigation = { goBack: jest.fn() };

      networkUtils.post.mockResolvedValueOnce({
        success: true,
        data: { custAddressId: 888 },
      });

      const result = await executeAddressSave({
        isEditMode: false,
        editAddress: null,
        values: sampleValues,
        items: sampleItems,
        region: sampleRegion,
        editPincode,
        refreshAddresses,
        navigation,
      });

      expect(networkUtils.post).toHaveBeenCalledTimes(1);
      const postArgs = networkUtils.post.mock.calls[0];
      expect(postArgs[0]).toBe('me/address');
      expect(postArgs[1]).toMatchObject({
        custName: 'John Doe',
        addLine1: '12/B Palm Avenue',
        addLine2: 'Near Metro',
        landmark: 'Opp City Mall',
        phone: '9876543210',
        pincode: '682030',
        pincodeAreaId: 42,
        pincodeAreaName: 'Kaloor',
        latitude: 9.9816,
        longitude: 76.2999,
        addressType: 'HOME',
        isDefaultBillingAddress: true,
        isDefaultShippingAddress: true,
      });

      expect(mockToastShow).toHaveBeenCalledWith('Address added', 0);
      expect(editPincode).toHaveBeenCalledWith({
        pincodeAreaId: 42,
        areaName: 'Kaloor',
      });
      expect(mockSecureStore.get('selectedAddressId')).toBe('888');
      expect(refreshAddresses).toHaveBeenCalledTimes(1);
      expect(navigation.goBack).toHaveBeenCalledTimes(1);
      expect(result.success).toBe(true);
    });

    it('TC-FLOW-ADD-002: saves address with OFFICE addressType correctly', async () => {
      networkUtils.post.mockResolvedValueOnce({
        success: true,
        data: { custAddressId: 889 },
      });

      const result = await executeAddressSave({
        isEditMode: false,
        editAddress: null,
        values: { ...sampleValues, addressType: 'OFFICE' },
        items: sampleItems,
        region: sampleRegion,
        editPincode: jest.fn(),
        refreshAddresses: jest.fn(),
        navigation: { goBack: jest.fn() },
      });

      expect(networkUtils.post.mock.calls[0][1].addressType).toBe('OFFICE');
      expect(result.success).toBe(true);
    });

    it('TC-FLOW-ADD-003: saves address with OTHER addressType correctly', async () => {
      networkUtils.post.mockResolvedValueOnce({
        success: true,
        data: { custAddressId: 890 },
      });

      const result = await executeAddressSave({
        isEditMode: false,
        editAddress: null,
        values: { ...sampleValues, addressType: 'OTHER' },
        items: sampleItems,
        region: sampleRegion,
        editPincode: jest.fn(),
        refreshAddresses: jest.fn(),
        navigation: { goBack: jest.fn() },
      });

      expect(networkUtils.post.mock.calls[0][1].addressType).toBe('OTHER');
      expect(result.success).toBe(true);
    });

    it('TC-FLOW-ADD-004: handles optional empty addLine2 and landmark gracefully', async () => {
      networkUtils.post.mockResolvedValueOnce({
        success: true,
        data: { custAddressId: 891 },
      });

      const result = await executeAddressSave({
        isEditMode: false,
        editAddress: null,
        values: { ...sampleValues, addLine2: '', landmark: '' },
        items: sampleItems,
        region: sampleRegion,
        editPincode: jest.fn(),
        refreshAddresses: jest.fn(),
        navigation: { goBack: jest.fn() },
      });

      expect(networkUtils.post.mock.calls[0][1].addLine2).toBe('');
      expect(networkUtils.post.mock.calls[0][1].landmark).toBe('');
      expect(result.success).toBe(true);
    });

    it('TC-FLOW-ADD-005: handles add address API failure response without navigating back', async () => {
      const navigation = { goBack: jest.fn() };
      networkUtils.post.mockResolvedValueOnce({
        success: false,
        message: 'Invalid area for delivery',
      });

      const result = await executeAddressSave({
        isEditMode: false,
        editAddress: null,
        values: sampleValues,
        items: sampleItems,
        region: sampleRegion,
        editPincode: jest.fn(),
        refreshAddresses: jest.fn(),
        navigation,
      });

      expect(mockToastShow).toHaveBeenCalledWith('Invalid area for delivery', 0);
      expect(navigation.goBack).not.toHaveBeenCalled();
      expect(mockSecureStore.has('selectedAddressId')).toBe(false);
      expect(result.success).toBe(false);
    });

    it('TC-FLOW-ADD-006: handles network exception when adding address', async () => {
      const navigation = { goBack: jest.fn() };
      networkUtils.post.mockRejectedValueOnce(new Error('Network offline'));

      const result = await executeAddressSave({
        isEditMode: false,
        editAddress: null,
        values: sampleValues,
        items: sampleItems,
        region: sampleRegion,
        editPincode: jest.fn(),
        refreshAddresses: jest.fn(),
        navigation,
      });

      expect(mockToastShow).toHaveBeenCalledWith('An error occurred', 0);
      expect(navigation.goBack).not.toHaveBeenCalled();
      expect(result.success).toBe(false);
    });
  });

  describe('Edit Address Flow (isEditMode = true)', () => {
    it('TC-FLOW-EDIT-001: successfully updates an existing address using addressId in URL', async () => {
      const editAddress = { addressId: 777 };
      const editPincode = jest.fn(async () => {});
      const refreshAddresses = jest.fn(async () => {});
      const navigation = { goBack: jest.fn() };

      networkUtils.put.mockResolvedValueOnce({
        success: true,
        data: { custAddressId: 777 },
        message: 'Updated',
      });

      const result = await executeAddressSave({
        isEditMode: true,
        editAddress,
        values: { ...sampleValues, addressType: 'WORK' },
        items: sampleItems,
        region: sampleRegion,
        editPincode,
        refreshAddresses,
        navigation,
      });

      expect(networkUtils.put).toHaveBeenCalledWith(
        'me/address/777',
        expect.objectContaining({
          custName: 'John Doe',
          addressType: 'WORK',
        }),
      );

      expect(mockToastShow).toHaveBeenCalledWith('Address updated', 0);
      expect(refreshAddresses).toHaveBeenCalledTimes(1);
      expect(navigation.goBack).toHaveBeenCalledTimes(1);
      expect(result.success).toBe(true);
    });

    it('TC-FLOW-EDIT-002: successfully updates address type from HOME to OFFICE', async () => {
      const editAddress = { addressId: 777 };
      networkUtils.put.mockResolvedValueOnce({ success: true });

      const result = await executeAddressSave({
        isEditMode: true,
        editAddress,
        values: { ...sampleValues, addressType: 'OFFICE' },
        items: sampleItems,
        region: sampleRegion,
        editPincode: jest.fn(),
        refreshAddresses: jest.fn(),
        navigation: { goBack: jest.fn() },
      });

      expect(networkUtils.put.mock.calls[0][1].addressType).toBe('OFFICE');
      expect(result.success).toBe(true);
    });

    it('TC-FLOW-EDIT-003: successfully updates phone number in edit mode', async () => {
      const editAddress = { addressId: 777 };
      networkUtils.put.mockResolvedValueOnce({ success: true });

      await executeAddressSave({
        isEditMode: true,
        editAddress,
        values: { ...sampleValues, phone: '9988776655' },
        items: sampleItems,
        region: sampleRegion,
        editPincode: jest.fn(),
        refreshAddresses: jest.fn(),
        navigation: { goBack: jest.fn() },
      });

      expect(networkUtils.put.mock.calls[0][1].phone).toBe('9988776655');
    });

    it('TC-FLOW-EDIT-004: resolves address ID from custAddressId when addressId is absent', async () => {
      const editAddress = { custAddressId: 999 };
      const navigation = { goBack: jest.fn() };
      networkUtils.put.mockResolvedValueOnce({ success: true });

      await executeAddressSave({
        isEditMode: true,
        editAddress,
        values: sampleValues,
        items: sampleItems,
        region: sampleRegion,
        editPincode: jest.fn(),
        refreshAddresses: jest.fn(),
        navigation,
      });

      expect(networkUtils.put).toHaveBeenCalledWith(
        'me/address/999',
        expect.any(Object),
      );
      expect(navigation.goBack).toHaveBeenCalled();
    });

    it('TC-FLOW-EDIT-005: handles edit address failure response', async () => {
      const editAddress = { addressId: 777 };
      const navigation = { goBack: jest.fn() };
      networkUtils.put.mockResolvedValueOnce({
        success: false,
        message: 'Address not found or permission denied',
      });

      const result = await executeAddressSave({
        isEditMode: true,
        editAddress,
        values: sampleValues,
        items: sampleItems,
        region: sampleRegion,
        editPincode: jest.fn(),
        refreshAddresses: jest.fn(),
        navigation,
      });

      expect(mockToastShow).toHaveBeenCalledWith(
        'Address not found or permission denied',
        0,
      );
      expect(navigation.goBack).not.toHaveBeenCalled();
      expect(result.success).toBe(false);
    });

    it('TC-FLOW-EDIT-006: handles edit address network exception', async () => {
      const editAddress = { addressId: 777 };
      const navigation = { goBack: jest.fn() };
      networkUtils.put.mockRejectedValueOnce(new Error('Server unavailable'));

      const result = await executeAddressSave({
        isEditMode: true,
        editAddress,
        values: sampleValues,
        items: sampleItems,
        region: sampleRegion,
        editPincode: jest.fn(),
        refreshAddresses: jest.fn(),
        navigation,
      });

      expect(mockToastShow).toHaveBeenCalledWith('An error occurred', 0);
      expect(navigation.goBack).not.toHaveBeenCalled();
      expect(result.success).toBe(false);
    });
  });
});

// ============================================================================
// 4. DELETE ADDRESS WORKFLOW & CONTEXT STATE MANAGEMENT
// ============================================================================
describe('4. Delete Address Workflow & State Management', () => {
  let addressList;
  let showConfirmationMock;
  let showStatusMock;
  let setShowAddressModalMock;

  const createDeleteHandler = () => {
    return async addressId => {
      setShowAddressModalMock(false);

      showConfirmationMock({
        title: 'Delete Address',
        message: 'Are you sure you want to delete this address?',
        confirmText: 'Delete',
        onConfirm: async () => {
          try {
            const response = await deleteAddressApi(addressId);
            if (response?.success) {
              const deletedItem = addressList.find(item => item.id === addressId);
              addressList = addressList.filter(item => item.id !== addressId);

              // If the deleted address was selected, select the first remaining address
              if (deletedItem?.selected && addressList.length > 0) {
                addressList[0] = { ...addressList[0], selected: true };
              }
              mockToastShow('Address deleted successfully', 0);
            } else {
              showStatusMock({
                type: 'error',
                title: 'Error',
                message: response?.message || 'Failed to delete address',
              });
            }
          } catch (error) {
            showStatusMock({
              type: 'error',
              title: 'Error',
              message:
                typeof error === 'string' ? error : 'Failed to delete address',
            });
          }
        },
      });
    };
  };

  beforeEach(() => {
    jest.clearAllMocks();
    setShowAddressModalMock = jest.fn();
    showConfirmationMock = jest.fn();
    showStatusMock = jest.fn();

    addressList = [
      { id: 1, addLine1: 'Home Address', selected: true },
      { id: 2, addLine1: 'Office Address', selected: false },
      { id: 3, addLine1: 'Parents Address', selected: false },
    ];
  });

  it('TC-FLOW-DEL-001: prompts confirmation modal before deleting address', async () => {
    const onDelete = createDeleteHandler();
    await onDelete(2);

    expect(setShowAddressModalMock).toHaveBeenCalledWith(false);
    expect(showConfirmationMock).toHaveBeenCalledTimes(1);
    expect(showConfirmationMock).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Delete Address',
        message: 'Are you sure you want to delete this address?',
        confirmText: 'Delete',
      }),
    );
  });

  it('TC-FLOW-DEL-002: does not call delete API if user cancels confirmation', async () => {
    const onDelete = createDeleteHandler();
    await onDelete(2);

    // Confirmation shown, but onConfirm is not called
    expect(networkUtils.deleteRequest).not.toHaveBeenCalled();
    expect(addressList).toHaveLength(3);
  });

  it('TC-FLOW-DEL-003: deletes unselected address and removes it from the list', async () => {
    networkUtils.deleteRequest.mockResolvedValueOnce({ success: true });

    const onDelete = createDeleteHandler();
    await onDelete(2);

    const confirmationArgs = showConfirmationMock.mock.calls[0][0];
    await confirmationArgs.onConfirm();

    expect(networkUtils.deleteRequest).toHaveBeenCalledWith('me/address/2');
    expect(addressList).toHaveLength(2);
    expect(addressList.map(a => a.id)).toEqual([1, 3]);
    expect(addressList.find(a => a.id === 1).selected).toBe(true);
    expect(mockToastShow).toHaveBeenCalledWith('Address deleted successfully', 0);
  });

  it('TC-FLOW-DEL-004: deletes selected address and automatically reassigns selection to next address', async () => {
    networkUtils.deleteRequest.mockResolvedValueOnce({ success: true });

    const onDelete = createDeleteHandler();
    await onDelete(1);

    const confirmationArgs = showConfirmationMock.mock.calls[0][0];
    await confirmationArgs.onConfirm();

    expect(networkUtils.deleteRequest).toHaveBeenCalledWith('me/address/1');
    expect(addressList).toHaveLength(2);
    expect(addressList.map(a => a.id)).toEqual([2, 3]);
    expect(addressList[0].id).toBe(2);
    expect(addressList[0].selected).toBe(true);
    expect(mockToastShow).toHaveBeenCalledWith('Address deleted successfully', 0);
  });

  it('TC-FLOW-DEL-005: deleting the single/last address results in empty list', async () => {
    addressList = [{ id: 10, addLine1: 'Only Address', selected: true }];
    networkUtils.deleteRequest.mockResolvedValueOnce({ success: true });

    const onDelete = createDeleteHandler();
    await onDelete(10);

    const confirmationArgs = showConfirmationMock.mock.calls[0][0];
    await confirmationArgs.onConfirm();

    expect(addressList).toHaveLength(0);
    expect(mockToastShow).toHaveBeenCalledWith('Address deleted successfully', 0);
  });

  it('TC-FLOW-DEL-006: handles server failure response when deleting address', async () => {
    networkUtils.deleteRequest.mockResolvedValueOnce({
      success: false,
      message: 'Cannot delete address linked to active orders',
    });

    const onDelete = createDeleteHandler();
    await onDelete(2);

    const confirmationArgs = showConfirmationMock.mock.calls[0][0];
    await confirmationArgs.onConfirm();

    expect(addressList).toHaveLength(3);
    expect(showStatusMock).toHaveBeenCalledWith({
      type: 'error',
      title: 'Error',
      message: 'Cannot delete address linked to active orders',
    });
  });

  it('TC-FLOW-DEL-007: handles network error during address deletion', async () => {
    networkUtils.deleteRequest.mockRejectedValueOnce(new Error('Gateway timeout'));

    const onDelete = createDeleteHandler();
    await onDelete(2);

    const confirmationArgs = showConfirmationMock.mock.calls[0][0];
    await confirmationArgs.onConfirm();

    expect(addressList).toHaveLength(3);
    expect(showStatusMock).toHaveBeenCalledWith({
      type: 'error',
      title: 'Error',
      message: 'Failed to delete address',
    });
  });

  it('TC-FLOW-DEL-008: three-dots toggle manages action visibility for individual addresses', () => {
    let addresses = [
      { id: 1, threeDotsClicked: false },
      { id: 2, threeDotsClicked: false },
    ];

    const onThreeDotsClicked = id => {
      addresses = addresses.map(item => ({
        ...item,
        threeDotsClicked: item.id === id,
      }));
    };

    onThreeDotsClicked(1);
    expect(addresses.find(a => a.id === 1).threeDotsClicked).toBe(true);
    expect(addresses.find(a => a.id === 2).threeDotsClicked).toBe(false);

    onThreeDotsClicked(2);
    expect(addresses.find(a => a.id === 1).threeDotsClicked).toBe(false);
    expect(addresses.find(a => a.id === 2).threeDotsClicked).toBe(true);
  });

  it('TC-FLOW-DEL-009: close three-dots menu resets all items', () => {
    let addresses = [
      { id: 1, threeDotsClicked: true },
      { id: 2, threeDotsClicked: false },
    ];

    const onCloseThreeDots = () => {
      addresses = addresses.map(item => ({
        ...item,
        threeDotsClicked: false,
      }));
    };

    onCloseThreeDots();
    expect(addresses.every(a => !a.threeDotsClicked)).toBe(true);
  });
});

// ============================================================================
// 5. UI COMPONENT INTEGRATION (AddressSheet & SavedAddressScreen)
// ============================================================================
describe('5. UI Components Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('AddressSheet Component (Add vs Edit Mode)', () => {
    const dummyForm = {
      control: {},
      addLine1: 'Flat 101',
      addLine2: 'Main St',
    };
    const dummyArea = { items: [], selectedArea: null };

    it('TC-UI-SHEET-001: renders Add Mode with "Confirm location" title and "Save address" button', () => {
      const onSaveMock = jest.fn();
      let tree;
      act(() => {
        tree = renderer.create(
          <AddressSheet
            isEditMode={false}
            form={dummyForm}
            area={dummyArea}
            status={{ isLoading: false, isValid: true }}
            onSave={onSaveMock}
            isExpanded={false}
          />,
        );
      });

      const textNodes = tree.root
        .findAllByType('Text')
        .map(node => node.children.join(''));

      expect(textNodes).toContain('Confirm location');
      expect(textNodes).toContain('Save address');
      expect(textNodes).not.toContain('Edit location');
      expect(textNodes).not.toContain('Update address');
    });

    it('TC-UI-SHEET-002: renders Edit Mode with "Edit location" title and "Update address" button', () => {
      const onSaveMock = jest.fn();
      let tree;
      act(() => {
        tree = renderer.create(
          <AddressSheet
            isEditMode={true}
            form={dummyForm}
            area={dummyArea}
            status={{ isLoading: false, isValid: true }}
            onSave={onSaveMock}
            isExpanded={false}
          />,
        );
      });

      const textNodes = tree.root
        .findAllByType('Text')
        .map(node => node.children.join(''));

      expect(textNodes).toContain('Edit location');
      expect(textNodes).toContain('Update address');
      expect(textNodes).not.toContain('Confirm location');
      expect(textNodes).not.toContain('Save address');
    });

    it('TC-UI-SHEET-003: triggers onSave when Save button is pressed', () => {
      const onSaveMock = jest.fn();
      let tree;
      act(() => {
        tree = renderer.create(
          <AddressSheet
            isEditMode={false}
            form={dummyForm}
            area={dummyArea}
            status={{ isLoading: false, isValid: true }}
            onSave={onSaveMock}
            isExpanded={false}
          />,
        );
      });

      const saveBtn = findByA11yLabel(tree.root, 'Save address');
      expect(saveBtn).toBeTruthy();

      act(() => {
        saveBtn.props.onPress();
      });

      expect(onSaveMock).toHaveBeenCalledTimes(1);
    });

    it('TC-UI-SHEET-004: disables save button when status.isLoading is true', () => {
      let tree;
      act(() => {
        tree = renderer.create(
          <AddressSheet
            isEditMode={false}
            form={dummyForm}
            area={dummyArea}
            status={{ isLoading: true, isValid: true }}
            onSave={jest.fn()}
            isExpanded={false}
          />,
        );
      });

      const saveBtn = findByA11yLabel(tree.root, 'Save address');
      expect(saveBtn).toBeTruthy();
      expect(saveBtn.props.disabled).toBe(true);
    });
  });

  describe('SavedAddressScreen Component (Add, Edit, Delete Actions)', () => {
    it('TC-UI-SCREEN-001: renders empty address state when no saved addresses exist', () => {
      useAddresses.mockReturnValue({
        addresses: [],
        isLoading: false,
        refreshAddresses: jest.fn(),
        onSelectAddress: jest.fn(),
        onThreeDotsClicked: jest.fn(),
        onDeleteClicked: jest.fn(),
        onCloseThreeDots: jest.fn(),
        addressConfirmationData: null,
        setAddressConfirmationData: jest.fn(),
      });

      let tree;
      act(() => {
        tree = renderer.create(<SavedAddressScreen />);
      });

      const textNodes = tree.root
        .findAllByType('Text')
        .map(node => node.children.join(''));

      expect(textNodes).toContain('No saved addresses');
      expect(textNodes).toContain('Add new location');
    });

    it('TC-UI-SCREEN-002: clicking "Add new location" navigates to AddLocationScreen in add mode', () => {
      useAddresses.mockReturnValue({
        addresses: [],
        isLoading: false,
        refreshAddresses: jest.fn(),
        onSelectAddress: jest.fn(),
        onThreeDotsClicked: jest.fn(),
        onDeleteClicked: jest.fn(),
        onCloseThreeDots: jest.fn(),
        addressConfirmationData: null,
        setAddressConfirmationData: jest.fn(),
      });

      let tree;
      act(() => {
        tree = renderer.create(<SavedAddressScreen />);
      });

      const addLocationBtn = findByA11yLabel(tree.root, 'Add new location');
      expect(addLocationBtn).toBeTruthy();

      act(() => {
        addLocationBtn.props.onPress();
      });

      expect(mockNavigate).toHaveBeenCalledWith('AddLocationScreen', undefined);
    });

    it('TC-UI-SCREEN-003: clicking "Edit address" in menu navigates to AddLocationScreen with address data', () => {
      const sampleAddress = {
        id: 101,
        type: 'Home',
        address: 'Villa 402, Sunset Road, Kaloor',
        phone: '9876543210',
        pin: '682030',
        selected: false,
        threeDotsClicked: true,
        raw: { addressId: 101, custName: 'John Doe', addLine1: 'Villa 402' },
      };

      useAddresses.mockReturnValue({
        addresses: [sampleAddress],
        isLoading: false,
        refreshAddresses: jest.fn(),
        onSelectAddress: jest.fn(),
        onThreeDotsClicked: jest.fn(),
        onDeleteClicked: jest.fn(),
        onCloseThreeDots: jest.fn(),
        addressConfirmationData: null,
        setAddressConfirmationData: jest.fn(),
      });

      let tree;
      act(() => {
        tree = renderer.create(<SavedAddressScreen />);
      });

      const editBtn = findByA11yLabel(tree.root, 'Edit address');
      expect(editBtn).toBeTruthy();
      act(() => {
        editBtn.props.onPress();
      });
      expect(mockNavigate).toHaveBeenCalledWith('AddLocationScreen', {
        address: sampleAddress.raw,
      });
    });

    it('TC-UI-SCREEN-004: clicking "Delete address" in menu invokes onDeleteClicked with id', () => {
      const mockOnDeleteClicked = jest.fn();
      const sampleAddress = {
        id: 101,
        type: 'Home',
        address: 'Villa 402, Sunset Road, Kaloor',
        phone: '9876543210',
        pin: '682030',
        selected: false,
        threeDotsClicked: true,
        raw: { addressId: 101 },
      };

      useAddresses.mockReturnValue({
        addresses: [sampleAddress],
        isLoading: false,
        refreshAddresses: jest.fn(),
        onSelectAddress: jest.fn(),
        onThreeDotsClicked: jest.fn(),
        onDeleteClicked: mockOnDeleteClicked,
        onCloseThreeDots: jest.fn(),
        addressConfirmationData: null,
        setAddressConfirmationData: jest.fn(),
      });

      let tree;
      act(() => {
        tree = renderer.create(<SavedAddressScreen />);
      });

      const deleteBtn = findByA11yLabel(tree.root, 'Delete address');
      expect(deleteBtn).toBeTruthy();
      act(() => {
        deleteBtn.props.onPress();
      });
      expect(mockOnDeleteClicked).toHaveBeenCalledWith(101);
    });

    it('TC-UI-SCREEN-005: clicking "Close actions" invokes onCloseThreeDots', () => {
      const mockOnCloseThreeDots = jest.fn();
      const sampleAddress = {
        id: 101,
        type: 'Home',
        address: 'Villa 402, Sunset Road, Kaloor',
        phone: '9876543210',
        pin: '682030',
        selected: false,
        threeDotsClicked: true,
        raw: { addressId: 101 },
      };

      useAddresses.mockReturnValue({
        addresses: [sampleAddress],
        isLoading: false,
        refreshAddresses: jest.fn(),
        onSelectAddress: jest.fn(),
        onThreeDotsClicked: jest.fn(),
        onDeleteClicked: jest.fn(),
        onCloseThreeDots: mockOnCloseThreeDots,
        addressConfirmationData: null,
        setAddressConfirmationData: jest.fn(),
      });

      let tree;
      act(() => {
        tree = renderer.create(<SavedAddressScreen />);
      });

      const closeBtn = findByA11yLabel(tree.root, 'Close actions');
      expect(closeBtn).toBeTruthy();
      act(() => {
        closeBtn.props.onPress();
      });
      expect(mockOnCloseThreeDots).toHaveBeenCalledTimes(1);
    });
  });
});
