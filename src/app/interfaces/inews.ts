import { IUser } from './iuser';

export interface INews {
    sendUser: IUser,
    title: string,
    message: string,
    date: string,
    location: string,
    imageBase64: string,
    imageType: string
}
