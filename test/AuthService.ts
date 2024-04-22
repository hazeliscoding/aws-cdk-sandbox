import { SignInOutput, fetchAuthSession, signIn } from '@aws-amplify/auth';
import { Amplify } from 'aws-amplify';
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers';

const awsRegion = 'us-east-1';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'us-east-1_y8plTPjzM',
      userPoolClientId: '1d22tfa3v30jihrmrof63cold3',
      identityPoolId: 'us-east-1:5f476e47-da6e-449f-a0e5-b2266d283985',
    },
  },
});

export class AuthService {
  public async login(username: string, password: string) {
    const result = (await signIn({
      username,
      password,
      options: {
        authFlowType: 'USER_PASSWORD_AUTH',
      },
    })) as SignInOutput;
    return result;
  }

  public async getSession() {
    const { tokens, credentials, identityId, userSub } =
      await fetchAuthSession();

    const { idToken, accessToken } = tokens;
    console.log({ tokens });
  }

  public async generateTemporaryCredentials() {
    const { idToken } = (await fetchAuthSession()).tokens ?? {}; //CognitoUser is deprecated, but fetchAuthSession() will grab the current session details.
    console.log(idToken);
    const cognitoIdentityPool = `cognito-idp.${awsRegion}.amazonaws.com/us-east-1_y8plTPjzM`;
    const cognitoIdentity = new CognitoIdentityClient({
      credentials: fromCognitoIdentityPool({
        identityPoolId: 'us-east-1:5f476e47-da6e-449f-a0e5-b2266d283985',
        logins: {
          [cognitoIdentityPool]: idToken.toString() as string,
        },
      }),
    });
    const credentials = await cognitoIdentity.config.credentials();
    return credentials;
  }
}
