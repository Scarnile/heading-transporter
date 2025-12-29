import HeadingTransporterPlugin, { HeadingTransporterSettings } from "main";

import { HeadingInfo } from "heading";
import { v4 as uuidv4 } from "uuid";
import { BaseManager } from "baseManager";

export type HeadingCategory = {
    id: string;
    name: string;
    headingIds: string[];
    selectedHeadingId?: string;
}

export class HeadingCategoryManager extends BaseManager<HeadingCategory> {

    // Heading Category ID returns the HeadingCategory object

    // Convert initial data to a map
    constructor(initialData?: HeadingCategory[]) {
        super()
        if (initialData) {
            for (const category of initialData) {
                this.items.set(category.id, category)          
            }
        }
    }

    addCategory(name: string, ...headingIds: string[]): HeadingCategory {

        const info: HeadingCategory = {
            id: uuidv4(),
            name,
            headingIds,
        }
        this.items.set(info.id, info)
        return info
    }

    getCategorizedHeadingIds(): Set<string> {
        const result = new Set<string>

            for (const category of this.items.values()) {
                category.headingIds.forEach((headingId) => {
                    result.add(headingId)
            })
        }

        return result
    }

    getHeadingIdsFromCategory(categoryId: string): string[] | undefined {
        this.getById
        return this.items.get(categoryId)?.headingIds
    }

    addHeadingToCategory(headingId: string, category: HeadingCategory) {
        this.items.get(category.id)?.headingIds.push(headingId)
    }

    serialize(): HeadingCategory[] {
        return [...this.items.values()]
    }
}