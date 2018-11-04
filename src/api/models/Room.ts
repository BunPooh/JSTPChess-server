import * as chess from 'chess.js';

import { User } from './User';

export class Room {
    public id: string;
    public creator: User;
    public opponent: User;
    public chessBoard: string;

    public toString(): string {
        return `${this.creator} ${this.opponent} (${this.chessBoard})`;
    }
}
