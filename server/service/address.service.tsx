import { Address } from "../model/address.model";
import { SearchModel } from "../model/search.model";
import ApiClient from "./client";

const getAddressById = (id: string) => ApiClient.get(`/api/address/${id}`).then((response) => response?.data);
const findByCondition = (search: SearchModel<Address[]>): Promise<SearchModel<Address[]>> => ApiClient.post(`/api/address/search`, search).then((response) => response?.data);

export const AddressService = {
    getAddressById,
    findByCondition,
};