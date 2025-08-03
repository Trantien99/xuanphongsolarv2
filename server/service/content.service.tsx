import { Content } from "../model/content.model";
import { SearchModel } from "../model/search.model";
import ApiClient from "./client";

const getContentById = (id: string) => ApiClient.get(`/api/v2/contents/${id}`).then((response) => response?.data);
const createContent = (Content: Content) => ApiClient.post('/api/contents', Content);
const saveDraft = (Content: Content) => ApiClient.post('/api/contents/draft', Content);
const updateContent = (id: string, Content: Content) => ApiClient.put(`/api/contents/${id}`, Content);
const inactiveContent = (id: string) => ApiClient.patch(`/api/contents/${id}/inactive`);
const activeContent = (id: string) => ApiClient.patch(`/api/contents/${id}/active`);
const findByCondition = (search: SearchModel<Content[]>): Promise<SearchModel<Content[]>> => ApiClient.post(`/api/contents/search`, search).then((response) => response?.data);
const getContentsV2 = (): Promise<Content[]> => ApiClient.get(`/api/v2/contents`).then((response) => response?.data);
const moveUpContent = (id: string) => ApiClient.patch(`/api/contents/${id}/move-up`);
const moveDownContent = (id: string) => ApiClient.patch(`/api/contents/${id}/move-down`);


export const ContentService = {
    getContentById,
    createContent,
    updateContent,
    inactiveContent,
    activeContent,
    findByCondition,
    saveDraft,
    getContentsV2,
    moveUpContent,
    moveDownContent
};