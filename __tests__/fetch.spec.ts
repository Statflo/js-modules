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

        it.skip('Should be able set middlewares', async () => {
            const fetchWrapper = createMiddleware([
                function lemonade(input) {
                    return Promise.resolve('Lemonade');
                },
                function tycoon(input, config, previous) {
                    input = input + previous + ' Tycoon';
                    return Promise.resolve();
                }
            ]);

            expect(await fetchWrapper('Game: ')).toBe('Game: Lemonade Tycoon');
        });
    });
});
