export interface ProfileImages {
    UserId: string;
    PictureId: string;
    PictureUrl: string;
    [key: string]: any; // Additional attributes
}

export interface ImageRepository {
    saveImage(userId: string, picture: Buffer, pictureKey: string): Promise<void>;
    getPictures(userId: string): Promise<string[]>
}