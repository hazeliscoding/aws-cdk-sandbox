import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';
import { postSpaces } from './PostSpaces';
import { getSpaces } from './GetSpaces';
import { updateSpace } from './UpdateSpace';
import { deleteSpace } from './DeleteSpace';
import { MissingFieldError } from '../shared/DataValidator';

const dbbClient = new DynamoDBClient({});

async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  let message: string;

  try {
    switch (event.httpMethod) {
      case 'GET':
        const getResponse = await getSpaces(event, dbbClient);
        console.debug(getResponse);
        return getResponse;
      case 'POST':
        const postResponse = await postSpaces(event, dbbClient);
        console.debug(postResponse);
        return postResponse;
      case 'PUT':
        const putResponse = await updateSpace(event, dbbClient);
        console.debug(putResponse);
        return putResponse;
      case 'DELETE':
        const deleteResponse = await deleteSpace(event, dbbClient);
        console.debug(deleteResponse);
        return deleteResponse;
      default:
        break;
    }
  } catch (error) {
    if (error instanceof MissingFieldError) {
      return {
        statusCode: 400,
        body: JSON.stringify(error.message),
      };
    }
    return {
      statusCode: 500,
      body: JSON.stringify(error.message),
    };
  }

  const response: APIGatewayProxyResult = {
    statusCode: 200,
    body: JSON.stringify(message),
  };

  console.log(event);

  return response;
}

export { handler };
