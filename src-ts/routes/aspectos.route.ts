import { Aspecto } from './../models/aspecto'
import express, {Request, Response, Router } from 'express';
import {getAspectosCartasDesbloqueados, getAspectosTablerosDesbloqueados, getTodosAspectosCartas, getTodosAspectosTableros } from '../services/aspectos.service';

const aspectosRouter: Router = express.Router()


aspectosRouter.get('/cartas', async(req: Request, res: Response) => {
    const aspectos : Aspecto[] = await getTodosAspectosCartas();
    res.json(aspectos);
    res.send();
});

aspectosRouter.get('/cartas/desbloqueadas', async(req: Request, res: Response) => {
    var username = "";
    if(req.session.username){
        username =  req.session.username;
        const aspectos : Aspecto[] = await getAspectosCartasDesbloqueados(username);
        res.json(aspectos);
        res.send();
    }
    else{
        res.status(401);
        res.send();
    }
});


aspectosRouter.get('/tableros', async(req: Request, res: Response) => {
    const aspectos : Aspecto[] = await getTodosAspectosTableros();
    res.json(aspectos);
    res.send();
});

aspectosRouter.get('/tableros/desbloqueados', async(req: Request, res: Response) => {
    var username = "";
    if(req.session.username){
        username =  req.session.username;
        const aspectos : Aspecto[] = await getAspectosTablerosDesbloqueados(username);
        res.json(aspectos);
        res.send();
    }
    else{
        res.status(401);
        res.send();
    }
});


module.exports = aspectosRouter;
