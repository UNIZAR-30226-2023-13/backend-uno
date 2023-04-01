import { Persona } from './../models/persona'
import express, {Request, Response, Router } from 'express';
import { anadirAmigos, getAmigos } from '../services/amigos.service';

const amigosRouter: Router = express.Router()


amigosRouter.get('/', async(req: Request, res: Response) => {
    const username: string = req.body.username;
    console.log("username: " + username);
    console.log("session username: " + req.session.username + "\t esta logeado?:" + req.session.loggeado);

    // Si el usuario loggeado pide informacion sobre si mismo
    if(username===req.session.username){
        res.status(200);
        // Obtener array de amigos
        const amigos : Persona[] = await getAmigos(username);
        res.json(amigos);
        res.send();
    }
    // Si pide informacion sobre otro usuario
    else{
        res.status(401);
        res.send('No tienes permisos');
    }
});

amigosRouter.post('/anadir_amigo', (req: Request, res: Response) => {
    const username1: string = req.body.username1;
    const username2: string = req.body.username2;

    const anadidos: Boolean = anadirAmigos(username1,username2);
    if(anadidos){
        res.status(200);
        res.send('Añadidos correctamente');
    }
    else {
        res.status(401);
        res.send('No se ha podido añadir como amigos');
    }
});

module.exports = amigosRouter;
