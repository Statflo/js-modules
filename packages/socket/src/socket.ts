import * as SockJS from 'sockjs-client';
import * as Stomp  from '@stomp/stompjs/esm5';
import {
    SocketServiceSubscriptions,
    SocketServiceMessageCallback,
    SocketServiceOptions
} from './types';

export class SocketService {
    client: Stomp.Client;
    connected?: boolean;
    subscriptions: SocketServiceSubscriptions;

    private static readonly defaultOptions = {
        sockJS: {}
    }

    private static readonly defaultHeaders = {}

    public constructor(url: string, connectHeaders: Stomp.StompHeaders = SocketService.defaultHeaders, options: SocketServiceOptions = SocketService.defaultOptions) {
        function webSocketFactory() {
            return new SockJS(url, null, options.sockJS);
        }

        this.client = new Stomp.Client({
            webSocketFactory,
            connectHeaders
        });
        this.subscriptions = new Map();
    }

    public subscribe(target: string, callback: SocketServiceMessageCallback) {
        if (!this.subscriptions.has(target)) {
            const subscription = this.client.subscribe(target, callback);
            this.subscriptions.set(target, subscription);
        }
    }

    public unsubscribe(target: string) {
        const subscription = this.subscriptions.get(target);
        if (subscription) {
            subscription.unsubscribe();
            this.subscriptions.delete(target);
        }
    }

    public connect(): Promise<Stomp.Frame | undefined> {
        return new Promise((resolve, reject) => {
            this.client.onConnect = (frame: Stomp.Frame) => {
                this.connected = true;
                resolve(frame);
            };

            this.client.onStompError = (frame: Stomp.Frame) => {
                this.connected = false;
                reject(frame);
            };

            this.client.activate();
        });
    }

    public disconnect() {
        return new Promise(resolve => {
            this.connected = false;
            this.client.onDisconnect = resolve;

            this.client.forceDisconnect();
        });
    }

    public message(destination: string, body: string) {
        if (!this.connected) {
            throw new Error('Socket client service is not connected');
        }

        this.client.publish({
            destination,
            body
        });
    }
}

export default SocketService;
