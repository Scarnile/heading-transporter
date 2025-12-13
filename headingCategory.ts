import HeadingTransporterPlugin, { HeadingTransporterSettings } from "main";

import { HeadingInfo } from "heading";
import { v4 as uuidv4 } from "uuid";

export type HeadingCategory = {
    id: string;
    categoryName: string;
    headingIds: string[];
}

export class HeadingCategoryManager {

    // Heading Category ID returns the HeadingCategory object
    private categories: Map<string, HeadingCategory> = new Map()

    // Convert initial data to a map
    constructor(initialData?: HeadingCategory[]) {
        if (initialData) {
            for (const category of initialData) {
                this.categories.set(category.id, category)          
            }
        }
    }

    addCategory(categoryName: string, ...headingIds: string[]): HeadingCategory {

        const info: HeadingCategory = {
            id: uuidv4(),
            categoryName,
            headingIds,
        }
        this.categories.set(info.id, info)
        
        return info
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