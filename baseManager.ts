
export abstract class BaseManager<T extends {id: string}> {
    // Returns the saved item when given an id
    items: Map<string, T> = new Map()

    // Convert initial data to a map
    constructor(initialData?: T[]) {
        if (initialData) {
            for (const item of initialData) {
                this.items.set(item.id, item)          
            }
        }
    }

    getById(id: string) {
        return this.items.get(id)
    }

    getAll() {
        return this.items
    }
}