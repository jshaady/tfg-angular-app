import { IMatch } from './imatch';

export interface IStats {
    matches: IMatch[]
    leaguesPlayed: number,
    tournamentsPlayed: number,
    won: number,
    matchesWon: number,
    matchesPlayed: number
}
