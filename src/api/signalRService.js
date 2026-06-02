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
    async startConnection(hubUrl) {
        if (this.connection) return;

        // Automatically derive hub URL from config if not provided
        if (!hubUrl) {
            const apiBase = CONFIG.base_url || 'https://staging.kapradaily.com/api/v1/';
            const domain = apiBase.split('/api/v1/')[0];
            hubUrl = `${domain}/hubs/order`;
        }

        try {
            const initialToken = await getAccessToken();
            if (!initialToken) {
                return;
            }

            this.connection = new signalR.HubConnectionBuilder()
                .withUrl(hubUrl, {
                    accessTokenFactory: async () => {
                        const token = await getAccessToken();
                        return token;
                    },
                })
                .withAutomaticReconnect()
                .configureLogging(signalR.LogLevel.Information)
                .build();

            // Reconnection handlers
            this.connection.onreconnecting((error) => {
                this.callbacks.forEach(callback => callback('reconnecting', error));
            });

            this.connection.onreconnected((connectionId) => {
                this.callbacks.forEach(callback => callback('reconnected', connectionId));
            });

            // Listen for Order Updates
            this.connection.on('ReceiveOrderUpdate', (data) => {
:', data);
                this.callbacks.forEach(callback => callback('orderUpdate', data));
            });

            this.connection.on('OrderStatusUpdated', (data) => {
:', data);
                this.callbacks.forEach(callback => callback('orderUpdate', data));
            });

            await this.connection.start();
        } catch (err) {
            const errorMsg = String(err);
            
            // If it's an auth error, don't spam retries
            if (errorMsg.includes('401') || errorMsg.includes('UNAUTHORIZED')) {
                this.connection = null; // Reset so it can be manually re-started on next login/tracking click
                return;
            }

            // Other errors get standard retry
            setTimeout(() => this.startConnection(hubUrl), 10000); // 10s cooldown
        }
    }

    /**
     * Subscribes to a specific order for real-time updates.
     * @param {number|string} orderId 
     */
    async subscribeToOrder(orderId) {
        if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
            return;
        }
        try {
            await this.connection.invoke("SubscribeOrder", orderId);
        } catch (err) {
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
        } catch (err) {
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
