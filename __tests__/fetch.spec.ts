import { createMiddleware } from '@statflo/fetch/src/fetch';

declare const global: any;

// mock fetch
global.fetch = (init: string) => Promise.resolve(init);

describe('@statflo/fetch', () => {
    describe('#createMiddleware', () => {
        it('Should be able to create a empty middleware', async() => {
            const fetch = createMiddleware();

            expect(await fetch('foobar')).toBe('foobar');
        });

        it('Should be able set middlewares', async () => {
            let game = '';
            const fetchWrapper = createMiddleware([
                function lemonade(input) {
                    return Promise.resolve('Game: ');
                },
                function tycoon(input, config, previous) {
                    game = previous + 'Lemonade';

                    return Promise.resolve();
                }
            ], () => game += ' Tycoon');

            await fetchWrapper();

            expect(game).toBe('Game: Lemonade Tycoon');
        });
    });
});
