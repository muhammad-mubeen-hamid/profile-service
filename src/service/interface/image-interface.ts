import { AppResponse } from '@muhammad-mubeen-hamid/marhaba-commons'
export interface ImageService {
    uploadPicture(userId: string, picture: Buffer): Promise<AppResponse<null>>;
    getPictures(userId: string): Promise<AppResponse<string[]>>;
}