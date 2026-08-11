import React, { useState } from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import useResolvedAreaId from '../src/queries/useResolvedAreaId';

var mockStorage = { defer: false, pending: [], areaId: null };

jest.mock('../src/utils/secureStore', () => ({
  getItem: jest.fn(
    () =>
      new Promise(resolve => {
        if (mockStorage.defer) {
          mockStorage.pending.push(() => resolve(mockStorage.areaId));
          return;
        }
        resolve(mockStorage.areaId);
      }),
  ),
}));

const flushStorage = async () => {
  await act(async () => {
    mockStorage.pending.splice(0).forEach(resolve => resolve());
  });
};

const mountHook = initialPincode => {
  const results = [];
  let setPincode;

  const Probe = () => {
    const [pincode, set] = useState(initialPincode);
    setPincode = set;
    results.push(useResolvedAreaId(pincode));
    return null;
  };

  let tree;
  act(() => {
    tree = TestRenderer.create(<Probe />);
  });

  return {
    results,
    latest: () => results[results.length - 1],
    setPincode: next => act(() => setPincode(next)),
    unmount: () => act(() => tree.unmount()),
  };
};

beforeEach(() => {
  mockStorage.defer = true;
  mockStorage.pending = [];
  mockStorage.areaId = null;
  jest.clearAllMocks();
});

describe('useResolvedAreaId', () => {
  it('resolves a hydrated profile on the very first render, without waiting on storage', () => {
    const hook = mountHook(42);

    expect(hook.results[0]).toEqual({ areaId: 42, isResolvingArea: false });
  });

  it('switches area in the same commit as the profile, never reporting the old one after', () => {
    mockStorage.areaId = '42';
    const hook = mountHook(42);

    hook.setPincode(77);

    expect(hook.latest().areaId).toBe(77);
    const areaIdsAfterSwitch = hook.results
      .slice(hook.results.findIndex(r => r.areaId === 77))
      .map(r => r.areaId);
    expect(areaIdsAfterSwitch.every(id => id === 77)).toBe(true);
  });

  it('ignores a stale stored area id once the profile has one', async () => {
    mockStorage.areaId = '42';
    const hook = mountHook(77);

    await flushStorage();

    expect(hook.latest().areaId).toBe(77);
  });

  it('bootstraps from storage while the profile has not hydrated', async () => {
    mockStorage.areaId = '42';
    const hook = mountHook(undefined);

    expect(hook.latest()).toEqual({ areaId: undefined, isResolvingArea: true });

    await flushStorage();

    expect(hook.latest()).toEqual({ areaId: 42, isResolvingArea: false });
  });

  it('stops resolving when storage holds no area either, so the query is not left disabled forever', async () => {
    mockStorage.areaId = null;
    const hook = mountHook(undefined);

    await flushStorage();

    expect(hook.latest()).toEqual({
      areaId: undefined,
      isResolvingArea: false,
    });
  });

  it('normalises a string area id so it shares a cache key with the numeric one', () => {
    const hook = mountHook('42');

    expect(hook.latest().areaId).toBe(42);
  });

  it('falls back to storage when the profile carries an unusable area id', async () => {
    mockStorage.areaId = '42';
    const hook = mountHook('');

    await flushStorage();

    expect(hook.latest().areaId).toBe(42);
  });

  it('reads storage once per mount, not once per store switch', () => {
    const secureStore = require('../src/utils/secureStore');
    mockStorage.areaId = '42';
    const hook = mountHook(42);

    hook.setPincode(77);
    hook.setPincode(91);

    expect(secureStore.getItem).toHaveBeenCalledTimes(1);
  });

  it('does not set state from a storage read that lands after unmount', async () => {
    mockStorage.areaId = '42';
    const hook = mountHook(undefined);

    hook.unmount();
    const warn = jest.spyOn(console, 'error').mockImplementation(() => {});
    await flushStorage();

    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
  });
});
