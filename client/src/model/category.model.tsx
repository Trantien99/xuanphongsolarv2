import { CategoryFilterModel } from "./category-filter.model";
import { MenuItemData } from "./menu-item.model";

export class Category {
    id: string;
    label: string;
    key: string;
    content?: string;
    status: string;
    order: number;
    menuItems: MenuItemData[];
    filterItems?: CategoryFilterModel[];
    icon?: string;
    firstNote?: any;
    itemCount?: any;
    href: string;

    constructor() {
        this.id = '';
        this.label = '';
        this.key = '';
        this.content = '';
        this.status = '';
        this.order = 0;
        this.menuItems = [];
        this.filterItems = [];
        this.icon = '';
        this.firstNote = '';
        this.href = '';
    }
}