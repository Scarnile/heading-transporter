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
    private categories: Map<string, HeadingCategory> = new Map()

    // Convert initial data to a map
    constructor(initialData?: HeadingCategory[]) {
        super()
        if (initialData) {
            for (const category of initialData) {
                this.categories.set(category.id, category)          
            }
        }
    }

    addCategory(name: string, ...headingIds: string[]): HeadingCategory {

        const info: HeadingCategory = {
            id: uuidv4(),
            name,
            headingIds,
        }
        this.categories.set(info.id, info)
        return info
    }

    getCategoryById(id: string) {
        return this.categories.get(id)
    }

    getCategorizedHeadingIds(): Set<string> {
        const result = new Set<string>

         for (const category of this.categories.values()) {
            category.headingIds.forEach((headingId) => {
                result.add(headingId)
            })
        }

        return result
    }

    getHeadingIdsFromCategory(categoryId: string): string[] | undefined {
        return this.categories.get(categoryId)?.headingIds
    }

    addHeadingToCategory(headingId: string, category: HeadingCategory) {
        this.categories.get(category.id)?.headingIds.push(headingId)
    }

    serialize(): HeadingCategory[] {
        return [...this.categories.values()]
    }
}