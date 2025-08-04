import { PhoneModel } from "./phone.model";

export class Setting {
    id: string;
    name: string;
    shortName: string;
    subTitle: string;
    firstNote: string;
    mainPhone: PhoneModel;
    warrantyPhone: PhoneModel;
    supportPhone: PhoneModel;
    hotline: PhoneModel;
    zaloLink: string;
    facebookLink: string;
    youtubeLink: string;
    description: string;
    createdBy: string;
    createdDate: Date;
    updatedDate: Date;
    updatedBy: string;
    order: number;
    status: string;
    email: string;
    messagerLink: string;
    address: string;


    constructor() {
        this.id = '';
        this.name = '';
        this.shortName = '';
        this.subTitle = '';
        this.firstNote = '';
        this.mainPhone = new PhoneModel();
        this.warrantyPhone = new PhoneModel();
        this.supportPhone = new PhoneModel();
        this.hotline = new PhoneModel();
        this.zaloLink = '';
        this.facebookLink = '';
        this.youtubeLink = '';
        this.description = '';
        this.createdBy = '';
        this.createdDate = new Date();
        this.updatedDate = new Date();
        this.updatedBy = '';
        this.order = 0;
        this.status = '';
        this.email = '';
        this.messagerLink = '';
        this.address = '';
      }
}