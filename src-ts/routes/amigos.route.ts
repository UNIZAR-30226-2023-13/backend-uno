import { Persona } from './../models/persona'
import express, {Request, Response, Router } from 'express';
import { anadirAmigos, comprobarSiAmigos, getAmigos } from '../services/amigos.service';

const amigosRouter: Router = express.Router()


amigosRouter.get('/', async(req: Request, res: Response) => {
    var username: string = "";

    if(req.session.username){
        username = req.session.username;
    }

    // Si el usuario loggeado es valido
    if(username.length!=0){
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

amigosRouter.post('/anadir_amigo', async(req: Request, res: Response) => {
    const username1: string = req.body.username1;
    const username2: string = req.body.username2;

    // Si se intenta añadir a si mismo como amigo
    if(username1===username2){
        res.status(401);
        res.send('No te puedes añadir a ti mismo como amigo');
    }
    else{
        const eranAmigos: Boolean = await comprobarSiAmigos(username1,username2)
        // Si ya eran amigos
        if(eranAmigos){
            res.status(401);
            res.send('Ya sois amigos');
        }
        else{
            const anadidos: Boolean = await anadirAmigos(username1,username2);
            // Si se han podido añadir
            if(anadidos){
                res.status(200);
                res.send('Añadidos correctamente');
            }
            else {
                res.status(401);
                res.send('No se ha podido añadir como amigos');
            }
        }

    }

    
});

module.exports = amigosRouter;
