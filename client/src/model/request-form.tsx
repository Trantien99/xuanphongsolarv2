export class RequestForm {
    id?: string;
    name?: string;
    phoneNumber: string;
    email: string;
    message?: string;
    address?: string;
    category: string;
    status?: string;
    note: string;

    constructor() {
        this.id = '';
        this.name = '';
        this.phoneNumber = '';
        this.email = '';
        this.message = '';
        this.address = '';
        this.category = '';
        this.status = '';
        this.note = '';
    }
}
