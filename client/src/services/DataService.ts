import { AuthService } from './AuthService';

export class DataService {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  public async createSpace(name: string, location: string, photo?: File) {
    try {
      console.log('calling create space!!');
      const credentials = await this.authService.getTemporaryCredentials();
      console.log(credentials);
      return '123';
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  public isAuthorized() {
    return true;
  }
}
