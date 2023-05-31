import express, { Request, Response, Router } from "express";
import {
    comprobarContrasena,
    obtenerCorreoPuntos,
} from "../services/login.service";
import { Persona } from "../models/persona";
const loginRouter: Router = express.Router();

loginRouter.post("/", async (req: Request, res: Response) => {
    const username: string = req.body.username;
    const password: string = req.body.password;

    // Si es una sesion que ya habia iniciado sesion
    if (req.session.loggeado === true) {
        res.status(200);
        res.send("Ok, ya estabas login");
    }
    // Buscamos en la BD si existe un usuario con ese nombre y contraseña
    else {
        const iguales = await comprobarContrasena(username, password);
        if (iguales) {
            req.session.loggeado = true;
            req.session.username = username;
            res.status(200);
            res.send("Ok, login");
        }
        // Si no existe un usuario con esa contraseña
        else {
            res.status(401);
            res.send("Usuario y contraseña incorrectos");
        }
    }
});

loginRouter.get("/quien-soy", async (req: Request, res: Response) => {
    let username = "";
    if (req.session.username) {
        username = req.session.username;
        const personaCompleta: { persona: Persona; correo: string } =
            await obtenerCorreoPuntos(username);
        res.status(200);
        res.json({
            ...personaCompleta.persona,
            correo: personaCompleta.correo,
        });
    } else {
        res.status(401);
        res.send();
    }
});

module.exports = loginRouter;
