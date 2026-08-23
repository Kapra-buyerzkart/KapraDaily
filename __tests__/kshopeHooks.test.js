import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import { useDebounce } from '../src/kshope/hooks/useDebounce';

jest.mock('../src/kshope/api/services/productService', () => ({
  getProductSuggestionsApi: jest.fn(() => Promise.resolve({ success: true, data: [] })),
  searchProductsApi: jest.fn(() => Promise.resolve({ success: true, data: { items: [], totalCount: 0 } })),
}));

jest.mock('../src/kshope/hooks/useKshopeAreaId', () => ({
  useKshopeAreaId: jest.fn(() => ({ areaId: 207, isResolving: false, refresh: jest.fn() })),
}));

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('does not propagate a value change before the delay elapses', () => {
    const results = [];
    const Probe = ({ value }) => {
      const debounced = useDebounce(value, 500);
      results.push(debounced);
      return null;
    };

    let tree;
    act(() => {
      tree = TestRenderer.create(<Probe value="a" />);
    });

    act(() => {
      tree.update(<Probe value="b" />);
    });

    act(() => {
      jest.advanceTimersByTime(499);
    });

    expect(results[results.length - 1]).toBe('a');
  });

  it('propagates the value once the delay has fully elapsed', () => {
    const Probe = ({ value }) => {
      const debounced = useDebounce(value, 500);
      results.push(debounced);
      return null;
    };
    const results = [];

    let tree;
    act(() => {
      tree = TestRenderer.create(<Probe value="a" />);
    });

    act(() => {
      tree.update(<Probe value="b" />);
    });

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(results[results.length - 1]).toBe('b');
  });

  it('resets the debounce window on a rapid second change', () => {
    const results = [];
    const Probe = ({ value }) => {
      const debounced = useDebounce(value, 500);
      results.push(debounced);
      return null;
    };

    let tree;
    act(() => {
      tree = TestRenderer.create(<Probe value="a" />);
    });

    act(() => {
      tree.update(<Probe value="b" />);
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    act(() => {
      tree.update(<Probe value="c" />);
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(results[results.length - 1]).toBe('a');

    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(results[results.length - 1]).toBe('c');
  });
});

describe('useProductSearch', () => {
  it('never reads the host pincodeAreaId key', () => {
    const fs = require('fs');
    const path = require('path');
    const src = fs.readFileSync(path.join(__dirname, '..', 'src/kshope/hooks/useProductSearch.ts'), 'utf8');
    expect(src).not.toContain("'pincodeAreaId'");
    expect(src).not.toMatch(/getItem\(['"]pincodeAreaId['"]\)/);
    expect(src).toMatch(/useKshopeAreaId/);
  });
});
