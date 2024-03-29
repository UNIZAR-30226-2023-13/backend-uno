import { Aspecto } from "./../models/aspecto";
import express, { Request, Response, Router } from "express";
import {
    cambiarAspectoCartas,
    cambiarTablero,
    getAspectosCartas,
    getAspectosTableros,
} from "../services/aspectos.service";

const aspectosRouter: Router = express.Router();

aspectosRouter.get("/cartas", async (req: Request, res: Response) => {
    let username = "";
    if (req.session.username) {
        username = req.session.username;
        const aspectos: Aspecto[] = await getAspectosCartas(username);
        res.status(200);
        res.json(aspectos);
    } else {
        res.status(401);
        res.send();
    }
});

aspectosRouter.post("/cartas/cambiar", async (req: Request, res: Response) => {
    const aspecto = req.body.aspecto;
    if (req.session.username && aspecto) {
        const username = req.session.username;
        const cambiado: boolean = await cambiarAspectoCartas(username, aspecto);
        if (cambiado) {
            res.status(200);
            res.send("Aspecto cambiado correctamente");
        } else {
            res.status(403);
            res.send("No se ha podido modificar el aspecto");
        }
    } else {
        res.status(401);
        res.send();
    }
});

aspectosRouter.get("/tableros", async (req: Request, res: Response) => {
    let username = "";
    if (req.session.username) {
        username = req.session.username;
        const aspectos: Aspecto[] = await getAspectosTableros(username);
        res.status(200);
        res.json(aspectos);
    } else {
        res.status(401);
        res.send();
    }
});

aspectosRouter.post(
    "/tableros/cambiar",
    async (req: Request, res: Response) => {
        const tablero = req.body.tablero;
        if (req.session.username && tablero) {
            const username = req.session.username;
            const cambiado: boolean = await cambiarTablero(username, tablero);
            if (cambiado) {
                res.status(200);
                res.send("Tablero cambiado correctamente");
            } else {
                res.status(403);
                res.send("No se ha podido modificar el tablero");
            }
        } else {
            res.status(401);
            res.send();
        }
    }
);

module.exports = aspectosRouter;
