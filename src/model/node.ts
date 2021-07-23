import { CATEGORY, NodeType } from './node.interface';

export abstract class Node {
  readonly #element: NodeType
  #children: Node[]

  constructor(
    element:Partial<NodeType>, children?: Node[]
  ) {
    this.#element = {
      id:       element.id        ?? null,
      category: element.category  ?? CATEGORY.COMPANY,
      name:     element.name      ?? '',
      parent:   element.parent    ?? null
    };
    this.#children = children ?? [];
  }
  get id():       string|null { return this.#element.id; }
  get category(): CATEGORY    { return this.#element.category; }
  get name():     string      { return this.#element.name; }
  get parent():   string|null { return this.#element.parent; }
  get children(): Node[]      { return this.#children; }
  get data():     NodeType    { return this.#element; }
}

/**
 * 会社
 * 組織構造のルート
 */
export class Company extends Node {
  constructor(element:Partial<NodeType>) {
    super({...element, category:CATEGORY.COMPANY});
  }
}

/**
 * 部門
 */
export class Department extends Node {
  constructor(element:Partial<NodeType>) {
    super({...element, category:CATEGORY.DEPARTMENT});
  }
}

/**
 * 施設
 */
export class Facility extends Node {
  constructor(element:Partial<NodeType>) {
    super({...element, category:CATEGORY.FACILITY});
  }
}
