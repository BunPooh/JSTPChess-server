import { Chess } from 'chess.js';
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
import { SocketService } from '../services/SocketService';
import { UserService } from '../services/UserService';
import { ChessboardRPC } from '../wss/SocketCode';

@SocketController()
export class MessageController {
    private roomService = new RoomService();
    private socketService = new SocketService();
    private user;
    private curRoom;
    private chessInstance = new Chess();

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
            .then(
                decodedToken =>
                    (this.user.uid = this.socketService.newController(
                        decodedToken.uid,
                        socket
                    ))
            );
    }

    @OnDisconnect()
    public disconnect(@ConnectedSocket() socket: Socket) {
        if (this.curRoom !== undefined) {
            this.roomService.leaveRoom(this.curRoom, this.user);
        }
        this.socketService.removeController(this.user.uid);
        console.log("client disconnected");
    }

    @OnMessage("@@rooms/join")
    @EmitOnSuccess("@@rooms/join")
    public join_game(
        @ConnectedSocket() socket: Socket,
        @MessageBody() roomId: string
    ) {
        const room = this.roomService.get(roomId);
        room.opponent = this.user.uid;
        this.curRoom = room;
        this.chess_update(this.socketService.get(this.curRoom.opponent));
        this.chess_update(this.socketService.get(this.curRoom.creator));
    }

    @OnMessage("@@rooms/create")
    public create_game(@ConnectedSocket() socket: Socket) {
        if (this.curRoom === undefined) {
            const id = this.roomService.createRoom(this.user);
            this.curRoom = this.roomService.get(id);
            this.room_set(socket);
        }
    }

    @OnMessage("@@rooms/list")
    public list_room(@ConnectedSocket() socket: Socket) {
        const roomsList = this.roomService.getList();
        socket.emit("@@rooms/list", roomsList);
    }

    @OnMessage("@@rooms/leave")
    public leave_room(@ConnectedSocket() socket: Socket) {
        this.roomService.leaveRoom(this.curRoom, this.user);
        socket.emit("@@rooms/leave");
    }

    @OnMessage("@@chess/move")
    public chess_move(
        @ConnectedSocket() socket: Socket,
        @MessageBody() from: string,
        @MessageBody() to: string
    ) {
        this.chessInstance.load_pgn(this.curRoom.chessBoard);
        this.chessInstance.move(from + to);
        this.curRoom.chessBoard = this.chessInstance.pgn();
        this.room_set(this.socketService.get(this.curRoom.opponent));
        this.room_set(this.socketService.get(this.curRoom.creator));
    }

    public chess_update(socket: Socket) {
        this.curRoom = this.roomService.get(this.curRoom.id);
        this.room_set(socket);
    }

    public room_set(socket: Socket) {
        socket.emit("@@rooms/set", this.curRoom);
    }
}
