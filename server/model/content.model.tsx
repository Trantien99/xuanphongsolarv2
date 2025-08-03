export class Content {
    id: string;
    type: string;
    content: string;
    author: string;
    avatar: string;
    title: string;
    shortName: string;
    description: string;
    tags: string[];
    views: number;
    comments: number;
    status: string;
    order: number;
    createdBy: string;
    createdDate: Date;
    updatedDate: Date;
    updatedBy: string;

    constructor() {
        this.id = '';
        this.type = '';
        this.content = '';
        this.author = '';
        this.avatar = '';
        this.title = '';
        this.shortName = '';
        this.description = '';
        this.tags = [''];
        this.views = 0;
        this.comments = 0;
        this.status = '';
        this.order = 0;
        this.createdBy = '';
        this.createdDate = new Date();
        this.updatedDate = new Date();
        this.updatedBy = '';
    }
}