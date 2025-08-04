import { FlowModel } from "./flow.model";
import { OrderProductModel } from "./order-product.model";
import { UserContactModel } from "./user-contact.model";

class Order {
    id?: string;
    code?: string;
    status?: string | any;
    flows?: FlowModel[];
    userContact = new UserContactModel();
    products: OrderProductModel[];


    constructor() {
        this.id = '';
        this.code = '';
        this.status = '';
        this.flows = [];
        this.userContact = new UserContactModel();
        this.products = [];
    }
}

export default Order;

export const OrderStatus = {
    PENDING: 'Chờ xử lý',
    PROCESSING: 'Đang xử lý',
    DELIVERING: 'Đang giao',
    SUCCESS: 'Đã hoàn thành',
    CANCEL: 'Đã huỷ',
    REFUND: 'Đang hoàn lại',
    REFUND_SUCCESS: 'Hoàn lại thành công',
    REFUND_FAIL: 'Hoàn lại thất bại'
}