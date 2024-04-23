import { fetchAuthSession } from '@aws-amplify/auth';
import { AuthService } from './AuthService';
import { ListBucketsCommand, S3Client } from '@aws-sdk/client-s3';

async function testAuth() {
  const service = new AuthService();
  await service.login('testuser123', 'D%!1oe11');

  const { idToken } = (await fetchAuthSession()).tokens ?? {};

  // console.log(idToken?.toString());
  const credentials = await service.generateTemporaryCredentials();
  // console.log(credentials);

  const buckets = await listBuckets(credentials);
  console.log(buckets);
}

async function listBuckets(credentials: any) {
  const client = new S3Client({
    credentials: credentials,
  });

  const command = new ListBucketsCommand({});
  const response = await client.send(command);
  console.log(response);
  return response;
}

testAuth();
