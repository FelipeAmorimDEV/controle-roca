export class ResourceAlreadyExist extends Error {
  constructor() {
    super('resource already exist')
  }
}
