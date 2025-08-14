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

    rating?: number;
    reviewCount?: number;
    isFeatured?: boolean;
    isNew?: boolean;
    isBestSeller?: boolean;
    isTopRated?: boolean;
    isTopSeller?: boolean;
    inStock?: boolean;
    stockQuantity?: number;
    description?: string;
    specifications?: Record<string, string>;
    features?: string[];
    additionalInfo?: string;
    relatedProducts?: string[];
    // reviews?: Review[];
    reviews?: any[];
    relatedCategories?: string[];
    relatedBrands?: string[];
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