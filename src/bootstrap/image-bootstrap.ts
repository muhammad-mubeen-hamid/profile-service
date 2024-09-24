import { S3 } from 'aws-sdk';
import { ImageServiceImplementation } from '../service/image-service';
import { ImageRepositoryImplementation } from '../repository/image-repository';

export class ImageBootstrap {
    static initializeImageService(): { imageService: ImageServiceImplementation } {
        const s3 = new S3();
        const bucketName = process.env.USER_PICTURES_BUCKET;
        if (!bucketName) {
            throw new Error('Missing required environment variable: USER_PICTURES_BUCKET');
        }
        const imageRepository = new ImageRepositoryImplementation(s3, bucketName);
        const imageService = new ImageServiceImplementation(imageRepository);
        return { imageService };
    }
}
