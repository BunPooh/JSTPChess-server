export const enum ChessboardRPC {
    SERVER_INITIALIZE_PLAYER = "server/initialize_player",

    CLIENT_QUICKJOIN_GAME = "client/quickjoin_game",
    CLIENT_JOIN_GAME_CANCEL = "client/join_game_cancel",
    CLIENT_QUIT_GAME = "client/quit_game",

    /**
     * Game initialization & destruction
     */
    SERVER_INITIALIZE_GAME = "server/initialize_game",
    SERVER_GAME_FINISH = "server/game_finish",

    /**
     * InGame commands
     */
    CLIENT_MOVE_PIECE = "client/move_piece",
    SERVER_GAME_UPDATE = "server/game_update"
}
