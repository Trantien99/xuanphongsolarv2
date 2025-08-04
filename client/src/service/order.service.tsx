import Order from "../model/order.model";
import ApiClient from "./client";

const addOrder = (order: Order) => ApiClient.post(`/api/orders`, order, { headers: { "Content-Type": "application/json" } });


export const OrderService = {
  addOrder
}