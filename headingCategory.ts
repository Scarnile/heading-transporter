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
    private categories: Map<string, HeadingInfo[]> = new Map()

    addCategory(categoryName: string, ...headingIds: string[]): HeadingCategory {

        const info: HeadingCategory = {
            id: uuidv4(),
            categoryName,
            headingIds,
        }

        return info
    }
}