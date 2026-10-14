import kshopeSignalRService from '../src/kshope/api/services/kshopeSignalRService';
import kshopeTokenStore from '../src/kshope/api/tokenService';
import * as signalR from '@microsoft/signalr';

jest.mock('@microsoft/signalr');
jest.mock('../src/kshope/api/tokenService');

describe('Kshope SignalR Service', () => {
  let mockConnection;
  let mockBuilder;
  let eventHandlers;

  beforeEach(() => {
    jest.clearAllMocks();
    eventHandlers = {};

    mockConnection = {
      state: signalR.HubConnectionState.Disconnected,
      start: jest.fn().mockImplementation(async () => {
        mockConnection.state = signalR.HubConnectionState.Connected;
      }),
      stop: jest.fn().mockImplementation(async () => {
        mockConnection.state = signalR.HubConnectionState.Disconnected;
      }),
      invoke: jest.fn().mockResolvedValue(null),
      on: jest.fn().mockImplementation((event, handler) => {
        eventHandlers[event] = handler;
      }),
      onreconnecting: jest.fn(),
      onreconnected: jest.fn(),
      onclose: jest.fn(),
    };

    mockBuilder = {
      withUrl: jest.fn().mockReturnThis(),
      withAutomaticReconnect: jest.fn().mockReturnThis(),
      configureLogging: jest.fn().mockReturnThis(),
      build: jest.fn().mockReturnValue(mockConnection),
    };

    signalR.HubConnectionBuilder.mockImplementation(() => mockBuilder);
    kshopeTokenStore.getAccessToken.mockResolvedValue('test_kshope_jwt_token');
  });

  afterEach(async () => {
    await kshopeSignalRService.stopConnection();
  });

  it('connects to kshopecore order hub with kshope token', async () => {
    await kshopeSignalRService.startConnection();

    expect(mockBuilder.withUrl).toHaveBeenCalledWith(
      'https://kshopecore.kapradaily.com/hubs/order',
      expect.objectContaining({
        accessTokenFactory: expect.any(Function),
      }),
    );

    const config = mockBuilder.withUrl.mock.calls[0][1];
    const token = await config.accessTokenFactory();
    expect(token).toBe('test_kshope_jwt_token');
    expect(mockConnection.start).toHaveBeenCalled();
  });

  it('subscribes to an order and emits order updates to listeners', async () => {
    const listener = jest.fn();
    const unsubscribe = kshopeSignalRService.onEvent(listener);

    await kshopeSignalRService.subscribeToOrder(42);

    expect(mockConnection.invoke).toHaveBeenCalledWith('SubscribeOrder', 42);

    // Simulate ReceiveOrderUpdate event from server
    expect(eventHandlers.ReceiveOrderUpdate).toBeDefined();
    eventHandlers.ReceiveOrderUpdate({ orderId: 42, orderStatusKey: 'shipped' });

    expect(listener).toHaveBeenCalledWith('orderUpdate', {
      orderId: 42,
      orderStatusKey: 'shipped',
    });

    unsubscribe();
  });

  it('unsubscribes listener when callback returned is called', async () => {
    const listener = jest.fn();
    const unsubscribe = kshopeSignalRService.onEvent(listener);

    unsubscribe();

    if (eventHandlers.ReceiveOrderUpdate) {
      eventHandlers.ReceiveOrderUpdate({ orderId: 99 });
    }

    expect(listener).not.toHaveBeenCalled();
  });

  it('useKshopeOrderTracking hook forwards updates for matching order', async () => {
    const { useKshopeOrderTracking } = require('../src/kshope/hooks/useKshopeOrderTracking');
    const React = require('react');
    const TestRenderer = require('react-test-renderer');
    const onUpdate = jest.fn();

    const Component = ({ orderId }) => {
      useKshopeOrderTracking(orderId, onUpdate);
      return null;
    };

    let tree;
    await TestRenderer.act(async () => {
      tree = TestRenderer.create(React.createElement(Component, { orderId: 777 }));
    });

    expect(mockConnection.invoke).toHaveBeenCalledWith('SubscribeOrder', 777);

    // Simulate update for different order
    TestRenderer.act(() => {
      eventHandlers.ReceiveOrderUpdate({ orderId: 888, orderStatusKey: 'pending' });
    });
    expect(onUpdate).not.toHaveBeenCalled();

    // Simulate update for matching order
    TestRenderer.act(() => {
      eventHandlers.ReceiveOrderUpdate({ orderId: 777, orderStatusKey: 'delivered' });
    });
    expect(onUpdate).toHaveBeenCalledWith({ orderId: 777, orderStatusKey: 'delivered' });

    // Unmount
    TestRenderer.act(() => {
      tree.unmount();
    });

    // Verify further events don't trigger callback
    TestRenderer.act(() => {
      eventHandlers.ReceiveOrderUpdate({ orderId: 777, orderStatusKey: 'returned' });
    });
    expect(onUpdate).toHaveBeenCalledTimes(1);
  });
});
