import { APIGatewayProxyEvent } from 'aws-lambda';
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

export function hasAdminGroup(event: APIGatewayProxyEvent) {
  const groups = event.requestContext.authorizer?.claims['cognito:groups'];
  return groups?.includes('admins');
}
