import * as chess from 'chess.js';
import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { v4 as uuidv4 } from 'uuid';

import { EventDispatcher, EventDispatcherInterface } from '../../decorators/EventDispatcher';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { Room } from '../models/Room';
import { User } from '../models/User';
import { events } from '../subscribers/events';

@Service()
export class RoomService {
    private listRoom = new Map<string, Room>();

    public createRoom(user: User): string {
        const id = uuidv4();

        const room = new Room();
        room.chessBoard = new chess.Chess().pgn();
        room.id = id;
        room.creator = user;
        this.listRoom.set(id, room);
        return id;
    }

    public leaveRoom(room: Room, user: User) {
        if (room.creator === user) {
            room.creator = null;
        } else if (room.opponent === user) {
            room.creator = null;
        }

        if (room.creator === null && room.opponent === null) {
            this.listRoom.delete(room.id);
        }
    }

    public get(id: string): Room {
        return this.listRoom.get(id);
    }

    public getList(): Room[] {
        const arr = Array.from(this.listRoom.values());
        const val = arr.filter(item => item.opponent === undefined);
        return val;
    }
}
