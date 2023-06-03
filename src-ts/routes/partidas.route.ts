import express, { Request, Response, Router } from "express";
import { obtenerPartidasJugador } from "../services/historialPartidas.service";

const partidasRouter: Router = express.Router();

partidasRouter.get("/", async (req: Request, res: Response) => {
    let username = "";
    if (req.session.username) {
        username = req.session.username;
        obtenerPartidasJugador(username)
            .then((partidas) => {
                res.status(200);
                console.log(partidas);
                res.json({
                    partidas,
                });
            })
            .catch(() => {
                res.status(403);
                res.send("La cuenta ya no existe");
            });
    } else {
        res.status(401);
        res.send();
    }
});

module.exports = partidasRouter;
