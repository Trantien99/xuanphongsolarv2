import Product from "../model/product.model";
import { SearchModel } from "../model/search.model";
import ApiClient from "./client";
import { AppUtils } from "../utils/AppUtils";

const getProductByIds = (id: string[]) => ApiClient.get(AppUtils.API_URL.PRODUCT_V2, { params: { id } }).then((response) => response?.data);
const getProductById = (id: string) => ApiClient.get(`${AppUtils.API_URL.PRODUCT_V2}${id}`).then((response) => response?.data) as Promise<Product>;
const getProductByCategories = (category: string[]) => ApiClient.get(AppUtils.API_URL.PRODUCT_V2, { params: { category } }).then((response) => response?.data);
const findByCondition = (search: SearchModel<any>): Promise<SearchModel<Product[]>> => ApiClient.post(`${AppUtils.API_URL.PRODUCT_V2}search`, search).then((response) => response?.data);

export const ProductService = {
    getProductById,
    getProductByIds,
    findByCondition,
    getProductByCategories,
}