export class FlowModel {
    status: string;
    description: string;
    date: Date;

    constructor() {
        this.status = '';
        this.description = '';
        this.date = new Date();
    }
}