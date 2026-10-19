import signalRService from '../src/api/signalRService';
import * as tokenService from '../src/api/tokenService';
import * as signalR from '@microsoft/signalr';

jest.mock('@microsoft/signalr');
jest.mock('../src/api/tokenService');

describe('UdenDeal SignalR Service', () => {
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
    };

    mockBuilder = {
      withUrl: jest.fn().mockReturnThis(),
      withAutomaticReconnect: jest.fn().mockReturnThis(),
      configureLogging: jest.fn().mockReturnThis(),
      build: jest.fn().mockReturnValue(mockConnection),
    };

    signalR.HubConnectionBuilder.mockImplementation(() => mockBuilder);
    jest.spyOn(tokenService, 'getAccessToken').mockResolvedValue('test_udendeal_jwt_token');
  });

  afterEach(async () => {
    await signalRService.stopConnection();
  });

  it('connects to core order hub with UdenDeal token', async () => {
    await signalRService.startConnection();

    expect(mockBuilder.withUrl).toHaveBeenCalledWith(
      'https://core.kapradaily.com/hubs/order',
      expect.objectContaining({
        accessTokenFactory: expect.any(Function),
      }),
    );

    const config = mockBuilder.withUrl.mock.calls[0][1];
    const token = await config.accessTokenFactory();
    expect(token).toBe('test_udendeal_jwt_token');
    expect(mockConnection.start).toHaveBeenCalled();
  });

  it('subscribes to an order and emits order updates to listeners', async () => {
    const listener = jest.fn();
    const unsubscribe = signalRService.onEvent(listener);

    await signalRService.subscribeToOrder(12345);

    expect(mockConnection.invoke).toHaveBeenCalledWith('SubscribeOrder', 12345);

    expect(eventHandlers.ReceiveOrderUpdate).toBeDefined();
    eventHandlers.ReceiveOrderUpdate({ orderId: 12345, status: 'dispatched' });

    expect(listener).toHaveBeenCalledWith('orderUpdate', {
      orderId: 12345,
      status: 'dispatched',
    });

    unsubscribe();
  });

  it('handles OrderStatusUpdated event as well', async () => {
    const listener = jest.fn();
    const unsubscribe = signalRService.onEvent(listener);

    await signalRService.subscribeToOrder(9999);

    expect(eventHandlers.OrderStatusUpdated).toBeDefined();
    eventHandlers.OrderStatusUpdated({ orderId: 9999, status: 'delivered' });

    expect(listener).toHaveBeenCalledWith('orderUpdate', {
      orderId: 9999,
      status: 'delivered',
    });

    unsubscribe();
  });

  it('unsubscribes listener correctly', async () => {
    const listener = jest.fn();
    const unsubscribe = signalRService.onEvent(listener);

    unsubscribe();

    if (eventHandlers.ReceiveOrderUpdate) {
      eventHandlers.ReceiveOrderUpdate({ orderId: 12345 });
    }

    expect(listener).not.toHaveBeenCalled();
  });
});
