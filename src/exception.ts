export class NotFoundError extends Error {
  constructor(id:string) {
    super(`Not found items ${id}`)
  }
}