import * as admin from 'firebase-admin';
import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import { Container } from 'typedi';

import { env } from '../env';

export const fireBaseLoader: MicroframeworkLoader = (
    settings: MicroframeworkSettings | undefined
) => {
    if (settings) {
        const serviceAccount = require("../../firebase.json");

        Container.set(
            "firebase_admin",
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                databaseURL: "https://project-fullstackjs.firebaseio.com"
            })
        );
    }
};
