export default class PageModel<T> {
    pageIndex: number;
    pageSize: number;
    total: number;
    data: T[];

    constructor() {
        this.pageIndex = 0;
        this.pageSize = 10;
        this.total = 0;
        this.data = [];
    }
}