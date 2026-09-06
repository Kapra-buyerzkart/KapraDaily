import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { Text, TouchableOpacity } from 'react-native';

jest.mock('../src/context/appContext', () => {
  const React2 = require('react');
  return { AppContext: React2.createContext({}) };
});

const { AppContext } = require('../src/context/appContext');
const KshopeUnavailable = require('../src/kshope/screens/KshopeUnavailable').default;

const renderScreen = logout => {
  let tree;
  act(() => {
    tree = renderer.create(
      <AppContext.Provider value={{ logout }}>
        <KshopeUnavailable />
      </AppContext.Provider>,
    );
  });
  return tree;
};

const labels = tree =>
  tree.root
    .findAllByType(Text)
    .map(node => node.props.children)
    .filter(child => typeof child === 'string');

const pressLabelled = (tree, label) => {
  const button = tree.root
    .findAllByType(TouchableOpacity)
    .find(node => node.findAllByType(Text).some(t => t.props.children === label));
  if (!button) throw new Error(`no pressable labelled "${label}"`);
  act(() => {
    button.props.onPress();
  });
};

test('forces the user out as soon as it mounts', () => {
  const logout = jest.fn();
  renderScreen(logout);
  expect(logout).toHaveBeenCalledWith(true);
  expect(logout).toHaveBeenCalledTimes(1);
});

test('does not force the user out twice on re-render', () => {
  const logout = jest.fn();
  const tree = renderScreen(logout);
  act(() => {
    tree.update(
      <AppContext.Provider value={{ logout }}>
        <KshopeUnavailable />
      </AppContext.Provider>,
    );
  });
  expect(logout).toHaveBeenCalledTimes(1);
});

test('frames the block as an expired session', () => {
  const tree = renderScreen(jest.fn());
  const text = labels(tree).join(' ');
  expect(text).toContain('Your session has expired');
  expect(text).toContain('Please log in again to continue to 48hrs Deals.');
});

test('offers no escape hatch back into the module', () => {
  const tree = renderScreen(jest.fn());
  expect(labels(tree)).not.toContain('Go back');
});

test('keeps a manual retry if the automatic logout did not land', () => {
  const logout = jest.fn();
  const tree = renderScreen(logout);
  logout.mockClear();
  pressLabelled(tree, 'Log in again');
  expect(logout).toHaveBeenCalledWith(true);
});

test('a missing logout handler does not throw', () => {
  expect(() => {
    const tree = renderScreen(undefined);
    pressLabelled(tree, 'Log in again');
  }).not.toThrow();
});
