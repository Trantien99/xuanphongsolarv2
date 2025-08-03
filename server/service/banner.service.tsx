import { Banner } from "../model/banner.model";
import ApiClient from "./client";

const getCategoriesV2 = (): Promise<Banner[]> => ApiClient.get(`/api/v2/banners`).then((response) => response?.data);


export const BannerService = {
    getCategoriesV2,
};