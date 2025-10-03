// src/services/signalr.js
import { HubConnectionBuilder, LogLevel, HttpTransportType } from '@microsoft/signalr';

class SignalRService {
  constructor() {
    this.connection = null;
    this.isConnected = false;
    this.callbacks = new Map();
  }

  async connect(token) {
    try {
      console.log('🔄 Starting SignalR connection...');
      console.log('API URL:', import.meta.env.VITE_API_URL);

      const apiUrl = import.meta.env.VITE_API_URL || 'https://localhost:7217';

      this.connection = new HubConnectionBuilder()
        .withUrl(`${apiUrl}/aiResultsHub`, {
          accessTokenFactory: () => token,
          skipNegotiation: true,
          transport: HttpTransportType.WebSockets,
        })
        .withAutomaticReconnect([0, 2000, 10000, 30000])
        .configureLogging(LogLevel.Debug) // Debug logging
        .build();

      // ====== Event handlers ======
      this.connection.on('ReceiveDetectionResult', (data) => {
        console.log('🔔 Received detection:', data);
        this.callbacks.get('detection')?.forEach((cb) => cb(data));
      });

      this.connection.on('ReceiveAlert', (alert) => {
        console.log('🚨 Received alert:', alert);
        this.callbacks.get('alert')?.forEach((cb) => cb(alert));
      });

      this.connection.on('CameraStatusUpdate', (statusData) => {
        console.log('📹 Camera status update:', statusData);
        this.callbacks.get('status')?.forEach((cb) => cb(statusData));
      });

      // ====== Connection state ======
      this.connection.onreconnecting(() => {
        console.log('🔄 SignalR reconnecting...');
        this.isConnected = false;
      });

      this.connection.onreconnected(() => {
        console.log('✅ SignalR reconnected');
        this.isConnected = true;
      });

      this.connection.onclose(() => {
        console.log('🔌 SignalR connection closed');
        this.isConnected = false;
      });

      // Start connection
      await this.connection.start();
      this.isConnected = true;
      console.log('✅ SignalR Connected to Hub');

      return true;
    } catch (error) {
      console.error('❌ SignalR Connection failed:', error);
      this.isConnected = false;
      return false;
    }
  }

  disconnect() {
    if (this.connection) {
      this.connection.stop();
      this.isConnected = false;
      this.callbacks.clear();
      console.log('🔌 SignalR Disconnected');
    }
  }

  // ====== Subscriptions ======
  onDetection(callback) {
    if (!this.callbacks.has('detection')) {
      this.callbacks.set('detection', new Set());
    }
    this.callbacks.get('detection').add(callback);
    return () => this.callbacks.get('detection')?.delete(callback);
  }

  onAlert(callback) {
    if (!this.callbacks.has('alert')) {
      this.callbacks.set('alert', new Set());
    }
    this.callbacks.get('alert').add(callback);
    return () => this.callbacks.get('alert')?.delete(callback);
  }

  onCameraStatus(callback) {
    if (!this.callbacks.has('status')) {
      this.callbacks.set('status', new Set());
    }
    this.callbacks.get('status').add(callback);
    return () => this.callbacks.get('status')?.delete(callback);
  }

  // ====== Utils ======
  getConnectionState() {
    if (!this.connection) return 'Disconnected';

    const states = {
      0: 'Disconnected',
      1: 'Connecting',
      2: 'Connected',
      3: 'Disconnecting',
      4: 'Reconnecting',
    };

    return states[this.connection.state] || 'Unknown';
  }

  async reconnect() {
    if (this.connection && this.connection.state === 0) {
      try {
        await this.connection.start();
        this.isConnected = true;
        console.log('✅ Manual reconnection successful');
        return true;
      } catch (error) {
        console.error('❌ Manual reconnection failed:', error);
        return false;
      }
    }
    return false;
  }
}

export const signalRService = new SignalRService();
