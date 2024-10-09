export interface ITeam {
    createDate: string,
    description: string,
    location: string,
    imageBase64: string,
    imageType: string,
    teamname: string,
    userLeader: string,
    isPrivate: number,
    uuid: string,
    maxNumberPlayers: number,
    usersInTeam: any
}
