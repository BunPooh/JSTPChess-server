import * as chess from 'chess.js';
import { Socket } from 'socket.io';
import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { v4 as uuidv4 } from 'uuid';

import { EventDispatcher, EventDispatcherInterface } from '../../decorators/EventDispatcher';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { Room } from '../models/Room';
import { User } from '../models/User';
import { events } from '../subscribers/events';
import { MessageController } from '../wss/MessageController';

@Service()
export class SocketService {
    private listController = new Map<string, Socket>();

    public newController(id: string, controller: Socket): string {
        this.listController.set(id, controller);
        return id;
    }

    public removeController(id: string) {
        this.listController.delete(id);
    }

    public get(id: string): Socket {
        return this.listController.get(id);
    }
}
