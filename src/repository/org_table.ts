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

  async getById(id:string):Promise<NodeType> {
    const query = this.#baseQuery.spawn({filters: ['id=$1', 'category=$2']}).getSelect();
    const result = await this.#client.query(query, [id, this.#category]);

    if (result.rowCount === 0) {
      throw new NotFoundError(id);
    }
    return result.rows[0] as NodeType;
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

  async getById(id:string):Promise<Company> {
    return new Company(await super.getById(id));
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

  async getById(id:string):Promise<Department> {
    return new Department(await super.getById(id));
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

  async getById(id:string):Promise<Facility> {
    return new Facility(await super.getById(id));
  }
}
