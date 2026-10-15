const React = require('react');
const { View } = require('react-native');

const BottomSheetModal = React.forwardRef((props, ref) => {
  const [isOpen, setIsOpen] = React.useState(false);
  React.useImperativeHandle(ref, () => ({
    present: jest.fn(() => setIsOpen(true)),
    dismiss: jest.fn(() => setIsOpen(false)),
    snapToIndex: jest.fn(),
    expand: jest.fn(),
    collapse: jest.fn(),
  }));
  return isOpen && props.children ? React.createElement(View, props, props.children) : null;
});

const BottomSheet = React.forwardRef((props, ref) => {
  React.useImperativeHandle(ref, () => ({
    snapToIndex: jest.fn(),
    expand: jest.fn(),
    collapse: jest.fn(),
  }));
  return props.children ? React.createElement(View, props, props.children) : null;
});

const BottomSheetView = props => React.createElement(View, props, props.children);
const BottomSheetBackdrop = props => React.createElement(View, props, props.children);
const BottomSheetModalProvider = ({ children }) => React.createElement(View, null, children);

module.exports = {
  __esModule: true,
  default: BottomSheet,
  BottomSheet,
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetModalProvider,
  useBottomSheet: () => ({
    expand: jest.fn(),
    collapse: jest.fn(),
    snapToIndex: jest.fn(),
  }),
  useBottomSheetModal: () => ({
    present: jest.fn(),
    dismiss: jest.fn(),
  }),
};
