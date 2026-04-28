
class DataStorage {
    private static instance: DataStorage | null = null;
    private Storage: Map<string, {
        expiry: number;
        value: string;
    }> = new Map();
    
    private constructor() {}
    
    static getInstance(): DataStorage {
        if (!DataStorage.instance) {
            DataStorage.instance = new DataStorage();
        }
        return DataStorage.instance;
    }

    set(key: string, value: string, unit?: string, time?: string) {
        let expiry = 0;
        if(unit && time) {
            expiry = Date.now() + parseInt(time) * (unit === 'PX' ? 1 : 1000);
        }


        this.Storage.set(key, {
            expiry: expiry,
            value: value
        });
    }

    get(key: string): string | null {
        const { value, expiry } = this.Storage.get(key) || {
            value: null,
            expiry: 0
        };

        if(expiry && Date.now() > expiry) {
            this.Storage.delete(key);
            return null;
        }

        return value;
    }
}

export default DataStorage.getInstance();