import SocketService from '@statflo/socket/src/socket';

jest.mock('sockjs-client');
jest.mock('@stomp/stompjs');

describe('Socket Service', () => {
    it('should instantiate', () => {
        const service = new SocketService('foobar');

        expect(service.client).toBeTruthy();
        expect(service.subscriptions).toBeInstanceOf(Map);
    });

    describe('connection', () => {
        it('should establish', async() => {
            const service = new SocketService('foobar');
    
            expect(service.connected).toBeFalsy();
    
            await service.connect({});
    
            expect(service.connected).toBeTruthy();
        });
    
        it('should finish', async() => {
            const service = new SocketService('foobar');
    
            await service.connect({});
    
            expect(service.connected).toBeTruthy();
    
            await service.disconnect();
    
            expect(service.connected).toBeFalsy();
        });
    })

    describe('subscription', () => {
        it('should subscribe', done => {
            const service = new SocketService('foobar');

            service.subscribe('foo/bar', function (frame) {
               expect(frame).toBe('matcha');
               done();
            });

            service.client.send('foo/bar', {}, 'matcha');
        });

        it('should be single by route', () => {
            const service = new SocketService('foobar');

            service.subscribe('foo/bar', function() {});
            service.subscribe('foo/bar', function() {});
            service.subscribe('foo/bar/foo', function() {});

            expect(service.subscriptions.size).toBe(2);
        });

        it('should unsubscribe', () => {
            const service = new SocketService('foobar');

            service.subscribe('foo/bar', function () {});

            expect(service.subscriptions.has('foo/bar')).toBeTruthy();

            service.unsubscribe('foo/bar');

            expect(service.subscriptions.size).toBe(0);
        });
    });

    describe('message', () => {
        it('should not propagate without connection', () => {
            const service = new SocketService('foobar');

            service.subscribe('foo/bar', function () {});
            expect(() => {
                service.message('foo/bar', 'matcha');
            }).toThrowError('Socket client service is not connected');
        });

        it('should propagate', async(done) => {
            const service = new SocketService('foobar');

            await service.connect({});
            service.subscribe('foo/bar', function (frame) {
                expect(frame).toBe('matcha');
                done();
            });
            service.message('foo/bar', 'matcha');
        });
    })
});
