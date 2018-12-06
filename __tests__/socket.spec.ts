import SocketService from '@statflo/socket/src/socket';

jest.mock('sockjs-client');
jest.mock('@stomp/stompjs/esm5');

describe('Socket Service', () => {
    it('should instantiate', () => {
        const service = new SocketService('foobar');

        expect(service.client).toBeTruthy();
    });

    describe('connection', () => {
        it('should establish', async() => {
            const service =  new SocketService('/foobar');

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

    it('should subscribe', done => {
        const service = new SocketService('foobar');

        service.subscribe('foo/bar', function (frame) {
            expect(frame).toBe('matcha');
            done();
        });

        service.client.send('foo/bar', {}, 'matcha');
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
