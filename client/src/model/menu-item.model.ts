export class MenuItemData {
    name: string;
    url: string;
    icon: string;
    order: number;
    isShow: boolean;

    constructor() {
        this.name = '';
        this.url = '';
        this.icon = '';
        this.order = 0;
        this.isShow = true;
    }
}