const Query = require('/model/query');

enum CATEGORY {
  CAMPANY,
  DEPARTMENT,
  FACILITY
}

class Organization {
  readonly #baseQuery:Query = new Query({
    talbe:    ['org'],
    filters:  ['disabled=false'],
    orders:   ['created_at']
  })

  #category: CATEGORY = CATEGORY.CAMPANY;
  get category() { return this.#category }
  set category(value) { this.#category = value}

  getById(id:number) {
    //FIXME: プレースホルダ方式への変更
    return this.#baseQuery.spawn({filters: [`id=${id}`]}).getSelect()
  }

  /**
  * 再帰
  */
  getByIdWithChildren(id:number, depth:number=1) {
    //FIXME: Query ビルダーを使って構築したい
    return `
      with recursive temp(id, parent, name) as (
          select id, parent, name
          from compny_structure
          where id = {id}
            and is_deleted=false
          union all
          select dept.id, dept.parent, dept.name
          from temp, dept
          where dept.parent = temp.id
            and category = ${this.category}
            and is_deleted=false
      )
      select * from temp order by id;
    `
  }

  /**
  * 隣接要素
  */
  getChildren(parent_id:number) {
    return this.#baseQuery.spawn({
      filters: [`category=${this.category}`, `parent=${parent_id}`]
    }).getSelect()
  }

  /**
  * 追加
  */
  insertItem(props:any, parent:number|null=null) {

  }

  /**
  * 更新
  */
  updateItem(props:any) {

  }
}

export class Company extends Organization {
  constructor() {
    super()
    this.category = CATEGORY.CAMPANY
  }
}

export class Department extends Organization {
  constructor() {
    super()
    this.category = CATEGORY.DEPARTMENT
  }
}

export class Facility extends Organization {
  constructor() {
    super()
    this.category = CATEGORY.FACILITY
  }
}
