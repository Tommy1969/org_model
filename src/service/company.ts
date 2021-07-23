import { client } from "../repository/db";
import { CmpTable } from '../repository/org_table'
import { Company } from '../model/node'

export class CompanyService {
  static async getById(id:string):Promise<Company> {
    const tbl = new CmpTable(client);
    return await tbl.getById(id)
  }
}
