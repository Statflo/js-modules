export type FetchToolsInput = Request | string;

export interface FetchToolsCache<CacheShape> {
    [url: string]: CacheShape;
}

export type FetchMiddleware<P = any> = (input: FetchToolsInput, init?: RequestInit, previousResult?: P | void) => Promise<P>;

export type FetchMiddlewareStack<P = any> = FetchMiddleware<P>[];

export interface FetchMiddlewareHybridType extends Function {
    add?: (middleware: FetchMiddleware) => FetchMiddlewareHybridType;
}

const cacheResponse = <CacheShape>(cache: FetchToolsCache<CacheShape>, endPoint: string) =>
    (response: CacheShape) => Promise.resolve((cache[endPoint] = response));

const parseJSON = (response: Response) => response.json();

export function checkStatus(response: Response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    } else {
        const error = new Error(response.statusText);
        throw error;
    }
};

export function fetchJSON<JSONShape = object>(input: Request | string, init?: RequestInit) {
    return fetch(input, init).then(checkStatus).then<JSONShape>(parseJSON);
}

export function createCacheableFetch<CacheShape = object>(cache: FetchToolsCache<CacheShape> = Object.create(null)) {
    return function fetchAndCache(url: string, init?: RequestInit) {
        return cache[url] && Promise.resolve(cache[url])
            || fetchJSON<CacheShape>(url, init).then(cacheResponse<CacheShape>(cache, url));
    }
}

export function createMiddleware<ResultShape = any>(stack: FetchMiddlewareStack<ResultShape> = [], fetchHandler: Function = fetch) {
    const runMiddlewareStack = <FetchMiddlewareHybridType>async function fetchWithMiddleware(input: FetchToolsInput, init?: RequestInit) {
        let previousResult;

        for (let middleware of stack) {
            previousResult = await middleware(input, init, previousResult);
        }

        return fetchHandler(input, init);
    };

    runMiddlewareStack.add = function addMiddleware(middleware) {
        return (stack = stack.concat(middleware)) && runMiddlewareStack;
    }

    return runMiddlewareStack;
}
