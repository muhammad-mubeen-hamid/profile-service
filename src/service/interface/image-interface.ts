import { AppResponse } from '@muhammad-mubeen-hamid/marhaba-commons/src'
export interface ImageService {
    uploadPicture(userId: string, picture: Buffer): Promise<AppResponse<null>>;
    getPictures(userId: string): Promise<AppResponse<string[]>>;
}