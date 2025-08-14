import { Cart } from "../model/cart.model";
import { CategoryFilterModel } from "../model/category-filter.model";
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInMonths, differenceInSeconds, differenceInYears } from 'date-fns';
// import dayjs from 'dayjs';
// import relativeTime from 'dayjs/plugin/relativeTime';
// import 'dayjs/locale/vi'; // tiếng Việt (hoặc 'en' nếu bạn dùng tiếng Anh)

// dayjs.extend(relativeTime);
// dayjs.locale('vi'); // hoặc 'en'

export class AppUtils {
    public static formatCurrency = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    }

    public static addCart = (item: Cart) => {
        console.log(item);
        const cart = localStorage.getItem('cart');
        if (cart) {
            const newCart: Cart[] = JSON.parse(cart);
            const prod = newCart.find((i: Cart) => i.productId === item.productId);
            console.log('prod', prod);
            if (prod) {
                prod.quantity += item.quantity;
            } else {
                newCart.push(item);
            }
            localStorage.setItem('cart', JSON.stringify(newCart));
        } else {
            console.log('prod2', item);
            localStorage.setItem('cart', JSON.stringify([item]));
        }
    }

    public static updateCart = (item: Cart) => {
        const cart = localStorage.getItem('cart');
        if (cart) {
            const newCart: Cart[] = JSON.parse(cart);
            const prodIndex = newCart.findIndex((i: Cart) => i.productId === item.productId);
            if (prodIndex != -1) {
                newCart[prodIndex] = item;
                localStorage.setItem('cart', JSON.stringify(newCart));
            }
        }
    }

    public static getCart = (): Promise<Cart[]> => {
        try {
            const cart: any = localStorage.getItem('cart');
            return Promise.resolve(JSON.parse(cart || []) || []).catch(() => []);
        } catch (error) {
            console.log(error);
            return Promise.resolve([]).catch(() => []);
        }
    }

    public static reloadCart = (items: Cart[]) => {
        localStorage.setItem('cart', JSON.stringify(items));
    }

    public static readonly BASE_URL = 'http://localhost:3000';
    // public static readonly BASE_URL = 'https://xuanphongsolar.com';

    public static readonly API_URL = {
        FILE: AppUtils.BASE_URL + '/api/files/',
        PRODUCT: AppUtils.BASE_URL + '/api/products/',
        PRODUCT_V2: AppUtils.BASE_URL + '/api/v2/products/',
        ORDER: AppUtils.BASE_URL + '/api/orders/'
    }

    public static formattedDiscount = (value: number, type: string) => {
        if (value === 0) return '';
        if (type === 'percent') {
            return value + ' %';
        }
        return AppUtils.formatCurrency(value);
    }

    public static calculateDiscountString = (price: number, discount: number, discountType: string) => {
        if (!price) return 'Liên hệ';
        if (discount === 0) return AppUtils.formatCurrency(price);
        if (discountType === 'percent') {
            const result = price - (price * discount / 100);
            // console.log('result', result);
            return AppUtils.formatCurrency(result > 0 ? result : 0);
        }
        const result = price - discount;
        console.log('result', result);
        return AppUtils.formatCurrency(result > 0 ? result : 0);
    }

    public static calculateDiscount = (price: number, discount: number, discountType: string): number => {
        if (!price) return 0;
        if (discount === 0) return price;
        if (discountType === 'percent') {
            return price - (price * discount / 100);
        }
        const result = price - discount;
        return result > 0 ? result : 0;
    }

    public static convertFilterArrayToRecord(filters: CategoryFilterModel[]): Record<string, string | string[]> {
        const result: Record<string, string | string[]> = {};

        filters.forEach(({ key, operator, value }) => {
            let expr: string;

            if (operator === 'like') {
                expr = value;
            } else {
                expr = `${operator}${value}`;
            }

            if (result[key]) {
                if (Array.isArray(result[key])) {
                    (result[key] as string[]).push(expr);
                } else {
                    result[key] = [result[key] as string, expr];
                }
            } else {
                result[key] = expr;
            }
        });

        return result;
    }

    public static slugify(str: string): string {
        return str
            .toLowerCase()
            .normalize("NFD")                     // Tách dấu khỏi ký tự (e.g. "ấ" => "a" + "̂")
            .replace(/[\u0300-\u036f]/g, "")     // Xoá các dấu (accents)
            .replace(/[^a-z0-9\s-]/g, "")        // Xoá ký tự đặc biệt
            .trim();                              // Xoá khoảng trắng đầu/cuối
    }



    // public static getTimeDifference = (updatedDate: Date) => {
    //     if (!updatedDate) return "Không có ngày cập nhật";
    //     return dayjs(updatedDate).fromNow()
    // };

    public static formatPhoneNumber = (phone: string) => {
        return phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
    };

}