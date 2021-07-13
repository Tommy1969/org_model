import { client } from "./db";
import format from "pg-format";
import { OrgTable } from "./org";

const TEST_DATA = [
  [1000, null, 1, '会社1', false],
  [2000, 1000, 2, '組織2', false],
  [3000, 2000, 2, '組織3', false],
  [4000, 1000, 2, '組織4', true]     // 無効確認用
]
beforeAll(async () => {
  await client.connect();
  await client.query("TRUNCATE TABLE org");
  const query = format("INSERT INTO org (id, parent, category, name, disabled) VALUES %L", TEST_DATA)
  await client.query(query);
})

afterAll(async () => {
  await client.end();
})

describe('一件のレコードについて', () => {
  const target = new OrgTable(client);
  it('初期値を含む値が取れること', async () => {
    const result = await target.getById(1000);
    const exp = {
      id: 1000, name: '会社1', disabled: false,
      category: 1, parent: null,
      created_at: expect.any(Date),
      updated_at: expect.any(Date)};
    expect(result).toEqual(exp);
  })
})

describe('複数のレコードについて', () => {
  const target = new OrgTable(client);
  it('無効レコード含を含まない隣接レコードが取れること', async () => {
    const result = await target.getChildren(1000, 2);
    const exp = [{
        id: 2000, name: '組織2', disabled: false,
        category: 2, parent: 1000,
        created_at: expect.any(Date),
        updated_at: expect.any(Date)}
      ];
    expect(result).toEqual(exp);
  })
})
