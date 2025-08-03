import { Setting } from "../model/setting.model";
import { SearchModel } from "../model/search.model";
import ApiClient from "./client";

const getSettingActive = () => ApiClient.get(`/api/setting/active`).then((response) => response?.data);
const getSettingById = (id: string) => ApiClient.get(`/api/setting/${id}`).then((response) => response?.data);
const createSetting = (setting: Setting) => ApiClient.post('/api/setting', setting);
const saveDraft = (setting: Setting) => ApiClient.post('/api/setting/draft', setting);
const updateSetting = (id: string, setting: Setting) => ApiClient.put(`/api/setting/${id}`, setting);
const inactiveSetting = (id: string) => ApiClient.patch(`/api/setting/${id}/inactive`);
const activeSetting = (id: string) => ApiClient.patch(`/api/setting/${id}/active`);
const findByCondition = (search: SearchModel<Setting[]>): Promise<SearchModel<Setting[]>> => ApiClient.post(`/api/setting/search`, search).then((response) => response?.data);
const getCategoriesV2 = (): Promise<Setting[]> => ApiClient.get(`/api/v2/setting`).then((response) => response?.data);
const moveUpSetting = (id: string) => ApiClient.patch(`/api/setting/${id}/move-up`);
const moveDownSetting = (id: string) => ApiClient.patch(`/api/setting/${id}/move-down`);


export const SettingService = {
    getSettingActive,
    getSettingById,
    createSetting,
    updateSetting,
    inactiveSetting,
    activeSetting,
    findByCondition,
    saveDraft,
    getCategoriesV2,
    moveUpSetting,
    moveDownSetting
};