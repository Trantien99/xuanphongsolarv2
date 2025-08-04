export class SearchModel<T> {
    data?: T;
    filter: { };
    fields?: string;
    page: number;
    pageSize: number;
    total?: number;
    sort?: {
        field: string;
        order: number;
    } | null;

    constructor() {
        this.data = {} as T;
        this.filter = {};
        this.page = 1;
        this.pageSize = 10;
        this.total = 0;
        this.sort = { field: '', order: 0 };
    }
}