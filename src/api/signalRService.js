import * as signalR from '@microsoft/signalr';
import { getAccessToken } from './tokenService';
import CONFIG from '../globals/config';

class SignalRService {
    constructor() {
        this.connection = null;
        this.callbacks = new Set();
    }

    /**
     * Initializes and starts the SignalR connection.
     * @param {string} hubUrl Optional override for the hub URL.
     */
    async startConnection(hubUrl = `https://core.kapradaily.com/hubs/order`) {
        if (this.connection) return;

        try {
            const token = await getAccessToken();

            this.connection = new signalR.HubConnectionBuilder()
                .withUrl(hubUrl, {
                    accessTokenFactory: () => token,
                })
                .withAutomaticReconnect()
                .configureLogging(signalR.LogLevel.Information)
                .build();

            // Reconnection handlers
            this.connection.onreconnecting((error) => {
                console.log('📡 [SignalR] Reconnecting...', error);
                this.callbacks.forEach(callback => callback('reconnecting', error));
            });

            this.connection.onreconnected((connectionId) => {
                console.log('📡 [SignalR] Reconnected. ID:', connectionId);
                this.callbacks.forEach(callback => callback('reconnected', connectionId));
            });

            // Listen for Order Updates
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
            console.error('📡 [SignalR] Connection Error:', err);
            // Retry logic
            setTimeout(() => this.startConnection(hubUrl), 5000);
        }
    }

    /**
     * Subscribes to a specific order for real-time updates.
     * @param {number|string} orderId 
     */
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

    /**
     * Stops the SignalR connection.
     */
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

    /**
     * Registers a callback for real-time events.
     * @param {Function} callback 
     */
    onEvent(callback) {
        this.callbacks.add(callback);
        return () => this.callbacks.delete(callback);
    }
}

const signalRService = new SignalRService();
export default signalRService;
