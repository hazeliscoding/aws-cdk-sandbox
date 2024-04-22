import {
  DynamoDBClient,
  GetItemCommand,
  ScanCommand,
} from '@aws-sdk/client-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export async function getSpaces(
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> {
  if (event.queryStringParameters) {
    if ('id' in event.queryStringParameters) {
      const spaceId = event.queryStringParameters['id'];
      const getItemsResponse = ddbClient.send(
        new GetItemCommand({
          TableName: process.env.TABLE_NAME,
          Key: {
            id: { S: spaceId },
          },
        })
      );

      if ((await getItemsResponse).Item) {
        return {
          statusCode: 200,
          body: JSON.stringify((await getItemsResponse).Item),
        };
      } else {
        return {
          statusCode: 404,
          body: JSON.stringify(`Space with id ${spaceId} not found!`),
        };
      }
    } else {
      return {
        statusCode: 401,
        body: JSON.stringify('Id required!'),
      };
    }
  }
  const result = await ddbClient.send(
    new ScanCommand({
      TableName: process.env.TABLE_NAME,
    })
  );

  console.log(result.Items);

  return {
    statusCode: 200,
    body: JSON.stringify(result.Items),
  };
}
