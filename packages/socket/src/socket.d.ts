import * as SockJS from 'sockjs-client';
import { CompatClient, Message, Frame, StompHeaders } from '@stomp/stompjs/esm6';
export interface SocketServiceOptions {
    sockJS?: SockJS.Options;
}
export declare type SocketServiceMessageCallback = (message: Message) => void;
export declare class SocketService {
    client: CompatClient;
    connected?: boolean;
    private static readonly defaultOptions;
    constructor(url: string, options?: SocketServiceOptions);
    subscribe(target: string, callback: SocketServiceMessageCallback): import("@stomp/stompjs/esm6").StompSubscription;
    connect(headers: StompHeaders): Promise<Frame | undefined>;
    disconnect(): Promise<{}>;
    message(target: string, body: string): void;
}
export default SocketService;
