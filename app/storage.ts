class DataStorage {
    private static instance: DataStorage | null = null;
    private Storage: Map<string, string> = new Map();
    
    private constructor() {}
    
    static getInstance(): DataStorage {
        if (!DataStorage.instance) {
            DataStorage.instance = new DataStorage();
        }
        return DataStorage.instance;
    }
    
    set(key: string, value: string) {
        this.Storage.set(key, value);
    }

    get(key: string): string | null {
        return this.Storage.get(key) || null;
    }
}

export default DataStorage.getInstance();