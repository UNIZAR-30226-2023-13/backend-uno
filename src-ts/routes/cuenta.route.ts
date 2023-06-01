import express, { Request, Response, Router } from "express";
import {
    cambiarEmailPassword,
    eliminarCuenta,
} from "../services/cuenta.service";
import { obtenerCorreoPuntos } from "../services/login.service";
import { Persona } from "../models/persona";

const cuentaRouter: Router = express.Router();

cuentaRouter.post(
    "/cambiar-email-password",
    async (req: Request, res: Response) => {
        const email = req.body.email;
        const password = req.body.password;
        if (req.session.username && email && password) {
            const username = req.session.username;
            const cambiado = await cambiarEmailPassword(
                username,
                email,
                password
            );
            if (cambiado) {
                res.status(200);
                res.send("Email y contraseña cambiados correctamente");
            } else {
                res.status(403);
                res.send("No se ha podido modificar el email y la contraseña");
            }
        } else {
            res.status(401);
            res.send();
        }
    }
);

cuentaRouter.post("/eliminar", async (req: Request, res: Response) => {
    const password = req.body.password;
    if (req.session.username && password) {
        const username = req.session.username;
        const eliminado = await eliminarCuenta(username, password);
        if (eliminado) {
            req.session.loggeado = false;
            req.session = null as never;
            res.status(200);
            res.send("Cuenta eliminada correctamente");
        } else {
            res.status(403);
            res.send("No se ha podido eliminar la cuenta");
        }
    } else {
        res.status(401);
        res.send();
    }
});

cuentaRouter.get("/quien-soy", async (req: Request, res: Response) => {
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

module.exports = cuentaRouter;
