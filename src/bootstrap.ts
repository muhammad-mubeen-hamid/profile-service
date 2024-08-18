// bootstrap.ts
import { S3 } from 'aws-sdk';
import {ImageServiceImplementation} from "./service/implementation/image-service";
import {ImageRepositoryImplementation} from "./repository/implementation/image-repository";
import ProfileRepositoryImplementation from "./repository/implementation/profile-repository";
import {ProfileServiceImplementation} from "./service/implementation/profile-service";

export class Bootstrap {
    public static initializeProfileService(): {  profileService: ProfileServiceImplementation } {
        const profileRepository = new ProfileRepositoryImplementation(process.env.USER_PROFILE_TABLE!);
        const profileService = new ProfileServiceImplementation(profileRepository);
        return { profileService };
    }

    static initializeImageService(): { imageService: ImageServiceImplementation } {
        const s3 = new S3();
        const bucketName = process.env.USER_PICTURES_BUCKET!;
        const imageRepository = new ImageRepositoryImplementation(s3, bucketName);
        const imageService = new ImageServiceImplementation(imageRepository);

        return { imageService };
    }
}
