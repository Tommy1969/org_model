import { v4 as uuidv4 } from 'uuid';
import { client } from "../repository/db";
import format from "pg-format";
import { CompanyService } from './company'
import { Company } from '../model/node'

const IDS = [uuidv4(), uuidv4(), uuidv4()]
const TEST_DATA = [
  [IDS[0], null, 1, '会社1'],
  [IDS[1], IDS[0], 2, '部門'],
  [IDS[2], IDS[0], 3, '施設3'],
]

beforeAll(async () => {
  await client.connect();
  await client.query("TRUNCATE TABLE org");
  const query = format("INSERT INTO org (id, parent, category, name) VALUES %L", TEST_DATA);
  await client.query(query);

})

afterAll(async () => {
  await client.end();
})

it('会社オブジェクトを取れること', async () => {
  const exp = new Company({id: IDS[0], category: 1, name: '会社1'})
  const result = await CompanyService.getById(IDS[0])
  expect(result.data).toEqual(exp.data);
})
