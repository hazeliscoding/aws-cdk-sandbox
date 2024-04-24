import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { AuthService } from './AuthService';
import { DataStack, ApiStack } from '../../../outputs.json';
import { fetchAuthSession } from '@aws-amplify/auth';

const spacesUrl = ApiStack.SpacesApiEndpoint36C4F3B6 + 'spaces';

export class DataService {
  private authService: AuthService;
  private s3Client: S3Client | undefined;
  private awsRegion = 'us-east-1';

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  public async createSpace(name: string, location: string, photo?: File) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const space = {} as any;
    space.name = name;
    space.location = location;

    console.log('calling create space!!');
    if (photo) {
      const uploadUrl = await this.uploadPublicFile(photo);
      space.photoUrl = uploadUrl;
    }
    const { idToken } = (await fetchAuthSession()).tokens ?? {};

    console.log(idToken);

    const postResult = await fetch(spacesUrl, {
      method: 'POST',
      headers: {
        Authorization: `${idToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(space),
    });

    const postResultJson = await postResult.json();

    return postResultJson.id;
  }

  private async uploadPublicFile(file: File) {
    const credentials = await this.authService.getTemporaryCredentials();
    if (!this.s3Client) {
      this.s3Client = new S3Client({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        credentials: credentials as any,
        region: this.awsRegion,
      });
    }
    const command = new PutObjectCommand({
      Bucket: DataStack.SpaceFinderPhotosBucketName,
      Key: file.name,
      ACL: 'public-read',
      Body: file,
    });
    await this.s3Client.send(command);
    return `https://${command.input.Bucket}.s3.${this.awsRegion}.amazonaws.com/${command.input.Key}`;
  }

  public isAuthorized() {
    return true;
  }
}
