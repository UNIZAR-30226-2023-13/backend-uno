import express, {Request, Response, Router } from 'express';
import { comprobarContrasena } from '../services/login.service';
const loginRouter: Router = express.Router()


loginRouter.post('/', async(req: Request, res: Response) => {
    const username: string = req.body.username;
    const password: string = req.body.password;

    // Si es una sesion que ya habia iniciado sesion
    if(req.session.loggeado === true){
        res.status(200);
        res.send('Ok, ya estabas login');
    }
    // Buscamos en la BD si existe un usuario con ese nombre y contraseña
    else {
        const iguales = await comprobarContrasena(username,password);
        if(iguales){
            req.session.loggeado=true;
            req.session.username=username;
            res.status(200);
            res.send('Ok, login');
        }
        // Si no existe un usuario con esa contraseña
        else{
            res.status(403);
            res.send('Usuario y contraseña incorrectos');
        }        
    }
});

module.exports = loginRouter;
