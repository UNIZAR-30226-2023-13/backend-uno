import express, {Request, Response, Router } from 'express';
const loginRouter: Router = express.Router()

loginRouter.post('/', (req: Request, res: Response) => {
    const username: string = req.body.username;
    const password: string = req.body.password;
    console.log("username: " + username + "\t contraseña:" + password);
    console.log("session username: " + req.session.username + "\t esta logeado?:" + req.session.loggeado);

    // Si es una sesion que ya habia iniciado sesion
    if(req.session.loggeado === true){
        res.status(200);
        res.send('Ok, ya estabas login');
    }
    // Si existe ese usuario con esa contraseña
    else if(username==="juan" && password==="juan"){
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
});

module.exports = loginRouter;
