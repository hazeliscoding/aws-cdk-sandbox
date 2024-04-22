import { SpaceEntry } from '../model/Model';

export class MissingFieldError extends Error {
  constructor(public field: string) {
    super(`Value for '${field}' expected but not found.`);
  }
}

export class JSONError extends Error {}

export function validateAsSpaceEntry(arg: any) {
  if ((arg as SpaceEntry).location === undefined) {
    throw new MissingFieldError('location');
  }
  if ((arg as SpaceEntry).name === undefined) {
    throw new MissingFieldError('name');
  }
  if ((arg as SpaceEntry).id === undefined) {
    throw new MissingFieldError('id');
  }
}
