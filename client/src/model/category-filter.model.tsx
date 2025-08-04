export class CategoryFilterModel {
    key: string;
    label: string;
    operator: string;
    value: string;
    isSelected?: boolean;

    constructor() {
        this.key = '';
        this.label = '';
        this.operator = '';
        this.value = '';
        this.isSelected = false
    }
}