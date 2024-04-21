import { handler } from '../src/services/spaces/handler';

process.env.AWS_REGION = 'us-east-1';
process.env.TABLE_NAME = 'SpaceTable-12b56d6b82f9';

handler(
  {
    httpMethod: 'POST',
    body: JSON.stringify({ location: 'Stockholm' }),
  } as any,
  {} as any
);
