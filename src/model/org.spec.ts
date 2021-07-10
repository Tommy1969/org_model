const { Client } = require('pg');
const client = new Client({
  user: process.env.DB_USER,
  database: process.env.DB_SPACE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});

beforeAll(async () => {
  await client.connect();
})

afterAll(async () => {
  await client.end();
})

describe('一件のレコードについて', () => {
  let result :any = null
  beforeAll(async () => {
    await client.query("TRUNCATE TABLE org");
    await client.query("INSERT INTO org (name) VALUES ('会社')");
    result = await client.query(`SELECT * FROM org;`);
  })
  it('結果が一件であること', async () => {
    expect(result.rowCount).toBe(1)
  })
  it('初期値を含む値が設定されていること', async () => {
    const exp = {
      id: expect.any(Number),
      name: '会社',
      disabled: false,
      category: 1,
      parent: null,
      created_at: expect.any(Date),
      updated_at: expect.any(Date)}
    expect(result.rows[0]).toEqual(exp)
  })
})

describe('複数のレコードについて', () => {
  let result :any = null
  beforeAll(async () => {
    await client.query("TRUNCATE TABLE org");
    await client.query("INSERT INTO org (name) VALUES ('会社1')");
    await client.query("INSERT INTO org (name, disabled) VALUES ('会社2', true)");
    await client.query("INSERT INTO org (name) VALUES ('会社3')");
    result = await client.query(`SELECT * FROM vw_org;`);
  })
  it('無効レコードが含まれないこと', async () => {
    expect(result.rowCount).toBe(2)
  })
})
