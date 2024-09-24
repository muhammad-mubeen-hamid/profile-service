import {ImageRepositoryImplementation} from "../repository/image-repository";
import {ImageService} from "./interface/image-interface";
import {
    AppResponse,
    AppResponseSuccessBody,
    ProfileCodes,
    SendResponse
} from "@muhammad-mubeen-hamid/marhaba-commons";

export class ImageServiceImplementation implements ImageService {

    private imageRepository: ImageRepositoryImplementation;

    constructor(imageRepository: ImageRepositoryImplementation) {
        this.imageRepository = imageRepository;
    }

    async uploadPicture(userId: string, picture: Buffer): Promise<AppResponse<null>> {
        try {
            const pictureKey = `${Date.now().toString()}.jpg`;
            await this.imageRepository.saveImage(userId, picture, pictureKey);

            const success: AppResponseSuccessBody<null> = {
                success: true,
                message: ProfileCodes.IMAGE_UPLOADED,
                data: null
            }
            const response: AppResponse<null> = {
                statusCode: 200,
                body: success
            }
            return SendResponse(response);
        } catch (error) {
            const response: AppResponse<null> = {
                statusCode: 500,
                body: {
                    success: false,
                    message: ProfileCodes.INTERNAL_SERVER_ERROR,
                }
            }
            return SendResponse(response);
        }
    }

    async getPictures(userId: string): Promise<AppResponse<string[]>> {
        try {
            const pictures = await this.imageRepository.getPictures(userId);
            const success: AppResponseSuccessBody<string[]> = {
                success: true,
                message: ProfileCodes.ALL_OKAY,
                data: pictures
            }
            const response: AppResponse<string[]> = {
                statusCode: 200,
                body: success
            }
            return SendResponse(response);
        } catch (error) {
            const response: AppResponse<string[]> = {
                statusCode: 500,
                body: {
                    success: false,
                    message: ProfileCodes.INTERNAL_SERVER_ERROR,
                }
            }
            return SendResponse(response);
        }
    }
}
