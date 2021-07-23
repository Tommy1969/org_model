import { client } from "../repository/db";
import format from "pg-format";
import { CompanyService } from './company'
import { Company } from '../model/node'

const TEST_DATA = [
  ['1000', null, 1, '会社1'],
  ['2000', '1000', 2, '部門'],
  ['3000', '1000', 3, '施設3'],
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
  const exp = new Company({id: '1000', category: 1, name: '会社1'})
  const result = await CompanyService.getById('1000')
  expect(result.data).toEqual(exp.data);
})
