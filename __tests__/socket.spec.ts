import SocketService from '@statflo/socket/src/socket';
import * as Stomp    from '@stomp/stompjs/esm5';

jest.mock('sockjs-client');
jest.mock('@stomp/stompjs/esm5');

class FakeClient {
    subscribe: jest.Mock<{}>;
    publish: jest.Mock<{}>;
    activate: jest.Mock<{}>;
    onConnect?: jest.Mock<{}>;
    onDisconnect?: jest.Mock<{}>;
    forceDisconnect: jest.Mock<{}>;

    constructor() {
        this.subscribe = jest.fn();
        this.publish = jest.fn();
        this.activate = jest.fn(() => this.onConnect && this.onConnect({} as Stomp.Frame));
        this.forceDisconnect = jest.fn(() => this.onDisconnect && this.onDisconnect());
    }
}

(Stomp.Client as any).mockImplementation(() => new FakeClient());

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

    it('should subscribe', () => {
        const mockCallback = jest.fn();

        service.subscribe('foo/bar', mockCallback);

        expect(service.client.subscribe).toBeCalledWith('foo/bar', mockCallback);
    });

    describe('message', () => {
        it('should not propagate without connection', () => {
            service.subscribe('foo/bar', function () {});
            expect(() => {
                service.message('foo/bar', 'matcha');
            }).toThrowError('Socket client service is not connected');
        });

        it('should propagate', async(done) => {
            const mockCallback = jest.fn();

            return service.connect().then(() => {
                service.subscribe('foo/bar', mockCallback);

                service.message('foo/bar', 'matcha');

                expect(service.client.publish).toBeCalledWith({ destination: 'foo/bar', body: 'matcha' });

                done();
            });
        });
    })
});
