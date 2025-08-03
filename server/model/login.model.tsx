export class LoginResponse {
    name: string;
    email: string;
    phoneNumber: string;
    accessToken: string;

    constructor() {
        this.name = '';
        this.email = '';
        this.phoneNumber = '';
        this.accessToken = '';
    }
}