import { client } from "../repository/db";
import { CmpTable, DepTable, FacTable } from '../repository/org_table';
import { Company, Department, Facility } from '../model/node';

export class StorageService {
  static async getCompanyById(id: string): Promise<Company> {
    const tbl = new CmpTable(client);
    return await tbl.getById(id);
  }

  static async getDepartmentById(id: string): Promise<Department> {
    const tbl = new DepTable(client);
    return await tbl.getById(id);
  }

  static async getFacilityById(id: string): Promise<Facility> {
    const tbl = new FacTable(client);
    return await tbl.getById(id);
  }
}
