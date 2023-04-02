import { Aspecto } from './../models/aspecto'
import express, {Request, Response, Router } from 'express';
import {getTodosAspectosCartas, getTodosAspectosTableros } from '../services/aspectos.service';

const aspectosRouter: Router = express.Router()


aspectosRouter.get('/cartas', async(req: Request, res: Response) => {
    const aspectos : Aspecto[] = await getTodosAspectosCartas();
    res.json(aspectos);
    res.send();
});

aspectosRouter.get('/tableros', async(req: Request, res: Response) => {
    const aspectos : Aspecto[] = await getTodosAspectosTableros();
    res.json(aspectos);
    res.send();
});


module.exports = aspectosRouter;
