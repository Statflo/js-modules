import SocketService from '@statflo/socket/src/socket';
import * as Stomp    from '@stomp/stompjs/esm5';

jest.mock('sockjs-client');
jest.mock('@stomp/stompjs/esm5');

class FakeSubscription {
    unsubscribe: jest.Mock<{}>;

    constructor() {
        this.unsubscribe = jest.fn();
    }
}

class FakeClient {
    subscribe: jest.Mock<{}>;
    unsubscribe: jest.Mock<{}>;
    publish: jest.Mock<{}>;
    activate: jest.Mock<{}>;
    onConnect?: jest.Mock<{}>;
    onDisconnect?: jest.Mock<{}>;
    forceDisconnect: jest.Mock<{}>;

    constructor() {
        this.subscribe = jest.fn(() => (new FakeSubscription()));
        this.unsubscribe = jest.fn();
        this.publish = jest.fn();
        this.activate = jest.fn(() => this.onConnect && this.onConnect({} as Stomp.Frame));
        this.forceDisconnect = jest.fn(() => this.onDisconnect && this.onDisconnect());
    }
}

(Stomp.Client as any).mockImplementation(() => new FakeClient());

const mockExchange = 'foo/bar';
const mockCallback = jest.fn();

describe('Socket Service', () => {
    let service = {} as SocketService;

    beforeEach(() => service = new SocketService('foobar'));

    it('should instantiate', () => {
        expect(service.client).toBeTruthy();
    });

    describe('connection', () => {
        it('should establish', async () => {
            expect(service.connected).toBeFalsy();

            return service.connect().then(() => {
                expect(service.client.activate).toBeCalled();
                expect(service.connected).toBeTruthy();
            });

        });

        it('should finish', async(done) => {
            await service.connect();

            expect(service.connected).toBeTruthy();

            await service.disconnect();

            expect(service.client.forceDisconnect).toBeCalled();
            expect(service.connected).toBeFalsy();
            done();
        });
    });

    describe('subscription', () => {
        beforeEach(() => service.subscribe(mockExchange, mockCallback));

        it('should subscribe the client to the specified exchange', () => {
            expect(service.client.subscribe).toBeCalledWith(mockExchange, mockCallback);
            expect(service.subscriptions.has(mockExchange)).toBe(true);
        });

        it('should unsubscribe the client from the specified exchange', () => {
            service.unsubscribe(mockExchange);

            expect(service.subscriptions.has(mockExchange)).toBe(false);
        });
    });

    describe('message', () => {
        it('should not propagate without connection', () => {
            service.subscribe(mockExchange, function () {});
            expect(() => {
                service.message(mockExchange, 'matcha');
            }).toThrowError('Socket client service is not connected');
        });

        it('should propagate', async(done) => {
            return service.connect().then(() => {
                service.subscribe(mockExchange, mockCallback);

                service.message(mockExchange, 'matcha');

                expect(service.client.publish).toBeCalledWith({ destination: mockExchange, body: 'matcha' });

                done();
            });
        });
    })
});
