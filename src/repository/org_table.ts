import { Client } from "pg";
import { NotFoundError } from '../exception'
import { Company, Department, Facility } from '../model/node'
import { NodeType } from '../model/node.interface'

export class OrgTable {
  #client

  constructor(client:Client) {
    this.#client = client
  }

  async getById(id:string):Promise<NodeType> {
    const query = 'select * from org where id=$1;'
    const result = await this.#client.query(query, [id])
    if (result.rowCount === 0) {
      throw new NotFoundError(id)
    }
    return result.rows[0] as NodeType;
  }
}

/**
 * 会社の時のテーブル操作
 */
export class CmpTable extends OrgTable {
  async getById(id:string):Promise<Company> {
    return new Company(await super.getById(id));
  }
}

/**
 * 部門の時のテーブル操作
 */
export class DepTable extends OrgTable {
  async getById(id:string):Promise<Department> {
    return new Department(await super.getById(id));
  }
}

/**
 * 施設の時のテーブル操作
 */
export class FacTable extends OrgTable {
  async getById(id:string):Promise<Facility> {
    return new Facility(await super.getById(id));
  }
}
