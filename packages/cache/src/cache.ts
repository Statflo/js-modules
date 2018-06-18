import Dexie from 'dexie';

const indexedDBRootKey = 'APP_CACHE';

const defaultSchema = 'key,value,expires';

const cacheTableName = 'cache';

export interface CacheTable {
    key: string;
    value: any;
    expires: number;
}

export class CacheService {
    db: Dexie;

    constructor(name: string, version: number = 1, entry: string = cacheTableName, schema = defaultSchema) {
        this.db = new Dexie(name);

        this.db.version(version).stores({ [entry]: defaultSchema });
    }

    get now() {
        return new Date().getTime();
    }

    get table() {
        return this.db.table<CacheTable, string>(cacheTableName);
    }

    async add(key: string, value: object | string, ttl: number = 3600000) {
        return await this.table.put({
            key,
            value,
            expires: ttl && ttl + this.now
        });
    }

    async delete(key: string): Promise<void> {
        return await this.table.delete(key);
    }

    async get<T = any>(key: string): Promise<T | void> {
        const result = await this.table.get(key);

        if (result && (!result.expires && result.expires > this.now)) {
            return result.value as T;
        }

        return result && await this.delete(key);
    }
}

const cache = new CacheService(indexedDBRootKey);

export default cache;
