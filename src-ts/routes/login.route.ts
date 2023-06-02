import express, { Request, Response, Router } from "express";
import { comprobarContrasena } from "../services/login.service";
import { existeCuenta } from "../services/cuenta.service";
import { Session, SessionData } from "express-session";
const loginRouter: Router = express.Router();

loginRouter.post("/", async (req: Request, res: Response) => {
    const username: string = req.body.username;
    const password: string = req.body.password;

    // Si es una sesion que ya habia iniciado sesion
    if (req.session.username && req.session.loggeado === true) {
        // Comprobar que la cuenta sigue existiendo
        const existe: boolean = await existeCuenta(req.session.username);
        if (existe) {
            res.status(200);
            res.send("Ok, ya estabas login");
        } else {
            req.session.loggeado = false;
            req.session = null as unknown as Session & Partial<SessionData>;
            res.status(401);
            res.send("El usuario ya no existe");
        }
    }
    // Buscamos en la BD si existe un usuario con ese nombre y contraseña
    else if (username != undefined && password != undefined) {
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
    } else {
        res.status(403);
        res.send("No ha mandado cookie ni parametros");
    }
});

module.exports = loginRouter;
