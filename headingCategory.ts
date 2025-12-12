import HeadingTransporterPlugin, { HeadingTransporterSettings } from "main";

import { HeadingInfo } from "heading";
import { v4 as uuidv4 } from "uuid";

export type HeadingCategory = {
    id: string;
    categoryName: string;
    headingIds: string[];
}

export const addHeadingCategory = (name: string, settings: HeadingTransporterSettings, ...headingIds: string[]) => {
    const newCategory: HeadingCategory = {
        id: uuidv4(),
        categoryName: name,
        headingIds: headingIds
    }

    settings.headingCategories.push(newCategory)
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
        this.categories
        return info
    }

    serialize(): HeadingCategory[] {
        return [...this.categories.values()]
    }
}