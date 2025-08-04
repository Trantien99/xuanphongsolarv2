export class Cart {
    productId: string;
    quantity: number;
    checked?: boolean;

    constructor() {
        this.productId = '';
        this.quantity = 0;
        this.checked = false;
    }
}