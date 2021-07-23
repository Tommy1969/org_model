export const CATEGORY = {
  COMPANY:    1,
  DEPARTMENT: 2,
  FACILITY:   3
} as const;
export type CATEGORY = typeof CATEGORY[keyof typeof CATEGORY];

export type NodeType = {
  id: string|null;
  category: CATEGORY;
  name: string;
  parent: string|null;
}
