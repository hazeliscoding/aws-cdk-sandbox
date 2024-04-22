import { fetchAuthSession } from '@aws-amplify/auth';
import { AuthService } from './AuthService';

async function testAuth() {
  const service = new AuthService();
  await service.login('testuser123', 'D%!1oe11');

  const { idToken } = (await fetchAuthSession()).tokens ?? {};

  // console.log(idToken?.toString());
  const credentials = await service.generateTemporaryCredentials();
  console.log(credentials);

  return idToken;
}

testAuth();
