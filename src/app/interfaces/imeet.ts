import { IUser } from './iuser';

export interface IMeet {
    id: number,
    name: string,
    userCreator: string,
    date: string,
    sport: string,
    description: string,
    location: string,
    participants: number,
    usersInMeet: IUser[]
}
