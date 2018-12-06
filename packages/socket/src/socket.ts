import * as SockJS from 'sockjs-client';
import {
    Stomp,
    CompatClient,
    Message,
    Frame,
    StompHeaders
} from '@stomp/stompjs/esm5';

export interface SocketServiceOptions {
    sockJS?: SockJS.Options;
}

export type SocketServiceMessageCallback = (message: Message) => void;

export class SocketService {
    client: CompatClient;
    connected?: boolean;

    private static readonly defaultOptions = {
        sockJS: {}
    }

    public constructor(url: string, options: SocketServiceOptions = SocketService.defaultOptions) {
        console.log('url', url);
        this.client = Stomp.over(new SockJS(url, null, options.sockJS));
        console.log('this', this);
    }

    public subscribe(target: string, callback: SocketServiceMessageCallback) {
        return this.client.subscribe(target, callback);
    }

    public connect(headers: StompHeaders): Promise<Frame | undefined> {
        return new Promise((resolve, reject) => this.client.connect(headers, (frame: Frame) => {
            this.connected = true;
            resolve(frame);
        }, (msg: Error) => {
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
        if (!this.connected) {
            throw new Error('Socket client service is not connected');
        }

        this.client.send(target, {}, body);
    }
}

export default SocketService;
