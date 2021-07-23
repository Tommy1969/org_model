/**
 * 使い方:
 * 基準クエリーを作る
 * const baseQ = Query({tables=['org'], filters=['disable=false']})
 * 基準クエリーから派生クエリを作る
 * const inhelQ = baseQ.spawn({filters=['parent=1']})
 * 両方の条件を加味した select を取得できる
 * inhelQ.getSelect() =>
 *    'select * from org where disable=false and parent=1'
 */

type QueryElement = {
  tables: string[];
  fields: string[];
  filters: string[];
  orders: string[];
}

export class Query {
  #element: QueryElement
  constructor(element?: Partial<QueryElement>) {
    this.#element = {
      tables: element?.tables ?? [],
      fields: element?.fields ?? [],
      filters: element?.filters ?? [],
      orders: element?.orders ?? []
    };
  }

  get tables():string[] { return this.#element.tables; }
  get fields():string[] { return this.#element.fields; }
  get filters():string[] { return this.#element.filters; }
  get orders():string[] { return this.#element.orders; }

  sectionTables(): string {
    return this.tables?.length ? 'from ' + this.tables.join(', ') : '';
  }

  sectionFields(): string {
    return this.fields?.length ? this.fields.join(', ') : '*';
  }

  sectionFilters(): string {
    return this.filters?.length ? 'where ' + this.filters.join(' and ') : '';
  }

  sectionOrders(): string {
    return this.orders?.length ? 'order by ' + this.orders.join(', ') : '';
  }

  spawn(element?: Partial<QueryElement>): Query {
    return new Query({
      tables: this.tables.concat(element?.tables ?? []),
      fields: this.fields.concat(element?.fields ?? []),
      filters: this.filters.concat(element?.filters ?? []),
      orders: this.orders.concat(element?.orders ?? [])
    });
  }

  getSelect(): string {
    const query: string[] = ['select'];
    query.push(this.sectionFields());
    query.push(this.sectionTables());
    query.push(this.sectionFilters());
    query.push(this.sectionOrders());

    return query
      .filter(it=>it.length>0)
      .join(' ');
  }
}
