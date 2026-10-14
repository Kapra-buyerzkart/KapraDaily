import * as signalR from '@microsoft/signalr';
import { getAccessToken } from './tokenService';
import CONFIG from '../globals/config';

class SignalRService {
    constructor() {
        this.connection = null;
        this.connectingPromise = null;
        this.callbacks = new Set();
        this.activeSubscriptions = new Set();
        this.retryTimeout = null;
    }

    resolveHubUrl(customHubUrl) {
        if (customHubUrl) return customHubUrl;
        const apiBase = CONFIG.base_url || 'https://staging.kapradaily.com/api/v1/';
        const domain = apiBase.split('/api/v1')[0].replace(/\/$/, '');
        return `${domain}/hubs/order`;
    }

    async startConnection(hubUrl) {
        if (
            this.connection &&
            (this.connection.state === signalR.HubConnectionState.Connected ||
                this.connection.state === signalR.HubConnectionState.Connecting)
        ) {
            return;
        }

        if (this.connectingPromise) {
            return this.connectingPromise;
        }

        const targetHubUrl = this.resolveHubUrl(hubUrl);
        console.log('📡 [SignalR] Initializing connection to:', targetHubUrl);

        this.connectingPromise = (async () => {
            try {
                const initialToken = await getAccessToken();
                if (!initialToken) {
                    console.warn('📡 [SignalR] Delaying connection: No access token available');
                    return;
                }

                if (this.retryTimeout) {
                    clearTimeout(this.retryTimeout);
                    this.retryTimeout = null;
                }

                this.connection = new signalR.HubConnectionBuilder()
                    .withUrl(targetHubUrl, {
                        accessTokenFactory: async () => {
                            const token = await getAccessToken();
                            console.log('📡 [SignalR] Token factory provided token:', token ? 'YES' : 'NO');
                            return token || '';
                        },
                    })
                    .withAutomaticReconnect()
                    .configureLogging(signalR.LogLevel.Information)
                    .build();

                this.connection.onreconnecting((error) => {
                    console.log('📡 [SignalR] Reconnecting...', error);
                    this.callbacks.forEach(callback => callback('reconnecting', error));
                });

                this.connection.onreconnected(async (connectionId) => {
                    console.log('📡 [SignalR] Reconnected. ID:', connectionId);
                    this.callbacks.forEach(callback => callback('reconnected', connectionId));
                    await this.resubscribeActiveOrders();
                });

                this.connection.on('ReceiveOrderUpdate', (data) => {
                    console.log('📡 [SignalR] Order Update Received (ReceiveOrderUpdate):', data);
                    this.callbacks.forEach(callback => callback('orderUpdate', data));
                });

                this.connection.on('OrderStatusUpdated', (data) => {
                    console.log('📡 [SignalR] Order Status Updated (OrderStatusUpdated):', data);
                    this.callbacks.forEach(callback => callback('orderUpdate', data));
                });

                await this.connection.start();
                console.log('📡 [SignalR] Connection Started');
                await this.resubscribeActiveOrders();
            } catch (err) {
                const errorMsg = String(err);
                console.error('📡 [SignalR] Connection Error:', errorMsg);

                this.connection = null;

                if (errorMsg.includes('401') || errorMsg.includes('UNAUTHORIZED')) {
                    console.warn('📡 [SignalR] Authentication failed. Stopping automatic retry.');
                    return;
                }

                this.retryTimeout = setTimeout(() => {
                    this.retryTimeout = null;
                    this.startConnection(targetHubUrl).catch(() => {});
                }, 10000);
            } finally {
                this.connectingPromise = null;
            }
        })();

        return this.connectingPromise;
    }

    async subscribeToOrder(orderId) {
        if (!orderId) return;
        this.activeSubscriptions.add(orderId);

        if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
            await this.startConnection();
        }

        if (this.connection && this.connection.state === signalR.HubConnectionState.Connected) {
            try {
                await this.connection.invoke("SubscribeOrder", orderId);
                console.log('📡 [SignalR] Subscribed to order:', orderId);
            } catch (err) {
                console.error('📡 [SignalR] Subscription Error:', err);
            }
        } else {
            console.warn('📡 [SignalR] Cannot subscribe: connection not established for order:', orderId);
        }
    }

    unsubscribeFromOrder(orderId) {
        if (!orderId) return;
        this.activeSubscriptions.delete(orderId);
    }

    async resubscribeActiveOrders() {
        if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) return;
        for (const orderId of Array.from(this.activeSubscriptions)) {
            try {
                await this.connection.invoke("SubscribeOrder", orderId);
                console.log('📡 [SignalR] Re-subscribed to active order:', orderId);
            } catch (err) {
                console.error('📡 [SignalR] Re-subscription Error for order:', orderId, err);
            }
        }
    }

    async stopConnection() {
        if (this.retryTimeout) {
            clearTimeout(this.retryTimeout);
            this.retryTimeout = null;
        }
        if (!this.connection) return;
        try {
            await this.connection.stop();
            console.log('📡 [SignalR] Connection Stopped');
        } catch (err) {
            console.error('📡 [SignalR] Stop Connection Error:', err);
        } finally {
            this.connection = null;
            this.connectingPromise = null;
        }
    }

    onEvent(callback) {
        this.callbacks.add(callback);
        return () => this.callbacks.delete(callback);
    }
}

const signalRService = new SignalRService();
export default signalRService;
