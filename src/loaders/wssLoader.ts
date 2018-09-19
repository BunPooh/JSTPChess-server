import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import { useSocketServer } from 'socket-controllers';

import { env } from '../env';

import socketIO = require("socket.io");

export const wssLoader: MicroframeworkLoader = (
    settings: MicroframeworkSettings | undefined
) => {
    if (settings) {
        const httpServer = settings.getData("express_server");
        const io = socketIO(httpServer, {
            // transports: ["websocket"]
        });

        const wssServer = useSocketServer(io, {
            controllers: env.app.dirs.socketControllers
        });

        // Here we can set the data for other loaders
        settings.setData("wss_server", wssServer);
    }
};
