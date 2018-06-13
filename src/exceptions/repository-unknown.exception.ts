export class RepositoryUnknownException extends Error {
  public name = 'RepositoryUnknownException';

  constructor(collectionName: string) {
    super(`Repository ${collectionName} is unknown and not yet registered!`);
  }
}
