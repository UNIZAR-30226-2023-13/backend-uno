import { Persona } from "./../models/persona";
import express, { Request, Response, Router } from "express";
import {
    anadirAmigos,
    comprobarSiAmigos,
    eliminarInvitacion,
    enviarInvitacion,
    getAmigos,
    getInvitaciones,
} from "../services/amigos.service";
import { jugadoresConectados } from "../services/usuariosConectados.service";

const amigosRouter: Router = express.Router();

amigosRouter.get("/", async (req: Request, res: Response) => {
    let username = "";

    if (req.session.username) {
        username = req.session.username;
    }

    // Si el usuario loggeado es valido
    if (username.length != 0) {
        res.status(200);
        // Obtener array de amigos
        const amigos: Persona[] = await getAmigos(username);
        const usuariosConectados: string[] = jugadoresConectados();
        const amigosConEstado = amigos.map((amigo: Persona) => ({
            ...amigo,
            conectado: usuariosConectados.includes(amigo.username),
        }));
        res.json(amigosConEstado);
    }
    // Si pide informacion sobre otro usuario
    else {
        res.status(401);
        res.send("No tienes permisos");
    }
});

amigosRouter.get("/invitaciones", async (req: Request, res: Response) => {
    let username = "";

    if (req.session.username) {
        username = req.session.username;
    }

    // Si el usuario loggeado es valido
    if (username.length != 0) {
        res.status(200);
        // Obtener array de amigos
        const amigos: Persona[] = await getInvitaciones(username);
        res.json(amigos);
    }
    // Si pide informacion sobre otro usuario
    else {
        res.status(401);
        res.send("No tienes permisos");
    }
});

amigosRouter.post("/enviar_invitacion", async (req: Request, res: Response) => {
    const username1: string = req.session.username ? req.session.username : "";
    const username2: string = req.body.username;

    // Si se intenta añadir a si mismo como amigo
    if (username1 === username2) {
        res.status(400);
        res.send("No te puedes enviar una invitacion a ti mismo");
    } else {
        const eranAmigos: boolean = await comprobarSiAmigos(
            username1,
            username2
        );
        // Si ya eran amigos
        if (eranAmigos) {
            res.status(409);
            res.send("Ya sois amigos");
        } else {
            const anadidos: boolean = await enviarInvitacion(
                username1,
                username2
            );
            // Si se han podido añadir
            if (anadidos) {
                res.status(200);
                res.send("Invitacion enviada correctamente");
            } else {
                res.status(500);
                res.send("No se ha podido enviar la invitacion");
            }
        }
    }
});

amigosRouter.post(
    "/eliminar_invitacion",
    async (req: Request, res: Response) => {
        const username1: string = req.session.username
            ? req.session.username
            : "";
        const username2: string = req.body.username;

        const invitacionEliminada: boolean = await eliminarInvitacion(
            username2,
            username1
        );
        if (invitacionEliminada) {
            res.status(200);
            res.send("Invitacion eliminada");
        } else {
            res.status(200);
            res.send("No se ha podido eliminar la invitacion");
        }
    }
);

amigosRouter.post("/anadir_amigo", async (req: Request, res: Response) => {
    const username1: string = req.session.username ? req.session.username : "";
    const username2: string = req.body.username;

    // Si se intenta añadir a si mismo como amigo
    if (username1 === username2) {
        res.status(400);
        res.send("No te puedes añadir a ti mismo como amigo");
    } else {
        const eranAmigos: boolean = await comprobarSiAmigos(
            username1,
            username2
        );
        // Si ya eran amigos
        if (eranAmigos) {
            res.status(409);
            res.send("Ya sois amigos");
        } else {
            const anadidos: boolean = await anadirAmigos(username1, username2);
            // Si se han podido añadir
            if (anadidos) {
                const invitacionEliminada: boolean = await eliminarInvitacion(
                    username2,
                    username1
                );
                if (invitacionEliminada) {
                    res.status(200);
                    res.send("Añadidos correctamente");
                } else {
                    res.status(200);
                    res.send(
                        "Añadidos pero no se ha podido eliminar la invitacion"
                    );
                }
            } else {
                res.status(500);
                res.send("No se ha podido añadir como amigos");
            }
        }
    }
});

module.exports = amigosRouter;
