export const CHESSBOARD_WIDTH = 8;

export const enum IChessPieceType {
    PAWN,
    KNIGHT,
    BISHOP,
    ROOK,
    QUEEN,
    KING
}

export interface IChessboardState {
    chessPieces: IChessPiece[];
    players: IChessPlayer[];
    history: IChessMoves[];
    winnerId?: string;
    currentPlayerId: string;
}

export interface IChessPiece {
    id: string;
    playerId: string;
    type: IChessPieceType;
    position: IChessboardPosition;
}

export interface IChessPlayer {
    id: string;
}

export interface IChessMoves {
    id: string;
    playerId: string;
    pieceId: string;
    from: IChessboardPosition;
    to: IChessboardPosition;
}

export interface IChessboardPosition {
    x: number;
    y: number;
}

export const enum ChessboardActionTypes {
    INIT_BOARD = "@@chessboard/INIT_BOARD",
    MOVE_PIECE = "@@chessboard/MOVE_PIECE"
}
