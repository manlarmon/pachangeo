import { User } from "./user.model";

export interface Team {
    teamId: string;
    name: string;
    userIdTeamOwner: string;
    invitationCode: string;
    favoriteFootballType: string;
    users: User[];
    photo: string;
}

