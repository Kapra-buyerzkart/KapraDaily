import React, { useState } from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import useVoucherData from '../src/screens/ticketLandingScreen/hooks/useVoucherData';
import useEventsData from '../src/screens/ticketLandingScreen/hooks/useEventsData';

jest.mock('../src/api/voucherService', () => ({
  getVouchersApi: jest.fn(() => Promise.resolve({ data: { items: [] } })),
  getVoucherByIdApi: jest.fn(() => Promise.resolve({ data: null })),
  getVoucherQuoteApi: jest.fn(() => Promise.resolve({ success: false })),
  getMyVouchersApi: jest.fn(() => Promise.resolve({ data: { items: [] } })),
}));

jest.mock('../src/api/userService', () => ({
  getDashboardDataApi: jest.fn(() => Promise.resolve({ data: {} })),
}));

jest.mock('../src/api/eventService', () => ({
  getEventDetailsListApi: jest.fn(() => Promise.resolve({ data: [] })),
  getPopularListApi: jest.fn(() => Promise.resolve({ data: {} })),
  getPopularCategoriesApi: jest.fn(() => Promise.resolve({ data: [] })),
}));

const mountHook = useHook => {
  const results = [];
  let rerender;

  const Probe = () => {
    const [, setTick] = useState(0);
    rerender = () => setTick(t => t + 1);
    results.push(useHook());
    return null;
  };

  let tree;
  act(() => {
    tree = TestRenderer.create(<Probe />);
  });

  return { results, rerender: () => act(() => rerender()), tree };
};

const flush = async () => {
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });
};

describe('landing screen data hooks keep a stable identity', () => {
  it('useVoucherData returns the same object when nothing it owns changed', async () => {
    const { results, rerender } = mountHook(useVoucherData);
    await flush();

    const before = results[results.length - 1];
    rerender();
    const after = results[results.length - 1];

    expect(results.length).toBeGreaterThan(1);
    expect(after).toBe(before);
  });

  it('useEventsData returns the same object when nothing it owns changed', async () => {
    const navigation = { navigate: jest.fn() };
    const { results, rerender } = mountHook(() => useEventsData(navigation));
    await flush();

    const before = results[results.length - 1];
    rerender();
    const after = results[results.length - 1];

    expect(results.length).toBeGreaterThan(1);
    expect(after).toBe(before);
  });
});
