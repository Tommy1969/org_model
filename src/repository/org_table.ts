import { Client } from "pg";
import { NotFoundError } from '../exception';
import { Company, Department, Facility } from '../model/node';
import { CATEGORY, NodeType } from '../model/node.interface';
import { Query } from "../util/query";

export class OrgTable {
  readonly #client
  readonly #baseQuery:Query = new Query({
    tables:   ['org'],
    filters:  ['disabled=false'],
    orders:   ['created_at']
  })
  #category: CATEGORY

  constructor(client:Client) {
    this.#client = client;
    this.#category = CATEGORY.COMPANY;
  }

  set category(value:CATEGORY) { this.#category = value;}

  async getNodeById(id:string):Promise<NodeType> {
    const query = this.#baseQuery.spawn({filters: ['id=$1', 'category=$2']}).getSelect();
    const result = await this.#client.query(query, [id, this.#category]);

    if (result.rowCount === 0) {
      throw new NotFoundError(id);
    }
    return result.rows[0] as NodeType;
  }

  async getAllChildrenById(id:string, category:CATEGORY):Promise<NodeType[]> {
    const query = `
      with recursive children (id) as (
        select *
        from org
        where id = $1
          and category = $2
          and disabled=false
        union all
        select org.*
        from children, org
        where org.parent = children.id
          and org.category = $3
          and org.disabled=false
      )
      select * from children order by created_at;
    `;
    const result = await this.#client.query(query, [id, this.#category, category]);

    if (result.rowCount === 0) {
      throw new NotFoundError(id);
    }
    return result.rows as NodeType[];
  }

  convModel(element:NodeType):Company|Department|Facility {
    const CLASSES = [Company, Department, Facility];
    return new CLASSES[element.category-1](element);
  }
}

/**
 * 会社の時のテーブル操作
 */
export class CmpTable extends OrgTable {
  constructor(client:Client) {
    super(client);
    this.category = CATEGORY.COMPANY;
  }

  async getNodeById(id:string):Promise<Company> {
    return this.convModel(await super.getNodeById(id));
  }

  async getAllDepartmentsById(id:string):Promise<(Company|Department)[]> {
    const result:NodeType[] = await this.getAllChildrenById(id, CATEGORY.DEPARTMENT);
    return result.map(it => this.convModel(it));
  }

  async getAllFacilitiesById(id:string):Promise<(Company|Facility)[]> {
    const result:NodeType[] = await this.getAllChildrenById(id, CATEGORY.DEPARTMENT);
    return result.map(it => this.convModel(it));
  }
}

/**
 * 部門の時のテーブル操作
 */
export class DepTable extends OrgTable {
  constructor(client:Client) {
    super(client);
    this.category = CATEGORY.DEPARTMENT;
  }

  async getNodeById(id:string):Promise<Department> {
    return this.convModel(await super.getNodeById(id));
  }
}

/**
 * 施設の時のテーブル操作
 */
export class FacTable extends OrgTable {
  constructor(client:Client) {
    super(client);
    this.category = CATEGORY.FACILITY;
  }

  async getNodeById(id:string):Promise<Facility> {
    return this.convModel(await super.getNodeById(id));
  }
}
