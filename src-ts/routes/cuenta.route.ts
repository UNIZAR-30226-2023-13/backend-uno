import express, { Request, Response, Router } from "express";
import {
    cambiarEmail,
    cambiarEmailPassword,
    eliminarCuenta,
} from "../services/cuenta.service";
import { obtenerCorreoPuntos } from "../services/login.service";

const cuentaRouter: Router = express.Router();

cuentaRouter.post(
    "/cambiar-email-password",
    async (req: Request, res: Response) => {
        const email: string = req.body.email;
        const cambioPassword: string = req.body.cambioPassword;
        if (req.session.username && email && cambioPassword === "true") {
            console.log(
                "Cambio de email y contraseña de: " + req.session.username
            );
            const username = req.session.username;
            const password: string = req.body.password;
            // Si quiero cambiar email y password
            if (cambioPassword) {
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
                    res.send(
                        "No se ha podido modificar el email y la contraseña"
                    );
                }
            }
        } else if (
            req.session.username &&
            email &&
            cambioPassword === "false"
        ) {
            const username = req.session.username;
            const cambiado = await cambiarEmail(username, email);
            if (cambiado) {
                res.status(200);
                res.send("Email cambiado correctamente");
            } else {
                res.status(403);
                res.send("No se ha podido modificar el email");
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

cuentaRouter.post("/cerrar-sesion", async (req: Request, res: Response) => {
    if (req.session.username && req.session.loggeado) {
        req.session.loggeado = false;
        req.session = null as never;
        res.status(200);
        res.send("Sesión cerrada correctamente");
    } else {
        res.status(401);
        res.send();
    }
});

cuentaRouter.get("/quien-soy", async (req: Request, res: Response) => {
    let username = "";
    if (req.session.username) {
        username = req.session.username;
        obtenerCorreoPuntos(username)
            .then(({ persona, correo }) => {
                res.status(200);
                res.json({
                    ...persona,
                    correo: correo,
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

module.exports = cuentaRouter;
