export const CATEGORY = {
  COMPANY: 1,
  DEPARTMENT: 2,
  FACILITY: 3
} as const;
type CATEGORY = typeof CATEGORY[keyof typeof CATEGORY];

type OrganizationElement = {
  name: string;
  category: CATEGORY;
  children: Organization[];
}

abstract class Organization {
  #element:OrganizationElement
  constructor(element:Partial<OrganizationElement>) {
    this.#element = {
      name: element?.name ?? '',
      category: CATEGORY.COMPANY,
      children: []
    }
  }
  get name() { return this.#element.name; }
  get category() { return this.#element.category; }
  set category(value) { this.#element.category = value; }
}

export class Company extends Organization {
  constructor(element:Partial<OrganizationElement>) {
    super(element)
    this.category = CATEGORY.COMPANY;
  }
}

export class Department extends Organization {
  constructor(element:Partial<OrganizationElement>) {
    super(element)
    this.category = CATEGORY.DEPARTMENT;
  }
}

export class Facility extends Organization {
  constructor(element:Partial<OrganizationElement>) {
    super(element)
    this.category = CATEGORY.FACILITY;
  }
}
