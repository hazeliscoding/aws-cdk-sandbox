import { SignInOutput, signIn } from '@aws-amplify/auth';
import { Amplify } from 'aws-amplify';

import { AuthStack } from '../../../outputs.json';

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

  public async login(username: string, password: string) {
    try {
      this.user = (await signIn({
        username,
        password,
        options: {
          authFlowType: 'USER_PASSWORD_AUTH',
        },
      })) as SignInOutput;
      return this.user;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  public isSignedIn() {
    return this.user?.isSignedIn;
  }
}
