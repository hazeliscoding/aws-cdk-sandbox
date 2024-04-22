import { SignInOutput, signIn } from '@aws-amplify/auth';
import { Amplify } from 'aws-amplify';

const awsRegion = 'us-east-1';
 
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'us-east-1_y8plTPjzM',
      userPoolClientId: '1d22tfa3v30jihrmrof63cold3',
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
}