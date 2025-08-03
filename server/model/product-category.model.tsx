import { CategoryFilterModel } from "./category-filter.model";
import { MenuItemData } from "./menu-item.model";
import Product from "./product.model";

export class ProductCategory {
    label: string;
    firstNote?: string;
    icon?: string;
    key: string;
    items: Product[];
    menuItems?: MenuItemData[];
    filterItems?: CategoryFilterModel[];
    page: number;
    pageSize: number;
    total: number;
    isShowNextPage: boolean ;
    isShowHidenPage: boolean;
    isShowFullPage: boolean;
    content?: string;

    constructor() {
        this.label = '';
        this.key = '';
        this.firstNote = '';
        this.icon = '';
        this.items = [];
        this.page = 1;
        this.total = 0;
        this.pageSize = 10;
        this.isShowNextPage = false;
        this.isShowHidenPage = false;
        this.isShowFullPage = false;
        this.content = '';
        this.menuItems = [];
        this.filterItems = [];
     }
}