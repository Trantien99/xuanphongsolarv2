export class OrderProductModel {
    id: string;
    name: string;
    code: string;
    amount: number;
    price: number;
    discount: number;
    discountType: string;
    warranty: string;
    warrantyType: string;
    origin: string;
    brand: string;
    style: string;
    material: string;
    avatar: string;
    category: string;

    constructor() {
        this.id = '';
        this.name = '';
        this.code = '';
        this.amount = 0;
        this.price = 0;
        this.discount = 0;
        this.discountType = '';
        this.warranty = '';
        this.warrantyType = '';
        this.origin = '';
        this.brand = '';
        this.style = '';
        this.material = '';
        this.avatar = '';
        this.category = '';
    }
}