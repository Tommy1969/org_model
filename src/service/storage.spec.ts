import { v4 as uuidv4 } from 'uuid';
import { client } from "../repository/db";
import format from "pg-format";
import { StorageService } from './storage';
import { Company, Department, Facility } from '../model/node';

const UUID:string[] = Array(20).fill('').map(() => uuidv4());
const TEST_DATA = [
  [UUID[0], null, 1, '会社1'],
  [UUID[1], UUID[0], 2, '部門2'],
  [UUID[2], UUID[0], 2, '部門3'],
  [UUID[3], UUID[2], 2, '部門31'],
  [UUID[4], UUID[2], 2, '部門32'],
  [UUID[5], UUID[0], 3, '施設3'],
  [UUID[6], UUID[0], 3, '施設4'],
  [UUID[7], UUID[6], 3, '施設41'],
  [UUID[8], UUID[6], 3, '施設42']
];

beforeAll(async () => {
  await client.connect();
  await client.query("TRUNCATE TABLE org");
  const query = format("INSERT INTO org (id, parent, category, name) VALUES %L", TEST_DATA);
  await client.query(query);

});

afterAll(async () => {
  await client.end();
});

describe('ストレージサービスの単純操作について', () => {
  it('会社オブジェクトを取れること', async () => {
    const exp = new Company({id: UUID[0], category: 1, name: '会社1'});
    const result = await StorageService.getCompanyById(UUID[0]);
    expect(result.data).toEqual(exp.data);
  });
  
  it('部門オブジェクトを取れること', async () => {
    const exp = new Department({id: UUID[1], parent: UUID[0], category: 2, name: '部門2'});
    const result = await StorageService.getDepartmentById(UUID[1]);
    expect(result.data).toEqual(exp.data);
  });
  
  it('施設オブジェクトを取れること', async () => {
    const exp = new Facility({id: UUID[5], parent: UUID[0], category: 3, name: '施設3'});
    const result = await StorageService.getFacilityById(UUID[5]);
    expect(result.data).toEqual(exp.data);
  });
});

describe('ストレージサービスの階層構造について', () => {
  it('部門階層を取れること', async () => {
    const dep1 = new Department({id: UUID[5], parent: UUID[0], category: 2, name: '部門2'});
    const dep2 = new Department({id: UUID[6], parent: UUID[0], category: 2, name: '部門3'});
    const dep3 = new Department({id: UUID[7], parent: UUID[6], category: 2, name: '部門31'});
    const dep4 = new Department({id: UUID[8], parent: UUID[6], category: 2, name: '部門32'});
    dep2.children.push(dep3);
    dep2.children.push(dep4);

    const exp = new Company({id: UUID[0], category: 1, name: '会社1'});
    exp.children.push(dep1);
    exp.children.push(dep2);

    const result = await StorageService.getDepStructureByCmpId(UUID[0]);
    expect(result.data).toEqual(exp.data);
    expect(result.children).toEqual(exp.children);
  });

  it('施設階層を取れること', async () => {
    const fac1 = new Facility({id: UUID[1], parent: UUID[0], category: 2, name: '施設3'});
    const fac2 = new Facility({id: UUID[2], parent: UUID[0], category: 2, name: '施設4'});
    const fac3 = new Facility({id: UUID[3], parent: UUID[2], category: 2, name: '施設31'});
    const fac4 = new Facility({id: UUID[4], parent: UUID[2], category: 2, name: '施設32'});
    fac2.children.push(fac3);
    fac2.children.push(fac4);

    const exp = new Company({id: UUID[0], category: 1, name: '会社1'});
    exp.children.push(fac1);
    exp.children.push(fac2);

    const result = await StorageService.getFacStructureByCmpId(UUID[0]);
    expect(result.data).toEqual(exp.data);
  });
});
