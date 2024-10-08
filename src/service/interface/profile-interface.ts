import { UserProfile } from "../../repository/interface/profile-interface";
import {AppResponse} from "@muhammad-mubeen-hamid/marhaba-commons";

export interface ProfileService {
    saveUserProfile(userProfile: UserProfile): Promise<AppResponse<UserProfile>>;
}
