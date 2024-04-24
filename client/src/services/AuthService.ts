import { SignInOutput, fetchAuthSession, signIn } from '@aws-amplify/auth';
import { Amplify } from 'aws-amplify';

import { AuthStack } from '../../../outputs.json';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers';
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';

const awsRegion = 'us-east-1';

Amplify.configure({
  Auth: {
    Cognito: {
      identityPoolId: AuthStack.SpaceIdentityPoolId,
      userPoolId: AuthStack.SpaceUserPoolId,
      userPoolClientId: AuthStack.SpaceUserPoolClientId,
    },
  },
});

export class AuthService {
  private user: SignInOutput | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private temporaryCredentials: any | undefined;
  public jwtToken: string | undefined;

  public isAuthorized() {
    if (this.user) {
      return true;
    }
    return false;
  }

  public async login(username: string, password: string) {
    try {
      this.user = (await signIn({
        username,
        password,
        options: {
          authFlowType: 'USER_PASSWORD_AUTH',
        },
      })) as SignInOutput;
      const { idToken } = (await fetchAuthSession()).tokens ?? {};
      console.log(idToken?.toString());
      this.jwtToken = idToken?.toString() as string;
      return this.user;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  public isSignedIn() {
    return this.user?.isSignedIn;
  }

  public async getTemporaryCredentials() {
    if (this.temporaryCredentials) {
      return this.temporaryCredentials;
    }
    this.temporaryCredentials = await this.generateTemporaryCredentials();
    return this.temporaryCredentials;
  }

  public async generateTemporaryCredentials() {
    const { idToken } = (await fetchAuthSession()).tokens ?? {}; //CognitoUser is deprecated, but fetchAuthSession() will grab the current session details.
    console.log(idToken);

    const cognitoIdentityPool = `cognito-idp.${awsRegion}.amazonaws.com/us-east-1_y8plTPjzM`;
    const cognitoIdentity = new CognitoIdentityClient({
      credentials: fromCognitoIdentityPool({
        clientConfig: {
          region: awsRegion,
        },
        identityPoolId: 'us-east-1:5f476e47-da6e-449f-a0e5-b2266d283985',
        logins: {
          [cognitoIdentityPool]: idToken?.toString() as string,
        },
      }),
    });
    const credentials = await cognitoIdentity.config.credentials();
    return credentials;
  }
}
