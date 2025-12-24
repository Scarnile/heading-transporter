
export abstract class BaseManager<T> {
    items: Map<string, T> = new Map()

    getById(id: string) {
        return this.items.get(id)
    }

    getAll() {
        return this.items
    }
}