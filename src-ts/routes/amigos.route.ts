import { Persona } from './../models/persona'
import express, {Request, Response, Router } from 'express';
import { getAmigos } from '../services/amigos.service';
const amigosRouter: Router = express.Router()

amigosRouter.get('/', (req: Request, res: Response) => {
    const username: string = req.body.username;
    console.log("username: " + username);
    console.log("session username: " + req.session.username + "\t esta logeado?:" + req.session.loggeado);

    // Si el usuario loggeado pide informacion sobre si mismo
    if(username===req.session.username){
        res.status(200);
        // Obtener array de amigos
        /*
            var amigos : Persona[] = getAmigos(username);
            res.json(JSON.stringify(amigos));
        */

        res.json({ username: 'Flavio' });
        res.send();
    }
    // Si pide informacion sobre otro usuario
    else{
        res.status(401);
        res.send('No tienes permisos');
    }
});

module.exports = amigosRouter;
