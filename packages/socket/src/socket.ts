import * as SockJS from 'sockjs-client';
import * as Stomp  from '@stomp/stompjs';

export interface SocketServiceOptions {
    sockJS?: SockJS.Options;
}

export type SocketServiceMessageCallback = (message: Stomp.Message) => void;

export default class SocketService {
    subscriptions: Map<string, Stomp.StompSubscription>;
    client: Stomp.Client;
    connected?: boolean;

    private static readonly defaultOptions = {
        sockJS: {}
    }

    public constructor(url: string, options: SocketServiceOptions = SocketService.defaultOptions) {
        this.client = Stomp.over(new SockJS(url, null, options.sockJS));
        this.subscriptions = new Map();
    }

    public subscribe(target: string, callback: SocketServiceMessageCallback) {
        if (!this.subscriptions.has(target)) {
            this.subscriptions.set(target, this.client.subscribe(target, callback));
        }
    }

    public unsubscribe(target: string) {
        const connection = this.subscriptions.get(target);
        if (connection) {
            connection.unsubscribe();
            this.subscriptions.delete(target);
        }
    }

    public connect(headers: Stomp.StompHeaders): Promise<Stomp.Frame | undefined> {
        return new Promise((resolve, reject) => this.client.connect(headers, frame => {
            this.connected = true;
            resolve(frame);
        }, msg => {
            this.connected = false;
            reject(msg);
        }));
    }

    public disconnect() {
        return new Promise(resolve => {
            this.connected = false;
            this.client.disconnect(resolve)
        });
    }

    public message(target: string, body: string) {
        this.client.send(target, {}, body);
    }
}
