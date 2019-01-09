import * as SockJS from 'sockjs-client';
import * as Stomp from '@stomp/stompjs';
export interface SocketServiceOptions {
    sockJS?: SockJS.Options;
}
export declare type SocketServiceMessageCallback = (message: Stomp.Message) => void;
export declare class SocketService {
    client: Stomp.Client;
    connected?: boolean;
    private static readonly defaultOptions;
    private static readonly defaultHeaders;
    constructor(url: string, connectHeaders?: Stomp.StompHeaders, options?: SocketServiceOptions);
    subscribe(target: string, callback: SocketServiceMessageCallback): Stomp.StompSubscription;
    connect(): Promise<Stomp.Frame | undefined>;
    disconnect(): Promise<{}>;
    message(destination: string, body: string): void;
}
export default SocketService;
