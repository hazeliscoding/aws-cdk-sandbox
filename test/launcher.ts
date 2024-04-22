import { handler } from '../src/services/spaces/handler';

process.env.AWS_REGION = 'us-east-1';
process.env.TABLE_NAME = 'SpaceTable-12b56d6b82f9';

handler(
  {
    httpMethod: 'POST',
    // queryStringParameters: { id: '275081eb-7236-471f-83ef-ee8a056a588c' },
    body: JSON.stringify({ location: 'Dublin' }),
  } as any,
  {} as any
).then((result) => {
  console.log(result);
});
