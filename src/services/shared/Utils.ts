import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { JSONError } from './DataValidator';
import { randomUUID } from 'crypto';

export function createRandomId() {
  return randomUUID();
}

export function addCorsHeader(arg: APIGatewayProxyResult) {
  if (!arg.headers) {
    arg.headers = {};
  }
  arg.headers['Access-Control-Allow-Origin'] = '*';
  arg.headers['Access-Control-Allow-Methods'] = '*';
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
