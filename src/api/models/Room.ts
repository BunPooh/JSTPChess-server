import * as chess from 'chess.js';

import { User } from './User';

export class Room {
    public id: string;
    public creator: User;
    public opponent: User;
    public chessBoard: chess.ChessInstance;

    public toString(): string {
        return `${this.creator} ${this.opponent} (${this.chessBoard.ascii})`;
    }
}
