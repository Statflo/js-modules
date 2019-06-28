import * as Stomp from '@stomp/stompjs/esm5';
import { SocketServiceSubscriptions, SocketServiceMessageCallback, SocketServiceOptions } from './types';
export declare class SocketService {
    client: Stomp.Client;
    connected?: boolean;
    subscriptions: SocketServiceSubscriptions;
    private static readonly defaultOptions;
    private static readonly defaultHeaders;
    constructor(url: string, connectHeaders?: Stomp.StompHeaders, options?: SocketServiceOptions);
    subscribe(target: string, callback: SocketServiceMessageCallback): void;
    unsubscribe(target: string): void;
    connect(): Promise<Stomp.Frame | undefined>;
    disconnect(): Promise<{}>;
    message(destination: string, body: string): void;
}
export default SocketService;
