const Query = require('/util/query');

class OrgTable {
  readonly #baseQuery:Query = new Query({
    talbe:    ['org'],
    filters:  ['disabled=false'],
    orders:   ['created_at']
  })

  getById(id:number) {
    //FIXME: プレースホルダ方式への変更
    return this.#baseQuery.spawn({filters: [`id=${id}`]}).getSelect();
  }

  /**
  * 再帰
  */
  getByIdWithChildren(id:number, category:number, depth:number=1) {
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
            and category = ${category}
            and is_deleted=false
      )
      select * from temp order by id;
    `;
  }

  /**
  * 隣接要素
  */
  getChildren(parent:number, category:number) {
    return this.#baseQuery.spawn({
      filters: [`category=${category}`, `parent=${parent}`]
    }).getSelect();
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
