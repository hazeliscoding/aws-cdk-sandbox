import { JSONError } from './DataValidator';
import { randomUUID } from 'crypto';

export function createRandomId() {
  return randomUUID();
}

export function parseJSON(arg: string) {
  try {
    return JSON.parse(arg);
  } catch (e) {
    throw new JSONError(e.messsage);
  }
}
