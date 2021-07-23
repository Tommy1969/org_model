import { Client } from "pg";
import { Query } from "../util/query";

/**
 * @Obsolete
 */
export class OrgTable2 {
  readonly #client:Client;
  readonly #baseQuery:Query = new Query({
    tables:   ['org'],
    filters:  ['disabled=false'],
    orders:   ['created_at']
  })

  constructor(client:Client) {
    this.#client = client;
  }

  async getById(id:number):Promise<string[]> {
    const query = this.#baseQuery.spawn({filters: ['id=$1']}).getSelect();
    const result = await this.#client.query(query, [id]);
    if (result.rowCount===0) {
      throw new Error(`Not found organization (#${id})`);
    }
    return result.rows[0];
  }

  /**
  * 隣接要素
  */
  async getChildren(parent:number, category:number):Promise<string[][]> {
    const query = this.#baseQuery.spawn({
      filters: [`category=$1`, `parent=$2`]
    }).getSelect();
    const result = await this.#client.query(query, [category, parent]);
    return result.rows;
  }

  /**
  * 再帰
  */
  getByIdWithChildren(id:number, category:number, depth=1):string {
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
  * 追加
  */
  // insertItem(props:any, parent:number|null=null) {

  // }

  /**
  * 更新
  */
  // updateItem(props:any) {

  // }
}
