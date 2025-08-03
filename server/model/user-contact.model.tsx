export class UserContactModel {
    fullname: string;
    email: string;
    phone: string;
    message: string;
    address: string;
    addressDetail: string;

    constructor() {
        this.fullname = '';
        this.email = '';
        this.phone = '';
        this.message = '';
        this.address = '';
        this.addressDetail = '';
    }
}