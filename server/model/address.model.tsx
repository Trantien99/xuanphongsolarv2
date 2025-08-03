export class Address {
  id?: string;
  level?: number;
  code?: string;
  name?: string;
  fullName?: string;
  codeName?: string;
  provinceCode?: string;
  districtCode?: string;
  parent?: string;

  constructor() {
    this.id = '';
    this.level = 0;
    this.code = '';
    this.name = '';
    this.fullName = '';
    this.codeName = '';
    this.provinceCode = '';
    this.districtCode = '';
    this.parent = '';
  }
}