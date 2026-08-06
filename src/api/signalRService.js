import * as signalR from '@microsoft/signalr';
import { getAccessToken } from './tokenService';
import CONFIG from '../globals/config';

class SignalRService {
    constructor() {
        this.connection = null;
        this.callbacks = new Set();
    }

    async startConnection(hubUrl) {
        if (this.connection) return;

        if (!hubUrl) {
            const apiBase = CONFIG.base_url || 'https://staging.kapradaily.com/api/v1/';
            const domain = apiBase.split('/api/v1/')[0];
            hubUrl = `${domain}/hubs/order`;
        }

        console.log('📡 [SignalR] Initializing connection to:', hubUrl);

        try {
            const initialToken = await getAccessToken();
            if (!initialToken) {
                console.warn('📡 [SignalR] Delaying connection: No access token available');
                return;
            }

            this.connection = new signalR.HubConnectionBuilder()
                .withUrl(hubUrl, {
                    accessTokenFactory: async () => {
                        const token = await getAccessToken();
                        console.log('📡 [SignalR] Token factory provided token:', token ? 'YES' : 'NO');
                        return token;
                    },
                })
                .withAutomaticReconnect()
                .configureLogging(signalR.LogLevel.Information)
                .build();

            this.connection.onreconnecting((error) => {
                console.log('📡 [SignalR] Reconnecting...', error);
                this.callbacks.forEach(callback => callback('reconnecting', error));
            });

            this.connection.onreconnected((connectionId) => {
                console.log('📡 [SignalR] Reconnected. ID:', connectionId);
                this.callbacks.forEach(callback => callback('reconnected', connectionId));
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
        } catch (err) {
            const errorMsg = String(err);
            console.error('📡 [SignalR] Connection Error:', errorMsg);
            
            if (errorMsg.includes('401') || errorMsg.includes('UNAUTHORIZED')) {
                console.warn('📡 [SignalR] Authentication failed. Stopping automatic retry.');
                this.connection = null;
                return;
            }

            setTimeout(() => this.startConnection(hubUrl), 10000);
        }
    }

    async subscribeToOrder(orderId) {
        if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
            console.warn('📡 [SignalR] Cannot subscribe: connection not established');
            return;
        }
        try {
            await this.connection.invoke("SubscribeOrder", orderId);
            console.log('📡 [SignalR] Subscribed to order:', orderId);
        } catch (err) {
            console.error('📡 [SignalR] Subscription Error:', err);
        }
    }

    async stopConnection() {
        if (!this.connection) return;
        try {
            await this.connection.stop();
            this.connection = null;
            console.log('📡 [SignalR] Connection Stopped');
        } catch (err) {
            console.error('📡 [SignalR] Stop Connection Error:', err);
        }
    }

    onEvent(callback) {
        this.callbacks.add(callback);
        return () => this.callbacks.delete(callback);
    }
}

const signalRService = new SignalRService();
export default signalRService;
