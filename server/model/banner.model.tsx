export class Banner {
    id: string;
    name: string;
    image: string;
    order: number;
    description: string;
    status: string;

    constructor() {
        this.id = '';
        this.name = '';
        this.image = '';
        this.order = 0;
        this.status = '';
        this.description = '';
    }
}