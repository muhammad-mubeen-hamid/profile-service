// userPicturesRepository.ts
import { S3 } from 'aws-sdk';
import {ImageRepository} from "../interface/image-repository";

export class ImageRepositoryImplementation implements ImageRepository {
    private s3: S3;
    private bucketName: string;

    constructor(s3: S3, bucketName: string) {
        this.s3 = s3;
        this.bucketName = bucketName;
    }

    async saveImage(userId: string, picture: Buffer, pictureKey: string): Promise<void> {
        await this.s3.putObject({
            Bucket: this.bucketName,
            Key: `${userId}/${pictureKey}`,
            Body: picture,
        }).promise();
    }

    async getPictures(userId: string): Promise<string[]> {
        const objects = await this.s3.listObjectsV2({
            Bucket: this.bucketName,
            Prefix: `${userId}/`,
        }).promise();

        return objects.Contents?.map(item => item.Key || '') || [];
    }
}
