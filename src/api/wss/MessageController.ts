import * as admin from 'firebase-admin';
import {
    ConnectedSocket, EmitOnFail, EmitOnSuccess, MessageBody, OnConnect, OnDisconnect, OnMessage,
    SocketController, SocketQueryParam
} from 'socket-controllers';
import { Socket } from 'socket.io';
import { Container } from 'typedi';
import { v4 as uuidv4 } from 'uuid';

import { User } from '../models/User';
import { RoomService } from '../services/RoomService';
import { UserService } from '../services/UserService';
import { ChessboardRPC } from '../wss/SocketCode';

@SocketController()
export class MessageController {
    private roomService = new RoomService();
    private user;
    private curRoom;

    constructor(private userService: UserService) {}

    @OnConnect()
    public connection(
        @ConnectedSocket() socket: Socket,
        @SocketQueryParam("token") token: string
    ) {
        this.user = new User();
        const admin = Container.get("firebase_admin") as admin.app.App;
        admin
            .auth()
            .verifyIdToken(token)
            .then(decodedToken => (this.user.id = decodedToken.uid));
    }

    @OnDisconnect()
    public disconnect(@ConnectedSocket() socket: Socket) {
        console.log("client disconnected");
    }

    @OnMessage("@@rooms/join")
    @EmitOnSuccess("@@rooms/join")
    public join_game(
        @ConnectedSocket() socket: Socket,
        @MessageBody() roomId: string
    ) {
        const room = this.roomService.get(roomId);
        room.opponent = this.user.id;
        this.curRoom = room;
        return {
            chessBoard: room.chessBoard.ascii()
        };
    }

    @OnMessage("@@rooms/create")
    public create_game(@ConnectedSocket() socket: Socket) {
        const id = this.roomService.createRoom(this.user);
        this.curRoom = this.roomService.get(id);
        socket.emit("@@rooms/create", this.curRoom);
    }

    @OnMessage("@@rooms/list")
    public list_room(@ConnectedSocket() socket: Socket) {
        const roomsList = this.roomService.getList();
        socket.emit("@@rooms/list", roomsList);
    }

    @OnMessage("@@rooms/leave")
    public leave_room(@ConnectedSocket() socket: Socket) {
        const roomsList = this.roomService.leaveRoom(this.curRoom, this.user);
    }

    @OnMessage("@@chess/move")
    public chess_move(
        @ConnectedSocket() socket: Socket,
        @MessageBody() from: string,
        @MessageBody() to: string
    ) {
        this.curRoom.chess.move({ from, to });
        socket.emit("@@chess/move", this.curRoom.chess.ascii());
    }

    @OnMessage("@@chess/update")
    public chess_update(@ConnectedSocket() socket: Socket) {
        this.curRoom = this.roomService.get(this.curRoom.id);
        socket.emit("@@chess/update", this.curRoom.chess.ascii());
    }
}
