import React, { createRef } from 'react';
import renderer, { act } from 'react-test-renderer';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn(async (key: string) => store[key] || null),
    setItem: jest.fn(async (key: string, value: any) => {
      store[key] = String(value);
    }),
    removeItem: jest.fn(async (key: string) => {
      delete store[key];
    }),
    clear: jest.fn(async () => {
      store = {};
    }),
  };
});

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 40, bottom: 20, left: 0, right: 0 }),
  SafeAreaProvider: ({ children }: any) => children,
}));

import HomeWheelBottomSheetModal, {
  HomeWheelBottomSheetModalRef,
} from '../src/components/HomeWheelBottomSheetModal';
import * as spinWheelService from '../src/api/spinWheelService';

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const React = require('react');
  const View = require('react-native').View;
  return {
    __esModule: true,
    default: {
      View: View,
    },
    useSharedValue: (init: any) => ({ value: init }),
    useAnimatedStyle: (fn: any) => fn(),
    withTiming: (toValue: any, _config: any, callback: any) => {
      callback?.(true);
      return toValue;
    },
    withSpring: (toValue: any) => toValue,
    withSequence: (...args: any[]) => args[0],
    withRepeat: (anim: any) => anim,
    Easing: {
      linear: (t: any) => t,
      sin: (t: any) => t,
      inOut: (fn: any) => fn,
      bezier: () => (t: any) => t,
    },
    runOnJS: (fn: any) => fn,
  };
});

// Mock @gorhom/bottom-sheet
const mockPresent = jest.fn();
const mockDismiss = jest.fn();

jest.mock('@gorhom/bottom-sheet', () => {
  const React = require('react');
  const View = require('react-native').View;
  const BottomSheetModal = React.forwardRef(({ children, onDismiss }: any, ref: any) => {
    React.useImperativeHandle(ref, () => ({
      present: mockPresent,
      dismiss: () => {
        mockDismiss();
        onDismiss?.();
      },
    }));
    return <View testID="bottom-sheet-modal">{children}</View>;
  });

  return {
    BottomSheetModal,
    BottomSheetView: ({ children, style }: any) => <View style={style}>{children}</View>,
    BottomSheetBackdrop: () => null,
  };
});

// Mock haptics
jest.mock('../src/utils/haptics', () => ({
  selectionTick: jest.fn(),
  impactTick: jest.fn(),
  successTick: jest.fn(),
}));

// Mock SimpleToast
jest.mock('react-native-simple-toast', () => ({
  show: jest.fn(),
  SHORT: 1,
}));

// Mock Clipboard
jest.mock('@react-native-clipboard/clipboard', () => ({
  setString: jest.fn(),
}));

const extractAllText = (node: any): string[] => {
  if (!node) return [];
  if (typeof node === 'string') return [node];
  if (Array.isArray(node)) {
    return node.flatMap(child => extractAllText(child));
  }
  if (node.children) {
    return extractAllText(node.children);
  }
  return [];
};

describe('HomeWheelBottomSheetModal Component', () => {
  const sampleVisibilityDataWith4Rewards = {
    campaignId: 2,
    campaignName: 'FREE EARBUDS',
    description: 'Chance to win a earbud daily',
    requestId: 'req-dyn-1234',
    items: [
      {
        campaignId: 2,
        campaignName: 'FREE EARBUDS',
        rewards: [
          {
            campaignItemId: 101,
            rewardId: 101,
            rewardName: 'Free Earbuds Pro',
            rewardType: 'Product',
            code: 'EARBUDSFREE',
            displayText: 'FREE BUDS',
            description: 'Free high-definition earbuds',
          },
          {
            campaignItemId: 102,
            rewardId: 102,
            rewardName: 'Flat ₹100 Off',
            rewardType: 'Coupon',
            code: 'SAVE100',
            displayText: '₹100 OFF',
            description: 'Flat ₹100 off on cart',
          },
          {
            campaignItemId: 103,
            rewardId: 103,
            rewardName: 'Free Delivery',
            rewardType: 'FreeDelivery',
            code: 'FREEDEL',
            displayText: 'FREE DEL',
            description: 'Free home delivery',
          },
          {
            campaignItemId: 104,
            rewardId: 104,
            rewardName: '50 UD Coins',
            rewardType: 'BCoin',
            code: 'COINS50',
            displayText: '50 COINS',
            description: '50 coins added to wallet',
          },
        ],
      },
    ],
  };

  const sampleVisibilityDataWith2Rewards = {
    campaignId: 2,
    rewards: [
      { rewardId: 1, rewardName: 'Prize 1' },
      { rewardId: 2, rewardName: 'Prize 2' },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('strictly refuses to present if backend rewards count < 3 and invokes onDismiss', () => {
    const onDismissMock = jest.fn();
    const modalRef = createRef<HomeWheelBottomSheetModalRef>();

    act(() => {
      renderer.create(
        <HomeWheelBottomSheetModal
          ref={modalRef}
          visibilityData={sampleVisibilityDataWith2Rewards}
          onDismiss={onDismissMock}
        />,
      );
    });

    act(() => {
      modalRef.current?.present();
    });

    expect(mockPresent).not.toHaveBeenCalled();
    expect(onDismissMock).toHaveBeenCalledTimes(1);
  });

  it('renders design elements when backend rewards >= 3 and presents via ref', () => {
    const onDismissMock = jest.fn();
    const modalRef = createRef<HomeWheelBottomSheetModalRef>();

    let component: any;
    act(() => {
      component = renderer.create(
        <HomeWheelBottomSheetModal
          ref={modalRef}
          visibilityData={sampleVisibilityDataWith4Rewards}
          onDismiss={onDismissMock}
        />,
      );
    });

    const texts = extractAllText(component.toJSON());
    expect(texts.join(' ')).toContain('FREE EARBUDS');
    expect(texts.join(' ')).toContain('Chance to win a earbud daily');
    expect(texts.join(' ')).toContain('SPIN NOW');

    act(() => {
      modalRef.current?.present();
      jest.advanceTimersByTime(50);
    });

    expect(mockPresent).toHaveBeenCalled();
  });

  it('spins the wheel, calls playHomeWheelApi with dynamic payload, and displays won prize card', async () => {
    const playHomeWheelApiSpy = jest
      .spyOn(spinWheelService, 'playHomeWheelApi')
      .mockResolvedValueOnce({
        success: true,
        data: {
          prize: {
            campaignItemId: 101,
            rewardId: 101,
            rewardName: 'Free Earbuds Pro',
            code: 'EARBUDSFREE',
            description: 'Free high-definition earbuds',
          },
        },
      } as any);

    const onSpinSuccessMock = jest.fn();
    const modalRef = createRef<HomeWheelBottomSheetModalRef>();

    let component: any;
    act(() => {
      component = renderer.create(
        <HomeWheelBottomSheetModal
          ref={modalRef}
          visibilityData={sampleVisibilityDataWith4Rewards}
          onSpinSuccess={onSpinSuccessMock}
        />,
      );
    });

    // Find the SPIN NOW touchable
    const spinTouchables = component.root.findAll((node: any) =>
      node.props.onPress && extractAllText(node).includes('SPIN NOW'),
    );
    expect(spinTouchables.length).toBeGreaterThan(0);

    await act(async () => {
      spinTouchables[0].props.onPress();
      jest.advanceTimersByTime(6500);
    });

    // Check play API invocation with dynamic payload
    expect(playHomeWheelApiSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        campaignId: 2,
        requestId: 'req-dyn-1234',
        anonymousId: null,
      }),
    );

    // Won prize celebration card displayed
    const updatedTexts = extractAllText(component.toJSON()).join(' ');
    expect(updatedTexts).toContain('CONGRATULATIONS!');
    expect(updatedTexts).toContain('Free Earbuds Pro');
    expect(updatedTexts).toContain('Free high-definition earbuds');
    expect(updatedTexts).toContain('EARBUDSFREE');
    expect(updatedTexts).toContain('Claim Reward');

    // Callback invoked
    expect(onSpinSuccessMock).toHaveBeenCalledWith(
      expect.objectContaining({
        campaignItemId: 101,
        code: 'EARBUDSFREE',
      }),
    );
  });

  it('allows claiming reward and dismisses the bottom sheet', async () => {
    jest.spyOn(spinWheelService, 'playHomeWheelApi').mockResolvedValueOnce({
      success: true,
      data: {
        prize: {
          campaignItemId: 102,
          rewardName: 'Flat ₹100 Off',
          code: 'SAVE100',
        },
      },
    } as any);

    const onDismissMock = jest.fn();
    const modalRef = createRef<HomeWheelBottomSheetModalRef>();

    let component: any;
    act(() => {
      component = renderer.create(
        <HomeWheelBottomSheetModal
          ref={modalRef}
          visibilityData={sampleVisibilityDataWith4Rewards}
          onDismiss={onDismissMock}
        />,
      );
    });

    const spinTouchables = component.root.findAll((node: any) =>
      node.props.onPress && extractAllText(node).includes('SPIN NOW'),
    );

    await act(async () => {
      spinTouchables[0].props.onPress();
      jest.advanceTimersByTime(6500);
    });

    const claimTouchables = component.root.findAll((node: any) =>
      node.props.onPress && extractAllText(node).includes('Claim Reward'),
    );
    expect(claimTouchables.length).toBeGreaterThan(0);

    act(() => {
      claimTouchables[0].props.onPress();
    });

    expect(mockDismiss).toHaveBeenCalled();
  });

  it('spins the wheel for an order and calls playSpinWin and markOrderSpinClaimed', async () => {
    const playSpinWinSpy = jest
      .spyOn(spinWheelService, 'playSpinWin')
      .mockResolvedValueOnce({
        success: true,
        data: {
          prize: {
            campaignItemId: 103,
            rewardName: '50 UD Coins',
            code: 'COINS50',
          },
        },
      } as any);

    const markOrderSpinClaimedSpy = jest
      .spyOn(spinWheelService, 'markOrderSpinClaimed')
      .mockResolvedValueOnce();

    const onSpinSuccessMock = jest.fn();
    const modalRef = createRef<HomeWheelBottomSheetModalRef>();

    let component: any;
    act(() => {
      component = renderer.create(
        <HomeWheelBottomSheetModal
          ref={modalRef}
          orderId="order-999"
          orderNumber="KD-999"
          visibilityData={sampleVisibilityDataWith4Rewards}
          onSpinSuccess={onSpinSuccessMock}
        />,
      );
    });

    const spinTouchables = component.root.findAll((node: any) =>
      node.props.onPress && extractAllText(node).includes('SPIN NOW'),
    );

    await act(async () => {
      spinTouchables[0].props.onPress();
      jest.advanceTimersByTime(6500);
    });

    expect(playSpinWinSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        orderId: 'order-999',
      }),
    );

    expect(markOrderSpinClaimedSpy).toHaveBeenCalledWith(
      'order-999',
      expect.objectContaining({
        campaignItemId: 103,
        code: 'FREEDEL',
      }),
    );

    expect(onSpinSuccessMock).toHaveBeenCalledWith(
      expect.objectContaining({
        campaignItemId: 103,
        code: 'FREEDEL',
      }),
    );
  });

  it('correctly matches and displays "Better Luck Next Time" when server awards NoPrize with rewardId', async () => {
    const visibilityWithNoPrize = {
      campaignId: 1,
      campaignName: 'Post Order Spin',
      rewards: [
        {
          campaignItemId: 1,
          rewardId: 1,
          rewardName: '15 UD Tokens',
          rewardType: 'BToken',
          displayText: '15 BTOKENS',
        },
        {
          campaignItemId: 2,
          rewardId: 2,
          rewardName: 'Flat ₹50 Off',
          rewardType: 'Coupon',
          displayText: '₹50 OFF',
        },
        {
          campaignItemId: 9,
          rewardId: 9,
          rewardName: 'Better Luck Next Time',
          rewardType: 'NoPrize',
          displayText: 'BETTER LUCK NEXT TIME',
        },
      ],
    };

    jest.spyOn(spinWheelService, 'playSpinWin').mockResolvedValueOnce({
      success: true,
      status: 'OK',
      message: 'Spin result fetched.',
      data: {
        spinId: 55,
        orderId: 19963,
        campaignId: 1,
        spinStatus: 2,
        rewardId: 9,
        rewardName: 'Better Luck Next Time',
        rewardType: 'NoPrize',
        rewardValueType: 'NotApplicable',
        awardedValue: 0,
        rewardCode: null,
      },
    } as any);

    const onSpinSuccessMock = jest.fn();
    const modalRef = createRef<HomeWheelBottomSheetModalRef>();

    let component: any;
    act(() => {
      component = renderer.create(
        <HomeWheelBottomSheetModal
          ref={modalRef}
          orderId={19963}
          visibilityData={visibilityWithNoPrize}
          onSpinSuccess={onSpinSuccessMock}
        />,
      );
    });

    const spinTouchables = component.root.findAll((node: any) =>
      node.props.onPress && extractAllText(node).includes('SPIN NOW'),
    );

    await act(async () => {
      spinTouchables[0].props.onPress();
      jest.advanceTimersByTime(6500);
    });

    const updatedTexts = extractAllText(component.toJSON()).join(' ');
    expect(updatedTexts).toContain('BETTER LUCK NEXT TIME');
    expect(updatedTexts).not.toContain('CONGRATULATIONS!');
    expect(updatedTexts).toContain('Continue');
    expect(updatedTexts).not.toContain('Claim Reward');

    expect(onSpinSuccessMock).toHaveBeenCalledWith(
      expect.objectContaining({
        rewardId: 9,
        isNoPrize: true,
      }),
    );
  });

  it('strictly refuses to fake spin or fallback to dummy random prize when backend play API fails', async () => {
    jest.spyOn(spinWheelService, 'playHomeWheelApi').mockResolvedValueOnce({
      success: false,
      message: 'Network timeout',
    } as any);

    const onSpinSuccessMock = jest.fn();
    const modalRef = createRef<HomeWheelBottomSheetModalRef>();

    let component: any;
    act(() => {
      component = renderer.create(
        <HomeWheelBottomSheetModal
          ref={modalRef}
          visibilityData={sampleVisibilityDataWith4Rewards}
          onSpinSuccess={onSpinSuccessMock}
        />,
      );
    });

    const spinTouchables = component.root.findAll((node: any) =>
      node.props.onPress && extractAllText(node).includes('SPIN NOW'),
    );

    await act(async () => {
      spinTouchables[0].props.onPress();
      jest.advanceTimersByTime(6500);
    });

    // Does NOT show celebration modal
    const updatedTexts = extractAllText(component.toJSON()).join(' ');
    expect(updatedTexts).not.toContain('CONGRATULATIONS!');
    expect(updatedTexts).not.toContain('Claim Reward');
    expect(updatedTexts).not.toContain('BETTER LUCK NEXT TIME');

    // Callback NOT invoked
    expect(onSpinSuccessMock).not.toHaveBeenCalled();
  });
});
