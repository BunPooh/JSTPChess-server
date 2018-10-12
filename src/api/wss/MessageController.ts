import * as chess from 'chess.js';
import { ChessInstance } from 'chessjs';
import {
    ConnectedSocket, MessageBody, OnConnect, OnDisconnect, OnMessage, SocketController
} from 'socket-controllers';
import { Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';

import { User } from '../models/User';
import { UserService } from '../services/UserService';
import { ChessboardRPC } from '../wss/SocketCode';

@SocketController()
export class MessageController {
    constructor(private userService: UserService) {}

    private game: ChessInstance;

    @OnConnect()
    public connection(@ConnectedSocket() socket: Socket) {
        console.log("client connected");
        const user = new User();

        user.id = uuidv4();
        user.firstName = "test";
        user.lastName = "test";
        user.email = "sascha.braun@epitech.eu";

        this.userService.create(user);

        socket.emit(ChessboardRPC.SERVER_INITIALIZE_PLAYER, user.id);
    }

    @OnDisconnect()
    public disconnect(@ConnectedSocket() socket: Socket) {
        console.log("client disconnected");
    }

    @OnMessage("join_game")
    public init_game(@ConnectedSocket() socket: Socket) {
        socket.emit("start_game");
        this.game = new chess();
        socket.emit("game_update");
    }

    @OnMessage("save")
    public save(@ConnectedSocket() socket: any, @MessageBody() message: any) {
        console.log("received message:", message);
        console.log(
            "setting id to the message and sending it back to the client"
        );
        console.log(this.userService);

        message.id = 1;
        socket.emit("message_saved", message);
    }
}
