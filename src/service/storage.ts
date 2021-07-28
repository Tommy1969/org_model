import { client } from "../repository/db";
import { CmpTable, DepTable, FacTable } from '../repository/org_table';
import { Company, Department, Facility } from '../model/node';

export class StorageService {
  static async getCompanyById(id: string): Promise<Company> {
    const tbl = new CmpTable(client);
    return await tbl.getNodeById(id);
  }

  static async getDepartmentById(id: string): Promise<Department> {
    const tbl = new DepTable(client);
    return await tbl.getNodeById(id);
  }

  static async getFacilityById(id: string): Promise<Facility> {
    const tbl = new FacTable(client);
    return await tbl.getNodeById(id);
  }

  /**
   * 部門階層の取得
   * @param id 会社 ID
   * @returns 部門階層を含んだ会社オブジェクト
   */
  static async getDepStructureByCmpId(id: string): Promise<Company> {
    const tbl = new CmpTable(client);
    const tmp = await tbl.getAllDepartmentsById(id);
    const map:Map<string, Company|Department> = tmp.reduce((acm, it) => {
      if (it.id) {acm.set(it.id, it);}
      return acm;
    }, new Map<string, Company|Department>());
    tmp.filter(it => it.parent !== null)
    .forEach(it => map.get(it.parent ?? '')?.children.push(it));
    return map.get(id) as Company;
  }

  /**
   * 施設階層の取得
   * @param id 会社 ID
   * @returns 施設階層を含んだ会社オブジェクト
   */
  static async getFacStructureByCmpId(id: string): Promise<Company> {
    const tbl = new CmpTable(client);
    const tmp = await tbl.getAllFacilitiesById(id);
    const map:Map<string, Company|Facility> = tmp.reduce((acm, it) => {
      if (it.id) {acm.set(it.id, it);}
      return acm;
    }, new Map<string, Company|Facility>());
    tmp.filter(it => it.parent !== null)
    .forEach(it => map.get(it.parent ?? '')?.children.push(it));
    return map.get(id) as Company;
  }
}
