import { Category } from "../model/category.model";
import { SearchModel } from "../model/search.model";
import ApiClient from "./client";

const getCategoryById = (id: string) => ApiClient.get(`/api/categories/${id}`).then((response) => response?.data);
const findByCondition = (search: SearchModel<Category[]>): Promise<SearchModel<Category[]>> => ApiClient.post(`/api/v2/categories/search`, search).then((response) => response?.data);


export const CategoryService = {
    getCategoryById,
    findByCondition,
};