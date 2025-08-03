import Order from "../model/order.model";
import { RequestForm } from "../model/request-form";
import ApiClient from "./client";

const addRequestForm = (body: RequestForm) => ApiClient.post(`/api/request-form`, body, { headers: { "Content-Type": "application/json" } });


export const RequestFormService = {
  addRequestForm
}