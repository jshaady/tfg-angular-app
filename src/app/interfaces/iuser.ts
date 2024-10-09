import { ITeam } from './iteam';

export interface IUser {
    username: string,
    name: string,
    surname: string,
    description: string,
    location: string,
    email: string,
    country: string,
    birthdate: string,
    imageBase64: string,
    imageType: string,
    rol: number,
    token: string,
    teams: ITeam[]
}
