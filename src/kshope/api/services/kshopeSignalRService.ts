import * as signalR from '@microsoft/signalr';
import kshopeTokenStore from '../tokenService';
import KSHOPE_CONFIG from '../../globals/config';
import logger from '../../../utils/logger';

export type SignalREventType =
  | 'orderUpdate'
  | 'reconnecting'
  | 'reconnected'
  | 'close';

export type SignalREventCallback = (type: SignalREventType, data: any) => void;

class KshopeSignalRService {
  private connection: signalR.HubConnection | null = null;
  private connectingPromise: Promise<void> | null = null;
  private callbacks = new Set<SignalREventCallback>();
  private activeSubscriptions = new Set<string | number>();
  private retryTimeout: ReturnType<typeof setTimeout> | null = null;

  private resolveHubUrl(customHubUrl?: string): string {
    if (customHubUrl) {
      return customHubUrl;
    }
    const apiBase =
      KSHOPE_CONFIG.base_url || 'https://kshopecore.kapradaily.com/api/v1/';
    const domain = apiBase.split('/api/v1')[0].replace(/\/$/, '');
    return `${domain}/hubs/order`;
  }

  public async startConnection(customHubUrl?: string): Promise<void> {
    if (
      this.connection &&
      this.connection.state === signalR.HubConnectionState.Connected
    ) {
      return;
    }

    if (this.connectingPromise) {
      return this.connectingPromise;
    }

    const hubUrl = this.resolveHubUrl(customHubUrl);
    logger.log('📡 [Kshope SignalR] Initializing connection to:', hubUrl);

    this.connectingPromise = (async () => {
      try {
        const initialToken = await kshopeTokenStore.getAccessToken();
        if (!initialToken) {
          logger.warn(
            '📡 [Kshope SignalR] Delaying connection: No access token available',
          );
          return;
        }

        if (this.retryTimeout) {
          clearTimeout(this.retryTimeout);
          this.retryTimeout = null;
        }

        this.connection = new signalR.HubConnectionBuilder()
          .withUrl(hubUrl, {
            accessTokenFactory: async () => {
              const token = await kshopeTokenStore.getAccessToken();
              return token || '';
            },
          })
          .withAutomaticReconnect()
          .configureLogging(signalR.LogLevel.Information)
          .build();

        this.connection.onreconnecting((error) => {
          logger.log('📡 [Kshope SignalR] Reconnecting...', error);
          this.emit('reconnecting', error);
        });

        this.connection.onreconnected(async (connectionId) => {
          logger.log('📡 [Kshope SignalR] Reconnected. ID:', connectionId);
          this.emit('reconnected', connectionId);
          await this.resubscribeActiveOrders();
        });

        this.connection.onclose((error) => {
          logger.log('📡 [Kshope SignalR] Connection Closed', error);
          this.emit('close', error);
        });

        this.connection.on('ReceiveOrderUpdate', (data: any) => {
          logger.log('📡 [Kshope SignalR] ReceiveOrderUpdate:', data);
          this.emit('orderUpdate', data);
        });

        this.connection.on('OrderStatusUpdated', (data: any) => {
          logger.log('📡 [Kshope SignalR] OrderStatusUpdated:', data);
          this.emit('orderUpdate', data);
        });

        await this.connection.start();
        logger.log('📡 [Kshope SignalR] Connection Started Successfully');

        await this.resubscribeActiveOrders();
      } catch (err: any) {
        const errorMsg = String(err);
        logger.error('📡 [Kshope SignalR] Connection Error:', errorMsg);

        this.connection = null;

        if (errorMsg.includes('401') || errorMsg.includes('UNAUTHORIZED')) {
          logger.warn(
            '📡 [Kshope SignalR] Authentication failed. Stopping automatic retry.',
          );
          return;
        }

        this.retryTimeout = setTimeout(() => {
          this.retryTimeout = null;
          this.startConnection(hubUrl).catch(() => {});
        }, 10000);
      } finally {
        this.connectingPromise = null;
      }
    })();

    return this.connectingPromise;
  }

  public async subscribeToOrder(orderId: string | number): Promise<void> {
    if (!orderId) {
      return;
    }
    this.activeSubscriptions.add(orderId);

    if (
      !this.connection ||
      this.connection.state !== signalR.HubConnectionState.Connected
    ) {
      await this.startConnection();
    }

    if (
      this.connection &&
      this.connection.state === signalR.HubConnectionState.Connected
    ) {
      try {
        await this.connection.invoke('SubscribeOrder', orderId);
        logger.log('📡 [Kshope SignalR] Subscribed to order:', orderId);
      } catch (err) {
        logger.error('📡 [Kshope SignalR] Subscription Error:', err);
      }
    } else {
      logger.warn(
        '📡 [Kshope SignalR] Could not subscribe: connection not established for order:',
        orderId,
      );
    }
  }

  public unsubscribeFromOrder(orderId: string | number): void {
    if (!orderId) {
      return;
    }
    this.activeSubscriptions.delete(orderId);
  }

  private async resubscribeActiveOrders(): Promise<void> {
    if (
      !this.connection ||
      this.connection.state !== signalR.HubConnectionState.Connected ||
      this.activeSubscriptions.size === 0
    ) {
      return;
    }

    for (const orderId of Array.from(this.activeSubscriptions)) {
      try {
        await this.connection.invoke('SubscribeOrder', orderId);
        logger.log(
          '📡 [Kshope SignalR] Re-subscribed to active order:',
          orderId,
        );
      } catch (err) {
        logger.error(
          '📡 [Kshope SignalR] Re-subscription Error for order:',
          orderId,
          err,
        );
      }
    }
  }

  public async stopConnection(): Promise<void> {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
      this.retryTimeout = null;
    }
    if (!this.connection) {
      return;
    }
    try {
      await this.connection.stop();
      logger.log('📡 [Kshope SignalR] Connection Stopped');
    } catch (err) {
      logger.error('📡 [Kshope SignalR] Stop Connection Error:', err);
    } finally {
      this.connection = null;
      this.connectingPromise = null;
    }
  }

  public onEvent(callback: SignalREventCallback): () => void {
    this.callbacks.add(callback);
    return () => {
      this.callbacks.delete(callback);
    };
  }

  private emit(type: SignalREventType, data: any): void {
    this.callbacks.forEach((cb) => {
      try {
        cb(type, data);
      } catch (e) {
        logger.error('📡 [Kshope SignalR] Listener error:', e);
      }
    });
  }

  public getConnectionState(): signalR.HubConnectionState | 'Uninitialized' {
    return this.connection ? this.connection.state : 'Uninitialized';
  }
}

const kshopeSignalRService = new KshopeSignalRService();
export default kshopeSignalRService;
