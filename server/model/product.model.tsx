class Product {
    id: string;
    name: string;
    code: string;
    price: number;
    discount: {
        value: number;
        type: string;
        code: string;
    } | null;
    amount: number;
    origin: string;
    brand: string;
    style: string;
    material: string;
    warranty: string;
    warrantyType: string;
    avatar: string;
    imageUrls: string[];
    content: string;
    status: string;
    category: string;
    constructor() {
        this.id = '';
        this.name = '';
        this.code = '';
        this.price = 0;
        this.discount = null;
        this.amount = 0;
        this.origin = '';
        this.brand = '';
        this.style = '';
        this.material = '';
        this.warranty = '';
        this.warrantyType = '';
        this.imageUrls = [];
        this.content = '';
        this.status = '';
        this.avatar = '';
        this.category = '';
    }
}

export default Product;