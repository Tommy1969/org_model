import { CATEGORY, Company, Department, Facility } from "./organization"

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
