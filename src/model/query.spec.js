const Query = require('./query')

describe('クエリについて', () => {
  it.each([
    [{tables:[]}, ''],
    [{tables:['f1']}, 'from f1'],
    [{tables:['f3', 'f4']}, 'from f3, f4']
  ])('セットした from 節になること', (element, exp) => {
    const target = new Query(element)
    expect(target.sectionTables()).toEqual(exp)
  })

  it.each([
    [{fields: []}, '*'],
    [{fields: ['f1']}, 'f1'],
    [{fields: ['f3', 'f4']}, 'f3, f4']
  ])('期待したフィールド節になること', (element, exp) => {
    const target = new Query(element)
    expect(target.sectionFields()).toEqual(exp)
  })

  it.each([
    [{filters: []}, ''],
    [{filters: ['f1']}, 'where f1'],
    [{filters: ['f2', 'f3']}, 'where f2 and f3']
  ])('期待した where 節になること', (element, exp) => {
    const target = new Query(element)
    expect(target.sectionFilters()).toEqual(exp)
  })

  it.each([
    [{orders: []}, ''],
    [{orders: ['f1']}, 'order by f1'],
    [{orders: ['f2', 'f3']}, 'order by f2, f3']
  ])('期待した order by 節になること', (element, exp) => {
    const target = new Query(element)
    expect(target.sectionOrders()).toEqual(exp)
  })

  it('', () => {
    const target1 = new Query({tables: ['org'], filters: ['disable=false']})
    const target2 = target1.spawn({tables: ['org2'], filters: ['id=9']})

    expect(target1.getSelect()).toEqual('select * from org where disable=false')
    expect(target2.getSelect()).toEqual('select * from org, org2 where disable=false and id=9')
  })

  it('', () => {
    const target = new Query({tables: ['org']})
    expect(target.getSelect()).toEqual('select * from org')
  })
});
