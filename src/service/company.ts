import { client } from "../repository/db";
import { OrgTable } from '../repository/org'
import { Company } from '../model/organization'

export class CompanyService {
  static async getById(id:number):Promise<Company> {
    const tbl = new OrgTable(client);
    return new Company(await tbl.getById(id));
  }
}
