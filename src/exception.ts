export class NotFoundError extends Error {
  constructor(id:string) {
    super(`Not found item ${id}`);
  }
}
