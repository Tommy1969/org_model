const CATEGORY = {
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

class Company extends Organization {
  constructor(element:Partial<OrganizationElement>) {
    super(element)
    this.category = CATEGORY.COMPANY;
  }
}

class Department extends Organization {
  constructor(element:Partial<OrganizationElement>) {
    super(element)
    this.category = CATEGORY.DEPARTMENT;
  }
}

class Facility extends Organization {
  constructor(element:Partial<OrganizationElement>) {
    super(element)
    this.category = CATEGORY.FACILITY;
  }
}

describe('会社について', () => {
  const target = new Company({name: '会社'});
  it('名前を取得できること', () => {
    expect(target.name).toEqual('会社');
  })
  it('カテゴリが会社であること', () => {
    expect(target.category).toBe(CATEGORY.COMPANY);
  })
})

describe('部門について', () => {
  const target = new Department({name: '組織'});
  it('名前を取得できること', () => {
    expect(target.name).toEqual('組織');
  })
  it('カテゴリが部門であること', () => {
    expect(target.category).toBe(CATEGORY.DEPARTMENT);
  })
})

describe('施設について', () => {
  const target = new Facility({name: '施設'});
  it('名前を取得できること', () => {
    expect(target.name).toEqual('施設');
  })
  it('カテゴリが施設であること', () => {
    expect(target.category).toBe(CATEGORY.FACILITY);
  })
})
